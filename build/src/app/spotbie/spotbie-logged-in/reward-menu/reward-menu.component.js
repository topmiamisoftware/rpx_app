"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardMenuComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const account_type_enum_1 = require("../../../helpers/enum/account-type.enum");
const business_1 = require("../../../models/business");
const environment_1 = require("../../../../environments/environment");
const rxjs_1 = require("rxjs");
let RewardMenuComponent = class RewardMenuComponent {
    constructor(loyaltyPointsService, businessMenuService, router, route) {
        this.loyaltyPointsService = loyaltyPointsService;
        this.businessMenuService = businessMenuService;
        this.router = router;
        this.rewardAppFullScreen = false;
        this.fullScreenMode = true;
        this.qrCodeLink = null;
        this.closeWindowEvt = new core_1.EventEmitter();
        this.notEnoughLpEvt = new core_1.EventEmitter();
        this.eAllowedAccountTypes = account_type_enum_1.AllowedAccountTypes;
        this.itemCreator = false;
        this.rewardApp$ = new rxjs_1.BehaviorSubject(false);
        this.rewards$ = new rxjs_1.BehaviorSubject(null);
        this.reward$ = new rxjs_1.BehaviorSubject(null);
        this.userType = null;
        this.business = new business_1.Business();
        this.isLoggedIn = null;
        if (this.router.url.indexOf('business-menu') > -1) {
            this.qrCodeLink = route.snapshot.params.qrCode;
        }
    }
    getWindowClass() {
        if (this.fullScreenMode) {
            return 'spotbie-overlay-window';
        }
        else {
            return '';
        }
    }
    fetchRewards(qrCodeLink = null) {
        let fetchRewardsReq = null;
        fetchRewardsReq = {
            qrCodeLink: this.qrCodeLink,
        };
        this.businessMenuService.fetchRewards(fetchRewardsReq).subscribe(resp => {
            this.fetchRewardsCb(resp);
        });
    }
    async fetchRewardsCb(resp) {
        if (resp.success) {
            console.log('RWARDS', resp.rewards);
            this.rewards$.next(resp.rewards);
            if (this.userType === this.eAllowedAccountTypes.Personal ||
                this.isLoggedIn !== '1') {
                this.userPointToDollarRatio = resp.loyalty_point_dollar_percent_value;
                this.business = resp.business;
            }
        }
    }
    addItem() {
        if (this.loyaltyPointsBalance.balance === 0) {
            this.notEnoughLpEvt.emit();
            this.closeWindow();
            return;
        }
        this.itemCreator = !this.itemCreator;
    }
    closeWindow() {
        this.closeWindowEvt.emit();
    }
    openReward(reward) {
        console.log('reward', reward);
        reward.link = `${environment_1.environment.baseUrl}business-menu/${this.qrCodeLink}/${reward.uuid}`;
        this.reward$.next(reward);
        this.rewardApp$.next(true);
    }
    closeReward() {
        this.reward$.next(null);
        this.rewardApp$.next(false);
    }
    editReward(reward) {
        this.reward$.next(reward);
        this.itemCreator = true;
    }
    closeRewardCreator() {
        this.reward$.next(null);
        this.itemCreator = false;
    }
    closeRewardCreatorAndRefetchRewardList() {
        this.closeRewardCreator();
        this.fetchRewards();
    }
    rewardTileStyling(reward) {
        if (reward.type === 0) {
            return { background: 'url(' + reward.images + ')' };
        }
        else {
            return { background: 'linear-gradient(90deg,#35a99f,#64e56f)' };
        }
    }
    ngOnInit() {
        this.userType = parseInt(localStorage.getItem('spotbie_userType'));
        this.isLoggedIn = localStorage.getItem('spotbie_loggedIn');
        if (this.userType !== this.eAllowedAccountTypes.Personal) {
            this.fetchRewards();
        }
        else {
            this.fetchRewards(this.qrCodeLink);
        }
    }
};
tslib_1.__decorate([
    (0, core_1.ViewChild)('rewardCreator')
], RewardMenuComponent.prototype, "rewardCreator", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('appRewardViewer')
], RewardMenuComponent.prototype, "appRewardViewer", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], RewardMenuComponent.prototype, "rewardAppFullScreen", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], RewardMenuComponent.prototype, "fullScreenMode", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], RewardMenuComponent.prototype, "loyaltyPoints", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], RewardMenuComponent.prototype, "qrCodeLink", void 0);
tslib_1.__decorate([
    (0, core_1.Output)()
], RewardMenuComponent.prototype, "closeWindowEvt", void 0);
tslib_1.__decorate([
    (0, core_1.Output)()
], RewardMenuComponent.prototype, "notEnoughLpEvt", void 0);
RewardMenuComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-reward-menu',
        templateUrl: './reward-menu.component.html',
        styleUrls: ['./reward-menu.component.css'],
    })
], RewardMenuComponent);
exports.RewardMenuComponent = RewardMenuComponent;
//# sourceMappingURL=reward-menu.component.js.map