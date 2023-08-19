import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UserauthService} from '../services/userauth.service';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css'],
})
export class UserHomeComponent {
  @Output() openSettingsEvt = new EventEmitter();

  constructor() {}
}
