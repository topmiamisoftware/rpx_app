"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeAccountModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const stripe_account_component_1 = require("./stripe-account.component");
let StripeAccountModule = class StripeAccountModule {
};
StripeAccountModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        declarations: [stripe_account_component_1.StripeAccountComponent],
        imports: [
            common_1.CommonModule
        ],
        exports: [stripe_account_component_1.StripeAccountComponent]
    })
], StripeAccountModule);
exports.StripeAccountModule = StripeAccountModule;
//# sourceMappingURL=stripe-account.module.js.map