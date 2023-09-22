"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoyaltyPointsComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const preferences_1 = require("@capacitor/preferences");
let LoyaltyPointsComponent = class LoyaltyPointsComponent {
    constructor(loyaltyPointsService, router) {
        this.loyaltyPointsService = loyaltyPointsService;
        this.router = router;
        this.closeWindow = new core_1.EventEmitter();
        this.openRedeemed = new core_1.EventEmitter();
        this.fullScreenWindow = true;
        this.userType = null;
        this.loyaltyPointBalance$ = this.loyaltyPointsService.userLoyaltyPoints$;
        this.init();
    }
    async init() {
        const retUserType = await preferences_1.Preferences.get({ key: 'spotbie_userType' });
        this.userType = parseInt(retUserType.value);
    }
    closeThis() {
        if (this.router.url.indexOf('scan') > -1) {
            this.router.navigate(['/user-home']);
        }
        else {
            this.closeWindow.emit();
        }
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