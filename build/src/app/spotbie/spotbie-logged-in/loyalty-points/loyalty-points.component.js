"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoyaltyPointsComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const account_type_enum_1 = require("../../../helpers/enum/account-type.enum");
let LoyaltyPointsComponent = class LoyaltyPointsComponent {
    constructor(loyaltyPointsService, formBuilder, router, route) {
        this.loyaltyPointsService = loyaltyPointsService;
        this.formBuilder = formBuilder;
        this.router = router;
        this.closeWindow = new core_1.EventEmitter();
        this.openRedeemed = new core_1.EventEmitter();
        this.fullScreenWindow = true;
        this.eAllowedAccountTypes = account_type_enum_1.AllowedAccountTypes;
        this.userLoyaltyPoints = 0;
        this.loading = false;
        this.userResetBalance = 0;
        this.userPointToDollarRatio = 0;
        this.businessAccount = false;
        this.businessLoyaltyPointsOpen = false;
        this.personalLoyaltyPointsOpen = false;
        this.businessLoyaltyPointsFormUp = false;
        this.businessLoyaltyPointsSubmitted = false;
        this.monthlyDollarValueCalculated = false;
        this.helpEnabled = false;
        this.qrCodeLink = null;
        this.userHash = null;
        this.loyaltyPointReward = null;
        this.totalSpent = null;
        this.newUserLoyaltyPoints = null;
        this.userType = null;
        this.loyaltyPointBalance$ = this.loyaltyPointsService.userLoyaltyPoints$;
        if (this.router.url.indexOf('scan') > -1) {
            this.qrCodeLink = route.snapshot.params.qrCode;
            this.loyaltyPointReward = route.snapshot.params.loyaltyPointReward;
            this.totalSpent = route.snapshot.params.totalSpent;
            this.userHash = route.snapshot.params.userHash;
        }
        this.userType = parseInt(localStorage.getItem('spotbie_userType'));
        this.loading = false;
        //this.getRedeemed()
    }
    getWindowClass() {
        if (this.fullScreenWindow) {
            return 'spotbie-overlay-window d-flex align-items-center justify-content-center';
        }
        else {
            return '';
        }
    }
    /* TO-DO: Create a function which shows a business's or personal account' past transactions. */
    fetchLedger() { }
    /* TO-DO: Create a function which shows a business's or personal account' past expenses. */
    fetchExpenses() { }
    loyaltyPointsClass() {
        if (this.userType !== account_type_enum_1.AllowedAccountTypes.Personal) {
            return 'sb-loyalty-points cursor-pointer';
        }
        else {
            return 'sb-loyalty-points no-cursor';
        }
    }
    initPersonalLoyaltyPoints() {
        this.personalLoyaltyPointsOpen = true;
    }
    initBusinessLoyaltyPoints() {
        if (this.userType === account_type_enum_1.AllowedAccountTypes.Personal) {
            this.openRedeemed.emit();
            return;
        }
    }
    closeBusinessLoyaltyPoints() {
        this.businessLoyaltyPointsOpen = false;
    }
    closeThis() {
        if (this.router.url.indexOf('scan') > -1) {
            this.router.navigate(['/user-home']);
        }
        else {
            this.closeWindow.emit();
        }
    }
    toggleHelp() {
        this.helpEnabled = !this.helpEnabled;
    }
};
tslib_1.__decorate([
    (0, core_1.Output)()
], LoyaltyPointsComponent.prototype, "closeWindow", void 0);
tslib_1.__decorate([
    (0, core_1.Output)()
], LoyaltyPointsComponent.prototype, "openRedeemed", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], LoyaltyPointsComponent.prototype, "fullScreenWindow", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('newBalanceLoyaltyPoints')
], LoyaltyPointsComponent.prototype, "newBalanceLoyaltyPoints", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('businessLoyaltyPointsInfo')
], LoyaltyPointsComponent.prototype, "businessLoyaltyPointsInfo", void 0);
LoyaltyPointsComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-loyalty-points',
        templateUrl: './loyalty-points.component.html',
        styleUrls: ['./loyalty-points.component.css'],
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
    })
], LoyaltyPointsComponent);
exports.LoyaltyPointsComponent = LoyaltyPointsComponent;
//# sourceMappingURL=loyalty-points.component.js.map