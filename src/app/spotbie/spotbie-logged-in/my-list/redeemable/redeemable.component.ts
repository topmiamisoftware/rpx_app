import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  AfterViewInit,
} from '@angular/core';
import {AllowedAccountTypes} from '../../../../helpers/enum/account-type.enum';
import {LoyaltyPointsService} from '../../../../services/loyalty-points/loyalty-points.service';
import {Redeemable} from '../../../../models/redeemable';
import {BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-redeemable',
  templateUrl: './redeemable.component.html',
  styleUrls: ['./redeemable.component.css', '../my-list.component.css'],
})
export class RedeemableComponent implements OnInit {
  @Output() closeWindowEvt = new EventEmitter();

  eAllowedAccountTypes = AllowedAccountTypes;
  userType: string;

  showRewardList$ = new BehaviorSubject<boolean>(false);
  rewards$ = new BehaviorSubject<boolean>(false);
  rewardList$ = new BehaviorSubject<Array<Redeemable>>([]);
  rewardPage$ = new BehaviorSubject<number>(1);
  rewardTotal$ = new BehaviorSubject<number>(0);

  loadMore$ = new BehaviorSubject<boolean>(false);

  constructor(
    private loyaltyPointsService: LoyaltyPointsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userType = localStorage.getItem('spotbie_userType');
    this.rewards$.next(true);
    this.getRewards();
  }

  loadMoreItems() {
    if (this.rewards$.getValue()) {
      this.rewardPage$.next(this.rewardPage$.getValue() + 1);
      this.getRewards();
    }
  }

  getRewardsStyle() {
    if (this.rewards$.getValue()) {
      return {'background-color': 'rgb(80 216 120)'};
    }
  }

  getRewards() {
    const getRewardsObj = {
      page: this.rewardPage$.getValue(),
    };

    this.loyaltyPointsService.getRewards(getRewardsObj).subscribe({
      next: resp => {
        const rewardList: Redeemable[] = resp.rewardList.data;

        this.rewardTotal$.next(rewardList.length);

        const currentPage = resp.rewardList.current_page;
        const lastPage = resp.rewardList.last_page;

        this.rewardPage$.next(currentPage);

        this.rewardPage$.getValue() === lastPage
          ? this.loadMore$.next(false)
          : this.loadMore$.next(true);

        rewardList.forEach((redeemItem: Redeemable) => {
          this.rewardList$.next([...this.rewardList$.getValue(), redeemItem]);
        });

        this.rewards$.next(true);
      },
      error: error => {
        console.log('getRewards', error);
      },
    });
  }

  showLoadMore() {
    if (this.rewards$.getValue() && this.rewardTotal$.getValue() > 0) {
      return true;
    }
  }

  closeWindow() {
    this.closeWindowEvt.emit();
  }
}
