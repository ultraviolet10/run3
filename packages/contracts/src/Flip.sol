// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ICreatorCoin} from "./interfaces/ICreatorCoin.sol";
import {MarketCapOracle} from "./oracle/MarketCapOracle.sol";

contract Flip is AccessControl, Pausable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    event BattleCreated(bytes32 indexed battleId, address creator1, address creator2);
    event BattleCompleted(bytes32 indexed battleId, address winner);
    event PrizesDistributed(bytes32 indexed battleId, uint256 winnerAmount, uint256 loserAmount);
    event TopHoldersRewarded(bytes32 indexed battleId, address[] holders, uint256[] rewards);

    enum BattleState {
        CHALLENGE_PERIOD, // Creators can stake
        TRADING_PERIOD, // Public trading active
        SCORING_PERIOD, // Calculate winner, no trading
        COMPLETED, // Prizes distributed
        CANCELLED // Emergency state
    }

    // this is kinda weird tbh 
    // how do we actually get this data?
    struct TopHolder {
        address holder;
        uint256 balance;    // Balance during battle period
        uint256 timestamp;  // When balance was recorded
    }

    struct Battle {
        address creator1;
        address creator2;
        ICreatorCoin token1; // Creator 1's vested creator token
        ICreatorCoin token2; // Creator 2's vested creator token
        uint256 stakeAmount; // Equal stakes from both creators
        BattleState state;
        uint256 startTime;
        uint256 endTime;
        uint256 initialMarketCap1; // Market cap at battle start
        uint256 initialMarketCap2; // Market cap at battle start
        address winner; // Set during scoring
        bool prizesDistributed; // Prevent double distribution
        bool holdersRewarded; // Track top holder rewards
        uint256 distributionDeadline; // Emergency distribution timeout
        bytes32 battleId; // Unique identifier
    }

    mapping(bytes32 => Battle) public battles;
    mapping(address => uint256) public creatorActiveStakes; // Track locked funds

    MarketCapOracle public immutable oracle;

    uint256 public constant BATTLE_DURATION = 24 hours;
    uint256 public constant WINNER_PERCENTAGE = 80;
    uint256 public constant HOLDERS_PERCENTAGE = 20;
    uint256 public constant MIN_STAKE = 1000e18; // this needs to be 10% of the user's market cap? what stake actually makes sense?
    uint256 public constant DISTRIBUTION_TIMEOUT = 24 hours;
    uint256 public constant TOP_HOLDERS_COUNT = 5;


    /**
    * @dev oracle is veeeeeeerrrrrry wip
    * @dev study access, is it needed here? 
    */
    constructor(MarketCapOracle _oracle) {
        oracle = _oracle;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function createChallenge(address challenger, ICreatorCoin token1, ICreatorCoin token2, uint256 stakeAmount)
        external
        nonReentrant
        whenNotPaused
        returns (bytes32 battleId)
    {
        /**
         * - challenger: refers to the expected contestant
         * - stakeAmount: this will have to be calculated from their respective market caps
         */
        require(challenger != msg.sender, "Cannot challenge self");
        require(stakeAmount >= MIN_STAKE, "Stake too low");
        require(token1 != token2, "Same token not allowed");
        /**
         * Verify tokens are actual vested creator tokens --
         * BaseCoin.sol - `payoutRecipient` variable is used to hold the address
         * of the coin creator who will receive initial and ongoing payouts
         */
        require(token1.payoutRecipient() == msg.sender, "Not token1 creator");
        require(token2.payoutRecipient() == challenger, "Not token2 creator");
        // Validate creator1 (challenger) has sufficient tokens and allowance
        require(token1.balanceOf(msg.sender) >= stakeAmount, "Creator1 insufficient balance");
        require(token1.allowance(msg.sender, address(this)) >= stakeAmount, "Creator1 insufficient allowance");
        
        // Pre-validate creator2 (challengee) has sufficient tokens
        // Note: allowance will be checked in acceptChallenge when creator2 approves
        require(token2.balanceOf(challenger) >= stakeAmount, "Creator2 insufficient balance");

        // battleId = generateBattleId(msg.sender, challenger, block.timestamp); // [uv1000] todo ?
        battleId = generateBattleId(msg.sender, challenger, block.timestamp);

        battles[battleId] = Battle({
            creator1: msg.sender,
            creator2: challenger,
            token1: token1,
            token2: token2,
            stakeAmount: stakeAmount,
            state: BattleState.CHALLENGE_PERIOD,
            startTime: 0, // Set when accepted
            endTime: 0,
            initialMarketCap1: 0, // Set when battle starts
            initialMarketCap2: 0, // Set when battle starts
            winner: address(0),
            prizesDistributed: false,
            holdersRewarded: false,
            distributionDeadline: 0,
            battleId: battleId
        });

        /**
         * this is for the challenge _creator_
         */
        creatorActiveStakes[msg.sender] += stakeAmount;

        emit BattleCreated(battleId, msg.sender, challenger);
    }

    function acceptChallenge(bytes32 battleId) external nonReentrant whenNotPaused {
        // this assumes we store the battleId in a server somewhere 
        Battle storage battle = battles[battleId];

        /**
        * - check that the battle expects a challenger
        * - expected challenger is the challenger
        */
        require(battle.state == BattleState.CHALLENGE_PERIOD, "Invalid state"); 
        require(msg.sender == battle.creator2, "Not the challenged creator");

        // Validate both creators have sufficient balance and allowance
        require(battle.token1.balanceOf(battle.creator1) >= battle.stakeAmount, "Creator1 insufficient balance");
        require(battle.token2.balanceOf(battle.creator2) >= battle.stakeAmount, "Creator2 insufficient balance");
        
        // CRITICAL: Check allowances for both creators  
        require(battle.token1.allowance(battle.creator1, address(this)) >= battle.stakeAmount, "Creator1 insufficient allowance");
        require(battle.token2.allowance(battle.creator2, address(this)) >= battle.stakeAmount, "Creator2 insufficient allowance");

        // ESCROW: Safe transfer both stakes to contract
        battle.token1.transferFrom(battle.creator1, address(this), battle.stakeAmount);
        battle.token2.transferFrom(battle.creator2, address(this), battle.stakeAmount);

        // Capture initial market caps for growth calculation
        battle.initialMarketCap1 = oracle.getMarketCap(battle.token1);
        battle.initialMarketCap2 = oracle.getMarketCap(battle.token2);

        // Update battle state
        battle.state = BattleState.TRADING_PERIOD;
        battle.startTime = block.timestamp;
        battle.endTime = block.timestamp + BATTLE_DURATION;

        // Update active stakes
        creatorActiveStakes[battle.creator2] += battle.stakeAmount;
    }

    /** 
    * should this be automated by chainlink fns?
    */ 
    function determineWinner(bytes32 battleId) external nonReentrant returns (address winner) {
        Battle storage battle = battles[battleId];

        require(battle.state == BattleState.TRADING_PERIOD, "Invalid state");
        require(block.timestamp >= battle.endTime, "Battle still active");

        // Get current market caps
        uint256 currentMarketCap1 = oracle.getMarketCap(battle.token1);
        uint256 currentMarketCap2 = oracle.getMarketCap(battle.token2);

        // Calculate growth
        uint256 growth1 = oracle.calculateGrowth(battle.token1, battle.initialMarketCap1, currentMarketCap1);
        uint256 growth2 = oracle.calculateGrowth(battle.token2, battle.initialMarketCap2, currentMarketCap2);

        // Determine winner based on higher growth
        winner = growth1 > growth2 ? battle.creator1 : battle.creator2;

        // Update battle state
        battle.winner = winner;
        battle.state = BattleState.SCORING_PERIOD;
        battle.distributionDeadline = block.timestamp + DISTRIBUTION_TIMEOUT;

        emit BattleCompleted(battleId, winner);

        return winner;
    }

    /// @notice Distribute prizes to winner and top holders
    /// @param battleId The battle to distribute prizes for
    /// @param topHolders Array of top 5 holders of the winning token (off-chain oracle computed)
    /// write this fn in the sdk
    function distributePrizes(bytes32 battleId, TopHolder[TOP_HOLDERS_COUNT] calldata topHolders) 
        external nonReentrant {
        Battle storage battle = battles[battleId];

        // Validate state
        require(battle.state == BattleState.SCORING_PERIOD, "Invalid state");
        require(!battle.prizesDistributed, "Already distributed");
        require(battle.winner != address(0), "Winner not determined");

        address winner = battle.winner;
        ICreatorCoin winnerToken = (winner == battle.creator1) ? battle.token1 : battle.token2;
        ICreatorCoin loserToken = (winner == battle.creator1) ? battle.token2 : battle.token1;
        
        // Verify top holders data for the WINNING token
        _verifyTopHolders(winnerToken, topHolders, battle.startTime, battle.endTime);

        // Calculate prize amounts per token type
        uint256 winnerTokenAmount = battle.stakeAmount; // Winner gets their own token back
        uint256 loserTokenAmount = battle.stakeAmount;  // Winner gets loser's token
        
        // Split loser's tokens: 80% to winner, 20% to top holders
        uint256 loserTokenToWinner = (loserTokenAmount * WINNER_PERCENTAGE) / 100;
        uint256 loserTokenToHolders = (loserTokenAmount * HOLDERS_PERCENTAGE) / 100;
        uint256 holderReward = loserTokenToHolders / TOP_HOLDERS_COUNT; // 4% each

        // Transfer winner's original tokens back to winner (100%)
        winnerToken.transfer(winner, winnerTokenAmount);
        
        // Transfer majority of loser's tokens to winner (80%)
        loserToken.transfer(winner, loserTokenToWinner);

        // Transfer remaining loser's tokens to top holders (20% total, 4% each)
        address[] memory holderAddresses = new address[](TOP_HOLDERS_COUNT);
        uint256[] memory rewards = new uint256[](TOP_HOLDERS_COUNT);
        
        for (uint i = 0; i < TOP_HOLDERS_COUNT; i++) {
            if (topHolders[i].holder != address(0)) {
                loserToken.transfer(topHolders[i].holder, holderReward);
                holderAddresses[i] = topHolders[i].holder;
                rewards[i] = holderReward;
            }
        }

        // Update state
        battle.prizesDistributed = true;
        battle.holdersRewarded = true;
        battle.state = BattleState.COMPLETED;

        // Update active stakes  
        creatorActiveStakes[battle.creator1] -= battle.stakeAmount;
        creatorActiveStakes[battle.creator2] -= battle.stakeAmount;

        emit PrizesDistributed(battleId, winnerTokenAmount + loserTokenToWinner, loserTokenToHolders);
        emit TopHoldersRewarded(battleId, holderAddresses, rewards);
    }

    /// @notice Emergency distribution if top holders data is unavailable
    /// @param battleId The battle to distribute prizes for
    /// @dev Can only be called after DISTRIBUTION_TIMEOUT, distributes only to winner
    function emergencyDistribution(bytes32 battleId) external nonReentrant {
        Battle storage battle = battles[battleId];

        require(battle.state == BattleState.SCORING_PERIOD, "Invalid state");
        require(!battle.prizesDistributed, "Already distributed");
        require(block.timestamp > battle.distributionDeadline, "Too early for emergency");

        address winner = battle.winner;
        ICreatorCoin winnerToken = (winner == battle.creator1) ? battle.token1 : battle.token2;
        ICreatorCoin loserToken = (winner == battle.creator1) ? battle.token2 : battle.token1;

        // Give both token stakes to winner (emergency case - no holders rewards)
        winnerToken.transfer(winner, battle.stakeAmount);
        loserToken.transfer(winner, battle.stakeAmount);

        // Update state
        battle.prizesDistributed = true;
        battle.state = BattleState.COMPLETED;

        // Update active stakes
        creatorActiveStakes[battle.creator1] -= battle.stakeAmount;
        creatorActiveStakes[battle.creator2] -= battle.stakeAmount;

        emit PrizesDistributed(battleId, battle.stakeAmount * 2, 0);
    }

    /// @dev Verify that submitted top holders are valid
    /// @param token The winning token to verify holders for
    /// @param topHolders Submitted top holders data
    /// @param startTime Battle start time
    /// @param endTime Battle end time
    function _verifyTopHolders(
        ICreatorCoin token,
        TopHolder[TOP_HOLDERS_COUNT] calldata topHolders,
        uint256 startTime,
        uint256 endTime
    ) internal view {
        for (uint i = 0; i < TOP_HOLDERS_COUNT; i++) {
            TopHolder calldata holder = topHolders[i];
            
            if (holder.holder == address(0)) continue;
            
            // Verify timestamp is within battle period
            require(
                holder.timestamp >= startTime && holder.timestamp <= endTime,
                "Invalid holder timestamp"
            );
            
            // Verify current balance is reasonable (holder still has tokens)
            // This is a simple check - sophisticated attacks would need more validation
            uint256 currentBalance = token.balanceOf(holder.holder);
            require(
                currentBalance > 0 && holder.balance > 0,
                "Invalid holder balance"
            );

            // Verify holders are sorted by balance (descending)
            if (i > 0 && topHolders[i-1].holder != address(0)) {
                require(
                    holder.balance <= topHolders[i-1].balance,
                    "Holders not sorted by balance"
                );
            }
        }
    }

    function generateBattleId(
      address creator1,
      address creator2,
      uint256 timestamp
  ) internal pure returns (bytes32) {
      return keccak256(abi.encodePacked(creator1, creator2, timestamp));
  }
}
