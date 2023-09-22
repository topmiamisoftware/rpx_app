"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedeemableModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const angular_1 = require("@ionic/angular");
const redeemable_component_1 = require("./redeemable.component");
const router_1 = require("@angular/router");
let RedeemableModule = class RedeemableModule {
};
RedeemableModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        declarations: [redeemable_component_1.RedeemableComponent],
        imports: [
            common_1.CommonModule,
            angular_1.IonicModule,
            router_1.RouterModule.forChild([{ path: '', component: redeemable_component_1.RedeemableComponent }]),
        ],
    })
], RedeemableModule);
exports.RedeemableModule = RedeemableModule;
//# sourceMappingURL=redeemable.module.js.map