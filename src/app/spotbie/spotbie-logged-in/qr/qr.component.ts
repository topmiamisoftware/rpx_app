import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {Redeemable} from '../../../models/redeemable';
import {UserauthService} from '../../../services/userauth.service';
import {Reward} from '../../../models/reward';
import {LoyaltyPointsService} from '../../../services/loyalty-points/loyalty-points.service';
import {Business} from '../../../models/business';
import {DeviceDetectorService} from 'ngx-device-detector';
import {RewardCreatorService} from '../../../services/spotbie-logged-in/business-menu/reward-creator/reward-creator.service';

const QR_CODE_LOYALTY_POINTS_SCAN_BASE_URL =
  environment.qrCodeLoyaltyPointsScanBaseUrl;
const QR_CODE_CALIM_REWARD_SCAN_BASE_URL = environment.qrCodeRewardScanBaseUrl;

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.css', '../reward-menu/reward-menu.component.css'],
})
export class QrComponent implements OnInit {
  @Input() fullScreenWindow = false;

  @Output() closeThisEvt = new EventEmitter();
  @Output() openUserLPBalanceEvt = new EventEmitter();
  @Output() closeQrUserEvt = new EventEmitter();
  @Output() notEnoughLpEvt = new EventEmitter();

  @ViewChild('sbEarnedPoints') sbEarnedPoints: ElementRef;

  business = new Business();
  redeemable = new Redeemable();
  userHash: string;
  qrType = 'url';
  isBusiness = false;
  userLoyaltyPoints = 0;
  loyaltyPointWorth = 0;
  businessLoyaltyPointsForm: UntypedFormGroup;
  businessLoyaltyPointsFormUp = false;
  rewardPrompted = false;
  promptForRewardTimeout;
  rewardPrompt = false;
  loyaltyPointReward: number;
  loyaltyPointRewardDollarValue: number;
  qrCodeLink: string;
  qrCodeLoyaltyPointsBaseUrl = QR_CODE_LOYALTY_POINTS_SCAN_BASE_URL;
  qrCodeRewardBaseUrl = QR_CODE_CALIM_REWARD_SCAN_BASE_URL;
  businessLoyaltyPointsSubmitted = false;
  qrWidth = 0;
  scanSuccess = false;
  awarded = false;
  reward: Reward;
  rewarded = false;
  pointsCharged: number;

  constructor(
    private userAuthService: UserauthService,
    private loyaltyPointsService: LoyaltyPointsService,
    private deviceDetectorService: DeviceDetectorService,
    private formBuilder: UntypedFormBuilder,
    private rewardService: RewardCreatorService
  ) {}

  get totalSpent() {
    return this.businessLoyaltyPointsForm.get('totalSpent').value;
  }
  get f() {
    return this.businessLoyaltyPointsForm.controls;
  }

  getWindowClass() {
    if (this.fullScreenWindow) {
      return 'spotbie-overlay-window';
    } else {
      return '';
    }
  }

  addLp(addLpObj) {
    this.loyaltyPointsService.addLoyaltyPoints(addLpObj, resp => {
      this.scanSuccessHandlerCb(resp);
    });
  }

  claimReward(addLpObj) {
    this.rewardService.claimReward(addLpObj, resp => {
      this.claimRewardCb(resp);
    });
  }

  claimRewardCb(resp) {
    if (resp.success) {
      this.rewarded = true;
      this.reward = resp.reward;
      this.pointsCharged = this.reward.point_cost;
      this.sbEarnedPoints.nativeElement.style.display = 'block';
    } else {
      alert(resp.message);
    }

    this.scanSuccess = false;
  }

  scanSuccessHandler(urlString: string) {
    if (this.scanSuccess) {
      return;
    }

    this.scanSuccess = true;

    const url = new URL(urlString);
    const urlParams = new URLSearchParams(url.search);

    const redeemableType = urlParams.get('t');

    const addLpObj = {
      redeemableHash: urlParams.get('r'),
      redeemableType,
    };

    switch (redeemableType) {
      case 'lp':
        this.addLp(addLpObj);
        break;
      case 'claim_reward':
        this.claimReward(addLpObj);
        break;
    }
  }

  scanSuccessHandlerCb(resp: any) {
    if (resp.success) {
      this.awarded = true;
      this.userLoyaltyPoints = resp.redeemable.amount;
      this.sbEarnedPoints.nativeElement.style.display = 'block';
    } else {
      alert(resp.message);
    }

    this.scanSuccess = false;
  }

  scanErrorHandler(event) {}

  scanFailureHandler(event) {
    console.log('scan failure', event);
  }

  getQrCode() {
    this.loyaltyPointsService.getLoyaltyPointBalance();

    this.userAuthService.getSettings().subscribe(resp => {
      this.userHash = resp.user.hash;
      this.business.address = resp.business.address;
      this.business.name = resp.business.name;
      this.business.qr_code_link = resp.business.qr_code_link;
      this.business.trial_ends_at = resp.business.trial_ends_at;
    });

    const totalSpentValidators = [Validators.required];

    this.businessLoyaltyPointsForm = this.formBuilder.group({
      totalSpent: ['', totalSpentValidators],
    });

    this.businessLoyaltyPointsFormUp = true;
  }

  startQrCodeScanner() {
    this.loyaltyPointsService.getLoyaltyPointBalance();
  }

  closeQr() {
    this.rewardPrompted = false;
  }

  closeQrUser() {
    this.closeQrUserEvt.emit(null);
  }

  ngOnInit(): void {
    if (this.deviceDetectorService.isMobile()) {
      this.qrWidth = 250;
    } else {
      this.qrWidth = 450;
    }

    this.startQrCodeScanner();
  }
}
