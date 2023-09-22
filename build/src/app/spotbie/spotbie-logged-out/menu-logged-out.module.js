"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuLoggedOutModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const router_1 = require("@angular/router");
const http_1 = require("@angular/common/http");
const forms_1 = require("@angular/forms");
const menu_logged_out_component_1 = require("./menu-logged-out.component");
const log_in_component_1 = require("./log-in/log-in.component");
const angular_fontawesome_1 = require("@fortawesome/angular-fontawesome");
const helper_module_1 = require("../../helpers/helper.module");
const sign_up_component_1 = require("./sign-up/sign-up.component");
const angular_1 = require("@ionic/angular");
const map_module_1 = require("../map/map.module");
let MenuLoggedOutModule = class MenuLoggedOutModule {
};
MenuLoggedOutModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        declarations: [menu_logged_out_component_1.MenuLoggedOutComponent, log_in_component_1.LogInComponent, sign_up_component_1.SignUpComponent],
        imports: [
            common_1.CommonModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule,
            http_1.HttpClientModule,
            router_1.RouterModule,
            helper_module_1.HelperModule,
            angular_fontawesome_1.FontAwesomeModule,
            angular_1.IonicModule.forRoot(),
            map_module_1.MapModule,
        ],
        exports: [menu_logged_out_component_1.MenuLoggedOutComponent],
    })
], MenuLoggedOutModule);
exports.MenuLoggedOutModule = MenuLoggedOutModule;
//# sourceMappingURL=menu-logged-out.module.js.map