import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {handleError} from '../../helpers/error-helper';
import {Store} from '@ngrx/store';
import {setValue} from '../../spotbie/spotbie-logged-in/loyalty-points/loyalty-points.actions';
import {LoyaltyPointBalance} from '../../models/loyalty-point-balance';
import * as spotbieGlobals from '../../globals';
import {LoyaltyTier} from '../../models/loyalty-point-tier.balance';

const LOYATLY_POINTS_API = spotbieGlobals.API + 'loyalty-points';
const LOYATLY_POINTS_TIER_API = spotbieGlobals.API + 'lp-tiers';
const REDEEMABLE_API = spotbieGlobals.API + 'redeemable';

@Injectable({
  providedIn: 'root',
})
export class LoyaltyPointsService {
  userLoyaltyPoints$: Observable<number> = this.store.select('loyaltyPoints');
  loyaltyPointBalance: LoyaltyPointBalance;
  existingTiers: Array<LoyaltyTier> = [];

  constructor(
    private http: HttpClient,
    private store: Store<{loyaltyPoints}>
  ) {}

  getLedger(request: any): Observable<any> {
    const apiUrl = `${REDEEMABLE_API}/ledger?page=${request.page}`;

    return this.http
      .get<any>(apiUrl, request)
      .pipe(catchError(handleError('getLedger')));
  }

  getBalanceList(request: any): Observable<any> {
    const apiUrl = `${REDEEMABLE_API}/balance-list?page=${request.page}`;

    return this.http
      .get<any>(apiUrl, request)
      .pipe(catchError(handleError('getBalanceList')));
  }

  getRedeemed(request: any): Observable<any> {
    const apiUrl = `${REDEEMABLE_API}/lp-redeemed?page=${request.page}`;

    return this.http
      .get<any>(apiUrl, request)
      .pipe(catchError(handleError('getRedeemed')));
  }

  getRewards(request: any): Observable<any> {
    const apiUrl = `${REDEEMABLE_API}/index?page=${request.page}`;

    return this.http
      .get<any>(apiUrl, request)
      .pipe(catchError(handleError('getRewards')));
  }

  getLoyaltyPointBalance(): any {
    const apiUrl = `${LOYATLY_POINTS_API}/show`;

    this.http
      .post<any>(apiUrl, null)
      .pipe(catchError(handleError('getLoyaltyPointBalance')))
      .subscribe(resp => {
        console.log('getLoyaltyPointBalance', resp);
        if (resp.success) {
          const loyaltyPointBalance = resp.loyalty_points;
          this.store.dispatch(setValue({loyaltyPointBalance}));
        }
      });
  }

  saveLoyaltyPoint(businessLoyaltyPointsObj: any): Observable<any> {
    const apiUrl = `${LOYATLY_POINTS_API}/store`;

    return this.http
      .post<any>(apiUrl, businessLoyaltyPointsObj)
      .pipe(catchError(handleError('saveLoyaltyPoint')));
  }

  addLoyaltyPoints(businessLoyaltyPointsObj: any, callback): any {
    const apiUrl = `${REDEEMABLE_API}/redeem`;

    this.http
      .post<any>(apiUrl, businessLoyaltyPointsObj)
      .pipe(catchError(handleError('saveLoyaltyPoint')))
      .subscribe(resp => {
        if (resp.success) {
          const loyaltyPointBalance = resp.loyalty_points;
          this.store.dispatch(setValue({loyaltyPointBalance}));
        }
        callback(resp);
      });
  }

  getExistingTiers(): Observable<any> {
    const apiUrl = `${LOYATLY_POINTS_TIER_API}/index`;

    return this.http.get<any>(apiUrl).pipe(
      tap(existingTiers => {
        existingTiers.data.forEach(tier => {
          tier.entranceValue = tier.lp_entrance;
          this.existingTiers.push(tier);
        });
      }),
      catchError(handleError('existingTiers'))
    );
  }
}
