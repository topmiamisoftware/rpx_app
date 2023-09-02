import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { LoyaltyPointsComponent } from '../loyalty-points/loyalty-points.component';
import { QrComponent } from '../qr/qr.component';
import { RedeemableComponent } from '../redeemable/redeemable.component';
import { RewardMenuComponent } from '../reward-menu/reward-menu.component';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from "rxjs";

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDashboardComponent {
  @Output() spawnCategoriesEvt = new EventEmitter();

  @ViewChild('loyaltyPointsApp') loyaltyPointsApp: LoyaltyPointsComponent;
  @ViewChild('rewardMenuApp') rewardMenuApp: RewardMenuComponent;
  @ViewChild('qrApp') qrApp: QrComponent;
  @ViewChild('redeemablesApp') redeemablesApp: RedeemableComponent;
  @ViewChild('lpAppAnchor') lpAppAnchor: ElementRef;
  @ViewChild('rewardMenuAppAnchor') rewardMenuAppAnchor: ElementRef;
  @ViewChild('qrCodeAppAnchor') qrCodeAppAnchor: ElementRef;

  scannerStarted$ = new BehaviorSubject<boolean>(false);
  isMobile$ = new BehaviorSubject<boolean>(false);
  getRedeemableItems$ = new BehaviorSubject<boolean>(false);

  constructor(private platform: Platform) {
    this.isMobile$.next(this.platform.is('mobile'));
  }

  redeemedLp() {
    this.getRedeemableItems$.next(true);
  }

  scrollToLpAppAnchor() {
    this.lpAppAnchor.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  scrollToQrAppAnchor() {
    if (this.qrCodeAppAnchor) {
      this.qrCodeAppAnchor.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    this.startQrScanner();
  }

  scrollToRewardMenuAppAnchor() {
    this.rewardMenuAppAnchor.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  startQrScanner() {
    this.scannerStarted$.next(true);
  }

  closeQrScanner() {
    this.scannerStarted$.next(false);
  }

  closeRedeemables() {
    this.getRedeemableItems$.next(false);
  }

  spawnCategories(category: number) {
    this.spawnCategoriesEvt.emit(category);
  }

  closeAll() {
    //Close all the windows in the dashboard
    this.loyaltyPointsApp.closeThis();
    this.rewardMenuApp.closeWindow();
    this.qrApp.closeQr();
  }
}
