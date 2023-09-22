"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalancesComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let BalancesComponent = class BalancesComponent {
    constructor(loyaltyPointsService, loadingCtrl) {
        this.loyaltyPointsService = loyaltyPointsService;
        this.loadingCtrl = loadingCtrl;
        this.showBalanceList$ = new rxjs_1.BehaviorSubject(false);
        this.balanceList$ = new rxjs_1.BehaviorSubject([]);
        this.balanceListPage$ = new rxjs_1.BehaviorSubject(1);
        this.balanceListTotal$ = new rxjs_1.BehaviorSubject(0);
        this.loadMore$ = new rxjs_1.BehaviorSubject(false);
        this.loading$ = new rxjs_1.BehaviorSubject(false);
        this.initLoading();
    }
    ngOnInit() {
        this.showBalanceList$.next(true);
        this.getBalanceList();
    }
    initLoading() {
        this.loading$
            .pipe((0, operators_1.filter)(loading => loading !== undefined))
            .subscribe(async (loading) => {
            if (loading) {
                this.loader = await this.loadingCtrl.create({
                    message: 'LOADING...',
                });
                this.loader.present();
            }
            else {
                if (this.loader) {
                    this.loader.dismiss();
                    this.loader = null;
                }
            }
        });
    }
    getBalanceList() {
        this.loading$.next(true);
        const getBalanceListObj = {
            page: this.balanceListPage$.getValue(),
        };
        this.loyaltyPointsService.getBalanceList(getBalanceListObj).subscribe({
            next: resp => {
                const balanceListData = resp.balanceList.data;
                this.balanceListTotal$.next(balanceListData.length);
                const currentPage = resp.balanceList.current_page;
                const lastPage = resp.balanceList.last_page;
                this.balanceListPage$.next(currentPage);
                this.balanceListPage$.getValue() === lastPage
                    ? this.loadMore$.next(false)
                    : this.loadMore$.next(true);
                balanceListData.forEach((lpBalance) => {
                    this.balanceList$.next([...this.balanceList$.getValue(), lpBalance]);
                });
                this.loading$.next(false);
            },
            error: error => {
                console.log('getLedger', error);
            },
        });
    }
    loadMoreItems() {
        this.balanceListPage$.next(this.balanceListPage$.getValue() + 1);
        this.getBalanceList();
    }
    getBalanceListStyle() {
        if (this.showBalanceList$.getValue()) {
            return { 'background-color': 'rgb(80 216 120)' };
        }
    }
    showLoadMore() {
        if (this.balanceList$.getValue() && this.balanceListTotal$.getValue() > 0) {
            return true;
        }
    }
    getLpStyle(lpPoints) {
        if (lpPoints < 0) {
            return 'sb-text-red-gradient';
        }
        else {
            return 'sb-text-light-green-gradient';
        }
    }
};
BalancesComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-balances',
        templateUrl: './balances.component.html',
        styleUrls: ['./balances.component.scss', '../my-list.component.css'],
    })
], BalancesComponent);
exports.BalancesComponent = BalancesComponent;
//# sourceMappingURL=balances.component.js.map