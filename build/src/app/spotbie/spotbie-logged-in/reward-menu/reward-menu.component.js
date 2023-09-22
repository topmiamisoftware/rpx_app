"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RewardMenuComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const account_type_enum_1 = require("../../../helpers/enum/account-type.enum");
const environment_1 = require("../../../../environments/environment");
const rxjs_1 = require("rxjs");
const preferences_1 = require("@capacitor/preferences");
let RewardMenuComponent = class RewardMenuComponent {
    constructor(businessMenuService, router, route) {
        this.businessMenuService = businessMenuService;
        this.router = router;
        this.rewardAppFullScreen = false;
        this.fullScreenMode = true;
        this.qrCodeLink = null;
        this.closeWindowEvt = new core_1.EventEmitter();
        this.notEnoughLpEvt = new core_1.EventEmitter();
        this.eAllowedAccountTypes = account_type_enum_1.AllowedAccountTypes;
        this.rewardApp$ = new rxjs_1.BehaviorSubject(false);
        this.userPointToDollarRatio$ = new rxjs_1.BehaviorSubject(null);
        this.rewards$ = new rxjs_1.BehaviorSubject(null);
        this.reward$ = new rxjs_1.BehaviorSubject(null);
        this.userType$ = new rxjs_1.BehaviorSubject(null);
        this.business$ = new rxjs_1.BehaviorSubject(null);
        this.isLoggedIn$ = new rxjs_1.BehaviorSubject(null);
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
            this.rewards$.next(resp.rewards);
            this.userPointToDollarRatio$.next((resp.loyalty_point_dollar_percent_value));
            this.business$.next(resp.business);
        }
    }
    closeWindow() {
        this.closeWindowEvt.emit();
    }
    openReward(reward) {
        reward.link = `${environment_1.environment.baseUrl}business-menu/${this.qrCodeLink}/${reward.uuid}`;
        this.reward$.next(reward);
        this.rewardApp$.next(true);
    }
    closeReward() {
        this.reward$.next(null);
        this.rewardApp$.next(false);
    }
    rewardTileStyling(reward) {
        if (reward.type === 0) {
            return { background: 'url(' + reward.images + ')' };
        }
        else {
            return { background: 'linear-gradient(90deg,#35a99f,#64e56f)' };
        }
    }
    async ngOnInit() {
        const userRet = await preferences_1.Preferences.get({ key: 'spotbie_userType' });
        this.userType$.next(parseInt(userRet.value));
        const retUserLoggedIn = await preferences_1.Preferences.get({ key: 'spotbie_loggedIn' });
        this.isLoggedIn$.next(retUserLoggedIn.value);
        if (this.userType$.getValue() !== this.eAllowedAccountTypes.Personal) {
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