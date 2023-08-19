"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const forgot_password_component_1 = require("./forgot-password.component");
const router_1 = require("@angular/router");
const helper_module_1 = require("../../../helpers/helper.module");
const http_1 = require("@angular/common/http");
const forms_1 = require("@angular/forms");
const routes = [
    { path: 'password', component: forgot_password_component_1.ForgotPasswordComponent },
    { path: 'password/reset/:token', component: forgot_password_component_1.ForgotPasswordComponent },
];
let ForgotPasswordModule = class ForgotPasswordModule {
};
ForgotPasswordModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        declarations: [forgot_password_component_1.ForgotPasswordComponent],
        imports: [
            common_1.CommonModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule,
            http_1.HttpClientModule,
            helper_module_1.HelperModule,
            router_1.RouterModule.forChild(routes),
        ],
        exports: [forgot_password_component_1.ForgotPasswordComponent],
        providers: [],
    })
], ForgotPasswordModule);
exports.ForgotPasswordModule = ForgotPasswordModule;
//# sourceMappingURL=forgot-password.module.js.map