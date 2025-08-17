// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ICreatorCoin} from "./interfaces/ICreatorCoin.sol";
import {MarketCapOracle} from "./MarketCapOracle.sol";

// deposit
// resolve
// claim

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
        uint256 balance; // Balance during battle period
        uint256 timestamp; // When balance was recorded
    }

    struct Battle {
        bytes32 battleId; // Unique identifier
        address creator1;
        address creator2;
        // ICreatorCoin token1; // Creator 1's vested creator token
        // ICreatorCoin token2; // Creator 2's vested creator token
        // uint256 stakeAmount; // Equal stakes from both creators
        BattleState state;
        uint256 startTime;
        uint256 endTime;
        uint256 initialMarketCap1; // Market cap at battle start
        uint256 initialMarketCap2; // Market cap at battle start
        address winner; // Set during scoring
            // bool prizesDistributed; // Prevent double distribution
            // bool holdersRewarded; // Track top holder rewards
            // uint256 distributionDeadline; // Emergency distribution timeout
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
    IERC20 public USDC_INSTANCE;

    /**
     * @dev oracle is veeeeeeerrrrrry wip
     * @dev study access, is it needed here?
     */
    constructor(MarketCapOracle _oracle) {
        oracle = _oracle;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        USDC_INSTANCE = IERC20(0x036CbD53842c5426634e7929541eC2318f3dCF7e); // base sepolia
    }

    function generateBattleId(address playerOne, address playerTwo, uint256 timestamp)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(playerOne, playerTwo, timestamp));
    }

    // take usdc instead of creator coins - mock usdc format
    // import erc20 interface create usdc instance - assume base chain for now
    // testnet - 0x036CbD53842c5426634e7929541eC2318f3dCF7e
    // mainnet - 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913
    function startContest(
        address playerOne,
        address playerTwo,
        // ICreatorCoin token1,
        // ICreatorCoin token2,
        uint256 stakeAmount
    ) external nonReentrant whenNotPaused returns (bytes32 battleId) {
        /**
         * - challenger: refers to the expected contestant
         * - stakeAmount: this will have to be calculated from their respective market caps
         */
        require(playerOne != playerTwo, "Cannot challenge self");
        require(stakeAmount >= MIN_STAKE, "Stake too low");

        battleId = generateBattleId(playerOne, playerTwo, block.timestamp);

        battles[battleId] = Battle({
            battleId: battleId,
            creator1: playerOne,
            creator2: playerTwo,
            // stakeAmount: stakeAmount,
            state: BattleState.CHALLENGE_PERIOD,
            startTime: block.timestamp, // Set when accepted
            endTime: block.timestamp + 6 hours,
            initialMarketCap1: 0, // Set when battle starts
            initialMarketCap2: 0, // Set when battle starts
            winner: address(0)
        });

        /**
         * this is for the challenge _creator_
         */
        creatorActiveStakes[msg.sender] += stakeAmount;

        emit BattleCreated(battleId, playerOne, playerTwo);
    }

    /// @notice both players have to pay here - assume 10 USDC
    function raiseTheStakes(bytes32 battleId) external returns (bool) {
        Battle storage battle = battles[battleId];

        // Check that the battle exists and is in the correct state
        require(battle.state == BattleState.CHALLENGE_PERIOD, "Invalid battle state");
        require(msg.sender == battle.creator1 || msg.sender == battle.creator2, "Not a participant");

        // Amount to stake - 10 USDC (USDC has 6 decimals)
        uint256 stakeAmount = 10 * 10 ** 6;

        // Check allowance - [uv1000] some flow sitch?
        require(USDC_INSTANCE.allowance(msg.sender, address(this)) >= stakeAmount, "Insufficient USDC allowance");

        // Transfer USDC from user to contract
        USDC_INSTANCE.transferFrom(msg.sender, address(this), stakeAmount);

        // Update state if needed todo
        // if (msg.sender == battle.creator1 && msg.sender == battle.creator2) {
        //     battle.state = BattleState.TRADING_PERIOD;
        //     battle.startTime = block.timestamp;
        //     // End time is already set to startTime + 6 hours
        // }

        return true;
    }

    function endContest(bytes32 battleId) external nonReentrant whenNotPaused {
        Battle storage battle = battles[battleId];

        // block.timestamp is behind the expected end time
        require(block.timestamp > battle.endTime, "contest still ongoing");

        // decide winner - offchain?
        //
    }

    /**
     * should this be automated by chainlink fns?
     */
    function determineWinner(bytes32 battleId) external nonReentrant returns (address winner) {
        Battle storage battle = battles[battleId];

        require(battle.state == BattleState.TRADING_PERIOD, "Invalid state");
        require(block.timestamp >= battle.endTime, "Battle still active");

        // // Get current market caps
        // uint256 currentMarketCap1 = oracle.getMarketCap(battle.token1);
        // uint256 currentMarketCap2 = oracle.getMarketCap(battle.token2);

        // // Calculate growth
        // uint256 growth1 = oracle.calculateGrowth(battle.token1, battle.initialMarketCap1, currentMarketCap1);
        // uint256 growth2 = oracle.calculateGrowth(battle.token2, battle.initialMarketCap2, currentMarketCap2);

        // // Determine winner based on higher growth
        // winner = growth1 > growth2 ? battle.creator1 : battle.creator2;

        // // Update battle state
        // battle.winner = winner;
        // battle.state = BattleState.SCORING_PERIOD;
        // battle.distributionDeadline = block.timestamp + DISTRIBUTION_TIMEOUT;

        emit BattleCompleted(battleId, winner);

        return winner;
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
        for (uint256 i = 0; i < TOP_HOLDERS_COUNT; i++) {
            TopHolder calldata holder = topHolders[i];

            if (holder.holder == address(0)) continue;

            // Verify timestamp is within battle period
            require(holder.timestamp >= startTime && holder.timestamp <= endTime, "Invalid holder timestamp");

            // Verify current balance is reasonable (holder still has tokens)
            // This is a simple check - sophisticated attacks would need more validation
            uint256 currentBalance = token.balanceOf(holder.holder);
            require(currentBalance > 0 && holder.balance > 0, "Invalid holder balance");

            // Verify holders are sorted by balance (descending)
            if (i > 0 && topHolders[i - 1].holder != address(0)) {
                require(holder.balance <= topHolders[i - 1].balance, "Holders not sorted by balance");
            }
        }
    }
}

