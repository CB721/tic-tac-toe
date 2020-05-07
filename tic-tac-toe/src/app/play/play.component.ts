import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
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
  // boolean to track whose turn it is
  isX: boolean = true;
  // strings for the character
  xColor: string = "blue";
  oColor: string = "green";
  // string for declaring a winner
  winner: string = "";
  constructor() {
    console.log(this.boardSections.box1);
  }

  ngOnInit(): void {
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
      // if there isn't a winner, switch to the next player
    } else {
      // switch to next player
      this.isX = !this.isX;
    }
  }
  resetBoard():void {
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
  // win can be horizontal, vertical or diagonal
  checkWinner():boolean {
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
      return false;
    }
  }
}
