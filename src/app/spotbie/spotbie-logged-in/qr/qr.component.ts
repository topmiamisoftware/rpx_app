import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {Reward} from '../../../models/reward';
import {LoyaltyPointsService} from '../../../services/loyalty-points/loyalty-points.service';
import {DeviceDetectorService} from 'ngx-device-detector';
import {RewardCreatorService} from '../../../services/spotbie-logged-in/business-menu/reward-creator/reward-creator.service';
import {BehaviorSubject} from 'rxjs';
import {BarcodeScanner} from '@capacitor-community/barcode-scanner';
import {
  AndroidSettings,
  IOSSettings,
  NativeSettings,
} from 'capacitor-native-settings';
import {Camera} from "@capacitor/camera";

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
  @ViewChild('sbSpentPoints') sbSpentPoints: ElementRef;

  userLoyaltyPoints$ = new BehaviorSubject<number>(0);
  rewardPrompted$ = new BehaviorSubject<boolean>(false);
  qrWidth$ = new BehaviorSubject<number>(0);
  scanSuccess$ = new BehaviorSubject<boolean>(false);
  awarded$ = new BehaviorSubject<boolean>(false);
  reward$ = new BehaviorSubject<Reward>(null);
  rewarded$ = new BehaviorSubject<boolean>(false);
  pointsCharged$ = new BehaviorSubject<number>(0);
  showEnablePermission$ = new BehaviorSubject<boolean>(false);

  businessLoyaltyPointsForm: UntypedFormGroup;

  constructor(
    private loyaltyPointsService: LoyaltyPointsService,
    private deviceDetectorService: DeviceDetectorService,
    private rewardService: RewardCreatorService
  ) {}

  get f() {
    return this.businessLoyaltyPointsForm.controls;
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
      this.sbSpentPoints.nativeElement.style.display = 'block';
    } else {
      alert(resp.message);
      this.closeQrUser();
    }

    this.scanSuccess$.next(false);
  }

  async checkPermission(): Promise<boolean> {
    // check if user already granted permission
    let status = await Camera.checkPermissions();

    console.log('STATUS', status);

    if (status.camera === 'granted') {
      // user granted permission
      return true;
    }

    if (status.camera === 'denied') {
      // user denied permission
      return false;
    }

    if (
      status.camera === 'prompt' ||
      status.camera === 'prompt-with-rationale'
    ) {
      const c = confirm(
        'We need your permission to use your camera to be able to scan barcodes.'
      );

      if (!c) {
        return false;
      }

      // prompt
      status = await Camera.requestPermissions({permissions: ['camera']});
      if (status.camera === 'granted') {
        return true;
      }
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
    } else {
      alert(resp.message);
    }

    this.scanSuccess$.next(false);
  }

  scanErrorHandler(event) {
    // Log the error somewhere.
    console.log('scan failure', event);
  }

  async startQrCodeScanner() {
    this.loyaltyPointsService.getLoyaltyPointBalance();

    this.checkPermission().then(async granted => {
      if (granted) {
        this.showEnablePermission$.next(false);
        BarcodeScanner.hideBackground();
        const result = await BarcodeScanner.startScan();
        if (result.hasContent) {
          this.scanSuccessHandler(result.content);
        } else {
          this.scanErrorHandler(result.content);
        }
      } else {
        alert('Please enable camera access to scan rewards.');
        this.showEnablePermission$.next(true);
      }
    });
  }

  closeQr() {
    this.rewardPrompted$.next(false);
  }

  closeQrUser() {
    this.closeQrUserEvt.emit(null);
  }

  openAppSettings() {
    NativeSettings.open({
      optionAndroid: AndroidSettings.ApplicationDetails,
      optionIOS: IOSSettings.App,
    });
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
