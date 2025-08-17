// // SPDX-License-Identifier: UNLICENSED
// pragma solidity ^0.8.13;

// import {Test, console} from "forge-std/Test.sol";
// import {Flip} from "../src/Flip.sol";
// import {MarketCapOracle} from "../src/oracle/MarketCapOracle.sol";
// import {MockCreatorCoin} from "../src/mocks/MockCreatorCoin.sol";


// contract FlipTest is Test {
//     Flip public flip;
//     MarketCapOracle public oracle;
//     MockCreatorCoin public token1;
//     MockCreatorCoin public token2;
    
//     address creator1 = address(0x1);
//     address creator2 = address(0x2);
    
//     function setUp() public {
//         oracle = new MarketCapOracle();
//         flip = new Flip(oracle);
        
//         token1 = new MockCreatorCoin(creator1);
//         token2 = new MockCreatorCoin(creator2);
        
//         // Give creators tokens and approvals
//         vm.prank(creator1);
//         token1.approve(address(flip), type(uint256).max);
        
//         vm.prank(creator2);
//         token2.approve(address(flip), type(uint256).max);
//     }
    
//     function testCreateChallenge() public {
//         vm.prank(creator1);
//         bytes32 battleId = flip.createChallenge(creator2, token1, token2, 1000e18);
        
//         (address battleCreator1, address battleCreator2,,,,,,,,,,,,,) = flip.battles(battleId);
        
//         assertEq(battleCreator1, creator1);
//         assertEq(battleCreator2, creator2);
//     }
    
//     function testAcceptChallenge() public {
//         vm.prank(creator1);
//         bytes32 battleId = flip.createChallenge(creator2, token1, token2, 1000e18);
        
//         vm.prank(creator2);
//         flip.acceptChallenge(battleId);
        
//         (,,,,,Flip.BattleState state,,,,,,,,,) = flip.battles(battleId);
//         assertEq(uint256(state), 1); // TRADING_PERIOD
//     }
    
//     function testFullBattleFlow() public {
//         // Create and accept battle
//         vm.prank(creator1);
//         bytes32 battleId = flip.createChallenge(creator2, token1, token2, 1000e18);
        
//         vm.prank(creator2);
//         flip.acceptChallenge(battleId);
        
//         // Fast forward past battle end
//         vm.warp(block.timestamp + 25 hours);
        
//         // Determine winner
//         address winner = flip.determineWinner(battleId);
        
//         // Give tokens to mock holders for BOTH tokens to ensure test works regardless of winner
//         vm.prank(creator1);
//         token1.transfer(address(0x100), 100e18);
//         vm.prank(creator2); 
//         token2.transfer(address(0x100), 100e18);
//         vm.prank(creator1);
//         token1.transfer(address(0x200), 50e18);
//         vm.prank(creator2);
//         token2.transfer(address(0x200), 50e18);
        
//         // Create mock top holders data (we'll test with whichever token wins)
//         Flip.TopHolder[5] memory topHolders;
//         topHolders[0] = Flip.TopHolder(address(0x100), 1000e18, block.timestamp - 12 hours);
//         topHolders[1] = Flip.TopHolder(address(0x200), 500e18, block.timestamp - 10 hours);
        
//         // Store initial balances
//         uint256 winnerBalance1Before = token1.balanceOf(winner);
//         uint256 winnerBalance2Before = token2.balanceOf(winner);
//         // uint256 holder1BalanceBefore = token1.balanceOf(address(0x100));
//         // uint256 holder2BalanceBefore = token2.balanceOf(address(0x100));
        
//         // Distribute prizes
//         flip.distributePrizes(battleId, topHolders);
        
//         // Verify winner received both their own tokens and majority of loser's tokens
//         if (winner == creator1) {
//             assertEq(token1.balanceOf(winner), winnerBalance1Before + 1000e18); // Got own tokens back
//             assertEq(token2.balanceOf(winner), winnerBalance2Before + 800e18);  // Got 80% of loser tokens
//         } else {
//             assertEq(token2.balanceOf(winner), winnerBalance2Before + 1000e18); // Got own tokens back  
//             assertEq(token1.balanceOf(winner), winnerBalance1Before + 800e18);  // Got 80% of loser tokens
//         }
        
//         // Verify top holders received rewards from loser's tokens
//         // Note: This assumes winner token is token1 and loser is token2
//         // In real test, we'd check which token the holders should receive based on winner
//     }
// }