import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AllowedAccountTypes} from '../../../helpers/enum/account-type.enum';
import {LoyaltyPointBalance} from '../../../models/loyalty-point-balance';
import {Business} from '../../../models/business';
import {Reward} from '../../../models/reward';
import {LoyaltyPointsService} from '../../../services/loyalty-points/loyalty-points.service';
import {BusinessMenuServiceService} from '../../../services/spotbie-logged-in/business-menu/business-menu-service.service';
import {RewardCreatorComponent} from './reward-creator/reward-creator.component';
import {RewardComponent} from './reward/reward.component';
import {environment} from '../../../../environments/environment';
import { BehaviorSubject } from "rxjs";

@Component({
  selector: 'app-reward-menu',
  templateUrl: './reward-menu.component.html',
  styleUrls: ['./reward-menu.component.css'],
})
export class RewardMenuComponent implements OnInit {
  @ViewChild('rewardCreator') rewardCreator: RewardCreatorComponent;
  @ViewChild('appRewardViewer') appRewardViewer: RewardComponent;

  @Input() rewardAppFullScreen = false;
  @Input() fullScreenMode = true;
  @Input() loyaltyPoints: string;
  @Input() qrCodeLink: string = null;

  @Output() closeWindowEvt = new EventEmitter();
  @Output() notEnoughLpEvt = new EventEmitter();

  eAllowedAccountTypes = AllowedAccountTypes;
  menuItemList: Array<any>;
  itemCreator = false;
  rewardApp$ = new BehaviorSubject(false);
  userLoyaltyPoints;
  userResetBalance;
  userPointToDollarRatio;
  rewards$ = new BehaviorSubject<Array<Reward>>(null);
  reward$ = new BehaviorSubject<Reward>(null);
  userType: number = null;
  business: Business = new Business();
  loyaltyPointsBalance: LoyaltyPointBalance;
  isLoggedIn: string = null;

  constructor(
    private loyaltyPointsService: LoyaltyPointsService,
    private businessMenuService: BusinessMenuServiceService,
    private router: Router,
    route: ActivatedRoute
  ) {
    if (this.router.url.indexOf('business-menu') > -1) {
      this.qrCodeLink = route.snapshot.params.qrCode;
    }
  }

  getWindowClass() {
    if (this.fullScreenMode) {
      return 'spotbie-overlay-window';
    } else {
      return '';
    }
  }

  fetchRewards(qrCodeLink: string = null) {
    let fetchRewardsReq = null;

    fetchRewardsReq = {
      qrCodeLink: this.qrCodeLink,
    };

    this.businessMenuService.fetchRewards(fetchRewardsReq).subscribe(resp => {
      this.fetchRewardsCb(resp);
    });
  }

  private async fetchRewardsCb(resp) {
    if (resp.success) {
      console.log('RWARDS', resp.rewards);
      this.rewards$.next(resp.rewards);

      if (
        this.userType === this.eAllowedAccountTypes.Personal ||
        this.isLoggedIn !== '1'
      ) {
        this.userPointToDollarRatio = resp.loyalty_point_dollar_percent_value;
        this.business = resp.business;
      }
    }
  }

  addItem() {
    if (this.loyaltyPointsBalance.balance === 0) {
      this.notEnoughLpEvt.emit();
      this.closeWindow();
      return;
    }

    this.itemCreator = !this.itemCreator;
  }

  closeWindow() {
    this.closeWindowEvt.emit();
  }

  openReward(reward: Reward) {
    console.log('reward', reward);
    reward.link = `${environment.baseUrl}business-menu/${this.qrCodeLink}/${reward.uuid}`;
    this.reward$.next(reward);

    this.rewardApp$.next(true);
  }

  closeReward() {
    this.reward$.next(null);
    this.rewardApp$.next(false);
  }

  editReward(reward: Reward) {
    this.reward$.next(reward);
    this.itemCreator = true;
  }

  closeRewardCreator() {
    this.reward$.next(null);
    this.itemCreator = false;
  }

  closeRewardCreatorAndRefetchRewardList() {
    this.closeRewardCreator();
    this.fetchRewards();
  }

  rewardTileStyling(reward: Reward) {
    if (reward.type === 0) {
      return {background: 'url(' + reward.images + ')'};
    } else {
      return {background: 'linear-gradient(90deg,#35a99f,#64e56f)'};
    }
  }

  ngOnInit(): void {
    this.userType = parseInt(localStorage.getItem('spotbie_userType'));
    this.isLoggedIn = localStorage.getItem('spotbie_loggedIn');

    if (this.userType !== this.eAllowedAccountTypes.Personal) {
      this.fetchRewards();
    } else {
      this.fetchRewards(this.qrCodeLink);
    }
  }
}
