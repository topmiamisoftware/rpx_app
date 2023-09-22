"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedeemedComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let RedeemedComponent = class RedeemedComponent {
    constructor(loyaltyPointsService, loadingCtrl) {
        this.loyaltyPointsService = loyaltyPointsService;
        this.loadingCtrl = loadingCtrl;
        this.lpRedeemed$ = new rxjs_1.BehaviorSubject(false);
        this.lpRedeemedList$ = new rxjs_1.BehaviorSubject([]);
        this.lpRedeemedPage$ = new rxjs_1.BehaviorSubject(1);
        this.lpRedeemedTotal$ = new rxjs_1.BehaviorSubject(0);
        this.loadMore$ = new rxjs_1.BehaviorSubject(false);
        this.loading$ = new rxjs_1.BehaviorSubject(false);
        this.initLoading();
    }
    ngOnInit() {
        this.lpRedeemed$.next(true);
        this.getRedeemed();
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
    getRedeemedStyle() {
        if (this.lpRedeemed$.getValue()) {
            return { 'background-color': 'rgb(80 216 120)' };
        }
    }
    getRedeemed() {
        this.loading$.next(true);
        const getRedeemedObj = {
            page: this.lpRedeemedPage$.getValue(),
        };
        this.loyaltyPointsService.getRedeemed(getRedeemedObj).subscribe({
            next: resp => {
                const redeemItemData = resp.redeemedList.data;
                this.lpRedeemedTotal$.next(redeemItemData.length);
                this.lpRedeemedPage$.next(resp.redeemedList.current_page);
                const lastPage = resp.redeemedList.last_page;
                if (this.lpRedeemedPage$.getValue() === lastPage) {
                    this.loadMore$.next(false);
                }
                else {
                    this.loadMore$.next(true);
                }
                redeemItemData.forEach((redeemItem) => {
                    this.lpRedeemedList$.next([
                        ...this.lpRedeemedList$.getValue(),
                        redeemItem,
                    ]);
                });
                this.loading$.next(false);
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
};
RedeemedComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-redeemed',
        templateUrl: './redeemed.component.html',
        styleUrls: ['./redeemed.component.scss', '../my-list.component.css'],
    })
], RedeemedComponent);
exports.RedeemedComponent = RedeemedComponent;
//# sourceMappingURL=redeemed.component.js.map