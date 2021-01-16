import { Component, OnInit} from '@angular/core';
import {ForecastService} from '../services/forecast.service';
import {forkJoin, Observable} from 'rxjs';
import { StateService } from '../services/state.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {
  cities: string[];
  searchVal: any;
  selectedCity: string;
  currentWeatherText: any;
  currentTemperature: string;
  fiveDayForecast: any[];
  cityLoaded = false;
  bgClass: string;

  constructor(private forecastServ: ForecastService, private stateServ: StateService) { }

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((pos) => {
      this.forecastServ.getGeoPosition(pos.coords.latitude, pos.coords.longitude).subscribe(data => {
        this.stateServ.actions.next({type: 'CHANGE_CITY', payload: {chosenCity: {LocalizedName: data.city, key: data.key}}});
        this.getConditionsAndForecast(data.key).subscribe(cityData => {
          this.stateServ.actions.next({type: 'UPDATE_WEATHER_DATA',
            payload: { fiveDayForecast: cityData[1], current: cityData[0][0] }
          });
          this.cityLoaded = true;
          if (cityData[0][0].WeatherText === 'Partly cloudy') {
             this.bgClass = 'partialCloudy';
          }
        });
      });
    });

    this.stateServ.state$.subscribe(value => {
      this.selectedCity = value.chosenCity.LocalizedName ? value.chosenCity.LocalizedName : value.chosenCity;
      this.currentWeatherText = value.current?.WeatherText;
      this.currentTemperature = value.isMetric ? value.current.temperature?.Metric?.Value : value.current.temperature?.Imperial?.Value;
      this.fiveDayForecast = value.fiveDayForecast;
    });
  }

  search(event: any): void {
    this.forecastServ.autoComplete(event.query).subscribe(cityData => {
      this.cities = cityData.map(data => {
        return {LocalizedName: data.LocalizedName, key: data.Key};
      });
    });
  }

  loadDataAboutCity(event): void {
    if (event && event !== '') {
      this.getConditionsAndForecast(event.key).subscribe(data => {
        this.stateServ.actions.next({type: 'CHANGE_CITY',
          payload: {chosenCity: {LocalizedName: event.LocalizedName, key: event.key} }
        });
        this.stateServ.actions.next({type: 'UPDATE_WEATHER_DATA', payload: {fiveDayForecast: data[1], current: data[0][0]}});
      });
    }
  }

  addToFavorites(): void {
    this.stateServ.actions.next({type: 'ADD_TO_FAVORITES'});
  }

  private getConditionsAndForecast(cityKey: string): Observable<any> {
     return forkJoin([this.forecastServ.getCurrentCondition(cityKey)
      , this.forecastServ.getFiveDayForecast(cityKey)]);
  }
}
