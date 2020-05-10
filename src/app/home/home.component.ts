import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor() { }

  tiles: number = 0;
  ngOnInit(): void {
    // check screen size and update tiles accordingly
    this.updateTiles();
  }
  ngAfterViewInit() {
    // update tiles when the window is resized
    window.addEventListener('resize', this.updateTiles);
  }
  tileColors: string[] = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];
  displayTiles: string[] = [];
  updateTiles() {
    let screenWidth = window.screen.width;
    // tiles for full screen
    if (screenWidth >= 800) {
      this.tiles = 40;
      // tiles for tablets
    } else if (screenWidth < 800 && screenWidth > 500) {
      this.tiles = 14;
    } else {
      // tiles for mobile
      this.tiles = 15;
    }
    // iterate over tile colors and add to display tiles
    for (let i = 0; i < this.tiles; i++) {
      let color = this.tileColors[Math.floor(Math.random() * this.tileColors.length)];
      this.displayTiles.push(color);
    }
  }
}
