import { Component, OnInit} from '@angular/core';
import {StateService} from '../services/state.service';
import {map} from 'rxjs/operators';
import {ForecastService} from '../services/forecast.service';
import {BehaviorSubject, forkJoin} from 'rxjs';



@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements  OnInit {

  favorites: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([] );
  isMetric: boolean;
  favoritesLoaded = false;

  constructor(private stateServ: StateService, private forecastServ: ForecastService) { }

  removeFromFavorites(city): void {
    this.stateServ.actions.next({type: 'REMOVE_FAVORITE', payload: {city}});
    this.stateServ.state$.subscribe(nextVal => {
      this.favorites.next(nextVal.favorites);
    });
  }

  ngOnInit(): void {
    const state$ = this.stateServ.state$.pipe(map((data) => {
      return {favorites: data.favorites, isMetric: data.isMetric};
    }));

    state$.subscribe(favsData => {
      this.isMetric = favsData.isMetric;
      const observableArr = favsData.favorites.map(fav => this.forecastServ.getCurrentCondition(fav.chosenCity.key));
      forkJoin([...observableArr]).pipe(map(arr => {
        return arr.map((item, i) => {
          item[0].chosenCity = favsData.favorites[i].chosenCity;
          return item;
        });
      })).subscribe(arr => {
        this.favorites.next(arr);
      });
    });
    this.favoritesLoaded = true;
  }
}


