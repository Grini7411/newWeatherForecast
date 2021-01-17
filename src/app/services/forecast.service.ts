/* tslint:disable:no-string-literal */
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ForecastService {
  isDayTime: Subject<boolean> = new Subject<boolean>();
  isMetric: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  constructor(private http: HttpClient) { }

  getCurrentCondition(cityKey: string): Observable<any> {
    const urlProd = `http://dataservice.accuweather.com/currentconditions/v1/${cityKey}?apikey=${environment.api_key}`;
    const urlDev = 'assets/current.json';
    return this.http.get(environment.production ? urlProd : urlDev).pipe(map((data: any[]) => {
      return data.map(item => {
        const iconNum: string = item.WeatherIcon < 10 ? `0${item.WeatherIcon}` : `${item.WeatherIcon}`;
        this.isDayTime.next(item.isDayTime);
        return {
          Temperature: item.Temperature,
          Icon: `https://developer.accuweather.com/sites/default/files/${iconNum}-s.png`,
          WeatherText: item.WeatherText,
          isDayTime: item.isDayTime
        };
      });
    }));
  }
  autoComplete(searchWord: string): Observable<any> {
    const urlProd = `http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${environment.api_key}&q=${searchWord}`;
    const urlDev = 'assets/autoComplete.json';
    return this.http.get(environment.production ? urlProd : urlDev);
  }

  getFiveDayForecast(cityKey: string): Observable<any> {
    const urlProd = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityKey}?apikey=${environment.api_key}&metric=${this.isMetric.getValue()}`;
    const urlDev = 'assets/fiveDay.json';
    return this.http.get(environment.production ? urlProd : urlDev).pipe(map(key => key['DailyForecasts']), map(data => {
      return data.map(day => {
        const iconNum: string = day.Day.Icon < 10 ? `0${day.Day.Icon}` : `${day.Day.Icon}`;
        return {
          Icon: `https://developer.accuweather.com/sites/default/files/${iconNum}-s.png`,
          Date: day.Date,
          Temperature: day.Temperature,
          Day: day.Day
        };
      });
    }));
  }

  getGeoPosition(lat: number, lon: number): Observable<any> {
    const urlProd = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${environment.api_key}&q=${lat},${lon}&toplevel=true`;
    const urlDev = 'assets/geoPosition.json';
    return this.http.get(environment.production ? urlProd : urlDev).pipe(map(currentPosData => {
      return {
        key: currentPosData['Key'],
        city: currentPosData['LocalizedName']
      };
    }));
  }

  getImageFromGoogle(searchWord: string): Observable<any> {
    const url = `https://www.googleapis.com/customsearch/v1?key=${environment.google.googleKey}
                 &cx=${environment.google.cx}&q=${searchWord} city`;
    return this.http.get(url).pipe(map(data => {
      return data['items'][0].pagemap.cse_image[0].src;
    }));
  }
}
