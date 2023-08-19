"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const environment_1 = require("../../../../environments/environment");
const redeemable_1 = require("../../../models/redeemable");
const business_1 = require("../../../models/business");
const QR_CODE_LOYALTY_POINTS_SCAN_BASE_URL = environment_1.environment.qrCodeLoyaltyPointsScanBaseUrl;
const QR_CODE_CALIM_REWARD_SCAN_BASE_URL = environment_1.environment.qrCodeRewardScanBaseUrl;
let QrComponent = class QrComponent {
    constructor(userAuthService, loyaltyPointsService, deviceDetectorService, formBuilder, rewardService) {
        this.userAuthService = userAuthService;
        this.loyaltyPointsService = loyaltyPointsService;
        this.deviceDetectorService = deviceDetectorService;
        this.formBuilder = formBuilder;
        this.rewardService = rewardService;
        this.fullScreenWindow = false;
        this.closeThisEvt = new core_1.EventEmitter();
        this.openUserLPBalanceEvt = new core_1.EventEmitter();
        this.closeQrUserEvt = new core_1.EventEmitter();
        this.notEnoughLpEvt = new core_1.EventEmitter();
        this.business = new business_1.Business();
        this.redeemable = new redeemable_1.Redeemable();
        this.qrType = 'url';
        this.isBusiness = false;
        this.userLoyaltyPoints = 0;
        this.loyaltyPointWorth = 0;
        this.businessLoyaltyPointsFormUp = false;
        this.rewardPrompted = false;
        this.rewardPrompt = false;
        this.qrCodeLoyaltyPointsBaseUrl = QR_CODE_LOYALTY_POINTS_SCAN_BASE_URL;
        this.qrCodeRewardBaseUrl = QR_CODE_CALIM_REWARD_SCAN_BASE_URL;
        this.businessLoyaltyPointsSubmitted = false;
        this.qrWidth = 0;
        this.scanSuccess = false;
        this.awarded = false;
        this.rewarded = false;
    }
    get totalSpent() {
        return this.businessLoyaltyPointsForm.get('totalSpent').value;
    }
    get f() {
        return this.businessLoyaltyPointsForm.controls;
    }
    getWindowClass() {
        if (this.fullScreenWindow) {
            return 'spotbie-overlay-window';
        }
        else {
            return '';
        }
    }
    addLp(addLpObj) {
        this.loyaltyPointsService.addLoyaltyPoints(addLpObj, resp => {
            this.scanSuccessHandlerCb(resp);
        });
    }
    claimReward(addLpObj) {
        this.rewardService.claimReward(addLpObj, resp => {
            this.claimRewardCb(resp);
        });
    }
    claimRewardCb(resp) {
        if (resp.success) {
            this.rewarded = true;
            this.reward = resp.reward;
            this.pointsCharged = this.reward.point_cost;
            this.sbEarnedPoints.nativeElement.style.display = 'block';
        }
        else {
            alert(resp.message);
        }
        this.scanSuccess = false;
    }
    scanSuccessHandler(urlString) {
        if (this.scanSuccess) {
            return;
        }
        this.scanSuccess = true;
        const url = new URL(urlString);
        const urlParams = new URLSearchParams(url.search);
        const redeemableType = urlParams.get('t');
        const addLpObj = {
            redeemableHash: urlParams.get('r'),
            redeemableType,
        };
        switch (redeemableType) {
            case 'lp':
                this.addLp(addLpObj);
                break;
            case 'claim_reward':
                this.claimReward(addLpObj);
                break;
        }
    }
    scanSuccessHandlerCb(resp) {
        if (resp.success) {
            this.awarded = true;
            this.userLoyaltyPoints = resp.redeemable.amount;
            this.sbEarnedPoints.nativeElement.style.display = 'block';
        }
        else {
            alert(resp.message);
        }
        this.scanSuccess = false;
    }
    scanErrorHandler(event) { }
    scanFailureHandler(event) {
        console.log('scan failure', event);
    }
    getQrCode() {
        this.loyaltyPointsService.getLoyaltyPointBalance();
        this.userAuthService.getSettings().subscribe(resp => {
            this.userHash = resp.user.hash;
            this.business.address = resp.business.address;
            this.business.name = resp.business.name;
            this.business.qr_code_link = resp.business.qr_code_link;
            this.business.trial_ends_at = resp.business.trial_ends_at;
        });
        const totalSpentValidators = [forms_1.Validators.required];
        this.businessLoyaltyPointsForm = this.formBuilder.group({
            totalSpent: ['', totalSpentValidators],
        });
        this.businessLoyaltyPointsFormUp = true;
    }
    startQrCodeScanner() {
        this.loyaltyPointsService.getLoyaltyPointBalance();
    }
    closeQr() {
        this.rewardPrompted = false;
    }
    closeQrUser() {
        this.closeQrUserEvt.emit(null);
    }
    ngOnInit() {
        if (this.deviceDetectorService.isMobile()) {
            this.qrWidth = 250;
        }
        else {
            this.qrWidth = 450;
        }
        this.startQrCodeScanner();
    }
};
tslib_1.__decorate([
    (0, core_1.Input)()
], QrComponent.prototype, "fullScreenWindow", void 0);
tslib_1.__decorate([
    (0, core_1.Output)()
], QrComponent.prototype, "closeThisEvt", void 0);
tslib_1.__decorate([
    (0, core_1.Output)()
], QrComponent.prototype, "openUserLPBalanceEvt", void 0);
tslib_1.__decorate([
    (0, core_1.Output)()
], QrComponent.prototype, "closeQrUserEvt", void 0);
tslib_1.__decorate([
    (0, core_1.Output)()
], QrComponent.prototype, "notEnoughLpEvt", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('sbEarnedPoints')
], QrComponent.prototype, "sbEarnedPoints", void 0);
QrComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-qr',
        templateUrl: './qr.component.html',
        styleUrls: ['./qr.component.css', '../reward-menu/reward-menu.component.css'],
    })
], QrComponent);
exports.QrComponent = QrComponent;
//# sourceMappingURL=qr.component.js.map