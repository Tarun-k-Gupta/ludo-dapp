// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Coin {

    string public name = "LUDO";
    string public symbol = "LD";

    uint256 totalCoins;
    uint256 contractCoins;
    uint256 liquidityPool;
    uint256 totalStake;

    mapping(address => uint256) map;

    constructor() 
    {
        totalCoins = 1000000;
        map[msg.sender] = 100000; //10% of total Coins goes to owner
        contractCoins = 400000;  //40% of total coins goes to contract
        liquidityPool = 500000;
    }    

    //function to buy the coins when the user wants to start the game
    function buyCoins(address _to, uint256 value) public 
    {
        if(totalCoins - value >= 0)
        {
            map[_to] += value;
            totalCoins -= value;
        }
    }

    function transfer(address _to, uint256 value) public returns (bool)
    {
        require(map[msg.sender] >= value, "not enough tokens to transfer");
        map[msg.sender] -= value;
        map[_to] += value;
        return true;
    }

    function transferFrom(address _from, address _to, uint256 value) public returns (bool)
    {
        require(map[_from] >= value, "not enough tokens to transfer");
        map[_from] -= value;
        map[_to] += value;
        return true;
    }

    //stake the coins before the game starts and before the online player matching begins
    function startGame(address _from, uint256 stakeAmount) public returns (uint256)
    {
        require(map[_from] >= stakeAmount, "not enough coins to start the game");
        map[_from] -= stakeAmount;
        totalStake += stakeAmount;
        return map[_from];
    }

    //returning the stake if no player matches 
    function no2Players(address _p1, address _p2, uint256 stakeAmount) public
    {
        map[_p1] += stakeAmount;
        map[_p2] += stakeAmount;
        totalStake = 0;
    }

    function no4Players(address _p1, address _p2, address _p3, address _p4, uint256 stakeAmount) public
    {
        map[_p1] += stakeAmount;
        map[_p2] += stakeAmount;
        map[_p3] += stakeAmount;
        map[_p4] += stakeAmount;
        totalStake = 0;
    }

    //adding the winning amount to winners account 
    function gameEnd2players(address w1, uint256 stake) public
    {
        if(stake == 50) 
        {
            map[w1] += 90;
            totalCoins += 10;
            if(contractCoins - 90 >= 0) //burning the coins
                contractCoins -= 90;
            totalStake = 0;
        }
        else if(stake == 100) 
        {
            map[w1] += 190;
            totalCoins += 10; //not sure about this for where should this 10 coins go..
            if(contractCoins - 190 >= 0)
                contractCoins -= 190;
            totalStake = 0;
        }
        else if(stake == 500) 
        {
            map[w1] += 900;
            totalCoins += 100;
            if(contractCoins - 900 >= 0)
                contractCoins -= 900;
            totalStake = 0;
        } 
        else if(stake == 1000) 
        {
            map[w1] += 1900;
            totalCoins += 100;
            if(contractCoins - 1900 >= 0)
                contractCoins -= 1900;
            totalStake = 0;
        } 
        else if(stake == 5000) 
        {
            map[w1] += 9000;
            totalCoins += 1000;
            if(contractCoins - 9000 >= 0)
                contractCoins -= 9000;
            totalStake = 0;
        } 
        else if(stake == 10000) 
        {
            map[w1] += 19000;
            totalCoins += 1000;
            if(contractCoins - 19000 >= 0)
                contractCoins -= 19000;
            totalStake = 0;
        } 

    }

    function gameEnd4players(address w1, address w2, uint256 stake) public
    {
        if(stake == 50) 
        {
            map[w1] += 140;
            map[w2] += 50;
            totalCoins += 10;
            if(contractCoins - 190 >= 0)
                contractCoins -= 190;
            totalStake = 0;
        }
        else if(stake == 100) 
        {
            map[w1] += 290;
            map[w2] += 100;
            totalCoins += 10;
            if(contractCoins - 390 >= 0)
                contractCoins -= 390;
            totalStake = 0;
        }
        else if(stake == 500) 
        {
            map[w1] += 350;
            map[w2] += 100;
            totalCoins += 50;
            if(contractCoins - 450 >= 0)
                contractCoins -= 450;
            totalStake = 0;
        }
        else if(stake == 1000) 
        {
            map[w1] += 2500;
            map[w2] += 1000;
            totalCoins += 500;
            if(contractCoins - 3500 >= 0)
                contractCoins -= 3500;
            totalStake = 0;
        }
        else if(stake == 5000) 
        {
            map[w1] += 14000;
            map[w2] += 5000;
            totalCoins += 1000;
            if(contractCoins - 19000 >= 0)
                contractCoins -= 19000;
            totalStake = 0;
        }
        else if(stake == 10000) 
        {
            map[w1] += 25000;
            map[w2] += 10000;
            totalCoins += 5000;
            if(contractCoins - 35000 >= 0)
                contractCoins -= 35000;
            totalStake = 0;
        }
    }

    //adding 100 coins when user joins for the first time 
    function newAccount(address _account) public
    {
        require(totalCoins >= 100, "not enough coins");
        if(map[_account] == 0)
        {
            totalCoins -= 100; 
            map[_account] += 100;
        }
    }

    // function to return the coins owned by the user so that we can display it on the screen
    function getBalance(address _account) public view returns (uint) 
    {
        return map[_account];
    }
}
