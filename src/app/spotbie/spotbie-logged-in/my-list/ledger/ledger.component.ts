import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {LoyaltyPointsLedger} from '../../../../models/loyalty-points-ledger';
import {LoyaltyPointsService} from '../../../../services/loyalty-points/loyalty-points.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss', '../my-list.component.css'],
})
export class LedgerComponent implements OnInit {

  userType: string;

  ledger$ = new BehaviorSubject<boolean>(false);
  lpLedgerList$ = new BehaviorSubject<Array<LoyaltyPointsLedger>>([]);
  lpLedgerPage$ = new BehaviorSubject<number>(1);
  lpLedgerTotal$ = new BehaviorSubject<number>(0);

  loadMore$ = new BehaviorSubject<boolean>(false);
  constructor(
    private loyaltyPointsService: LoyaltyPointsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userType = localStorage.getItem('spotbie_userType');
    this.ledger$.next(true);
    this.getLedger();
  }

  showLoadMore() {
    if (this.ledger$.getValue() && this.lpLedgerTotal$.getValue() > 0) {
      return true;
    }
  }

  loadMoreItems() {
    this.lpLedgerPage$.next(this.lpLedgerPage$.getValue() + 1);
    this.getLedger();
  }

  getLedger() {
    const getLedgerObj = {
      page: this.lpLedgerPage$.getValue(),
    };

    this.loyaltyPointsService.getLedger(getLedgerObj).subscribe({
      next: resp => {
        const ledgerData: LoyaltyPointsLedger[] = resp.ledger.data;

        this.lpLedgerTotal$.next(ledgerData.length);

        const currentPage = resp.ledger.current_page;
        const lastPage = resp.ledger.last_page;

        this.lpLedgerPage$.next(currentPage);

        this.lpLedgerPage$.getValue() === lastPage
          ? this.loadMore$.next(false)
          : this.loadMore$.next(true);

        ledgerData.forEach((ledgerRecord: LoyaltyPointsLedger) => {
          this.lpLedgerList$.next([
            ...this.lpLedgerList$.getValue(),
            ledgerRecord,
          ]);
        });
      },
      error: error => {
        console.log('getLedger', error);
      },
    });
  }

  getLpStyle(lpPoints: number) {
    if (lpPoints < 0) {
      return 'sb-text-red-gradient';
    } else {
      return 'sb-text-light-green-gradient';
    }
  }

  setTopMargin() {
    const toolbarHeight =
      document.getElementsByTagName('ion-toolbar')[0].offsetHeight;

    document.getElementById('redeemWindowNavMargin').style.marginTop =
      toolbarHeight + 'px';
  }
}
