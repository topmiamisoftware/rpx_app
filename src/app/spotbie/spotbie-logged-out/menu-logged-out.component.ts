import {
  Component,
  ViewChild,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import {MenuController} from '@ionic/angular';
import {LogInComponent} from './log-in/log-in.component';
import {BehaviorSubject} from 'rxjs';
import {MapComponent} from '../map/map.component';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {Capacitor} from "@capacitor/core";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-menu-logged-out',
  templateUrl: './menu-logged-out.component.html',
  styleUrls: ['../menu.component.css'],
})
export class MenuLoggedOutComponent {
  @Output() myFavoritesEvt = new EventEmitter();
  @Output() openHome = new EventEmitter();

  @ViewChild('spotbieMainMenu') spotbieMainMenu: ElementRef;
  @ViewChild('appLogin') appLogin: LogInComponent;
  @ViewChild('appMap') appMap: MapComponent;

  logInWindow$ = new BehaviorSubject<boolean>(true);
  signUpWindow$ = new BehaviorSubject<boolean>(false);
  onForgotPassword$ = new BehaviorSubject<boolean>(false);

  constructor(private menuCtrl: MenuController, private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        const r = event as NavigationEnd;
        if (r.url.indexOf('forgot-password') > 0) {
          this.onForgotPassword$.next(true);
        }
      });
  }
  spawnCategories(type: number): void {
    this.logInWindow$.next(false);
    this.signUpWindow$.next(false);

    this.menuCtrl.close('main-menu');

    this.appMap.spawnCategories(type);
  }
  logIn() {
    this.signUpWindow$.next(false);
    this.logInWindow$.next(!this.logInWindow$.getValue());
  }

  closeSignUp(event$) {
    this.signUpWindow$.next(false);
  }

  home() {
    this.menuCtrl.close('main-menu');

    if (Capacitor.isNativePlatform()) {
      this.signUpWindow$.next(false);
      this.logInWindow$.next(true);
      this.appMap.map$.next(false);
      this.appMap.searchResults$.next([]);
      this.appMap.showSearchResults$.next(false);

      if (this.onForgotPassword$.getValue()) {
        this.router.navigate(['/home']);
      }
    } else {
      window.open(environment.baseUrl, '_self');
    }
  }
}
