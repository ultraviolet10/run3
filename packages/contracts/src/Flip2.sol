// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {ICreatorCoin} from "@zora/interfaces/ICreatorCoin.sol";
import {ICoin} from "@zora/interfaces/ICoin.sol";

// Extended interface to access vesting functions
interface ICreatorCoinExtended is ICreatorCoin, IERC20 {
    function getClaimableAmount() external view returns (uint256);
    function vestingStartTime() external view returns (uint256);
    function vestingEndTime() external view returns (uint256);
    function totalClaimed() external view returns (uint256);
}

contract Flip2 is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    event BattleCreated(uint256 indexed battleId, address playerOne, address playerTwo);
    event BattleCompleted(bytes32 indexed battleId, address winner);
    event TokensDeposited(address indexed creator, address indexed coinAddress, uint256 amount);
    event TokensWithdrawn(address indexed creator, address indexed coinAddress, uint256 amount);
    event TokensLocked(address indexed creator, address indexed coinAddress, uint256 amount, bytes32 battleId);
    event TokensUnlocked(address indexed creator, address indexed coinAddress, uint256 amount, bytes32 battleId);

    enum BattleState {
        CHALLENGE_PERIOD, // Creators can stake
        TRADING_PERIOD, // Public trading active
        SCORING_PERIOD, // Calculate winner, no trading
        COMPLETED, // Prizes distributed
        CANCELLED // Emergency state

    }

    struct Battle {
        bytes32 battleId;
        address playerOne;
        address playerTwo;
        BattleState state;
        uint256 startTime;
        uint256 endTime;
        address playerOneCoin;
        address playerTwoCoin;
        uint256 playerOneStake;
        uint256 playerTwoStake;
        address winner;
    }

    mapping(bytes32 => Battle) public battles;
    mapping(address => mapping(address => bytes32)) public activeBattles;

    // Vault mappings: creator => coinAddress => amount
    mapping(address => mapping(address => uint256)) public depositedTokens;
    mapping(address => mapping(address => uint256)) public lockedTokens;

    uint256 public constant BATTLE_DURATION = 6 hours; // to be updated with by owner, needs a write function
    uint8 public constant WINNER_PERCENTAGE = 80;

    // what is the `constructor` vs `initialize` paradigm? what works when?
    constructor() {
        // oracle setup
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function generateBattleId(address playerOne, address playerTwo, uint256 nonce) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(playerOne, playerTwo, nonce));
    }

    /// @notice Deposit creator tokens into the vault for future battles
    /// @param coinAddress The creator coin contract address
    /// @param amount The amount of tokens to deposit
    function depositCreatorTokens(address coinAddress, uint256 amount) external nonReentrant {
        require(coinAddress != address(0), "Invalid coin address");
        require(amount > 0, "Amount must be greater than zero");

        ICreatorCoinExtended creatorCoin = ICreatorCoinExtended(coinAddress);

        // Verify the caller is the payout recipient of this coin
        require(creatorCoin.payoutRecipient() == msg.sender, "Not coin owner");

        // Transfer tokens from creator to this contract
        IERC20(coinAddress).transferFrom(msg.sender, address(this), amount);

        // Update deposited balance
        depositedTokens[msg.sender][coinAddress] += amount;

        emit TokensDeposited(msg.sender, coinAddress, amount);
    }

    /// @notice Withdraw available creator tokens from the vault
    /// @param coinAddress The creator coin contract address
    /// @param amount The amount of tokens to withdraw (0 = withdraw all available)
    function withdrawCreatorTokens(address coinAddress, uint256 amount) external nonReentrant {
        require(coinAddress != address(0), "Invalid coin address");

        uint256 availableBalance = depositedTokens[msg.sender][coinAddress];
        require(availableBalance > 0, "No tokens available for withdrawal");

        // If amount is 0, withdraw all available tokens
        if (amount == 0 || amount > availableBalance) {
            amount = availableBalance;
        }

        // Update deposited balance
        depositedTokens[msg.sender][coinAddress] -= amount;

        // Transfer tokens back to creator
        // IERC20(coinAddress).transferFrom(msg.sender, amount);  // idk

        emit TokensWithdrawn(msg.sender, coinAddress, amount);
    }

    // startContest
    // -> check that the contract holds one percent of their token holdings
    // -> if yes,

    function startContest(address playerOne, address playerTwo, address playerOneCoin, address playerTwoCoin)
        external
        returns (bytes32 battleId)
    {
        require(playerOne != playerTwo, "Cannot challenge self");
        require(playerOneCoin != address(0) && playerTwoCoin != address(0), "Invalid coin addresses");

        // Check no active battle exists between these players
        require(activeBattles[playerOne][playerTwo] == 0, "Active battle already exists");
        require(activeBattles[playerTwo][playerOne] == 0, "Active battle already exists");

        // Validate stakes and get required amounts
        uint256 playerOneStake = _validateCreatorStake(playerOne, playerOneCoin);
        uint256 playerTwoStake = _validateCreatorStake(playerTwo, playerTwoCoin);

        // Check deposited tokens are sufficient
        require(
            depositedTokens[playerOne][playerOneCoin] >= playerOneStake, "Player one: insufficient deposited tokens"
        );
        require(
            depositedTokens[playerTwo][playerTwoCoin] >= playerTwoStake, "Player two: insufficient deposited tokens"
        );

        battleId = generateBattleId(playerOne, playerTwo, block.timestamp);

        // Lock tokens by moving from deposited to locked
        depositedTokens[playerOne][playerOneCoin] -= playerOneStake;
        lockedTokens[playerOne][playerOneCoin] += playerOneStake;
        depositedTokens[playerTwo][playerTwoCoin] -= playerTwoStake;
        lockedTokens[playerTwo][playerTwoCoin] += playerTwoStake;

        battles[battleId] = Battle({
            battleId: battleId,
            playerOne: playerOne,
            playerTwo: playerTwo,
            state: BattleState.CHALLENGE_PERIOD,
            startTime: block.timestamp,
            endTime: block.timestamp + BATTLE_DURATION,
            playerOneCoin: playerOneCoin,
            playerTwoCoin: playerTwoCoin,
            playerOneStake: playerOneStake,
            playerTwoStake: playerTwoStake,
            winner: address(0)
        });

        // Track active battle between these players
        activeBattles[playerOne][playerTwo] = battleId;
        activeBattles[playerTwo][playerOne] = battleId;

        // Emit lock events
        emit TokensLocked(playerOne, playerOneCoin, playerOneStake, battleId);
        emit TokensLocked(playerTwo, playerTwoCoin, playerTwoStake, battleId);
        emit BattleCreated(uint256(battleId), playerOne, playerTwo);

        return battleId;
    }

    /// @notice Validates that a creator has sufficient balance and returns required stake
    /// @param creator The creator's address
    /// @param coinAddress The creator's coin contract address
    /// @return requiredStake The amount that needs to be staked (10% of claimable)
    function _validateCreatorStake(address creator, address coinAddress)
        internal
        view
        returns (uint256 requiredStake)
    {
        ICreatorCoinExtended creatorCoin = ICreatorCoinExtended(coinAddress);

        // Verify the creator is the payout recipient of this coin
        require(creatorCoin.payoutRecipient() == creator, "Creator not coin owner");

        // Check that the creator has claimable vested amount (indicates active coin)
        uint256 claimableAmount = creatorCoin.getClaimableAmount();
        require(claimableAmount > 0, "No claimable vested tokens");

        // Calculate required stake (10% of claimable amount)
        requiredStake = (claimableAmount * 10) / 100;

        // Note: We no longer check creator's direct balance since we're using deposited tokens
        // The deposited token balance check is done in startContest

        return requiredStake;
    }

    /// @notice Distribute tokens to collectors based on their weighted holdings
    /// @param collectors Array of collector addresses
    /// @param balances Array of collector token balances
    /// @param totalAmount Total amount to distribute
    /// @param tokenAddress The token contract to distribute
    function _distributeToCollectors(
        address[] calldata collectors,
        uint256[] calldata balances,
        uint256 totalAmount,
        address tokenAddress
    ) internal {
        if (collectors.length == 0 || totalAmount == 0) return;

        // Calculate total balance across all collectors (skip zeros for gas optimization)
        uint256 totalBalance = 0;
        uint256 validCollectors = 0;
        for (uint256 i = 0; i < balances.length; i++) {
            if (balances[i] > 0) {
                totalBalance += balances[i];
                validCollectors++;
            }
        }

        require(totalBalance > 0, "No collector balances");

        // Distribute proportionally to each collector and track remainder
        uint256 distributedTotal = 0;
        address lastCollector;
        uint256 processedCollectors = 0;

        for (uint256 i = 0; i < collectors.length && processedCollectors < validCollectors; i++) {
            if (balances[i] > 0) {
                uint256 collectorShare = (totalAmount * balances[i]) / totalBalance;
                if (collectorShare > 0) {
                    depositedTokens[collectors[i]][tokenAddress] += collectorShare;
                    distributedTotal += collectorShare;
                    lastCollector = collectors[i];
                }
                processedCollectors++;
            }
        }

        // Give any remainder to the last collector to prevent token loss
        uint256 remainder = totalAmount - distributedTotal;
        if (remainder > 0 && lastCollector != address(0)) {
            depositedTokens[lastCollector][tokenAddress] += remainder;
        }
    }

    /// @notice Internal function to unlock and distribute tokens after battle ends
    function _unlockAndDistributeTokens(
        address winner,
        address loser,
        address winnerCoin,
        address loserCoin,
        uint256 winnerStake,
        uint256 loserStake,
        uint256 winnerPayout,
        uint256 collectorPayout,
        uint256 loserKeeps,
        address[] calldata topCollectors,
        uint256[] calldata collectorBalances
    ) internal {
        // Unlock all tokens from locked state
        lockedTokens[winner][winnerCoin] -= winnerStake;
        lockedTokens[loser][loserCoin] -= loserStake;

        // Give winner their payout (80% of their stake + 80% of loser's stake)
        depositedTokens[winner][winnerCoin] += (winnerStake * 80) / 100; // Winner's 80%
        depositedTokens[winner][loserCoin] += (loserStake * 80) / 100; // Loser's 80%

        // Give loser back 20% of their own stake
        depositedTokens[loser][loserCoin] += loserKeeps;

        // Distribute 20% of winner's stake to collectors
        _distributeToCollectors(topCollectors, collectorBalances, collectorPayout, winnerCoin);

        // Emit unlock events
        emit TokensUnlocked(winner, winnerCoin, winnerStake, bytes32(0));
        emit TokensUnlocked(loser, loserCoin, loserStake, bytes32(0));
    }

    /// @notice End a contest and distribute prizes based on trading volume scores
    /// @param battleId The battle to end
    /// @param playerOneScore Trading volume score for player one (basis points)
    /// @param playerTwoScore Trading volume score for player two (basis points)
    /// @param topCollectors Array of top collector addresses for winner's coin
    /// @param collectorBalances Array of token balances for each collector
    function endContest(
        bytes32 battleId,
        uint256 playerOneScore,
        uint256 playerTwoScore,
        address[] calldata topCollectors,
        uint256[] calldata collectorBalances
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        Battle storage battle = battles[battleId];

        // Validate battle exists and timing
        require(battle.startTime > 0, "Battle does not exist");
        require(battle.state == BattleState.CHALLENGE_PERIOD, "Battle not in active state");
        require(block.timestamp >= battle.endTime, "Contest still ongoing");

        // Validate collector arrays
        require(topCollectors.length == collectorBalances.length, "Array length mismatch");
        require(topCollectors.length <= 100, "Too many collectors"); // Gas limit protection

        // Determine winner based on scores
        address winner;
        address loser;
        address winnerCoin;
        address loserCoin;
        uint256 winnerStake;
        uint256 loserStake;

        require(playerOneScore != playerTwoScore, "Tie scores not allowed - contest invalid");

        if (playerOneScore > playerTwoScore) {
            winner = battle.playerOne;
            loser = battle.playerTwo;
            winnerCoin = battle.playerOneCoin;
            loserCoin = battle.playerTwoCoin;
            winnerStake = battle.playerOneStake;
            loserStake = battle.playerTwoStake;
        } else {
            winner = battle.playerTwo;
            loser = battle.playerOne;
            winnerCoin = battle.playerTwoCoin;
            loserCoin = battle.playerOneCoin;
            winnerStake = battle.playerTwoStake;
            loserStake = battle.playerOneStake;
        }

        // Update battle state
        battle.winner = winner;
        battle.state = BattleState.COMPLETED;

        // Calculate prize distribution
        // Loser gets 20% of their own stake back
        uint256 loserKeeps = (loserStake * 20) / 100;
        uint256 loserLoses = loserStake - loserKeeps; // 80% goes to winner

        // Winner gets 80% of their own stake + 80% of loser's stake
        uint256 winnerPayout = (winnerStake * 80) / 100 + loserLoses;

        // 20% of winner's stake goes to collectors
        uint256 collectorPayout = (winnerStake * 20) / 100;

        // Unlock and distribute tokens
        _unlockAndDistributeTokens(
            winner,
            loser,
            winnerCoin,
            loserCoin,
            winnerStake,
            loserStake,
            winnerPayout,
            collectorPayout,
            loserKeeps,
            topCollectors,
            collectorBalances
        );

        // Clear active battle tracking
        activeBattles[battle.playerOne][battle.playerTwo] = 0;
        activeBattles[battle.playerTwo][battle.playerOne] = 0;

        emit BattleCompleted(battleId, winner);
    }
}

/**
 * _Interface vs Concrete Contract Type_
 *
 *   Using Interface (what we have in Flip2.sol):
 *
 *   ICreatorCoin creatorCoin = ICreatorCoin(coinAddress);
 *   // Can only access functions defined in the ICreatorCoin interface
 *
 *   Using Concrete Contract (what the test does):
 *
 *   CreatorCoin internal creatorCoin;
 *   // Later assigned: creatorCoin = CreatorCoin(creatorCoinAddress);
 *   // Can access ALL public/external functions of the CreatorCoin contract
 */
