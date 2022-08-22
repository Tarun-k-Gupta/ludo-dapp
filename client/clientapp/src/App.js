import React from 'react';
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./board.css";
import "./App.css";
import io from "socket.io-client";
import abi from "./ludoAbi/Ludo.json";
const socket = io.connect("http://localhost:3001");

function App() {
  const [diceUrl, setDiceUrl] = useState("")

  let dice = ['./one.jpeg', './two.jpeg', './three.jpeg', './four.jpeg', './five.jpeg', './six.jpeg']

  let players = [0, 0, 0, 0, 0]; //players[0] = 1 if game is over
  let player = 0;

  let player11pos = [0, 0, 0, 0];
  let player12pos = [0, 0, 0, 0];
  let player13pos = [0, 0, 0, 0];
  let player14pos = [0, 0, 0, 0];

  let player21pos = [0, 0, 0, 0];
  let player22pos = [0, 0, 0, 0];
  let player23pos = [0, 0, 0, 0];
  let player24pos = [0, 0, 0, 0];

  let player31pos = [0, 0, 0, 0];
  let player32pos = [0, 0, 0, 0];
  let player33pos = [0, 0, 0, 0];
  let player34pos = [0, 0, 0, 0];

  let player41pos = [0, 0, 0, 0];
  let player42pos = [0, 0, 0, 0];
  let player43pos = [0, 0, 0, 0];
  let player44pos = [0, 0, 0, 0];



  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function getID(row, col) {
    let str = "cell";
    str += row.toString();
    str += col.toString();
    return str;
  }

  function setHome(coin, id) {
    if (coin == 1) {
      if (id == "1") player11pos = [0, 0, 0, 0];
      else if (id == "2") player12pos = [0, 0, 0, 0];
      else if (id == "3") player13pos = [0, 0, 0, 0];
      else if (id == "4") player14pos = [0, 0, 0, 0];
    }
    else if (coin == 2) {
      if (id == "1") player21pos = [0, 0, 0, 0];
      else if (id == "2") player22pos = [0, 0, 0, 0];
      else if (id == "3") player23pos = [0, 0, 0, 0];
      else if (id == "4") player24pos = [0, 0, 0, 0];
    }
    else if (coin == 3) {
      if (id == "1") player31pos = [0, 0, 0, 0];
      else if (id == "2") player32pos = [0, 0, 0, 0];
      else if (id == "3") player33pos = [0, 0, 0, 0];
      else if (id == "4") player34pos = [0, 0, 0, 0];
    }
    else if (coin == 4) {
      if (id == "1") player41pos = [0, 0, 0, 0];
      else if (id == "2") player42pos = [0, 0, 0, 0];
      else if (id == "3") player43pos = [0, 0, 0, 0];
      else if (id == "4") player44pos = [0, 0, 0, 0];
    }

  }

  function sendHome(row, col) {
    let coin, id, color;
    coin = colorOfBox(row, col);
    let cell = document.getElementById("cell" + row.toString() + col.toString());
    id = cell.innerHTML;
    color = cell.style.backgroundColor;
    setHome(coin, id.toString());
    let coin_id = "coin" + coin.toString() + id.toString();
    document.getElementById(coin_id).style.backgroundColor = color;
  }

  function colorOfBox(row, col) {
    var box = row.toString() + col.toString();
    var id = "cell" + box;
    var box = document.getElementById(id);
    if ((box.style.backgroundColor == "") || (box.style.backgroundColor == "white")) return 0;
    else if (box.style.backgroundColor == "red") return 1;
    else if (box.style.backgroundColor == "green") return 2;
    else if (box.style.backgroundColor == "yellow") return 3;
    else if (box.style.backgroundColor == "blue") return 4;
  }

  function replaceBox(pos, color) {
    if (pos[3] != 0) return 1;
    if (colorOfBox(pos[0], pos[1]) == 0) {
      return 1; //can be replaced/updated
    }

    if (colorOfBox(pos[0], pos[1]) == color) {
      console.log("hi");
      return 0; //cannot be replaced.
    }
    else {
      if (colorOfBox(pos[0], pos[1]) == 1) {
        if ((pos[0] == 7) && (pos[1] == 2)) {
          return 0; //as it is in safe point..can't be replaced; 
        }
        else {
          sendHome(pos[0], pos[1]);
          return 1;
        }
      }
      else if (colorOfBox(pos[0], pos[1]) == 2) {
        if ((pos[0] == 2) && (pos[1] == 9)) {
          return 0; //as it is in safe point..can't be replaced; 
        }
        else {
          sendHome(pos[0], pos[1]);
          return 1;
        }
      }
      else if (colorOfBox(pos[0], pos[1]) == 3) {
        if ((pos[0] == 9) && (pos[1] == 14)) {
          return 0; //as it is in safe point..can't be replaced; 
        }
        else {
          sendHome(pos[0], pos[1]);
          return 1;
        }
      }
      else if (colorOfBox(pos[0], pos[1]) == 4) {
        if ((pos[0] == 14) && (pos[1] == 7)) {
          return 0; //as it is in safe point..can't be replaced; 
        }
        else {
          sendHome(pos[0], pos[1]);
          return 1;
        }
      }
    }

  }

  function updateBox(row, col, safety, pos, fromHome, color, coin) {
    let colour;
    if (color == 1) colour = "red";
    else if (color == 2) colour = "green";
    else if (color == 3) colour = "yellow";
    else if (color == 4) colour = "blue";

    if (!replaceBox(pos, color)) {
      pos[0] = row; pos[1] = col; pos[2] = safety;
      return 0;
    }
    else {
      if (fromHome) {
        let id = getID(pos[0], pos[1]);
        document.getElementById(id).style.backgroundColor = colour;
        document.getElementById(id).innerHTML = coin;
        document.getElementById("coin" + color.toString() + coin.toString()).style.backgroundColor = "white";
        socket.emit("fromHome", id, color, coin, colour, room);
      }
      else {
        document.getElementById(getID(row, col)).style.backgroundColor = "";
        document.getElementById(getID(row, col)).innerHTML = "";
        socket.emit("setNull", row, col, room);

        if (pos[2] == 0) //not in safe lines
        {
          document.getElementById(getID(pos[0], pos[1])).style.backgroundColor = colour;
          document.getElementById(getID(pos[0], pos[1])).innerHTML = coin;
          socket.emit("pos2", pos[0], pos[1], colour, coin, room);
        }
        else {
          if (pos[3] == 1) {
            let coinId = "coin" + color.toString() + coin.toString();
            document.getElementById(coinId).style.backgroundColor = "lightgreen";
            pos[0] = 0; pos[1] = 0;
            socket.emit("pos3", coinId, room);
          }
          else {
            document.getElementById(getID(pos[0], pos[1])).style.backgroundColor = colour;
            document.getElementById(getID(pos[0], pos[1])).innerHTML = coin;
            socket.emit("Notpos3", pos[0], pos[1], colour, coin, room);        
          }
        }
      }
      return 1;
    }
  }

  function move(pos, num) {
    while (num > 0) {
      if (pos[0] == 7) {
        while ((pos[1] <= 6) && (num > 0)) {
          pos[1]++; num--;
        }
        if (pos[1] == 7) {
          pos[0]--;
        }
        while ((10 <= pos[1]) && (pos[1] <= 14) && (num > 0)) {
          pos[1]++; num--;
        }
      }

      if (pos[1] == 7) {
        while ((1 < pos[0]) && (pos[0] <= 6) && (num > 0)) {
          pos[0]--; num--;
        }
        while ((10 <= pos[0]) && (pos[0] <= 15) && (num > 0)) {
          pos[0]--; num--;
        }
        if (pos[0] == 9) pos[1]--;
      }

      if (pos[0] == 1) {
        while ((7 <= pos[1]) && (pos[1] < 9) && (num > 0)) {
          pos[1]++; num--;
        }
      }

      if (pos[1] == 9) {
        while ((pos[0] <= 6) && (num > 0)) {
          pos[0]++; num--;
        }
        if (pos[0] == 7) pos[1]++;
        while ((10 <= pos[0]) && (pos[0] < 15) && (num > 0)) {
          pos[0]++; num--;
        }
      }

      if (pos[1] == 15) {
        while ((7 <= pos[0]) && (pos[0] < 9) && (num > 0)) {
          pos[0]++; num--;
        }
      }

      if (pos[0] == 9) {
        while ((1 < pos[1]) && (pos[1] <= 6) && (num > 0)) {
          pos[1]--; num--;
        }
        while ((10 <= pos[1]) && (pos[1] <= 15) && (num > 0)) {
          pos[1]--; num--;
        }
        if (pos[1] == 9) pos[0]++;
      }

      if (pos[0] == 15) {
        while ((7 < pos[1]) && (pos[1] <= 9) && (num > 0)) {
          pos[1]--; num--;
        }
      }

      if (pos[1] == 1) {
        while ((7 < pos[0]) && (pos[0] <= 9) && (num > 0)) {
          pos[0]--; num--;
        }
      }
    }
  }

  function safemove(pos, num) {
    if ((pos[0] == 7) && (num > 0)) {
      pos[0]++; num--;
    }

    if ((pos[0] == 8) && (pos[1] <= 6) && (num > 0)) {
      let temp = pos[1];
      while (num > 0) {
        pos[1]++; num--;
      }
      if (pos[1] > 7) pos[1] = temp;
    }

    if ((pos[1] == 9) && (num > 0)) {
      pos[1]--; num--;
    }

    if ((pos[1] == 8) && (pos[0] <= 6) && (num > 0)) {
      let temp = pos[0];
      while (num > 0) {
        pos[0]++; num--;
      }
      if (pos[0] > 7) pos[0] = temp;
    }

    if ((pos[0] == 9) && (num > 0)) {
      pos[0]--; num--;
    }

    if ((pos[0] == 8) && (pos[1] >= 10) && (num > 0)) {
      let temp = pos[1];
      while (num > 0) {
        pos[1]--; num--;
      }
      if (pos[1] < 9) pos[1] = temp;
    }

    if ((pos[1] == 7) && (num > 0)) {
      pos[1]++; num--;
    }

    if ((pos[1] == 8) && (pos[0] >= 10) && (num > 0)) {
      let temp = pos[0];
      while (num > 0) {
        pos[0]--; num--;
      }
      if (pos[0] < 9) pos[0] = temp;
    }
  }


  function move1(pos, num) {
    if ((pos[0] == 0) && (pos[1] == 0)) {
      if (num == 6) num = 1;
      else return;
      pos[0] = 7; pos[1] = 2;
      num--;
      return;
    }

    if (!pos[2]) {
      let row = pos[0];
      let col = pos[1];
      let roll = num;
      move(pos, num);
      if (((row == 9) && (col <= 4)) || (col == 1)) {
        if ((pos[0] <= 7) && (pos[1] >= 2)) {
          pos[0] = row;
          pos[1] = col;
          num = roll;
          pos[2] = 1;
        }
      }
    }
    if (pos[2]) {
      if ((pos[0] != 8) || (pos[1] == 1)) {
        if ((pos[0] == 9) && (pos[1] == 4)) num -= 6;
        else if ((pos[0] == 9) && (pos[1] == 3)) num -= 5;
        else if ((pos[0] == 9) && (pos[1] == 2)) num -= 4;
        else if ((pos[0] == 9) && (pos[1] == 1)) num -= 3;
        else if ((pos[0] == 8) && (pos[1] == 1)) num -= 2;
        else if ((pos[0] == 7) && (pos[1] == 1)) num -= 1;
        pos[0] = 7; pos[1] = 2;
      }
      safemove(pos, num);
    }
  }

  function move2(pos, num) {
    if ((pos[0] == 0) && (pos[1] == 0)) {
      if (num == 6) num = 1;
      else return;
      pos[0] = 2; pos[1] = 9;
      num--;
      return;
    }

    if (!pos[2]) {
      let row = pos[0];
      let col = pos[1];
      let roll = num;
      move(pos, num);
      if (((col == 7) && (row <= 4)) || (row == 1)) {
        if ((pos[1] >= 9) && (pos[0] >= 2)) {
          pos[0] = row;
          pos[1] = col;
          num = roll;
          pos[2] = 1;
        }
      }
    }
    if (pos[2]) {
      if (!((pos[1] == 8) && (pos[0] != 1))) {
        if ((pos[1] == 7) && (pos[0] == 4)) num -= 6;
        else if ((pos[1] == 7) && (pos[0] == 3)) num -= 5;
        else if ((pos[1] == 7) && (pos[0] == 2)) num -= 4;
        else if ((pos[1] == 7) && (pos[0] == 1)) num -= 3;
        else if ((pos[1] == 8) && (pos[0] == 1)) num -= 2;
        else if ((pos[1] == 9) && (pos[0] == 1)) num -= 1;
        pos[1] = 9; pos[0] = 2;
      }
      safemove(pos, num);
    }
  }

  function move3(pos, num) {
    if ((pos[0] == 0) && (pos[1] == 0)) {
      if (num == 6) num = 1;
      else return;
      pos[0] = 9; pos[1] = 14;
      num--;
      return;
    }

    if (!pos[2]) {
      let row = pos[0];
      let col = pos[1];
      let roll = num;
      move(pos, num);
      if (((row == 7) && (col >= 12)) || (col == 15)) {
        if ((pos[0] >= 9) && (pos[1] <= 14)) {
          pos[0] = row;
          pos[1] = col;
          num = roll;
          pos[2] = 1;
        }
      }
    }
    if (pos[2]) {
      if (!((pos[0] == 8) && (pos[1] != 15))) {
        if ((pos[0] == 7) && (pos[1] == 12)) num -= 6;
        else if ((pos[0] == 7) && (pos[1] == 13)) num -= 5;
        else if ((pos[0] == 7) && (pos[1] == 14)) num -= 4;
        else if ((pos[0] == 7) && (pos[1] == 15)) num -= 3;
        else if ((pos[0] == 8) && (pos[1] == 15)) num -= 2;
        else if ((pos[0] == 9) && (pos[1] == 15)) num -= 1;
        pos[0] = 9; pos[1] = 14;
      }
      safemove(pos, num);
    }
  }

  function move4(pos, num) {
    if ((pos[0] == 0) && (pos[1] == 0)) {
      if (num == 6) num = 1;
      else return;
      pos[0] = 14; pos[1] = 7;
      num--;
      return;
    }

    if (!pos[2]) {
      let row = pos[0];
      let col = pos[1];
      let roll = num;
      move(pos, num);
      if (((col == 9) && (row >= 12)) || (row == 15)) {
        if ((pos[1] <= 7) && (pos[0] <= 14)) {
          pos[0] = row;
          pos[1] = col;
          num = roll;
          pos[2] = 1;
        }
      }
    }
    if (pos[2]) {
      if (!((pos[1] == 8) && (pos[0] != 15))) {
        if ((pos[1] == 9) && (pos[0] == 12)) num -= 6;
        else if ((pos[1] == 9) && (pos[0] == 13)) num -= 5;
        else if ((pos[1] == 9) && (pos[0] == 14)) num -= 4;
        else if ((pos[1] == 9) && (pos[0] == 15)) num -= 3;
        else if ((pos[1] == 8) && (pos[0] == 15)) num -= 2;
        else if ((pos[1] == 7) && (pos[0] == 15)) num -= 1;
        pos[1] = 7; pos[0] = 14;
      }
      safemove(pos, num);
    }
  }

  function play1(num, coin, pos) {
    let row = pos[0];
    let col = pos[1];
    let safety = pos[2];
    let fromHome = false;
    if ((pos[0] == 0) && (pos[1] == 0)) fromHome = true;

    let number = 0;
    if (coin == "coin11") number = 1;
    else if (coin == "coin12") number = 2;
    else if (coin == "coin13") number = 3;
    else if (coin == "coin14") number = 4;


    move1(pos, num); //updates the new position
    if ((pos[0] == 8) && (pos[1] == 7)) pos[3] = 1;

    //check for same coin meeting

    if (updateBox(row, col, safety, pos, fromHome, 1, number)) players[1] = 0;
  }

  function play2(num, coin, pos) {
    let row = pos[0];
    let col = pos[1];
    let safety = pos[2];
    let fromHome = false;
    if ((pos[0] == 0) && (pos[1] == 0)) fromHome = true;

    let number = 0;
    if (coin == "coin21") number = 1;
    else if (coin == "coin22") number = 2;
    else if (coin == "coin23") number = 3;
    else if (coin == "coin24") number = 4;


    move2(pos, num); //updates the new position
    if ((pos[0] == 7) && (pos[1] == 8)) pos[3] = 1;

    //check for same coin meeting

    if (updateBox(row, col, safety, pos, fromHome, 2, number)) players[2] = 0;

  }

  function play3(num, coin, pos) {
    let row = pos[0];
    let col = pos[1];
    let safety = pos[2];
    let fromHome = false;
    if ((pos[0] == 0) && (pos[1] == 0)) fromHome = true;

    let number = 0;
    if (coin == "coin31") number = 1;
    else if (coin == "coin32") number = 2;
    else if (coin == "coin33") number = 3;
    else if (coin == "coin34") number = 4;


    move3(pos, num); //updates the new position
    if ((pos[0] == 8) && (pos[1] == 9)) pos[3] = 1;

    //check for same coin meeting

    if (updateBox(row, col, safety, pos, fromHome, 3, number)) players[3] = 0;

  }

  function play4(num, coin, pos) {
    let row = pos[0];
    let col = pos[1];
    let safety = pos[2];
    let fromHome = false;
    if ((pos[0] == 0) && (pos[1] == 0)) fromHome = true;

    let number = 0;
    if (coin == "coin41") number = 1;
    else if (coin == "coin42") number = 2;
    else if (coin == "coin43") number = 3;
    else if (coin == "coin44") number = 4;


    move4(pos, num); //updates the new position'
    if ((pos[0] == 9) && (pos[1] == 8)) pos[3] = 1;

    //check for same coin meeting

    if (updateBox(row, col, safety, pos, fromHome, 4, number)) players[4] = 0;

  }


  function play(num) {
    document.getElementById("coin11").onclick = function () { if (players[1] && !player11pos[3]) { play1(num, "coin11", player11pos); sendInfo(player11pos, player12pos, player13pos, player14pos, player21pos, player22pos, player23pos, player24pos, player31pos, player32pos, player33pos, player34pos, player41pos, player42pos, player43pos, player44pos, room) } };
    document.getElementById("coin12").onclick = function () { if (players[1] && !player12pos[3]) { play1(num, "coin12", player12pos); sendInfo(player11pos, player12pos, player13pos, player14pos, player21pos, player22pos, player23pos, player24pos, player31pos, player32pos, player33pos, player34pos, player41pos, player42pos, player43pos, player44pos, room) } };
    document.getElementById("coin13").onclick = function () { if (players[1] && !player13pos[3]) { play1(num, "coin13", player13pos); sendInfo(player11pos, player12pos, player13pos, player14pos, player21pos, player22pos, player23pos, player24pos, player31pos, player32pos, player33pos, player34pos, player41pos, player42pos, player43pos, player44pos, room) } };
    document.getElementById("coin14").onclick = function () { if (players[1] && !player14pos[3]) { play1(num, "coin14", player14pos); sendInfo(player11pos, player12pos, player13pos, player14pos, player21pos, player22pos, player23pos, player24pos, player31pos, player32pos, player33pos, player34pos, player41pos, player42pos, player43pos, player44pos, room) } };

    document.getElementById("coin21").onclick = function () { if (players[2] && !player21pos[3]) { play2(num, "coin21", player21pos); sendInfo(player11pos, player12pos, player13pos, player14pos, player21pos, player22pos, player23pos, player24pos, player31pos, player32pos, player33pos, player34pos, player41pos, player42pos, player43pos, player44pos, room) } };
    document.getElementById("coin22").onclick = function () { if (players[2] && !player22pos[3]) { play2(num, "coin22", player22pos); sendInfo(player11pos, player12pos, player13pos, player14pos, player21pos, player22pos, player23pos, player24pos, player31pos, player32pos, player33pos, player34pos, player41pos, player42pos, player43pos, player44pos, room) } };
    document.getElementById("coin23").onclick = function () { if (players[2] && !player23pos[3]) { play2(num, "coin23", player23pos); sendInfo(player11pos, player12pos, player13pos, player14pos, player21pos, player22pos, player23pos, player24pos, player31pos, player32pos, player33pos, player34pos, player41pos, player42pos, player43pos, player44pos, room) } };
    document.getElementById("coin24").onclick = function () { if (players[2] && !player24pos[3]) { play2(num, "coin24", player24pos); sendInfo(player11pos, player12pos, player13pos, player14pos, player21pos, player22pos, player23pos, player24pos, player31pos, player32pos, player33pos, player34pos, player41pos, player42pos, player43pos, player44pos, room) } };

    document.getElementById("coin31").onclick = function () { if (players[3] && !player31pos[3]) { play3(num, "coin31", player31pos); sendInfo(player11pos, player12pos, player13pos, player14pos, player21pos, player22pos, player23pos, player24pos, player31pos, player32pos, player33pos, player34pos, player41pos, player42pos, player43pos, player44pos, room) } };
    document.getElementById("coin32").onclick = function () { if (players[3] && !player32pos[3]) { play3(num, "coin32", player32pos); sendInfo(player11pos, player12pos, player13pos, player14pos, player21pos, player22pos, player23pos, player24pos, player31pos, player32pos, player33pos, player34pos, player41pos, player42pos, player43pos, player44pos, room) } };
    document.getElementById("coin33").onclick = function () { if (players[3] && !player33pos[3]) { play3(num, "coin33", player33pos); sendInfo(player11pos, player12pos, player13pos, player14pos, player21pos, player22pos, player23pos, player24pos, player31pos, player32pos, player33pos, player34pos, player41pos, player42pos, player43pos, player44pos, room) } };
    document.getElementById("coin34").onclick = function () { if (players[3] && !player34pos[3]) { play3(num, "coin34", player34pos); sendInfo(player11pos, player12pos, player13pos, player14pos, player21pos, player22pos, player23pos, player24pos, player31pos, player32pos, player33pos, player34pos, player41pos, player42pos, player43pos, player44pos, room) } };

    document.getElementById("coin41").onclick = function () { if (players[4] && !player41pos[3]) { play4(num, "coin41", player41pos); sendInfo(player11pos, player12pos, player13pos, player14pos, player21pos, player22pos, player23pos, player24pos, player31pos, player32pos, player33pos, player34pos, player41pos, player42pos, player43pos, player44pos, room) } };
    document.getElementById("coin42").onclick = function () { if (players[4] && !player42pos[3]) { play4(num, "coin42", player42pos); sendInfo(player11pos, player12pos, player13pos, player14pos, player21pos, player22pos, player23pos, player24pos, player31pos, player32pos, player33pos, player34pos, player41pos, player42pos, player43pos, player44pos, room) } };
    document.getElementById("coin43").onclick = function () { if (players[4] && !player43pos[3]) { play4(num, "coin43", player43pos); sendInfo(player11pos, player12pos, player13pos, player14pos, player21pos, player22pos, player23pos, player24pos, player31pos, player32pos, player33pos, player34pos, player41pos, player42pos, player43pos, player44pos, room) } };
    document.getElementById("coin44").onclick = function () { if (players[4] && !player44pos[3]) { play4(num, "coin44", player44pos); sendInfo(player11pos, player12pos, player13pos, player14pos, player21pos, player22pos, player23pos, player24pos, player31pos, player32pos, player33pos, player34pos, player41pos, player42pos, player43pos, player44pos, room) } };
    players[player] = 0;
    player = player % 4 + 1;
    players[player] = 1;
  }

  function rolldice() {
    var choice = document.getElementById("choice");
    let num = getRandomInt(6);
    choice.style.backgroundImage = `url(${dice[num]})`;
    console.log(dice[num]);
    num = num + 1;

    play(num);
    socket.emit("updatePlayers", (players, room));
  }

  function start() {
    player = 4;
    players[player] = 1;
    document.getElementById("cell72").innerHTML = "START";
    document.getElementById("cell29").innerHTML = "START";
    document.getElementById("cell914").innerHTML = "START";
    document.getElementById("cell147").innerHTML = "START";
    document.getElementById('rollbutton').onclick = function () { rolldice() };
  }


  const [currentAccount, setCurrentAccount] = useState("");
  const [userCoins, setUserCoins] = useState(0);
  const [room, setRoom] = useState("");
  const [roomJoined, setroomJoined] = useState(false);
  const [gameStartData, setGameStartData] = useState(
    {
      players: 2,
      coins: 50
    });
  const contractAddress = "0xB5600aa28a8B2F5e008C2e8f13Bb8c5C2698D625";
  const contractABI = abi.abi;

  const joinRoom = () => {

    if (room !== "") {
      socket.emit("join_room", room);
      setroomJoined(true);
    }
  };

  const sendInfo = (player11pos, player12pos, player13pos, player14pos, player21pos, player22pos, player23pos, player24pos, player31pos, player32pos, player33pos, player34pos, player41pos, player42pos, player43pos, player44pos, room) => {
    console.log(room)
    socket.emit("updateBoard", player11pos, player12pos, player13pos, player14pos, player21pos, player22pos, player23pos, player24pos, player31pos, player32pos, player33pos, player34pos, player41pos, player42pos, player43pos, player44pos, room);
  }

  useEffect(() => {

    socket.on("receiveBoard", (p11pos, p12pos, p13pos, p14pos, p21pos, p22pos, p23pos, p24pos, p31pos, p32pos, p33pos, p34pos, p41pos, p42pos, p43pos, p44pos,) => {
      console.log("Listening receive board...");
      player11pos = p11pos;
      player12pos = p12pos;
      player13pos = p13pos;
      player14pos = p14pos;

      player21pos = p21pos;
      player22pos = p22pos;
      player23pos = p23pos;
      player24pos = p24pos;

      player31pos = p31pos;
      player32pos = p32pos;
      player33pos = p33pos;
      player34pos = p34pos;

      player41pos = p41pos;
      player42pos = p42pos;
      player43pos = p43pos;
      player44pos = p44pos;
    });

    console.log("here1");
    socket.on("sfromHome", (id, color, coin, colour) => {
      console.log("event catched..")
      document.getElementById(id).style.backgroundColor = colour;
      document.getElementById(id).innerHTML = coin;
      document.getElementById("coin" + color.toString() + coin.toString()).style.backgroundColor = "white";
    })
    console.log("here2");

    socket.on("s_setNull", (row, col) => {
      document.getElementById(getID(row, col)).style.backgroundColor = "";
      document.getElementById(getID(row, col)).innerHTML = "";
    })

    socket.on("s_pos2", (pos_0, pos_1, colour, coin) => {
      document.getElementById(getID(pos_0, pos_1)).style.backgroundColor = colour;
      document.getElementById(getID(pos_0, pos_1)).innerHTML = coin;
    })

    socket.on("s_pos3", (coinId) => {
      document.getElementById(coinId).style.backgroundColor = "lightgreen";
    })

    socket.on("s_Notpos3", (pos_0, pos_1, colour, coin) => {
      document.getElementById(getID(pos_0, pos_1)).style.backgroundColor = colour;
      document.getElementById(getID(pos_0, pos_1)).innerHTML = coin;
    })

    socket.on("s_updatePlayers", (Players) => {
      players = Players;
    })

  }, [socket])

  socket.on("sfromHome", (id, color, coin, colour) => {
    console.log("event catched..")
    document.getElementById(id).style.backgroundColor = colour;
    document.getElementById(id).innerHTML = coin;
    document.getElementById("coin" + color.toString() + coin.toString()).style.backgroundColor = "white";
  })

  const connectWallet = async (e) => {
    try {
      e.preventDefault();
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const ludoContract = new ethers.Contract(contractAddress, contractABI, signer);
      await ludoContract.newAccount(accounts[0]);
      let userCoins = await ludoContract.getBalance(accounts[0]);
      setUserCoins(userCoins.toNumber());
      console.log("coins:", userCoins.toNumber());
    } catch (error) {

      console.log(error)
    }
  }

  const searchPlayers = () => {
    console.log("Yo search players!!")
  }

  const func = () => {
  }


  const startGame = async (e) => {

    e.preventDefault();
    console.log("start clicked");
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const ludoContract = new
          ethers.Contract(contractAddress, contractABI, signer);
        if (room == "") {
          alert("Please enter room number");
          return;
        };

        let staked = await ludoContract.startGame(currentAccount, gameStartData.coins);
        let userCoins = await ludoContract.getBalance(currentAccount);
        setUserCoins(userCoins.toNumber());
        console.log("coins:", userCoins.toNumber());

        //add condition: players should not be more than 4 in any room
        socket.emit("join_room", room);
        setroomJoined(true);

      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log("error")
      alert("Not enough coins")
    }
  }

  const handleChange = (e) => {
    setGameStartData(prevData => {
      return {
        ...prevData,
        [e.target.name]: e.target.value
      }
    })
  }

  const buyToken = () => {
    window.open("https://app.uniswap.org/#/swap?chain=polygon_mumbai", '_blank');
  }
  const updateCoins = () => {

  }
  
  if (roomJoined) {
    return (
      <div>
        <main className="background">
          <section className="title">
            <h1>Ludo</h1>
          </section>
          <section class="game">
          <div class="cell" id="cell17"></div>
                <div class="cell" id="cell18"></div>
                <div class="cell" id="cell19"></div>
                <div class="cell" id="cell27"></div>
                <div class="cell" id="cell29"></div>
                <div class="cell" id="cell37"></div>
                <div class="cell" id="cell39"></div>
                <div class="cell" id="cell47"></div>
                <div class="cell" id="cell49"></div>
                <div class="cell" id="cell57"></div>
                <div class="cell" id="cell59"></div>
                <div class="cell" id="cell67"></div>
                <div class="cell" id="cell69"></div>
                <div class="cell" id="cell71"></div>
                <div class="cell" id="cell72"></div>
                <div class="cell" id="cell73"></div>
                <div class="cell" id="cell74"></div>
                <div class="cell" id="cell75"></div>
                <div class="cell" id="cell76"></div>
                <div class="cell" id="cell710"></div>
                <div class="cell" id="cell711"></div>
                <div class="cell" id="cell712"></div>
                <div class="cell" id="cell713"></div>
                <div class="cell" id="cell714"></div>
                <div class="cell" id="cell715"></div>
                <div class="cell" id="cell81"></div>
                <div class="cell" id="cell815"></div>
                <div class="cell" id="cell91"></div>
                <div class="cell" id="cell92"></div>
                <div class="cell" id="cell93"></div>
                <div class="cell" id="cell94"></div>
                <div class="cell" id="cell95"></div>
                <div class="cell" id="cell96"></div>
                <div class="cell" id="cell910"></div>
                <div class="cell" id="cell911"></div>
                <div class="cell" id="cell912"></div>
                <div class="cell" id="cell913"></div>
                <div class="cell" id="cell914"></div>
                <div class="cell" id="cell915"></div>
                <div class="cell" id="cell107"></div>
                <div class="cell" id="cell109"></div>
                <div class="cell" id="cell117"></div>
                <div class="cell" id="cell119"></div>
                <div class="cell" id="cell127"></div>
                <div class="cell" id="cell129"></div>
                <div class="cell" id="cell137"></div>
                <div class="cell" id="cell139"></div>
                <div class="cell" id="cell147"></div>
                <div class="cell" id="cell149"></div>
                <div class="cell" id="cell157"></div>
                <div class="cell" id="cell158"></div>
                <div class="cell" id="cell159"></div>
                <div class="player1home"></div>
                <div class="player2home"></div>
                <div class="player3home"></div>
                <div class="player4home"></div>
                <div class="cell11" id="coin11">1</div>
                <div class="cell12" id="coin12">2</div>
                <div class="cell13" id="coin13">3</div>
                <div class="cell14" id="coin14">4</div>
                <div class="cell21" id="coin21">1</div>
                <div class="cell22" id="coin22">2</div>
                <div class="cell23" id="coin23">3</div>
                <div class="cell24" id="coin24">4</div>
                <div class="cell31" id="coin31">1</div>
                <div class="cell32" id="coin32">2</div>
                <div class="cell33" id="coin33">3</div>
                <div class="cell34" id="coin34">4</div>
                <div class="cell41" id="coin41">1</div>
                <div class="cell42" id="coin42">2</div>
                <div class="cell43" id="coin43">3</div>
                <div class="cell44" id="coin44">4</div>
                <div class="destination"></div>
                <div class="way12" id="cell82"></div>
                <div class="way13" id="cell83"></div>
                <div class="way14" id="cell84"></div>
                <div class="way15" id="cell85"></div>
                <div class="way16" id="cell86"></div>
                <div class="way22" id="cell28"></div>
                <div class="way23" id="cell38"></div>
                <div class="way24" id="cell48"></div>
                <div class="way25" id="cell58"></div>
                <div class="way26" id="cell68"></div>
                <div class="way32" id="cell814"></div>
                <div class="way33" id="cell813"></div>
                <div class="way34" id="cell812"></div>
                <div class="way35" id="cell811"></div>
                <div class="way36" id="cell810"></div>
                <div class="way42" id="cell148"></div>
                <div class="way43" id="cell138"></div>
                <div class="way44" id="cell128"></div>
                <div class="way45" id="cell118"></div>
                <div class="way46" id="cell108"></div>

          </section>

          <img src="ludo.png" class="choice" id="choice"></img>

          <button class="rollbutton" id="rollbutton">
            Roll
          </button>

          <button class="start" id="start" onClick={start}>
            Start
          </button>
          <button className="quit" onClick={func}>
            Quit
          </button>
        </main>
      </div>
    )
  }
  return (
    <div>
      <div className="nav">
        <h3>{currentAccount}</h3>
        <h3>{userCoins}</h3>
        <button className="buyTokens" onClick={buyToken}>
            Buy Tokens
          </button>
          
      </div>
      <div className="boards">
        <div className="style-board">
          <form className="form-board">
            <button className="buttonApp" onClick={connectWallet}>Connect Wallet</button>


            <label htmlFor="players" className="players">Select
              players</label>
            <select name="players" id="players" value={gameStartData.players} onChange={handleChange}>
              <option value="2">2</option>
              <option value="4">4</option>
            </select>

            <label htmlFor="stake" className="players">Stake coins</label>
            <select name="coins" id="stake" value={gameStartData.coins} onChange={handleChange}>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="500">500</option>
              <option value="1000">1000</option>
              <option value="5000">5000</option>
              <option value="10000">10000</option>
            </select>
            <h3>Enter room code</h3>
            <input placeholder="Room Number..." onChange={(event) => {
              setRoom(event.target.value);
            }}
            />
            <button className="buttonApp" onClick={startGame}>Start game</button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default App;
