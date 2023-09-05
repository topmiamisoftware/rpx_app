import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Reward} from '../../../../models/reward';

@Component({
  selector: 'app-reward',
  templateUrl: './reward.component.html',
  styleUrls: ['./reward.component.css'],
})
export class RewardComponent implements OnInit {
  @Output() closeWindowEvt = new EventEmitter();

  @Input() fullScreenMode = true;
  @Input() reward: Reward;
  @Input() userPointToDollarRatio: number;

  loading = false;
  infoObjectImageUrl = 'assets/images/home_imgs/spotbie-white-icon.svg';
  successful_url_copy = false;
  rewardLink: string = null;

  constructor() {}

  ngOnInit(): void {}

  getFullScreenModeClass() {
    if (this.fullScreenMode) {
      return 'fullScreenMode';
    } else {
      return '';
    }
  }

  closeThis() {
    this.closeWindowEvt.emit();
  }

  linkCopy(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, inputElement.value.length);
    this.successful_url_copy = true;

    setTimeout(() => {
      this.successful_url_copy = false;
    }, 2500);
  }
}
