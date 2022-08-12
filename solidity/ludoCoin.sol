pragma solidity ^ 0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LudoCoin is ERC20 {

    address private owner;
    
    constructor() ERC20("LUDO", "LD") {
        owner = msg.sender;
        _mint(msg.sender, 1000000000000000000000000);
    }

    function increaseSupply(uint256 additionalSupply) external onlyOwner {
        _mint(msg.sender, additionalSupply);
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can perform this operation");
        _;
    }

    function destroy(address payable _addr) external payable onlyOwner{
        selfdestruct(_addr);
    }
}
