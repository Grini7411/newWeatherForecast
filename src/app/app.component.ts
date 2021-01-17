import {Component, OnInit} from '@angular/core';
import { PrimeNGConfig, PrimeIcons } from 'primeng/api';
import {Action, ActionHandler, ActionHandlers, StateService} from './services/state.service';
import {MenuItem} from 'primeng/api';
import {ForecastService} from './services/forecast.service';


export class WeatherActionHandler implements ActionHandler {
  handleAction(currentState: any, action: Action): any {
    if (action.type === 'init') {
      const favorites = localStorage.getItem('favorites') ? JSON.parse(localStorage.getItem('favorites')) : [];
      return {...currentState, favorites};
    }
    if (action.type === 'CHANGE_CITY') {
      return {
        ...currentState,
        chosenCity: action.payload.chosenCity
      };
    }
    if (action.type === 'UPDATE_WEATHER_DATA'){
      return {
        ...currentState,
        current: {
          WeatherText: action.payload.current.WeatherText,
          temperature: action.payload.current.Temperature,
          Icon: action.payload.current.Icon
        },
        fiveDayForecast: action.payload.fiveDayForecast,
        isMetric: true
      };
    }
    if (action.type === 'ADD_TO_FAVORITES') {
      const favorites: any[] = [...currentState.favorites];
      favorites.push({chosenCity: {...currentState.chosenCity}});
      if (favorites.length > 5) {
        favorites.shift();
      }
      localStorage.setItem('favorites', JSON.stringify(favorites));
      return {
        ...currentState,
        favorites
      };
    }
    if (action.type === 'CHANGE_TEMP_SYS') {
      return {...currentState, isMetric: action.payload.isMetric};
    }
    if (action.type === 'REMOVE_FAVORITE') {
      const favorites: any[] = [...currentState.favorites];
      const filteredArr = favorites.filter(el => el.chosenCity.LocalizedName !== action.payload.city);
      return {...currentState, favorites: filteredArr};
    }
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [StateService, {
    provide: ActionHandlers,
    useClass: WeatherActionHandler,
    multi: true
  }]
})

export class AppComponent implements OnInit{
  title = 'newWeatherForecast';
  navItems: MenuItem[];

  constructor(private primengConfig: PrimeNGConfig, private stateServ: StateService, private forecastServ: ForecastService) {}

  ngOnInit(): void {

    this.primengConfig.ripple = true;

    this.navItems = [
      {
        label: 'Current Weather',
        routerLink: '/',
        icon: PrimeIcons.CHECK_CIRCLE
      },
      {
        label: 'Favorites',
        icon: PrimeIcons.STAR,
        routerLink: '/favorites'
      }
    ];
  }
  changeTempSys($event: any): void {
    this.forecastServ.isMetric.next(!this.forecastServ.isMetric.getValue());
    this.stateServ.actions.next({type: 'CHANGE_TEMP_SYS' , payload: {isMetric: $event.checked}});
  }
}
