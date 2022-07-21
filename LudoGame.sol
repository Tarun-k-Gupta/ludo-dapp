pragma solidity ^ 0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract LudoGame {

    using SafeMath for uint;

    IERC20 private ludoCoin;
    address public owner;

    uint256 private signUpBonus;

    struct GameObject {
        uint gameCost;
        bool playing;
    }

    mapping(address => bool) userSignUpMapping;

    mapping(uint => mapping(address => GameObject)) gameMapping;

    mapping(uint => address[]) playersMapping;

    constructor(IERC20 _ludoCoin, uint _signUpBonus) {
        owner = msg.sender;
        signUpBonus = _signUpBonus;
        ludoCoin = _ludoCoin;
    }

    function updateSignUpBonus(uint _signUpBonus) external onlyOwner{
        signUpBonus = _signUpBonus;
    } 

    function signUp() external payable uniqueUser {
        require(ludoCoin.balanceOf(address(this)) >= signUpBonus, "Insufficient balance in the contract to provide the signup bonus");

        ludoCoin.transfer(tx.origin, signUpBonus); //from which account are the coins getting transferred?
        userSignUpMapping[tx.origin] = true;
    }

    function startGame(uint uniqueId, uint gameCost) external payable {

        require(gameMapping[uniqueId][tx.origin].playing == false, "Already in the waiting room");
        require(userSignUpMapping[tx.origin] == true, "User not signed up");
        require(ludoCoin.balanceOf(tx.origin) > gameCost, "Low balance!!");  //updated ludoCoin.balance to balanceOf

        if(ludoCoin.allowance(tx.origin, address(this)) < gameCost) { 
            ludoCoin.approve(address(this), gameCost);
        }

        ludoCoin.transferFrom(tx.origin, address(this), gameCost); //stake could have been stored in a temp variable also? why in contract?

        gameMapping[uniqueId][tx.origin].gameCost = gameCost;
        gameMapping[uniqueId][tx.origin].playing = true;

        playersMapping[uniqueId].push(tx.origin);
    }
 
    function endGame(uint uniqueId, address payable winner) external payable onlyOwner{
        address[] memory playerList = playersMapping[uniqueId];

        require(playerList.length > 0, "No active player found for this game!!");

        uint rewardPool = 0;

        for(uint i=0; i< playerList.length; i++) {
            rewardPool = rewardPool.add(gameMapping[uniqueId][playerList[i]].gameCost);
            delete(gameMapping[uniqueId][playerList[i]]);
        }

        if(rewardPool > 0) {
            require(rewardPool <= ludoCoin.balanceOf(address(this)), "Contract out of balance!");
            ludoCoin.transfer(winner, rewardPool);
        }
    }

    function bailOut(uint uniqueId, address payable quitter) external { //ca
        uint individialGameCost = 0;

        individialGameCost = gameMapping[uniqueId][quitter].gameCost;
        delete(gameMapping[uniqueId][quitter]);
        ludoCoin.transfer(quitter, individialGameCost);
    }

    modifier uniqueUser {
        require(userSignUpMapping[tx.origin] == false, "User already Signed Up");
        _;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can perform this operation");
        _;
    }

    function recieve() public payable {}  

    function destroy(address payable _addr) external payable onlyOwner{
        selfdestruct(_addr);
    }
}