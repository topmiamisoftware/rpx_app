"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const http_1 = require("@angular/common/http");
const menu_component_1 = require("./menu.component");
const forms_1 = require("@angular/forms");
// import {EmailConfirmationComponent} from './email-confirmation/email-confirmation.component';
const helper_module_1 = require("../helpers/helper.module");
const router_1 = require("@angular/router");
const menu_logged_in_module_1 = require("./spotbie-logged-in/menu-logged-in.module");
const menu_logged_out_module_1 = require("./spotbie-logged-out/menu-logged-out.module");
let MenuModule = class MenuModule {
};
MenuModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        declarations: [menu_component_1.MenuComponent],
        imports: [
            common_1.CommonModule,
            menu_logged_in_module_1.MenuLoggedInModule,
            menu_logged_out_module_1.MenuLoggedOutModule,
            http_1.HttpClientModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule,
            helper_module_1.HelperModule,
            router_1.RouterModule,
        ],
        exports: [menu_component_1.MenuComponent],
    })
], MenuModule);
exports.MenuModule = MenuModule;
//# sourceMappingURL=menu.module.js.map