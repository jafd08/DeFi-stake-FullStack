// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0; // safe math are OK after 0.8 version

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract TokenFarm is Ownable {
    // mapping token address -> staker address -> amount
    mapping(address => mapping(address => uint256)) public stakingBalance;
    mapping(address => uint256) public uniqueTokensStaked;
    mapping(address => address) public tokenPriceFeedMapping;

    address[] public stakers; // list of all stakers on our platform

    IERC20 public dappToken;
    // stake tokens
    // unstake tokens
    // issue tokens
    // add allowed tokens
    // get eth value
    address[] public allowedTokens;

    constructor(address _dappTokenAddress) public {
        dappToken = IERC20(_dappTokenAddress);
    }

    function setPriceFeedContract(address _token, address _priceFeed)
        public
        onlyOwner
    {
        // min 13:19
        tokenPriceFeedMapping[_token] = _priceFeed;
    }

    function issueTokens() public onlyOwner {
        // issue tokens of all stakers
        for (
            uint256 stakersIndex = 0;
            stakerIndex < stakers.length;
            stakersIndex++
        ) {
            address recipient = stakers[stakersIndex];
            // send them a token reward
            // based on their total value locked
            // min 13:11
            uint256 userTotalValue = getUserTotalValue(recipient);
            //dappToken.transfer(recipient, ????) // how much?
            dappToken.transfer(recipient, userTotalValue);
        }
    }

    function getUserTotalValue(address _user) public view returns (uint256) {
        uint256 totalValue = 0;
        require(uniqueTokensStaked[_user] > 0, "No tokens staked!");
        for (
            uint256 allowedTokensIndex = 0;
            allowedTokensIndex < allowedTokens.length;
            allowedTokensIndex++
        ) {
            totalValue =
                totalValue +
                getUserSingleTokenValue(
                    _user,
                    allowedTokens[allowedTokensIndex]
                );
        }
    }

    function getUserSingleTokenValue(address _user, address _token)
        public
        view
        returns (uint256)
    {
        // if we have 1 eth stakes -> $2000 = 2000 coins
        // $1 at this moment = 1 coin
        // 200 DAI = 200
        if (uniqueTokensStaked[_user] <= 0) {
            return 0;
        }
        (uint256 price, uint256 decimals) = getTokenValue(_token);
        return (stakingBalance[token][user] * price / (10 ** decimals));
    }

    function getTokenValue(address _token) public view returns (uint256) {
        // priceFeedAddress
        address priceFeedAddress = tokenPriceFeedMapping[_token];
        AggregatorV3Interface priceFeed = AggregatorV3Interface(priceFeedAddress);
        (,int256 price ,,,) = priceFeed.latestRoundData();
        uint256 decimals = uint256(priceFeed.decimals());
        return (uint256(price), decimals);
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
        if (uniqueTokensStaked[msg.sender] == 1) {
            // person has only 1 unique token
            stakers.push(msg.sender); // add to our list of stakers
        }
    }

    function unstakeTokens(address _token) public {
        uint256 balance = stakeBalance[_token][msg.sender];
        require(balance> 0, "staking balance cannot be 0");
        IER20(_token).transfer(msg.sender, balance);
        stakingBalance[_token][msg.sender] = 0 ;
        uniqueTokensStaked[msg.sender] = uniqueTokensStaked[msg.sender] -1;
    }
    function updateUniqueTokensStaked(address _user, address _token) internal {
        if (stakingBalance[_token][_user] <= 0) {
            uniqueTokensStaked[_user] = updateUniqueTokensStaked[_user] + 1;
        }
    }

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
