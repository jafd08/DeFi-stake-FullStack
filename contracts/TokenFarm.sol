// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0; // safe math are OK after 0.8 version

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract TokenFarm is Ownable {
    // mapping token address -> staker address -> amount
    mapping(address => mapping(address => uint256)) public stakingBalance;
    address[] public stakers; // list of all stakers on our platform
    // stake tokens
    // unstake tokens
    // issue tokens
    // add allowed tokens
    // get eth value
    address[] public allowedTokens;

    function issueTokens() public onlyOwner {
        // issue tokens of all stakers
    }

    function stakeTokens(uint256 _amount, address _token) public {
        require(_amount > 0, "Amount must be more than 0");
        // require(_token is allowed ??)
        require(isTokenAllowed(_token), "Token is currently not allowed");
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        updateUniqueTokensStaked(msg.sender, _token); // get a good idea on how many unique tokens they have
        stakingBalance[_token][msg.sender] =
            stakingBalance[_token][msg.sender] +
            _amount; // add the amount of what they already staked
    }

    function updateUniqueTokensStaked(address user, address token) internal {}

    function addAllowedTokens(address _token) public onlyOwner {
        allowedTokens.push(_token);
    }

    function isTokenAllowed(address _token) public returns (bool) {
        for (
            uint256 allowedTokensIndex = 0;
            allowedTokensIndex < allowedTokens.length;
            allowedTokensIndex++
        ) {
            if (allowedTokens[allowedTokensIndex] == _token) {
                return true;
            }
        }
        return false;
    }
}
