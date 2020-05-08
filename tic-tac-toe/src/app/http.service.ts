import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  getJokes() {
    const jokeCategories = ["animal", "career", "celebrity", "dev", "explicit", "fashion", "food", "history", "money", "movie", "music", "political", "religion", "science", "sport", "travel"];
    const randomJokeCategory = Math.floor(Math.random() * jokeCategories.length);
    const queryURL = `https://api.chucknorris.io/jokes/random?category=${jokeCategories[randomJokeCategory]}`
    return this.http.get(queryURL);
  }
}
