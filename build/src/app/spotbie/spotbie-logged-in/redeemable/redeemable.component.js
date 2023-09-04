"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedeemableComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const account_type_enum_1 = require("../../../helpers/enum/account-type.enum");
const $ = require("jquery");
const rxjs_1 = require("rxjs");
let RedeemableComponent = class RedeemableComponent {
    constructor(loyaltyPointsService) {
        this.loyaltyPointsService = loyaltyPointsService;
        this.closeWindowEvt = new core_1.EventEmitter();
        this.eAllowedAccountTypes = account_type_enum_1.AllowedAccountTypes;
        this.rewards$ = new rxjs_1.BehaviorSubject(false);
        this.rewardList$ = new rxjs_1.BehaviorSubject([]);
        this.rewardPage$ = new rxjs_1.BehaviorSubject(1);
        this.rewardTotal$ = new rxjs_1.BehaviorSubject(0);
        this.lpRedeemed$ = new rxjs_1.BehaviorSubject(false);
        this.lpRedeemedList$ = new rxjs_1.BehaviorSubject([]);
        this.lpRedeemedPage$ = new rxjs_1.BehaviorSubject(1);
        this.lpRedeemedTotal$ = new rxjs_1.BehaviorSubject(0);
        this.ledger$ = new rxjs_1.BehaviorSubject(false);
        this.lpLedgerList$ = new rxjs_1.BehaviorSubject([]);
        this.lpLedgerPage$ = new rxjs_1.BehaviorSubject(1);
        this.lpLedgerTotal$ = new rxjs_1.BehaviorSubject(0);
        this.showBalanceList$ = new rxjs_1.BehaviorSubject(false);
        this.balanceList$ = new rxjs_1.BehaviorSubject([]);
        this.balanceListPage$ = new rxjs_1.BehaviorSubject(1);
        this.balanceListTotal$ = new rxjs_1.BehaviorSubject(0);
        this.loadMore$ = new rxjs_1.BehaviorSubject(false);
    }
    loadMoreItems() {
        if (this.rewards$.getValue()) {
            this.rewardPage$.next(this.rewardPage$.getValue() + 1);
            this.getRewards();
        }
        else if (this.lpRedeemed$.getValue()) {
            this.lpRedeemedPage$.next(this.lpRedeemedPage$.getValue() + 1);
            this.getRedeemed();
        }
        else if (this.ledger$.getValue()) {
            this.lpLedgerPage$.next(this.lpLedgerPage$.getValue() + 1);
            this.getLedger();
        }
        else if (this.showBalanceList$.getValue()) {
            this.balanceListPage$.next(this.balanceListPage$.getValue() + 1);
            this.getBalanceList();
        }
    }
    getBalanceListStyle() {
        if (this.showBalanceList$.getValue()) {
            return { 'background-color': 'rgb(80 216 120)' };
        }
    }
    getBalanceList() {
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
            },
            error: error => {
                console.log('getLedger', error);
            },
        });
    }
    getLedgerStyle() {
        if (this.ledger$.getValue()) {
            return { 'background-color': 'rgb(80 216 120)' };
        }
    }
    getLedger() {
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
            },
            error: error => {
                console.log('getLedger', error);
            },
        });
    }
    getRewardsStyle() {
        if (this.rewards$.getValue()) {
            return { 'background-color': 'rgb(80 216 120)' };
        }
    }
    getRewards() {
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
            },
            error: error => {
                console.log('getRewards', error);
            },
        });
    }
    getRedeemedStyle() {
        if (this.lpRedeemed$.getValue()) {
            return { 'background-color': 'rgb(80 216 120)' };
        }
    }
    getRedeemed() {
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
            },
            error: error => {
                console.log('getRedeemed', error);
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
    showLoadMore() {
        if (this.rewards$.getValue() && this.rewardTotal$.getValue() > 0) {
            return true;
        }
        else if (this.lpRedeemed$.getValue() &&
            this.lpRedeemedTotal$.getValue() > 0) {
            return true;
        }
        else if (this.ledger$.getValue() && this.lpLedgerTotal$.getValue() > 0) {
            return true;
        }
        else if (this.balanceList$.getValue() &&
            this.balanceListTotal$.getValue() > 0) {
            return true;
        }
    }
    switchTab(tab) {
        this.rewards$.next(false);
        this.lpRedeemed$.next(false);
        this.ledger$.next(false);
        this.showBalanceList$.next(false);
        switch (tab) {
            case 'rewards':
                this.rewards$.next(true);
                if (this.rewardPage$.getValue() === 1 &&
                    this.rewardList$.getValue().length === 0) {
                    this.getRewards();
                }
                break;
            case 'lpRedeemed':
                this.lpRedeemed$.next(true);
                if (this.lpRedeemedPage$.getValue() === 1 &&
                    this.lpRedeemedList$.getValue().length === 0) {
                    this.getRedeemed();
                }
                break;
            case 'ledger':
                this.ledger$.next(true);
                if (this.lpLedgerPage$.getValue() === 1 &&
                    this.lpLedgerList$.getValue().length === 0) {
                    this.getLedger();
                }
                break;
            case 'balance-list':
                this.showBalanceList$.next(true);
                if (this.balanceListPage$.getValue() === 1 &&
                    this.balanceList$.getValue().length === 0) {
                    this.getBalanceList();
                }
                break;
        }
    }
    closeWindow() {
        this.closeWindowEvt.emit();
    }
    ngOnInit() {
        this.userType = localStorage.getItem('spotbie_userType');
        this.showBalanceList$.next(true);
        this.getBalanceList();
    }
    ngAfterViewInit() {
        const menuHeight = document.getElementById('spotbie-topMenu').offsetHeight;
        document.getElementById('redeemWindow').style.paddingTop =
            menuHeight + 'px';
        const redeemWindowNavItem = $('#redeemWindowNav').height();
        document.getElementById('redeemWindowNavMargin').style.marginBottom =
            (redeemWindowNavItem + 20).toString() + 'px';
    }
};
tslib_1.__decorate([
    (0, core_1.Output)()
], RedeemableComponent.prototype, "closeWindowEvt", void 0);
RedeemableComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-redeemable',
        templateUrl: './redeemable.component.html',
        styleUrls: ['./redeemable.component.css'],
    })
], RedeemableComponent);
exports.RedeemableComponent = RedeemableComponent;
//# sourceMappingURL=redeemable.component.js.map