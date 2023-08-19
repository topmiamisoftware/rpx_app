"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedeemableModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const redeemable_component_1 = require("./redeemable.component");
let RedeemableModule = class RedeemableModule {
};
RedeemableModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        declarations: [redeemable_component_1.RedeemableComponent],
        imports: [
            common_1.CommonModule
        ],
        exports: [
            redeemable_component_1.RedeemableComponent
        ]
    })
], RedeemableModule);
exports.RedeemableModule = RedeemableModule;
//# sourceMappingURL=redeemable.module.js.map