// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ICreatorCoin} from "./interfaces/ICreatorCoin.sol";
import {IPoolManager} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";
import {PoolId, PoolIdLibrary} from "@uniswap/v4-core/src/types/PoolId.sol";
import {PoolKey} from "@uniswap/v4-core/src/types/PoolKey.sol";

/// @title MarketCapOracle
/// @notice Calculates market cap for CreatorCoins using Uniswap V4 price data
contract MarketCapOracle {
    using PoolIdLibrary for PoolKey;

    error InvalidPoolData();
    error StalePrice();

    /// @notice Maximum age for price data (1 hour)
    uint256 public constant MAX_PRICE_AGE = 3600;

    /// @notice Calculate current market cap for a CreatorCoin
    /// @param token The CreatorCoin to calculate market cap for
    /// @return marketCap Current market cap in wei (token price * total supply)
    function getMarketCap(ICreatorCoin token) external view returns (uint256 marketCap) {
        uint256 price = getTokenPrice(token);
        uint256 totalSupply = token.totalSupply();

        // Market cap = price * total supply
        // Price is in wei per token, so result is in wei
        return (price * totalSupply) / 1e18;
    }

    /// @notice Get token price from Uniswap V4 pool
    /// @param token The CreatorCoin to get price for
    /// @return price Token price in wei per token
    function getTokenPrice(ICreatorCoin token) public view returns (uint256 price) {
        // Note: We need to construct the PoolKey from the token
        // This is a simplified version - you'll need the actual poolKey construction
        // based on how Zora structures their pools

        // For now, return a mock price - replace with actual Uniswap V4 integration
        return _getMockPrice(address(token));
    }

    /// @notice Get market cap growth between two timestamps
    /// @param startCap Initial market cap
    /// @param endCap Final market cap
    /// @return growth Percentage growth (basis points, 10000 = 100%)
    function calculateGrowth(
        ICreatorCoin, // token (unused but kept for interface consistency)
        uint256 startCap,
        uint256 endCap
    ) external pure returns (uint256 growth) {
        if (startCap == 0) return 0;

        if (endCap >= startCap) {
            // Positive growth: ((end - start) / start) * 10000
            return ((endCap - startCap) * 10000) / startCap;
        } else {
            // Negative growth: return 0 (no negative growth in contests)
            return 0;
        }
    }

    /// @dev Mock price function - replace with actual Uniswap V4 price calculation
    /// @param tokenAddress Address of the token
    /// @return Mock price in wei
    function _getMockPrice(address tokenAddress) private view returns (uint256) {
        // Simple mock: use address as seed for deterministic "price"
        uint256 mockPrice = uint256(keccak256(abi.encode(tokenAddress, block.timestamp / 3600)));

        // Return price between 0.001 ETH and 0.1 ETH per token
        return (mockPrice % 100000000000000000) + 1000000000000000; // 0.001 to 0.1 ETH
    }
}
