import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AllowedAccountTypes} from '../../../helpers/enum/account-type.enum';
import {LoyaltyPointsService} from '../../../services/loyalty-points/loyalty-points.service';

@Component({
  selector: 'app-loyalty-points',
  templateUrl: './loyalty-points.component.html',
  styleUrls: ['./loyalty-points.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoyaltyPointsComponent {
  @Output() closeWindow = new EventEmitter();
  @Output() openRedeemed = new EventEmitter();

  @Input() fullScreenWindow = true;

  @ViewChild('newBalanceLoyaltyPoints') newBalanceLoyaltyPoints;
  @ViewChild('businessLoyaltyPointsInfo') businessLoyaltyPointsInfo;

  eAllowedAccountTypes = AllowedAccountTypes;
  userLoyaltyPoints = 0;
  loading = false;
  userResetBalance = 0;
  userPointToDollarRatio: number | string = 0;
  businessAccount = false;
  businessLoyaltyPointsOpen = false;
  personalLoyaltyPointsOpen = false;
  businessLoyaltyPointsFormUp = false;
  businessLoyaltyPointsSubmitted = false;
  monthlyDollarValueCalculated = false;
  helpEnabled = false;
  qrCodeLink: string = null;
  userHash: string = null;
  loyaltyPointReward: number = null;
  totalSpent: number = null;
  newUserLoyaltyPoints: number = null;
  userType: number = null;
  loyaltyPointBalance$ = this.loyaltyPointsService.userLoyaltyPoints$;

  constructor(
    private loyaltyPointsService: LoyaltyPointsService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    route: ActivatedRoute
  ) {
    if (this.router.url.indexOf('scan') > -1) {
      this.qrCodeLink = route.snapshot.params.qrCode;
      this.loyaltyPointReward = route.snapshot.params.loyaltyPointReward;
      this.totalSpent = route.snapshot.params.totalSpent;
      this.userHash = route.snapshot.params.userHash;
    }

    this.userType = parseInt(localStorage.getItem('spotbie_userType'));
    this.loading = false;
    //this.getRedeemed()
  }

  getWindowClass() {
    if (this.fullScreenWindow) {
      return 'spotbie-overlay-window d-flex align-items-center justify-content-center';
    } else {
      return '';
    }
  }

  /* TO-DO: Create a function which shows a business's or personal account' past transactions. */
  fetchLedger() {}

  /* TO-DO: Create a function which shows a business's or personal account' past expenses. */
  fetchExpenses() {}

  loyaltyPointsClass() {
    if (this.userType !== AllowedAccountTypes.Personal) {
      return 'sb-loyalty-points cursor-pointer';
    } else {
      return 'sb-loyalty-points no-cursor';
    }
  }

  initPersonalLoyaltyPoints() {
    this.personalLoyaltyPointsOpen = true;
  }

  initBusinessLoyaltyPoints() {
    if (this.userType === AllowedAccountTypes.Personal) {
      this.openRedeemed.emit();
      return;
    }
  }

  closeBusinessLoyaltyPoints() {
    this.businessLoyaltyPointsOpen = false;
  }

  closeThis() {
    if (this.router.url.indexOf('scan') > -1) {
      this.router.navigate(['/user-home']);
    } else {
      this.closeWindow.emit();
    }
  }

  toggleHelp() {
    this.helpEnabled = !this.helpEnabled;
  }
}
