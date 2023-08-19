import {Component, Input, OnInit} from '@angular/core';
import {Ad} from '../../../../models/ad';

const EDIT_MODE = false;

@Component({
  selector: 'app-nearby-ads-three',
  templateUrl: './nearby-ads-three.component.html',
  styleUrls: ['./nearby-ads-three.component.css'],
})
export class NearbyAdsThreeComponent implements OnInit {
  @Input() lat: number = null;
  @Input() lng: number = null;
  @Input() accountType: number | string = null;
  @Input() eventsClassification: number = null;
  @Input() categories: any;

  peditMode = EDIT_MODE;
  padList = [new Ad(), new Ad(), new Ad()];

  constructor() {}

  ngOnInit(): void {}
}
