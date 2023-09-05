"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const environment_1 = require("../../../../environments/environment");
const business_1 = require("../../../models/business");
const rxjs_1 = require("rxjs");
const barcode_scanner_1 = require("@capacitor-community/barcode-scanner");
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
        this.business$ = new rxjs_1.BehaviorSubject(null);
        this.redeemable$ = new rxjs_1.BehaviorSubject(null);
        this.userHash$ = new rxjs_1.BehaviorSubject(null);
        this.isBusiness$ = false;
        this.userLoyaltyPoints$ = new rxjs_1.BehaviorSubject(0);
        this.loyaltyPointWorth$ = new rxjs_1.BehaviorSubject(0);
        this.businessLoyaltyPointsFormUp$ = new rxjs_1.BehaviorSubject(false);
        this.rewardPrompted$ = new rxjs_1.BehaviorSubject(false);
        this.rewardPrompt$ = new rxjs_1.BehaviorSubject(false);
        this.loyaltyPointReward$ = new rxjs_1.BehaviorSubject(null);
        this.loyaltyPointRewardDollarValue$ = new rxjs_1.BehaviorSubject(null);
        this.qrCodeLink$ = new rxjs_1.BehaviorSubject(null);
        this.businessLoyaltyPointsSubmitted$ = new rxjs_1.BehaviorSubject(false);
        this.qrWidth$ = new rxjs_1.BehaviorSubject(0);
        this.scanSuccess$ = new rxjs_1.BehaviorSubject(false);
        this.awarded$ = new rxjs_1.BehaviorSubject(false);
        this.reward$ = new rxjs_1.BehaviorSubject(null);
        this.rewarded$ = new rxjs_1.BehaviorSubject(false);
        this.pointsCharged$ = new rxjs_1.BehaviorSubject(0);
        this.qrType = 'url';
        this.qrCodeLoyaltyPointsBaseUrl = QR_CODE_LOYALTY_POINTS_SCAN_BASE_URL;
        this.qrCodeRewardBaseUrl = QR_CODE_CALIM_REWARD_SCAN_BASE_URL;
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
            this.rewarded$.next(true);
            this.reward$.next(resp.reward);
            this.pointsCharged$.next(this.reward$.getValue().point_cost);
            this.sbEarnedPoints.nativeElement.style.display = 'block';
        }
        else {
            alert(resp.message);
        }
        this.scanSuccess$.next(false);
    }
    async checkPermission() {
        // check if user already granted permission
        const status = await barcode_scanner_1.BarcodeScanner.checkPermission({ force: false });
        if (status.granted) {
            // user granted permission
            return true;
        }
        if (status.denied) {
            // user denied permission
            return false;
        }
        if (status.asked) {
            // system requested the user for permission during this call
            // only possible when force set to true
        }
        if (status.neverAsked) {
            // user has not been requested this permission before
            // it is advised to show the user some sort of prompt
            // this way you will not waste your only chance to ask for the permission
            const c = confirm('We need your permission to use your camera to be able to scan barcodes');
            if (!c) {
                return false;
            }
        }
        if (status.restricted || status.unknown) {
            // ios only
            // probably means the permission has been denied
            return false;
        }
        // user has not denied permission
        // but the user also has not yet granted the permission
        // so request it
        const statusRequest = await barcode_scanner_1.BarcodeScanner.checkPermission({ force: true });
        if (statusRequest.asked) {
            // system requested the user for permission during this call
            // only possible when force set to true
        }
        if (statusRequest.granted) {
            // the user did grant the permission now
            return true;
        }
        // user did not grant the permission, so he must have declined the request
        return false;
    }
    scanSuccessHandler(urlString) {
        if (this.scanSuccess$.getValue()) {
            return;
        }
        this.scanSuccess$.next(true);
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
            this.awarded$.next(true);
            this.userLoyaltyPoints$.next(resp.redeemable.amount);
            this.sbEarnedPoints.nativeElement.style.display = 'block';
        }
        else {
            alert(resp.message);
        }
        this.scanSuccess$.next(false);
    }
    scanErrorHandler(event) { }
    scanFailureHandler(event) {
        console.log('scan failure', event);
    }
    getQrCode() {
        this.loyaltyPointsService.getLoyaltyPointBalance();
        this.userAuthService.getSettings().subscribe(resp => {
            this.userHash$.next(resp.user.hash);
            this.business$.next({
                ...new business_1.Business(),
                address: resp.business.address,
                name: resp.business.name,
                qr_code_link: resp.business.qr_code_link,
                trial_ends_at: resp.business.trial_ends_at,
            });
        });
        const totalSpentValidators = [forms_1.Validators.required];
        this.businessLoyaltyPointsForm = this.formBuilder.group({
            totalSpent: ['', totalSpentValidators],
        });
        this.businessLoyaltyPointsFormUp$.next(true);
    }
    async startQrCodeScanner() {
        this.loyaltyPointsService.getLoyaltyPointBalance();
        barcode_scanner_1.BarcodeScanner.hideBackground();
        const result = await barcode_scanner_1.BarcodeScanner.startScan();
        if (result.hasContent) {
            console.log(result.content);
        }
    }
    closeQr() {
        this.rewardPrompted$.next(false);
    }
    closeQrUser() {
        this.closeQrUserEvt.emit(null);
    }
    ngOnInit() {
        if (this.deviceDetectorService.isMobile()) {
            this.qrWidth$.next(250);
        }
        else {
            this.qrWidth$.next(450);
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