import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild,} from '@angular/core';
import {MapComponent} from '../map/map.component';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-menu-logged-in',
  templateUrl: './menu-logged-in.component.html',
  styleUrls: ['../menu.component.css', './menu-logged-in.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuLoggedInComponent implements AfterViewInit {
  @ViewChild('spotbieMainMenu') spotbieMainMenu: ElementRef;
  @ViewChild('spotbieMap') spotbieMap: MapComponent;

  mapApp$ = new BehaviorSubject<boolean>(false);
  business = false;

  ngAfterViewInit() {
    this.mapApp$.next(true);
  }

  toggleLoyaltyPoints() {
    this.spotbieMap.goToLp();
  }

  toggleQRScanner() {
    this.spotbieMap.goToQrCode();
  }

  spawnCategories(evt: {category: number}): void {
    this.spotbieMap.spawnCategories(evt.category);
  }

  closeMapApp() {
    this.mapApp$.next(false);
  }
}
