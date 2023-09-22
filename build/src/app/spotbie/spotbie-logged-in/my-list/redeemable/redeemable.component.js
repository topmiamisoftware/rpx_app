"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedeemableComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let RedeemableComponent = class RedeemableComponent {
    constructor(loyaltyPointsService, loadingCtrl) {
        this.loyaltyPointsService = loyaltyPointsService;
        this.loadingCtrl = loadingCtrl;
        this.closeWindowEvt = new core_1.EventEmitter();
        this.rewards$ = new rxjs_1.BehaviorSubject(false);
        this.rewardList$ = new rxjs_1.BehaviorSubject([]);
        this.rewardPage$ = new rxjs_1.BehaviorSubject(1);
        this.rewardTotal$ = new rxjs_1.BehaviorSubject(0);
        this.loadMore$ = new rxjs_1.BehaviorSubject(false);
        this.loading$ = new rxjs_1.BehaviorSubject(false);
        this.initLoading();
    }
    ngOnInit() {
        this.rewards$.next(true);
        this.getRewards();
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
    loadMoreItems() {
        if (this.rewards$.getValue()) {
            this.rewardPage$.next(this.rewardPage$.getValue() + 1);
            this.getRewards();
        }
    }
    getRewards() {
        this.loading$.next(true);
        const getRewardsObj = {
            page: this.rewardPage$.getValue(),
        };
        this.loyaltyPointsService.getRewards(getRewardsObj).subscribe({
            next: resp => {
                const rewardList = resp.rewardList.data;
                this.rewardTotal$.next(rewardList.length);
                const currentPage = resp.rewardList.current_page;
                const lastPage = resp.rewardList.last_page;
                this.rewardPage$.next(currentPage);
                this.rewardPage$.getValue() === lastPage
                    ? this.loadMore$.next(false)
                    : this.loadMore$.next(true);
                rewardList.forEach((redeemItem) => {
                    this.rewardList$.next([...this.rewardList$.getValue(), redeemItem]);
                });
                this.rewards$.next(true);
                this.loading$.next(false);
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
};
tslib_1.__decorate([
    (0, core_1.Output)()
], RedeemableComponent.prototype, "closeWindowEvt", void 0);
RedeemableComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-redeemable',
        templateUrl: './redeemable.component.html',
        styleUrls: ['./redeemable.component.css', '../my-list.component.css'],
    })
], RedeemableComponent);
exports.RedeemableComponent = RedeemableComponent;
//# sourceMappingURL=redeemable.component.js.map