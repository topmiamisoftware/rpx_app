"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const ledger_component_1 = require("./ledger.component");
const angular_1 = require("@ionic/angular");
const router_1 = require("@angular/router");
let LedgerModule = class LedgerModule {
};
LedgerModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        declarations: [ledger_component_1.LedgerComponent],
        imports: [
            common_1.CommonModule,
            angular_1.IonicModule,
            router_1.RouterModule.forChild([{ path: '', component: ledger_component_1.LedgerComponent }]),
        ],
    })
], LedgerModule);
exports.LedgerModule = LedgerModule;
//# sourceMappingURL=ledger.module.js.map