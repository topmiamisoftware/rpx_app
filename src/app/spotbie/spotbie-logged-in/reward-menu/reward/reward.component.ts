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

  public loading = false;
  public infoObjectImageUrl = 'assets/images/home_imgs/spotbie-white-icon.svg';
  public successful_url_copy = false;
  public rewardLink: string = null;

  constructor() {}

  ngOnInit(): void {}

  public getFullScreenModeClass() {
    if (this.fullScreenMode) {
      return 'fullScreenMode';
    } else {
      return '';
    }
  }

  public closeThis() {
    this.closeWindowEvt.emit();
  }

  public linkCopy(inputElement) {
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, inputElement.value.length);
    this.successful_url_copy = true;

    setTimeout(() => {
      this.successful_url_copy = false;
    }, 2500);
  }
}
