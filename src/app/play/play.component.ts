import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
  constructor(private _http: HttpService) { }
  // array of objects to track which player has clicked which box
  boardSections: { border: String, selection: String }[] = [
    {
      border: "box left-bottom-border",
      selection: ""
    },
    {
      border: "box left-bottom-border",
      selection: ""
    },
    {
      border: "box",
      selection: ""
    },
    {
      border: "box left-bottom-border",
      selection: ""
    },
    {
      border: "box left-bottom-border",
      selection: ""
    },
    {
      border: "box top-bottom-border",
      selection: ""
    },
    {
      border: "box",
      selection: ""
    },
    {
      border: "box left-right-border",
      selection: ""
    },
    {
      border: "box",
      selection: ""
    }
  ]
  colorOptions: { color: String }[] = [
    {
      color: "red"
    },
    {
      color: "orange"
    },
    {
      color: "yellow"
    },
    {
      color: "green"
    },
    {
      color: "blue"
    },
    {
      color: "purple"
    },
    {
      color: "pink"
    }
  ]
  // boolean to track whose turn it is and if the game has started
  isX: boolean = true;
  isGameStart: boolean = true;
  // strings for the character
  xColor: string = "";
  oColor: string = "";
  // string for declaring a winner
  winner: string = "";
  winnerName: string = "";
  // inputs for users to add their names
  playerXName: string = "";
  playerOName: string = "";
  playerXIsSaved: boolean = false;
  playerOIsSaved: boolean = false;

  // array of previous games
  previousGames: (string | Object)[][] = [];
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
      for (let i = 0; i < savedGame.length; i++) {
        if (savedGame[i].selection.indexOf("x") >= 0) {
          xTally++;
        } else if (savedGame[i].selection.indexOf("o") >= 0) {
          oTally++;
        }
      }
      // if there are less o's than x's, then it is player o's turn
      if (oTally < xTally) {
        this.isX = false;
      }
    }
    // check for saved names
    const playerNames = JSON.parse(localStorage.getItem("playerNames"));
    if (playerNames && playerNames["x"]) {
      this.playerXName = playerNames["x"];
    } else if (playerNames && playerNames["o"]) {
      this.playerOName = playerNames["o"];
    }
    // check for previous games
    this.checkPreviousGames();
    // this._http.getJokes().subscribe(data => {
    //   this.jokes = data["value"];
    //   console.log(this.jokes);
    // });
  }
  checkPreviousGames() {
    const savedPreviousGames = JSON.parse(localStorage.getItem("previousGames"));
    this.previousGames = savedPreviousGames;
  }
  // jokes: Object;
  savePlayerName(name) {
    // if it is player x, set their name to be saved
    if (name === "x") this.playerXIsSaved = true;
    // if it is player o, set their name to be saved
    if (name === "o") this.playerOIsSaved = true;
    // save names to localStorage
    localStorage.setItem("playerNames", JSON.stringify({ x: this.playerXName, o: this.playerOName }));
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
    // check previous games
    this.checkPreviousGames();
    // if a color for either player hasnt been selected, set the color to be grey
    if (!this.xColor) this.xColor = "grey";
    if (!this.oColor) this.oColor = "grey";
  }
  registerMove(index) {
    // if a winner has been selected, a previous game has been won
    if (this.winner) {
      // clear the winner and reset the board
      this.winner = "";
      this.resetBoard();
      this.isGameStart = true;
    }
    // check if selected box has already been clicked
    if (this.boardSections[index].selection) {
      return;
    }
    // update board
    if (this.isX) {
      this.boardSections[index].selection = `x ${this.xColor}`;
    } else {
      this.boardSections[index].selection = `o ${this.oColor}`;
    }
    // check the winner
    // if someone has won, display winning message
    if (this.checkWinner()) {
      this.winner = `${this.isX ? "Player X Wins!" : "Player O Wins!"}`;
      this.winnerName = `${this.isX ? 'x' : 'o'}`;
      // switch to the next player
      this.isX = !this.isX;
      // save current game to list of previous games
      this.saveCompleteGame(this.winnerName);
    } else {
      // saved to local storage
      localStorage.setItem("currentGame", JSON.stringify(this.boardSections))
      // switch to next player
      this.isX = !this.isX;
    }
  }
  // win can be horizontal, vertical or diagonal
  checkWinner(): boolean {
    // check winning combinations for every row connected to box 1
    if (this.boardSections[0]["selection"] === this.boardSections[1]["selection"] && this.boardSections[0]["selection"] === this.boardSections[2]["selection"] && this.boardSections[0]["selection"]) {
      return true;
    } else if (this.boardSections[0]["selection"] === this.boardSections[4]["selection"] && this.boardSections[0]["selection"] === this.boardSections[8]["selection"] && this.boardSections[0]["selection"]) {
      return true;
    } else if (this.boardSections[0]["selection"] === this.boardSections[3]["selection"] && this.boardSections[0]["selection"] === this.boardSections[6]["selection"] && this.boardSections[0]["selection"]) {
      return true;
    }
    // check winning combinations for every row connected to box 5
    else if (this.boardSections[4]["selection"] === this.boardSections[2]["selection"] && this.boardSections[4]["selection"] === this.boardSections[6]["selection"] && this.boardSections[4]["selection"]) {
      return true;
    } else if (this.boardSections[4]["selection"] === this.boardSections[1]["selection"] && this.boardSections[4]["selection"] === this.boardSections[7]["selection"] && this.boardSections[4]["selection"]) {
      return true;
    } else if (this.boardSections[4]["selection"] === this.boardSections[3]["selection"] && this.boardSections[4]["selection"] === this.boardSections[5]["selection"] && this.boardSections[4]["selection"]) {
      return true;
    }
    // check winning combinations for every row connected to box 9
    else if (this.boardSections[8]["selection"] === this.boardSections[5]["selection"] && this.boardSections[8]["selection"] === this.boardSections[2]["selection"] && this.boardSections[8]["selection"]) {
      return true;
    } else if (this.boardSections[8]["selection"] === this.boardSections[7]["selection"] && this.boardSections[8]["selection"] === this.boardSections[6]["selection"] && this.boardSections[8]["selection"]) {
      return true;
    } else {
      // iterate over entire board sections to check if all boxes have been selected
      for (let i = 0; i < this.boardSections.length; i++) {
        if (!this.boardSections[i].selection) {
          return false;
        }
      }
      // show message letting user know the game was a tie
      this.winner = "Tie!";
      // save the game to the previous games
      this.saveCompleteGame('tie');
      // wait three seconds before clearing the winner message, resetting the board and updating local storage
      setTimeout(() => {
        this.isGameStart = true;
        this.winner = "";
        this.resetBoard();
      }, 3000);
    }
  }
  resetBoard(): void {
    // clear localstorage of current game
    localStorage.removeItem("currentGame");
    // set all of the boxes back to an empty string
    this.boardSections = [
      {
        border: "box left-bottom-border",
        selection: ""
      },
      {
        border: "box left-bottom-border",
        selection: ""
      },
      {
        border: "box",
        selection: ""
      },
      {
        border: "box left-bottom-border",
        selection: ""
      },
      {
        border: "box left-bottom-border",
        selection: ""
      },
      {
        border: "box top-bottom-border",
        selection: ""
      },
      {
        border: "box",
        selection: ""
      },
      {
        border: "box left-right-border",
        selection: ""
      },
      {
        border: "box",
        selection: ""
      }
    ]
  }
  saveCompleteGame(winPlayer): void {
    // create new array with board and who won
    let saveGame: {
      winPlayer: String,
      xColor: String,
      oColor: String,
      board: { border: String, selection: String }[]
    } = {
      winPlayer: winPlayer,
      xColor: this.xColor,
      oColor: this.oColor,
      board: this.boardSections
    }
    // grab all saved games
    const savedGames = JSON.parse(localStorage.getItem("previousGames"));
    // if there are any previous games saved to local storage
    if (savedGames) {
      // add current game to the beginning of the array
      savedGames.unshift(saveGame);
      // save to local storage
      localStorage.setItem("previousGames", JSON.stringify(savedGames));
    } else {
      // if there aren't any games currently in local storage, save the current game
      localStorage.setItem("previousGames", JSON.stringify([saveGame]));
    }
    // remove current game from local storage
    localStorage.removeItem("currentGame");
    // wait three seconds before resetting the board
    setTimeout(() => {
      this.isGameStart = true;
      this.winner = "";
      this.resetBoard();
    }, 3000);
  }


}
