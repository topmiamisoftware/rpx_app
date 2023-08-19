"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedeemableComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const account_type_enum_1 = require("../../../helpers/enum/account-type.enum");
const $ = require("jquery");
let RedeemableComponent = class RedeemableComponent {
    constructor(loyaltyPointsService) {
        this.loyaltyPointsService = loyaltyPointsService;
        this.closeWindowEvt = new core_1.EventEmitter();
        this.eAllowedAccountTypes = account_type_enum_1.AllowedAccountTypes;
        this.rewardList = [];
        this.rewardPage = 1;
        this.rewardTotal = 0;
        this.lpRedeemedList = [];
        this.lpRedeemedPage = 1;
        this.lpRedeemedTotal = 0;
        this.lpLedgerList = [];
        this.lpLedgerPage = 1;
        this.lpLedgerTotal = 0;
        this.balanceList = [];
        this.balanceListPage = 1;
        this.balanceListTotal = 0;
    }
    loadMoreItems() {
        if (this.rewards) {
            this.rewardPage = this.rewardPage + 1;
            this.getRewards();
        }
        else if (this.lpRedeemed) {
            this.lpRedeemedPage = this.lpRedeemedPage + 1;
            this.getRedeemed();
        }
        else if (this.ledger) {
            this.lpLedgerPage = this.lpLedgerPage + 1;
            this.getLedger();
        }
        else if (this.showBalanceList) {
            this.balanceListPage = this.balanceListPage + 1;
            this.getBalanceList();
        }
    }
    getBalanceListStyle() {
        if (this.showBalanceList) {
            return { 'background-color': 'rgb(80 216 120)' };
        }
    }
    getBalanceList() {
        const getBalanceListObj = {
            page: this.balanceListPage,
        };
        this.loyaltyPointsService.getBalanceList(getBalanceListObj).subscribe({
            next: resp => {
                const balanceListData = resp.balanceList.data;
                this.balanceListTotal = balanceListData.length;
                const currentPage = resp.balanceList.current_page;
                const lastPage = resp.balanceList.last_page;
                this.balanceListPage = currentPage;
                this.balanceListPage === lastPage
                    ? (this.loadMore = false)
                    : (this.loadMore = true);
                balanceListData.forEach((lpBalance) => {
                    this.balanceList.push(lpBalance);
                });
            },
            error: error => {
                console.log('getLedger', error);
            },
        });
    }
    getLedgerStyle() {
        if (this.ledger) {
            return { 'background-color': 'rgb(80 216 120)' };
        }
    }
    getLedger() {
        const getLedgerObj = {
            page: this.lpLedgerPage,
        };
        this.loyaltyPointsService.getLedger(getLedgerObj).subscribe({
            next: resp => {
                const ledgerData = resp.ledger.data;
                this.lpLedgerTotal = ledgerData.length;
                const currentPage = resp.ledger.current_page;
                const lastPage = resp.ledger.last_page;
                this.lpLedgerPage = currentPage;
                this.lpLedgerPage === lastPage
                    ? (this.loadMore = false)
                    : (this.loadMore = true);
                ledgerData.forEach((ledgerRecord) => {
                    this.lpLedgerList.push(ledgerRecord);
                });
            },
            error: error => {
                console.log('getLedger', error);
            },
        });
    }
    getRewardsStyle() {
        if (this.rewards) {
            return { 'background-color': 'rgb(80 216 120)' };
        }
    }
    getRewards() {
        const getRewardsObj = {
            page: this.rewardPage,
        };
        this.loyaltyPointsService.getRewards(getRewardsObj).subscribe({
            next: resp => {
                const rewardList = resp.rewardList.data;
                this.rewardTotal = rewardList.length;
                const currentPage = resp.rewardList.current_page;
                const lastPage = resp.rewardList.last_page;
                this.rewardPage = currentPage;
                this.rewardPage === lastPage
                    ? (this.loadMore = false)
                    : (this.loadMore = true);
                rewardList.forEach((redeemItem) => {
                    this.rewardList.push(redeemItem);
                });
                this.rewards = true;
            },
            error: error => {
                console.log('getRewards', error);
            },
        });
    }
    getRedeemedStyle() {
        if (this.lpRedeemed) {
            return { 'background-color': 'rgb(80 216 120)' };
        }
    }
    getRedeemed() {
        const getRedeemedObj = {
            page: this.lpRedeemedPage,
        };
        this.loyaltyPointsService.getRedeemed(getRedeemedObj).subscribe({
            next: resp => {
                const redeemItemData = resp.redeemedList.data;
                this.lpRedeemedTotal = redeemItemData.length;
                this.lpRedeemedPage = resp.redeemedList.current_page;
                const lastPage = resp.redeemedList.last_page;
                if (this.lpRedeemedPage === lastPage) {
                    this.loadMore = false;
                }
                else {
                    this.loadMore = true;
                }
                redeemItemData.forEach((redeemItem) => {
                    this.lpRedeemedList.push(redeemItem);
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
        if (this.rewards && this.rewardTotal > 0) {
            return true;
        }
        else if (this.lpRedeemed && this.lpRedeemedTotal > 0) {
            return true;
        }
        else if (this.ledger && this.lpLedgerTotal > 0) {
            return true;
        }
        else if (this.balanceList && this.balanceListTotal > 0) {
            return true;
        }
    }
    switchTab(tab) {
        this.rewards = false;
        this.lpRedeemed = false;
        this.ledger = false;
        this.showBalanceList = false;
        switch (tab) {
            case 'rewards':
                this.rewards = true;
                if (this.rewardPage === 1 && this.rewardList.length === 0) {
                    this.getRewards();
                }
                break;
            case 'lpRedeemed':
                this.lpRedeemed = true;
                if (this.lpRedeemedPage === 1 && this.lpRedeemedList.length === 0) {
                    this.getRedeemed();
                }
                break;
            case 'ledger':
                this.ledger = true;
                if (this.lpLedgerPage === 1 && this.lpLedgerList.length === 0) {
                    this.getLedger();
                }
                break;
            case 'balance-list':
                this.showBalanceList = true;
                if (this.balanceListPage === 1 && this.balanceList.length === 0) {
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
        this.showBalanceList = true;
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