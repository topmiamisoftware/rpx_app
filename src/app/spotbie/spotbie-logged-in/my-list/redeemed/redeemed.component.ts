import {Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Redeemable} from '../../../../models/redeemable';
import {LoyaltyPointsService} from '../../../../services/loyalty-points/loyalty-points.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-redeemed',
  templateUrl: './redeemed.component.html',
  styleUrls: ['./redeemed.component.scss', '../my-list.component.css'],
})
export class RedeemedComponent implements OnInit {
  userType: string;

  lpRedeemed$ = new BehaviorSubject<boolean>(false);
  lpRedeemedList$ = new BehaviorSubject<Array<Redeemable>>([]);
  lpRedeemedPage$ = new BehaviorSubject<number>(1);
  lpRedeemedTotal$ = new BehaviorSubject<number>(0);

  loadMore$ = new BehaviorSubject<boolean>(false);

  constructor(
    private loyaltyPointsService: LoyaltyPointsService,
    private router: Router
  ) {}

  getRedeemedStyle() {
    if (this.lpRedeemed$.getValue()) {
      return {'background-color': 'rgb(80 216 120)'};
    }
  }

  getRedeemed() {
    const getRedeemedObj = {
      page: this.lpRedeemedPage$.getValue(),
    };

    this.loyaltyPointsService.getRedeemed(getRedeemedObj).subscribe({
      next: resp => {
        const redeemItemData: Redeemable[] = resp.redeemedList.data;

        this.lpRedeemedTotal$.next(redeemItemData.length);
        this.lpRedeemedPage$.next(resp.redeemedList.current_page);

        const lastPage = resp.redeemedList.last_page;

        if (this.lpRedeemedPage$.getValue() === lastPage) {
          this.loadMore$.next(false);
        } else {
          this.loadMore$.next(true);
        }

        redeemItemData.forEach((redeemItem: Redeemable) => {
          this.lpRedeemedList$.next([
            ...this.lpRedeemedList$.getValue(),
            redeemItem,
          ]);
        });
      },
      error: error => {
        console.log('getRedeemed', error);
      },
    });
  }

  loadMoreItems() {
    if (this.lpRedeemed$.getValue()) {
      this.lpRedeemedPage$.next(this.lpRedeemedPage$.getValue() + 1);
      this.getRedeemed();
    }
  }

  showLoadMore() {
    if (this.lpRedeemed$.getValue() && this.lpRedeemedTotal$.getValue() > 0) {
      return true;
    }
  }

  ngOnInit() {
    this.userType = localStorage.getItem('spotbie_userType');
    this.lpRedeemed$.next(true);
    this.getRedeemed();
  }
}
