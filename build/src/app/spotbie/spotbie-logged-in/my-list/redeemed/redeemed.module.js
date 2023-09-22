"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedeemedModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const angular_1 = require("@ionic/angular");
const redeemed_component_1 = require("./redeemed.component");
const router_1 = require("@angular/router");
let RedeemedModule = class RedeemedModule {
};
RedeemedModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        declarations: [redeemed_component_1.RedeemedComponent],
        imports: [
            common_1.CommonModule,
            angular_1.IonicModule,
            router_1.RouterModule.forChild([{ path: '', component: redeemed_component_1.RedeemedComponent }]),
        ],
    })
], RedeemedModule);
exports.RedeemedModule = RedeemedModule;
//# sourceMappingURL=redeemed.module.js.map