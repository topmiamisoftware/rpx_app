import {
  Component,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
  ElementRef,
  AfterViewInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import {UserauthService} from '../../services/userauth.service';
import {MapComponent} from '../map/map.component';
import {DeviceDetectorService} from 'ngx-device-detector';
import {LoyaltyPointsService} from '../../services/loyalty-points/loyalty-points.service';
import {AllowedAccountTypes} from '../../helpers/enum/account-type.enum';
import {SettingsComponent} from './settings/settings.component';
import {logOutCallback} from '../../helpers/logout-callback';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-menu-logged-in',
  templateUrl: './menu-logged-in.component.html',
  styleUrls: ['../menu.component.css', './menu-logged-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuLoggedInComponent implements AfterViewInit {
  @Output() userBackgroundEvent = new EventEmitter();

  @ViewChild('spotbieMainMenu') spotbieMainMenu: ElementRef;
  @ViewChild('spotbieMap') spotbieMap: MapComponent;
  @ViewChild('spotbieSettings') spotbieSettings: SettingsComponent;

  foodWindow = {open: false};
  mapApp$ = new BehaviorSubject<boolean>(false);
  settingsWindow$ = new BehaviorSubject<boolean>(false);
  menuActive = false;
  isMobile: boolean;
  isDesktop: boolean;
  isTablet: boolean;
  userType: number;
  userLoyaltyPoints$ = this.loyaltyPointsService.userLoyaltyPoints$;
  userName: string = null;
  qrCode = false;
  business = false;
  eventMenuOpen = false;

  constructor(
    private userAuthService: UserauthService,
    private deviceService: DeviceDetectorService,
    private loyaltyPointsService: LoyaltyPointsService,
    private router: Router
  ) {
    this.isMobile = this.deviceService.isMobile();
    this.isDesktop = this.deviceService.isDesktop();
    this.isTablet = this.deviceService.isTablet();

    this.userType = parseInt(localStorage.getItem('spotbie_userType'));

    if (this.userType === AllowedAccountTypes.Personal) {
      this.business = false;
    } else {
      this.business = true;
    }

    this.userName = localStorage.getItem('spotbie_userLogin');

    this.getLoyaltyPointBalance();
  }

  myFavorites() {
    this.menuActive = false;
    this.spotbieMap.myFavorites();
  }

  toggleLoyaltyPoints() {
    this.spotbieMap.goToLp();
  }

  toggleQRScanner() {
    this.spotbieMap.goToQrCode();
  }

  toggleRewardMenu(ac: string) {
    this.spotbieMap.goToRewardMenu();
  }

  spawnCategories(category: number): void {
    this.slideMenu();
    this.spotbieMap.spawnCategories(category);
  }

  home() {
    this.settingsWindow$.next(false);
    this.foodWindow.open = false;
    this.eventMenuOpen = false;

    this.spotbieMap.openWelcome();
    this.spotbieMap.closeCategories();
  }

  slideMenu() {
    if (this.settingsWindow$.getValue()) {
      this.settingsWindow$.next(false);
    }
  }

  getMenuStyle() {
    if (this.menuActive === false) {
      return {'background-color': 'transparent'};
    }
  }

  openWindow(window): void {
    window.next(true);
  }

  closeWindow(window): void {
    window.next(false);
  }

  logOut(): void {
    this.userAuthService.logOut().subscribe(resp => {
      logOutCallback(resp, false);
      this.router.navigate(['/home']);
    });
  }

  usersAroundYou() {
    this.spotbieMap.mobileStartLocation();
  }

  async getLoyaltyPointBalance() {
    await this.loyaltyPointsService.getLoyaltyPointBalance();
  }

  getPointsWrapperStyle() {
    if (this.isMobile) {
      return {'width:': '85%', 'text-align': 'right'};
    } else {
      return {width: '45%'};
    }
  }

  openEvents() {
    this.eventMenuOpen = true;
  }

  closeEvents() {
    this.eventMenuOpen = false;
  }

  ngAfterViewInit() {
    this.mapApp$.next(true);
  }
}
