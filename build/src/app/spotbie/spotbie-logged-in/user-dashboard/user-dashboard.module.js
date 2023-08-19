"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDashboardModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const loyalty_points_module_1 = require("../loyalty-points/loyalty-points.module");
const reward_menu_module_1 = require("../reward-menu/reward-menu.module");
const router_1 = require("@angular/router");
const qr_module_1 = require("../qr/qr.module");
const user_dashboard_component_1 = require("./user-dashboard.component");
const redeemable_module_1 = require("../redeemable/redeemable.module");
let UserDashboardModule = class UserDashboardModule {
};
UserDashboardModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        declarations: [
            user_dashboard_component_1.UserDashboardComponent
        ],
        imports: [
            common_1.CommonModule,
            loyalty_points_module_1.LoyaltyPointsModule,
            reward_menu_module_1.RewardMenuModule,
            router_1.RouterModule,
            qr_module_1.QrModule,
            redeemable_module_1.RedeemableModule
        ],
        exports: [
            user_dashboard_component_1.UserDashboardComponent
        ]
    })
], UserDashboardModule);
exports.UserDashboardModule = UserDashboardModule;
//# sourceMappingURL=user-dashboard.module.js.map