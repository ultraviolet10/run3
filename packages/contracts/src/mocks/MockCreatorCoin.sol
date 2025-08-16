// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ICreatorCoin} from "../interfaces/ICreatorCoin.sol";
import {IPoolManager} from "@uniswap/v4-core/src/interfaces/IPoolManager.sol";

contract MockCreatorCoin is ICreatorCoin {
    address public payoutRecipient;
    uint256 private _totalSupply = 1000000e18;
    uint256 public vestingStartTime;
    uint256 public vestingEndTime;
    uint256 public totalClaimed;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    constructor(address _payoutRecipient) {
        payoutRecipient = _payoutRecipient;
        vestingStartTime = block.timestamp;
        vestingEndTime = block.timestamp + 365 days;
        _balances[_payoutRecipient] = _totalSupply;
    }

    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }

    function allowance(address owner, address spender) external view returns (uint256) {
        return _allowances[owner][spender];
    }

    function transfer(address to, uint256 value) external returns (bool) {
        _balances[msg.sender] -= value;
        _balances[to] += value;
        return true;
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        _allowances[from][msg.sender] -= value;
        _balances[from] -= value;
        _balances[to] += value;
        return true;
    }

    function approve(address spender, uint256 value) external returns (bool) {
        _allowances[msg.sender][spender] = value;
        return true;
    }

    function getClaimableAmount() external pure returns (uint256) {
        return 0;
    }

    function claimVesting() external pure returns (uint256) {
        return 0;
    }

    function poolManager() external pure returns (IPoolManager) {
        return IPoolManager(address(0));
    }

    function name() external pure returns (string memory) {
        return "MockCreatorCoin";
    }

    function symbol() external pure returns (string memory) {
        return "MCC";
    }

    function decimals() external pure returns (uint8) {
        return 18;
    }
}
