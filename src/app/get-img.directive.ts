import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {ForecastService} from './services/forecast.service';

@Directive({
  selector: '[appGetImg]'
})
export class GetImgDirective implements OnInit{
  @Input() appGetImg: string;
  constructor(private el: ElementRef, private forecastServ: ForecastService) {}

  ngOnInit(): void {
    this.forecastServ.getImageFromGoogle(this.appGetImg).subscribe(imgSrc => {
      this.el.nativeElement.src = imgSrc;
    });
  }

}
