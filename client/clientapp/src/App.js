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
  let dice = ['./one.png', './two.png', './three.png', './four.png', './five.png', './six.png']

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

  function sendHome(coin, id) {
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

  function checkBox(box) {
    var id = "cell" + box;
    var box = document.getElementById(id);
    if ((box.style.backgroundColor == "") || (box.style.backgroundColor == "white")) return 0;
    else if (box.style.backgroundColor == "red") return 1;
    else if (box.style.backgroundColor == "green") return 2;
    else if (box.style.backgroundColor == "yellow") return 3;
    else if (box.style.backgroundColor == "blue") return 4;
  }

  function move(pos, num) {
    let locations = [];
    while (num > 0) {
      if (pos[0] == 7) {
        while ((pos[1] <= 6) && (num > 0)) {
          pos[1]++; num--;
          locations.push(pos[0].toString() + pos[1].toString())
        }
        if (pos[1] == 7) {
          pos[0]--;
          locations.pop(); locations.push("67");
        }
        while ((10 <= pos[1]) && (pos[1] <= 14) && (num > 0)) {
          pos[1]++; num--;
          locations.push(pos[0].toString() + pos[1].toString())
        }
      }

      if (pos[1] == 7) {
        while ((1 < pos[0]) && (pos[0] <= 6) && (num > 0)) {
          pos[0]--; num--;
          locations.push(pos[0].toString() + pos[1].toString())
        }
        while ((10 <= pos[0]) && (pos[0] <= 15) && (num > 0)) {
          pos[0]--; num--;
          locations.push(pos[0].toString() + pos[1].toString())
        }
        if (pos[0] == 9) {
          pos[1]--;
          locations.pop(); locations.push("96");
        }
      }

      if (pos[0] == 1) {
        while ((7 <= pos[1]) && (pos[1] < 9) && (num > 0)) {
          pos[1]++; num--;
          locations.push(pos[0].toString() + pos[1].toString())
        }
      }

      if (pos[1] == 9) {
        while ((pos[0] <= 6) && (num > 0)) {
          pos[0]++; num--;
          locations.push(pos[0].toString() + pos[1].toString())
        }
        if (pos[0] == 7) {
          pos[1]++;
          locations.pop(); locations.push("710");
        }
        while ((10 <= pos[0]) && (pos[0] < 15) && (num > 0)) {
          pos[0]++; num--;
          locations.push(pos[0].toString() + pos[1].toString())
        }
      }

      if (pos[1] == 15) {
        while ((7 <= pos[0]) && (pos[0] < 9) && (num > 0)) {
          pos[0]++; num--;
          locations.push(pos[0].toString() + pos[1].toString())
        }
      }

      if (pos[0] == 9) {
        while ((1 < pos[1]) && (pos[1] <= 6) && (num > 0)) {
          pos[1]--; num--;
          locations.push(pos[0].toString() + pos[1].toString())
        }
        while ((10 <= pos[1]) && (pos[1] <= 15) && (num > 0)) {
          pos[1]--; num--;
          locations.push(pos[0].toString() + pos[1].toString())
        }
        if (pos[1] == 9) {
          pos[0]++;
          locations.pop(); locations.push("109");
        }
      }

      if (pos[0] == 15) {
        while ((7 < pos[1]) && (pos[1] <= 9) && (num > 0)) {
          pos[1]--; num--;
          locations.push(pos[0].toString() + pos[1].toString())
        }
      }

      if (pos[1] == 1) {
        while ((7 < pos[0]) && (pos[0] <= 9) && (num > 0)) {
          pos[0]--; num--;
          locations.push(pos[0].toString() + pos[1].toString())
        }
      }
    }
    return locations;
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
    let mayBeSafe = false;
    let locations;
    if (!pos[2]) {
      let row = pos[0];
      let col = pos[1];
      let roll = num;
      if (((pos[0] == 9) && (pos[1] <= 4)) || (pos[1] == 1)) mayBeSafe = true;
      locations = move(pos, num);
      if (mayBeSafe) {
        if ((pos[0] <= 7) && (pos[1] >= 2)) {
          if (pos[0] == 6) locations.pop();
          while (pos[1] > 2) {
            locations.pop(); pos[1]--;
          }
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
    return locations;
  }

  function move2(pos, num) {
    let mayBeSafe = false;
    let locations = [];
    if (!pos[2]) {
      let row = pos[0];
      let col = pos[1];
      let roll = num;
      if (((pos[1] == 7) && (pos[0] <= 4)) || (pos[0] == 1)) mayBeSafe = true;
      locations = move(pos, num);
      if (mayBeSafe) {
        if ((pos[1] >= 9) && (pos[0] >= 2)) {
          if (pos[1] == 9) locations.pop();
          while (pos[0] > 2) {
            pos[0]--; locations.pop();
          }
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
    return locations;
  }

  function move3(pos, num) {
    let mayBeSafe = false;
    let locations = [];
    if (!pos[2]) {
      let row = pos[0];
      let col = pos[1];
      let roll = num;
      if (((pos[0] == 7) && (pos[1] >= 12)) || (pos[1] == 15)) mayBeSafe = true;
      locations = move(pos, num);
      if (mayBeSafe) {
        if ((pos[0] >= 9) && (pos[1] <= 14)) {
          if (pos[0] == 10) locations.pop();
          while (pos[1] < 14) {
            locations.pop(); pos[1]++;
          }
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
    return locations;
  }

  function move4(pos, num) {
    let mayBeSafe = false;
    let locations = [];
    if (!pos[2]) {
      let row = pos[0];
      let col = pos[1];
      let roll = num;
      if (((pos[1] == 9) && (pos[0] >= 12)) || (pos[0] == 15)) mayBeSafe = true;
      locations = move(pos, num);
      if (mayBeSafe) {
        if ((pos[1] <= 7) && (pos[0] >= 14)) {
          if (pos[1] == 6) locations.pop();
          while (pos[0] < 14) {
            pos[0]++; locations.pop();
          }
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
    return locations;
  }

  function play1(num, coin, pos) {
    let row = pos[0];
    let col = pos[1];
    let fromHome = false;

    let number = 0;
    if (coin == "coin11") number = 1;
    else if (coin == "coin12") number = 2;
    else if (coin == "coin13") number = 3;
    else if (coin == "coin14") number = 4;

    let locations = [];

    if ((pos[0] == 0) && (pos[1] == 0)) {
      if (num == 6) num = 1;
      else return;
      pos[0] = 7;
      pos[1] = 2;
      locations.push(pos[0].toString() + pos[1].toString());
      fromHome = true;
      document.getElementById(coin).style.backgroundColor = "white";
      num--;
    }

    else locations = move1(pos, num);

    if (!((pos[0] == 8) && (pos[1] >= 2) && (pos[1] <= 7))) {
      let n = locations.length;
      for (let i = 0; i < n; i++) {
        let st = checkBox(locations[i]);
        var cell = document.getElementById("cell" + locations[i].toString());
        if (st == 1) {
          if (i == n - 1) {
            pos[0] = row; pos[1] = col;
            if (fromHome) document.getElementById(coin).style.backgroundColor = "red";
            return;
          }
        }
        else if (st == 2) {
          if (locations[i] != "29") {
            cell.style.backgroundColor = "white";
            var coinId = "coin2" + cell.innerHTML.toString();
            document.getElementById(coinId).style.backgroundColor = "green";
            sendHome(st, cell.innerHTML.toString());
            cell.innerHTML = "";
          }
          else {
            if (i == n - 1) {
              pos[0] = row; pos[1] = col;
              return;
            }
          }
        }
        else if (st == 3) {
          cell.style.backgroundColor = "white";
          var coinId = "coin3" + cell.innerHTML.toString();
          document.getElementById(coinId).style.backgroundColor = "yellow";
          sendHome(st, cell.innerHTML.toString());
          cell.innerHTML = "";
        }
        else if (st == 4) {
          cell.style.backgroundColor = "white";
          var coinId = "coin4" + cell.innerHTML.toString();
          document.getElementById(coinId).style.backgroundColor = "blue";
          sendHome(st, cell.innerHTML.toString());
          cell.innerHTML = "";
        }
      }

      var newId = getID(pos[0], pos[1]);
      var oldId = getID(row, col);
      var newCell = document.getElementById(newId);
      var oldCell = document.getElementById(oldId);

      newCell.style.backgroundColor = "red";
      newCell.innerHTML = number;

      if (!fromHome) {
        oldCell.style.backgroundColor = "white";
        oldCell.innerHTML = "";
      }
    }
    else {
      if (pos[1] == 7) {
        if (row == 7) {
          document.getElementById(getID(row, col)).style.backgroundColor = "white";
          document.getElementById(getID(row, col)).innerHTML = "";
        }
        else {
          let id = "way1" + col.toString();
          document.getElementById(id).innerHTML = "";
        }
        document.getElementById(coin).style.backgroundColor = "lightgreen";
        pos[0] = 0; pos[1] = 0; pos[3] = 1;
      }
      else {
        if (!((row == 8) && (col >= 2))) {
          document.getElementById(getID(row, col)).style.backgroundColor = "white";
          document.getElementById(getID(row, col)).innerHTML = "";

        }
        else {
          let id = "way1" + col.toString();
          document.getElementById(id).innerHTML = "";
        }
        let newId = "way1" + pos[1].toString();
        document.getElementById(newId).innerHTML = number;
      }
    }

    players[1] = 0;
  }

  function play2(num, coin, pos) {
    let row = pos[0];
    let col = pos[1];
    let fromHome = false;

    let number = 0;
    if (coin == "coin21") number = 1;
    else if (coin == "coin22") number = 2;
    else if (coin == "coin23") number = 3;
    else if (coin == "coin24") number = 4;

    let locations = [];

    if ((pos[0] == 0) && (pos[1] == 0)) {
      if (num == 6) num = 1;
      else return;
      pos[0] = 2;
      pos[1] = 9;
      locations.push("29");
      fromHome = true;
      document.getElementById(coin).style.backgroundColor = "white";
      num--;
    }

    else locations = move2(pos, num);

    if (!((pos[1] == 8) && (pos[0] >= 2) && (pos[0] <= 7))) {
      let n = locations.length;
      for (let i = 0; i < n; i++) {
        let st = checkBox(locations[i]);
        var cell = document.getElementById("cell" + locations[i].toString());
        if (st == 2) {
          if (i == n - 1) {
            pos[0] = row; pos[1] = col;
            if (fromHome) document.getElementById(coin).style.backgroundColor = "green";
            return;
          }
        }
        else if (st == 1) {
          cell.style.backgroundColor = "white";
          var coinId = "coin1" + cell.innerHTML.toString();
          document.getElementById(coinId).style.backgroundColor = "red";
          sendHome(st, cell.innerHTML.toString());
          cell.innerHTML = "";

        }
        else if (st == 3) {
          cell.style.backgroundColor = "white";
          var coinId = "coin3" + cell.innerHTML.toString();
          document.getElementById(coinId).style.backgroundColor = "yellow";
          sendHome(st, cell.innerHTML.toString());
          cell.innerHTML = "";

        }
        else if (st == 4) {
          cell.style.backgroundColor = "white";
          var coinId = "coin4" + cell.innerHTML.toString();
          document.getElementById(coinId).style.backgroundColor = "blue";
          sendHome(st, cell.innerHTML.toString());
          cell.innerHTML = "";

        }
      }
      console.log(pos[0].toString() + pos[1].toString())
      var newId = getID(pos[0], pos[1]);
      var oldId = getID(row, col);
      var newCell = document.getElementById(newId);
      var oldCell = document.getElementById(oldId);

      newCell.style.backgroundColor = "green";
      newCell.innerHTML = number;

      if (!fromHome) {
        oldCell.style.backgroundColor = "white";
        oldCell.innerHTML = "";
      }
    }
    else {
      if (pos[0] == 7) {
        if (col == 9) {
          document.getElementById(getID(row, col)).style.backgroundColor = "white";
          document.getElementById(getID(row, col)).innerHTML = "";
        }
        else {
          let id = "way2" + row.toString();
          document.getElementById(id).innerHTML = "";
        }
        document.getElementById(coin).style.backgroundColor = "lightgreen";
        pos[0] = 0; pos[1] = 0; pos[3] = 1;
      }
      else {
        if (!((col == 8) && (row >= 2))) {
          document.getElementById(getID(row, col)).style.backgroundColor = "white";
          document.getElementById(getID(row, col)).innerHTML = "";

        }
        else {
          let id = "way2" + row.toString();
          document.getElementById(id).innerHTML = "";
        }
        let newId = "way2" + pos[0].toString();
        document.getElementById(newId).innerHTML = number;
      }
    }

    players[2] = 0;
  }

  function play3(num, coin, pos) {
    let row = pos[0];
    let col = pos[1];
    let fromHome = false;

    let number = 0;
    if (coin == "coin31") number = 1;
    else if (coin == "coin32") number = 2;
    else if (coin == "coin33") number = 3;
    else if (coin == "coin34") number = 4;

    let locations = [];

    if ((pos[0] == 0) && (pos[1] == 0)) {
      if (num == 6) num = 1;
      else return;
      pos[0] = 9;
      pos[1] = 14;
      locations.push("914");
      fromHome = true;
      document.getElementById(coin).style.backgroundColor = "white";
      num--;
    }

    else locations = move3(pos, num);

    if (!((pos[0] == 8) && (pos[1] <= 14) && (pos[1] >= 9))) {
      var newId = getID(pos[0], pos[1]);
      var oldId = getID(row, col);
      var newCell = document.getElementById(newId);
      var oldCell = document.getElementById(oldId);

      let n = locations.length;
      for (let i = 0; i < n; i++) {
        let st = checkBox(locations[i]);
        var cell = document.getElementById("cell" + locations[i].toString());
        if (st == 3) {
          if (i == n - 1) {
            pos[0] = row; pos[1] = col;
            if (fromHome) document.getElementById(coin).style.backgroundColor = "yellow";
            return;
          }
        }
        else if (st == 2) {
          cell.style.backgroundColor = "white";
          var coinId = "coin2" + cell.innerHTML.toString();
          document.getElementById(coinId).style.backgroundColor = "green";
          sendHome(st, cell.innerHTML.toString());
          cell.innerHTML = "";

        }
        else if (st == 1) {
          cell.style.backgroundColor = "white";
          var coinId = "coin1" + cell.innerHTML.toString();
          document.getElementById(coinId).style.backgroundColor = "red";
          sendHome(st, cell.innerHTML.toString());
          cell.innerHTML = "";

        }
        else if (st == 4) {
          cell.style.backgroundColor = "white";
          var coinId = "coin4" + cell.innerHTML.toString();
          document.getElementById(coinId).style.backgroundColor = "blue";
          sendHome(st, cell.innerHTML.toString());
          cell.innerHTML = "";
        }
      }

      newCell.style.backgroundColor = "yellow";
      newCell.innerHTML = number;

      if (!fromHome) {
        oldCell.style.backgroundColor = "white";
        oldCell.innerHTML = "";
      }
    }
    else {
      if (pos[1] == 9) {
        if (row == 9) {
          document.getElementById(getID(row, col)).style.backgroundColor = "white";
          document.getElementById(getID(row, col)).innerHTML = "";
        }
        else {
          let id = "way3" + (16 - col).toString();
          document.getElementById(id).innerHTML = "";
        }
        document.getElementById(coin).style.backgroundColor = "lightgreen";
        pos[0] = 0; pos[1] = 0; pos[3] = 1;
      }
      else {
        if (!((row == 8) && (col <= 14))) {
          document.getElementById(getID(row, col)).style.backgroundColor = "white";
          document.getElementById(getID(row, col)).innerHTML = "";

        }
        else {
          let id = "way3" + (16 - col).toString();
          document.getElementById(id).innerHTML = "";
        }
        let newId = "way3" + (16 - pos[1]).toString();
        document.getElementById(newId).innerHTML = number;
      }
    }

    players[3] = 0;
  }

  function play4(num, coin, pos) {
    let row = pos[0];
    let col = pos[1];
    let fromHome = false;

    let number = 0;
    if (coin == "coin41") number = 1;
    else if (coin == "coin42") number = 2;
    else if (coin == "coin43") number = 3;
    else if (coin == "coin44") number = 4;

    let locations = []

    if ((pos[0] == 0) && (pos[1] == 0)) {
      if (num == 6) num = 1;
      else return;
      pos[0] = 14;
      pos[1] = 7;
      locations.push("147");
      fromHome = true;
      document.getElementById(coin).style.backgroundColor = "white";
      num--;
    }

    else locations = move4(pos, num);

    if (!((pos[1] == 8) && (pos[0] <= 14) && (pos[0] >= 9))) {
      var newId = getID(pos[0], pos[1]);
      var oldId = getID(row, col);
      var newCell = document.getElementById(newId);
      var oldCell = document.getElementById(oldId);

      let n = locations.length;
      for (let i = 0; i < n; i++) {
        let st = checkBox(locations[i]);
        var cell = document.getElementById("cell" + locations[i].toString());
        if (st == 1) {
          if (i == n - 1) {
            pos[0] = row; pos[1] = col;
            if (fromHome) document.getElementById(coin).style.backgroundColor = "blue";
            return;
          }
        }
        else if (st == 2) {
          cell.style.backgroundColor = "white";
          var coinId = "coin2" + cell.innerHTML.toString();
          document.getElementById(coinId).style.backgroundColor = "green";
          sendHome(st, cell.innerHTML.toString());
          cell.innerHTML = "";

        }
        else if (st == 3) {
          cell.style.backgroundColor = "white";
          var coinId = "coin3" + cell.innerHTML.toString();
          document.getElementById(coinId).style.backgroundColor = "yellow";
          sendHome(st, cell.innerHTML.toString());
          cell.innerHTML = "";

        }
        else if (st == 1) {
          cell.style.backgroundColor = "white";
          var coinId = "coin1" + cell.innerHTML.toString();
          document.getElementById(coinId).style.backgroundColor = "red";
          sendHome(st, cell.innerHTML.toString());
          cell.innerHTML = "";
        }
      }

      newCell.style.backgroundColor = "blue";
      newCell.innerHTML = number;

      if (!fromHome) {
        oldCell.style.backgroundColor = "white";
        oldCell.innerHTML = "";
      }
    }
    else {
      if (pos[0] == 9) {
        if (col == 7) {
          document.getElementById(getID(row, col)).style.backgroundColor = "white";
          document.getElementById(getID(row, col)).innerHTML = "";
        }
        else {
          let id = "way4" + (16 - row).toString();
          document.getElementById(id).innerHTML = "";
        }
        document.getElementById(coin).style.backgroundColor = "lightgreen";
        pos[0] = 0; pos[1] = 0; pos[3] = 1;
      }
      else {
        if (!((col == 8) && (row <= 14))) {
          document.getElementById(getID(row, col)).style.backgroundColor = "white";
          document.getElementById(getID(row, col)).innerHTML = "";

        }
        else {
          let id = "way4" + (16 - row).toString();
          document.getElementById(id).innerHTML = "";
        }
        let newId = "way4" + (16 - pos[0]).toString();
        document.getElementById(newId).innerHTML = number;
      }
    }

    players[4] = 0;
  }


  function play(num) {
    document.getElementById("coin11").onclick = function () { if (players[1] && !player11pos[3]) { play1(num, "coin11", player11pos); sendInfo(player11pos, player12pos, player13pos, player14pos, player21pos, player22pos, player23pos, player24pos, player31pos, player32pos, player33pos, player34pos, player41pos, player42pos, player43pos, player44pos, room)} };
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
    num = num + 1;

    play(num);
  }

  function start() {
    player = 4;
    players[player] = 1;
    document.getElementById('rollbutton').onclick = function () { rolldice() };
  }

  const [currentAccount, setCurrentAccount] = useState("");
  const [userCoins, setUserCoins] = useState(0);
  const [board, setBoard] = useState(false);
  const [room, setRoom] = useState("");
  const [roomJoined, setroomJoined] = useState(false);
  const [gameStartData, setGameStartData] = useState(
    {
      players: 2,
      coins: 50
    });
  const contractAddress = "0xD99EfEa12e6453AB13B6FA861250020cAA2c21E9";
  const contractABI = abi.abi;

  const joinRoom = () => {

    if (room !== "") {
      socket.emit("join_room", room);
      setroomJoined(true);
      setBoard(false);
    }
  };

  const sendInfo = (player11pos, player12pos, player13pos, player14pos, player21pos, player22pos, player23pos, player24pos, player31pos, player32pos, player33pos, player34pos, player41pos, player42pos, player43pos, player44pos, room) => {
    console.log(room)
    socket.emit("updateBoard", player11pos, player12pos, player13pos, player14pos, player21pos, player22pos, player23pos, player24pos, player31pos, player32pos, player33pos, player34pos, player41pos, player42pos, player43pos, player44pos, room);
  }

  useEffect(() => {

    socket.on("receiveBoard", (p11pos, p12pos, p13pos, p14pos, p21pos, p22pos, p23pos, p24pos, p31pos, p32pos, p33pos, p34pos, p41pos, p42pos, p43pos, p44pos, ) => {
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

      var c = document.getElementById("coin11");
      c.style.gridRowStart = player11pos[0];
      c.style.gridRowEnd = player11pos[0] + 1;
      c.style.gridColumnStart = player11pos[1];
      c.style.gridColumnEnd = player11pos[1] + 1;

      var c = document.getElementById("coin12");
      c.style.gridRowStart = player12pos[0];
      c.style.gridRowEnd = player12pos[0] + 1;
      c.style.gridColumnStart = player12pos[1];
      c.style.gridColumnEnd = player12pos[1] + 1;

      var c = document.getElementById("coin13");
      c.style.gridRowStart = player13pos[0];
      c.style.gridRowEnd = player13pos[0] + 1;
      c.style.gridColumnStart = player13pos[1];
      c.style.gridColumnEnd = player13pos[1] + 1;

      var c = document.getElementById("coin14");
      c.style.gridRowStart = player14pos[0];
      c.style.gridRowEnd = player14pos[0] + 1;
      c.style.gridColumnStart = player14pos[1];
      c.style.gridColumnEnd = player14pos[1] + 1;

    });
  }, [socket])


  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

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
      await ludoContract.newAccount("0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2");
      let userCoins = await ludoContract.getCoins("0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2");
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
    setBoard(false);
  }


  const startGame = async (e) => {
    setBoard(true);
    // e.preventDefault();
    // console.log("start clicked");
    // try {
    //   const { ethereum } = window;
    //   if (ethereum) {
    //     const provider = new ethers.providers.Web3Provider(ethereum);
    //     const signer = provider.getSigner();
    //     const ludoContract = new
    //     ethers.Contract(contractAddress, contractABI, signer);

    //     let staked = await ludoContract.stakeCoins("0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2", gameStartData.coins);
    //       let userCoins = await ludoContract.getCoins("0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2");
    //   setUserCoins(userCoins.toNumber());
    //   console.log("coins:", userCoins.toNumber());
    //   searchPlayers();
    //   } else {
    //     console.log("Ethereum object doesn't exist!")
    //   }
    // } catch (error) {
    //   console.log("eeerrrrrror")
    //   alert("not enough coins")
    // }
  }

  const handleChange = (e) => {
    setGameStartData(prevData => {
      return {
        ...prevData,
        [e.target.name]: e.target.value
      }
    })
  }
  const updateCoins = () => {

  }
  if (board) {
    return (
      <div>
        <h3>Enter room code</h3>
        <input placeholder="Room Number..." onChange={(event) => {
          setRoom(event.target.value);
        }}
        />
        <button className="joinButton" onClick={joinRoom}>Join room</button>
        {console.log(roomJoined)}
      </div>

    )
  }
  if (roomJoined) {
    return (
      <div>
        <main className="background">
          <section className="title">
            <h1>Ludo</h1>
          </section>
          <section class="game">
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="player2home"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="destination"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="player3home"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="player4home"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell"></div>
            <div class="cell" id="deleter"></div>
            <div class="player1home"></div>
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
            <div class="player1way"></div>
            <div class="player2way"></div>
            <div class="player3way"></div>
            <div class="player4way"></div>

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
            <button className="buttonApp" onClick={startGame}>Start game</button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default App;