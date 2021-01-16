/* tslint:disable:no-string-literal */
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ForecastService {

  constructor(private http: HttpClient) { }

  getCurrentCondition(cityKey: string): Observable<any> {
    const url = `http://dataservice.accuweather.com/currentconditions/v1/${cityKey}?apikey=${environment.api_key}`;
    // const uri = 'assets/current.json';
    return this.http.get(url);
  }
  autoComplete(searchWord: string): Observable<any> {
    const url = `http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${environment.api_key}&q=${searchWord}`;
    // const uri = 'assets/autoComplete.json';
    return this.http.get(url);
  }

  getFiveDayForecast(cityKey: string): Observable<any> {
    const url = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${cityKey}?apikey=${environment.api_key}&metric=true`;
    // const uri = 'assets/fiveDay.json';
    return this.http.get(url).pipe(map(key => key['DailyForecasts']), map(data => {
      return data.map(day => {
        return {
          Date: day.Date,
          Temperature: day.Temperature,
          Day: day.Day
        };
      });
    }));
  }

  getGeoPosition(lat: number, lon: number): Observable<any> {
    const url = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${environment.api_key}&q=${lat},${lon}&toplevel=true`;
    // const uri = 'assets/geoPosition.json';
    return this.http.get(url).pipe(map(currentPosData => {
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
