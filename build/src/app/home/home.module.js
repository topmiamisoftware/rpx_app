"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const home_component_1 = require("./home.component");
const router_1 = require("@angular/router");
const menu_module_1 = require("../spotbie/menu.module");
const spotbie_pipes_module_1 = require("../spotbie-pipes/spotbie-pipes.module");
const map_module_1 = require("../spotbie/map/map.module");
const helper_module_1 = require("../helpers/helper.module");
const menu_logged_out_module_1 = require("../spotbie/spotbie-logged-out/menu-logged-out.module");
const welcome_module_1 = require("../spotbie/welcome/welcome.module");
const menu_logged_in_module_1 = require("../spotbie/spotbie-logged-in/menu-logged-in.module");
const menu_logged_in_component_1 = require("../spotbie/spotbie-logged-in/menu-logged-in.component");
// import {TestModeModule} from '../spotbie/test-mode/test-mode.module';
const angular_1 = require("@ionic/angular");
const routes = [{ path: '', component: home_component_1.HomeComponent }];
let HomeModule = class HomeModule {
};
HomeModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        declarations: [home_component_1.HomeComponent],
        imports: [
            common_1.CommonModule,
            menu_logged_in_module_1.MenuLoggedInModule,
            menu_logged_out_module_1.MenuLoggedOutModule,
            menu_module_1.MenuModule,
            spotbie_pipes_module_1.SpotbiePipesModule,
            map_module_1.MapModule,
            helper_module_1.HelperModule,
            welcome_module_1.WelcomeModule,
            // TestModeModule,
            angular_1.IonicModule,
            router_1.RouterModule.forChild(routes),
        ],
        exports: [home_component_1.HomeComponent, menu_logged_in_component_1.MenuLoggedInComponent, menu_logged_out_module_1.MenuLoggedOutModule],
    })
], HomeModule);
exports.HomeModule = HomeModule;
//# sourceMappingURL=home.module.js.map