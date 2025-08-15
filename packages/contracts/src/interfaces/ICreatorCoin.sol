// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IERC20} from "forge-std/interfaces/IERC20.sol";
import {IPoolManager} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";

/// @title ICreatorCoin Interface
/// @notice Interface for Zora CreatorCoin contracts with vesting functionality
interface ICreatorCoin is IERC20 {
    /// @notice Get currently claimable vested amount for the creator
    /// @return The amount that can be claimed right now
    function getClaimableAmount() external view returns (uint256);

    /// @notice Allows the creator payout recipient to claim vested tokens
    /// @return claimAmount The amount of tokens claimed
    function claimVesting() external returns (uint256);

    /// @notice Get the payout recipient (creator address)
    /// @return The creator's payout recipient address
    function payoutRecipient() external view returns (address);

    /// @notice Get the Uniswap V4 pool manager for price calculation
    /// @return The pool manager contract address
    function poolManager() external view returns (IPoolManager);

    /// @notice Vesting timeline information
    /// @return Start time of the vesting period
    function vestingStartTime() external view returns (uint256);

    /// @notice End time of the vesting period
    /// @return End time of the vesting period
    function vestingEndTime() external view returns (uint256);

    /// @notice Total amount already claimed by creator
    /// @return Total claimed amount
    function totalClaimed() external view returns (uint256);

    /// @notice Event emitted when creator claims vested tokens
    event CreatorVestingClaimed(
        address indexed recipient,
        uint256 amount,
        uint256 totalClaimed,
        uint256 vestingStartTime,
        uint256 vestingEndTime
    );
}
