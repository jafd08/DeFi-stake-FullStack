pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DappToken is ERC20 {
    // token to engage and participate - staking on platform - reward token - etc
    // ERC 20 token
    constructor() public ERC20("Dapp Token", "DAPP"){
        _mint(msg.sender, 1000000000000000000000000);
    }
}