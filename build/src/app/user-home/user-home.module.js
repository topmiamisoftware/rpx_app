"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserHomeModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const user_home_component_1 = require("./user-home.component");
const menu_logged_in_module_1 = require("../spotbie/spotbie-logged-in/menu-logged-in.module");
const router_1 = require("@angular/router");
const helper_module_1 = require("../helpers/helper.module");
const routes = [{ path: '', component: user_home_component_1.UserHomeComponent }];
let UserHomeModule = class UserHomeModule {
};
UserHomeModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        declarations: [user_home_component_1.UserHomeComponent],
        imports: [
            common_1.CommonModule,
            helper_module_1.HelperModule,
            menu_logged_in_module_1.MenuLoggedInModule,
            router_1.RouterModule.forChild(routes),
        ],
        exports: [user_home_component_1.UserHomeComponent],
    })
], UserHomeModule);
exports.UserHomeModule = UserHomeModule;
//# sourceMappingURL=user-home.module.js.map