// function acceptChallenge(bytes32 battleId) external nonReentrant whenNotPaused {
//     // this assumes we store the battleId in a server somewhere
//     Battle storage battle = battles[battleId];

//     /**
//      * - check that the battle expects a challenger
//      * - expected challenger is the challenger
//      */
//     require(battle.state == BattleState.CHALLENGE_PERIOD, "Invalid state");
//     require(msg.sender == battle.creator2, "Not the challenged creator");

//     // Validate both creators have sufficient balance and allowance
//     require(battle.token1.balanceOf(battle.creator1) >= battle.stakeAmount, "Creator1 insufficient balance");
//     require(battle.token2.balanceOf(battle.creator2) >= battle.stakeAmount, "Creator2 insufficient balance");

//     // CRITICAL: Check allowances for both creators
//     require(
//         battle.token1.allowance(battle.creator1, address(this)) >= battle.stakeAmount,
//         "Creator1 insufficient allowance"
//     );
//     require(
//         battle.token2.allowance(battle.creator2, address(this)) >= battle.stakeAmount,
//         "Creator2 insufficient allowance"
//     );

//     // ESCROW: Safe transfer both stakes to contract
//     battle.token1.transferFrom(battle.creator1, address(this), battle.stakeAmount);
//     battle.token2.transferFrom(battle.creator2, address(this), battle.stakeAmount);

//     // Capture initial market caps for growth calculation
//     battle.initialMarketCap1 = oracle.getMarketCap(battle.token1);
//     battle.initialMarketCap2 = oracle.getMarketCap(battle.token2);

//     // Update battle state
//     battle.state = BattleState.TRADING_PERIOD;
//     battle.startTime = block.timestamp;
//     battle.endTime = block.timestamp + BATTLE_DURATION;

//     // Update active stakes
//     creatorActiveStakes[battle.creator2] += battle.stakeAmount;
// }
