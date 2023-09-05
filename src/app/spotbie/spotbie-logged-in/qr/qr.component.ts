import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Redeemable } from '../../../models/redeemable';
import { UserauthService } from '../../../services/userauth.service';
import { Reward } from '../../../models/reward';
import { LoyaltyPointsService } from '../../../services/loyalty-points/loyalty-points.service';
import { Business } from '../../../models/business';
import { DeviceDetectorService } from 'ngx-device-detector';
import { RewardCreatorService } from '../../../services/spotbie-logged-in/business-menu/reward-creator/reward-creator.service';
import { BehaviorSubject } from 'rxjs';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

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

  business$ = new BehaviorSubject<Business>(null);
  redeemable$ = new BehaviorSubject<Redeemable>(null);
  userHash$ = new BehaviorSubject<string>(null);
  isBusiness$ = false;
  userLoyaltyPoints$ = new BehaviorSubject<number>(0);
  loyaltyPointWorth$ = new BehaviorSubject<number>(0);
  businessLoyaltyPointsFormUp$ = new BehaviorSubject<boolean>(false);
  rewardPrompted$ = new BehaviorSubject<boolean>(false);
  rewardPrompt$ = new BehaviorSubject<boolean>(false);
  loyaltyPointReward$ = new BehaviorSubject<number>(null);
  loyaltyPointRewardDollarValue$ = new BehaviorSubject<number>(null);
  qrCodeLink$ = new BehaviorSubject<string>(null);
  businessLoyaltyPointsSubmitted$ = new BehaviorSubject<boolean>(false);
  qrWidth$ = new BehaviorSubject<number>(0);
  scanSuccess$ = new BehaviorSubject<boolean>(false);
  awarded$ = new BehaviorSubject<boolean>(false);
  reward$ = new BehaviorSubject<Reward>(null);
  rewarded$ = new BehaviorSubject<boolean>(false);
  pointsCharged$ = new BehaviorSubject<number>(0);

  qrType = 'url';
  promptForRewardTimeout;
  businessLoyaltyPointsForm: UntypedFormGroup;
  qrCodeLoyaltyPointsBaseUrl = QR_CODE_LOYALTY_POINTS_SCAN_BASE_URL;
  qrCodeRewardBaseUrl = QR_CODE_CALIM_REWARD_SCAN_BASE_URL;

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
      this.rewarded$.next(true);
      this.reward$.next(resp.reward);
      this.pointsCharged$.next(this.reward$.getValue().point_cost);
      this.sbEarnedPoints.nativeElement.style.display = 'block';
    } else {
      alert(resp.message);
    }

    this.scanSuccess$.next(false);
  }

  async checkPermission() {
    // check if user already granted permission
    const status = await BarcodeScanner.checkPermission({ force: false });

    if (status.granted) {
      // user granted permission
      return true;
    }

    if (status.denied) {
      // user denied permission
      return false;
    }

    if (status.asked) {
      // system requested the user for permission during this call
      // only possible when force set to true
    }

    if (status.neverAsked) {
      // user has not been requested this permission before
      // it is advised to show the user some sort of prompt
      // this way you will not waste your only chance to ask for the permission
      const c = confirm('We need your permission to use your camera to be able to scan barcodes');
      if (!c) {
        return false;
      }
    }

    if (status.restricted || status.unknown) {
      // ios only
      // probably means the permission has been denied
      return false;
    }

    // user has not denied permission
    // but the user also has not yet granted the permission
    // so request it
    const statusRequest = await BarcodeScanner.checkPermission({ force: true });

    if (statusRequest.asked) {
      // system requested the user for permission during this call
      // only possible when force set to true
    }

    if (statusRequest.granted) {
      // the user did grant the permission now
      return true;
    }

    // user did not grant the permission, so he must have declined the request
    return false;
  }

  scanSuccessHandler(urlString: string) {
    if (this.scanSuccess$.getValue()) {
      return;
    }

    this.scanSuccess$.next(true);

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
      this.awarded$.next(true);
      this.userLoyaltyPoints$.next(resp.redeemable.amount);
      this.sbEarnedPoints.nativeElement.style.display = 'block';
    } else {
      alert(resp.message);
    }

    this.scanSuccess$.next(false);
  }

  scanErrorHandler(event) {}

  scanFailureHandler(event) {
    console.log('scan failure', event);
  }

  getQrCode() {
    this.loyaltyPointsService.getLoyaltyPointBalance();

    this.userAuthService.getSettings().subscribe(resp => {
      this.userHash$.next(resp.user.hash);

      this.business$.next({
        ...new Business(),
        address: resp.business.address,
        name: resp.business.name,
        qr_code_link: resp.business.qr_code_link,
        trial_ends_at: resp.business.trial_ends_at,
      });
    });

    const totalSpentValidators = [Validators.required];

    this.businessLoyaltyPointsForm = this.formBuilder.group({
      totalSpent: ['', totalSpentValidators],
    });

    this.businessLoyaltyPointsFormUp$.next(true);
  }

  async startQrCodeScanner() {
    this.loyaltyPointsService.getLoyaltyPointBalance();

    BarcodeScanner.hideBackground();
    const result = await BarcodeScanner.startScan();
    if (result.hasContent) {
      console.log(result.content);
    }
  }

  closeQr() {
    this.rewardPrompted$.next(false);
  }

  closeQrUser() {
    this.closeQrUserEvt.emit(null);
  }

  ngOnInit(): void {
    if (this.deviceDetectorService.isMobile()) {
      this.qrWidth$.next(250);
    } else {
      this.qrWidth$.next(450);
    }

    this.startQrCodeScanner();
  }
}
