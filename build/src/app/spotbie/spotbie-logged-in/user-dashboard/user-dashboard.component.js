"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDashboardComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let UserDashboardComponent = class UserDashboardComponent {
    constructor(platform) {
        this.platform = platform;
        this.spawnCategoriesEvt = new core_1.EventEmitter();
        this.scannerStarted = false;
        this.isMobile = false;
        this.getRedeemableItems = false;
        this.isMobile = this.platform.is('mobile');
    }
    redeemedLp() {
        this.getRedeemableItems = true;
    }
    scrollToLpAppAnchor() {
        this.lpAppAnchor.nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }
    scrollToQrAppAnchor() {
        if (this.qrCodeAppAnchor) {
            this.qrCodeAppAnchor.nativeElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
        this.startQrScanner();
    }
    scrollToRewardMenuAppAnchor() {
        this.rewardMenuAppAnchor.nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }
    startQrScanner() {
        this.scannerStarted = true;
    }
    closeQrScanner() {
        this.scannerStarted = false;
    }
    closeRedeemables() {
        this.getRedeemableItems = false;
    }
    spawnCategories(category) {
        const obj = {
            category,
        };
        this.spawnCategoriesEvt.emit(obj);
    }
    closeAll() {
        //Close all the windows in the dashboard
        this.loyaltyPointsApp.closeThis();
        this.rewardMenuApp.closeWindow();
        this.qrApp.closeQr();
    }
};
tslib_1.__decorate([
    (0, core_1.Output)()
], UserDashboardComponent.prototype, "spawnCategoriesEvt", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('loyaltyPointsApp')
], UserDashboardComponent.prototype, "loyaltyPointsApp", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('rewardMenuApp')
], UserDashboardComponent.prototype, "rewardMenuApp", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('qrApp')
], UserDashboardComponent.prototype, "qrApp", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('redeemablesApp')
], UserDashboardComponent.prototype, "redeemablesApp", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('lpAppAnchor')
], UserDashboardComponent.prototype, "lpAppAnchor", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('rewardMenuAppAnchor')
], UserDashboardComponent.prototype, "rewardMenuAppAnchor", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('qrCodeAppAnchor')
], UserDashboardComponent.prototype, "qrCodeAppAnchor", void 0);
UserDashboardComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-user-dashboard',
        templateUrl: './user-dashboard.component.html',
        styleUrls: ['./user-dashboard.component.css'],
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
    })
], UserDashboardComponent);
exports.UserDashboardComponent = UserDashboardComponent;
//# sourceMappingURL=user-dashboard.component.js.map