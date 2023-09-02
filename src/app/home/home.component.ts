import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {MapComponent} from '../spotbie/map/map.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChild('appMap') appMap: MapComponent;

  arrowOn = false;
  getStartedPrompt = true;

  constructor(private router: Router) {}

  getStarted() {
    this.getStartedPrompt = false;
  }

  spawnCategories(category: number): void {
    this.appMap.spawnCategories(category);
  }

  openHome() {
    this.appMap.openWelcome();
  }

  myFavorites() {
    this.appMap.myFavorites();
  }

  async ngOnInit() {
    const isLoggedIn = localStorage.getItem('spotbie_loggedIn');

    if (isLoggedIn === '1') {
      this.router.navigate(['/user-home']);
    }
  }
}
