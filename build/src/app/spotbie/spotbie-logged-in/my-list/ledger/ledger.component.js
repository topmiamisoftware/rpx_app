"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let LedgerComponent = class LedgerComponent {
    constructor(loyaltyPointsService, loadingCtrl) {
        this.loyaltyPointsService = loyaltyPointsService;
        this.loadingCtrl = loadingCtrl;
        this.ledger$ = new rxjs_1.BehaviorSubject(false);
        this.lpLedgerList$ = new rxjs_1.BehaviorSubject([]);
        this.lpLedgerPage$ = new rxjs_1.BehaviorSubject(1);
        this.lpLedgerTotal$ = new rxjs_1.BehaviorSubject(0);
        this.loadMore$ = new rxjs_1.BehaviorSubject(false);
        this.loading$ = new rxjs_1.BehaviorSubject(false);
        this.initLoading();
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
    ngOnInit() {
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
        this.loading$.next(true);
        const getLedgerObj = {
            page: this.lpLedgerPage$.getValue(),
        };
        this.loyaltyPointsService.getLedger(getLedgerObj).subscribe({
            next: resp => {
                const ledgerData = resp.ledger.data;
                this.lpLedgerTotal$.next(ledgerData.length);
                const currentPage = resp.ledger.current_page;
                const lastPage = resp.ledger.last_page;
                this.lpLedgerPage$.next(currentPage);
                this.lpLedgerPage$.getValue() === lastPage
                    ? this.loadMore$.next(false)
                    : this.loadMore$.next(true);
                ledgerData.forEach((ledgerRecord) => {
                    this.lpLedgerList$.next([
                        ...this.lpLedgerList$.getValue(),
                        ledgerRecord,
                    ]);
                });
                this.loading$.next(false);
            },
            error: error => {
                console.log('getLedger', error);
            },
        });
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
LedgerComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-ledger',
        templateUrl: './ledger.component.html',
        styleUrls: ['./ledger.component.scss', '../my-list.component.css'],
    })
], LedgerComponent);
exports.LedgerComponent = LedgerComponent;
//# sourceMappingURL=ledger.component.js.map