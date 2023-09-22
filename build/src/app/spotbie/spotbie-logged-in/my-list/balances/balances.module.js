"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalancesModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const balances_component_1 = require("./balances.component");
const angular_1 = require("@ionic/angular");
const router_1 = require("@angular/router");
let BalancesModule = class BalancesModule {
};
BalancesModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        declarations: [balances_component_1.BalancesComponent],
        imports: [
            common_1.CommonModule,
            angular_1.IonicModule,
            router_1.RouterModule.forChild([{ path: '', component: balances_component_1.BalancesComponent }]),
        ],
    })
], BalancesModule);
exports.BalancesModule = BalancesModule;
//# sourceMappingURL=balances.module.js.map