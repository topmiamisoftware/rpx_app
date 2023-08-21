import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import {Location} from '@angular/common';
import {externalBrowserOpen} from '../../helpers/cordova/web-intent';
import {Router} from '@angular/router';
import {Platform} from '@ionic/angular';

@Component({
  selector: 'app-menu-logged-out',
  templateUrl: './menu-logged-out.component.html',
  styleUrls: ['../menu.component.css'],
})
export class MenuLoggedOutComponent implements OnInit, AfterViewInit {
  @Output() myFavoritesEvt = new EventEmitter();
  @Output() spawnCategoriesOut = new EventEmitter();
  @Output() openHome = new EventEmitter();

  @ViewChild('spotbieMainMenu') spotbieMainMenu: ElementRef;

  logInWindow = {open: true};
  signUpWindow = {open: false};
  menuActive = false;
  isMobile: boolean;
  isDesktop: boolean;
  isTablet: boolean;
  business = false;

  constructor(
    private location: Location,
    private platform: Platform,
    private router: Router
  ) {}

  ngOnInit(): void {
    const activatedRoute = this.location.path();

    this.isMobile = this.platform.is('mobile');
    this.isDesktop = this.platform.is('desktop');
    this.isTablet = this.platform.is('tablet');

    // check if we need to auto log-in
    const cookiedRememberMe = localStorage.getItem('spotbie_rememberMe');
    const loggedIn = localStorage.getItem('spotbie_rememberMe');

    if (activatedRoute.indexOf('/business') > -1) {
      this.business = true;
    }

    if (
      cookiedRememberMe === '1' &&
      activatedRoute.indexOf('/home') > -1 &&
      loggedIn !== '1'
    ) {
      this.logInWindow.open = true;
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.spotbieMainMenu.nativeElement.style.display = 'table';
    }, 750);
  }

  spawnCategories(type: any, slideMenu = true): void {
    this.logInWindow.open = false;
    this.signUpWindow.open = false;

    if (slideMenu) {
      this.slideMenu();
    }

    this.spawnCategoriesOut.emit(type);
  }

  goToBlog() {
    externalBrowserOpen('https://blog.spotbie.com/');
  }

  openWindow(window: any) {
    window.open = !window.open;
  }

  closeWindow(window) {
    window.open = false;
  }

  goToBusiness() {
    this.router.navigate(['/business']);
  }

  goToAppUser() {
    this.router.navigate(['/home']);
  }

  signUp() {
    this.logInWindow.open = false;
    this.signUpWindow.open = !this.signUpWindow.open;
  }

  logIn() {
    this.signUpWindow.open = false;
    this.logInWindow.open = !this.logInWindow.open;
  }

  slideMenu() {
    this.menuActive = !this.menuActive;
  }

  getMenuStyle() {
    if (!this.menuActive) {
      return {'background-color': 'transparent'};
    }
  }

  scrollTo(el: string) {
    const element = document.getElementById(el);
    element.scrollIntoView();
  }

  myFavorites() {
    this.menuActive = false;
    this.myFavoritesEvt.next(null);
  }

  home() {
    this.menuActive = false;
    this.signUpWindow.open = false;
    this.logInWindow.open = true;
  }
}
