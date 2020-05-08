import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
  constructor() { }
  // object to track which player has clicked which box
  boardSections: {
    box1: string,
    box2: String,
    box3: String,
    box4: String,
    box5: String,
    box6: String,
    box7: String,
    box8: String,
    box9: String
  } = {
      box1: "",
      box2: "",
      box3: "",
      box4: "",
      box5: "",
      box6: "",
      box7: "",
      box8: "",
      box9: ""
    }
  // boolean to track whose turn it is and if the game has started
  isX: boolean = true;
  isGameStart: boolean = true;
  // strings for the character
  xColor: string = "";
  oColor: string = "";
  // string for declaring a winner
  winner: string = "";
  // inputs for users to add their names
  playerXName: string = "";
  playerOName: string = "";
  playerXIsSaved: boolean = false;
  playerOIsSaved: boolean = false;

  ngOnInit(): void {
    // check local storage for existing game
    const savedGame = JSON.parse(localStorage.getItem("currentGame"));
    // if there is a saved game
    if (savedGame) {
      // set board to saved game
      this.boardSections = savedGame;
      // iterate over saved game object
      // tally for how many x's there are
      let xTally: number = 0;
      let oTally: number = 0;
      for (const box in savedGame) {
        if (savedGame[box].indexOf("x") >= 0) {
          xTally++;
        } else if (savedGame[box].indexOf("o") >= 0) {
          oTally++;
        }
      }
      // if there are less o's than x's, then it is player o's turn
      if (oTally < xTally) {
        this.isX = false;
      }
    }
  }
  savePlayerName(name) {
    // if it is player x, set their name to be saved
    if (name === "x") this.playerXIsSaved = true;
    // if it is player o, set their name to be saved
    if (name === "o") this.playerOIsSaved = true;
  }
  selectColor(player, value) {
    if (player === "x" && value) this.xColor = value;
    if (player === "o" && value) this.oColor = value;
  }
  startGame() {
    // change game start to false
    this.isGameStart = false;
    // randomly select which user will go first
    // generate number between 0 and 1
    const randomNum = Math.floor(Math.random() * 2);
    // if it is one, set it to o's turn, otherwise, leave it as x's turn
    if (randomNum) {
      this.isX = false;
    }
  }
  registerMove(box) {
    // if a winner has been selected, a previous game has been won
    if (this.winner) {
      // clear the winner and reset the board
      this.winner = "";
      this.resetBoard();
    }
    // check if selected box has already been clicked
    if (this.boardSections[box]) {
      return;
    }
    // update board
    if (this.isX) {
      this.boardSections[box] = `x ${this.xColor}`;
    } else {
      this.boardSections[box] = `o ${this.oColor}`;
    }
    // check the winner
    // if someone has won, display winning message
    if (this.checkWinner()) {
      this.winner = `${this.isX ? "Player X Wins!" : "Player O Wins!"}`
      // switch to the next player
      this.isX = !this.isX;
      // save current game to list of previous games
      this.saveCompleteGame();
    } else {
      // saved to local storage
      localStorage.setItem("currentGame", JSON.stringify(this.boardSections))
      // switch to next player
      this.isX = !this.isX;
    }
  }
  // win can be horizontal, vertical or diagonal
  checkWinner(): boolean {
    // check winning combinations for every row connected to box1
    if (this.boardSections.box1 === this.boardSections.box2 && this.boardSections.box1 === this.boardSections.box3 && this.boardSections.box1) {
      return true;
    } else if (this.boardSections.box1 === this.boardSections.box5 && this.boardSections.box1 === this.boardSections.box9 && this.boardSections.box1) {
      return true;
    } else if (this.boardSections.box1 === this.boardSections.box4 && this.boardSections.box1 === this.boardSections.box7 && this.boardSections.box1) {
      return true;
    }
    // check winning combinations for every row connected to box5
    else if (this.boardSections.box5 === this.boardSections.box3 && this.boardSections.box5 === this.boardSections.box7 && this.boardSections.box5) {
      return true;
    } else if (this.boardSections.box5 === this.boardSections.box2 && this.boardSections.box5 === this.boardSections.box8 && this.boardSections.box5) {
      return true;
    } else if (this.boardSections.box5 === this.boardSections.box4 && this.boardSections.box5 === this.boardSections.box6 && this.boardSections.box5) {
      return true;
    }
    // check winning combinations for every row connected to box9
    else if (this.boardSections.box9 === this.boardSections.box6 && this.boardSections.box9 === this.boardSections.box3 && this.boardSections.box9) {
      return true;
    } else if (this.boardSections.box9 === this.boardSections.box8 && this.boardSections.box9 === this.boardSections.box7 && this.boardSections.box9) {
      return true;
    } else {
      // iterate over entire object to check if all boxes have been selected
      for (const box in this.boardSections) {
        if (!this.boardSections[box]) {
          return false;
        }
      }
      // show message letting user know the game was a tie
      this.winner = "Tie!";
      // save the game to the previous games
      this.saveCompleteGame();
      // wait three seconds before clearing the winner message, resetting the board and updating local storage
      setTimeout(() => {
        this.isGameStart = true;
        this.winner = "";
        this.resetBoard();
      }, 3000);
    }
  }
  resetBoard(): void {
    // set all of the boxes back to an empty string
    this.boardSections = {
      box1: "",
      box2: "",
      box3: "",
      box4: "",
      box5: "",
      box6: "",
      box7: "",
      box8: "",
      box9: ""
    }
  }
  saveCompleteGame(): void {
    // grab all saved games
    const savedGames = JSON.parse(localStorage.getItem("previousGames"));
    // if there are any previous games saved to local storage
    if (savedGames) {
      // add current game to the beginning of the array
      savedGames.unshift(this.boardSections);
      // save to local storage
      localStorage.setItem("previousGames", JSON.stringify(savedGames));
    } else {
      // if there aren't any games currently in local storage, save the current game
      localStorage.setItem("previousGames", JSON.stringify([this.boardSections]));
    }
    // wait three seconds before resetting the board
    setTimeout(() => {
      this.isGameStart = true;
      this.winner = "";
      this.resetBoard();
    }, 3000);
  }
}