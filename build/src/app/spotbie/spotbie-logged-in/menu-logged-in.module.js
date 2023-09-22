"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuLoggedInModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const forms_1 = require("@angular/forms");
const http_1 = require("@angular/common/http");
const menu_logged_in_component_1 = require("./menu-logged-in.component");
const spotbie_pipes_module_1 = require("../../spotbie-pipes/spotbie-pipes.module");
const router_1 = require("@angular/router");
const helper_module_1 = require("../../helpers/helper.module");
const map_module_1 = require("../map/map.module");
const settings_module_1 = require("./settings/settings.module");
const angular_1 = require("@ionic/angular");
//import { EventMenuModule } from './event-menu/event-menu.module';
let MenuLoggedInModule = class MenuLoggedInModule {
};
MenuLoggedInModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        declarations: [menu_logged_in_component_1.MenuLoggedInComponent],
        imports: [
            common_1.CommonModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule,
            http_1.HttpClientModule,
            spotbie_pipes_module_1.SpotbiePipesModule,
            router_1.RouterModule,
            helper_module_1.HelperModule,
            map_module_1.MapModule,
            settings_module_1.SettingsModule,
            router_1.RouterModule,
            angular_1.IonicModule.forRoot(),
            //EventMenuModule
        ],
        exports: [menu_logged_in_component_1.MenuLoggedInComponent],
    })
], MenuLoggedInModule);
exports.MenuLoggedInModule = MenuLoggedInModule;
//# sourceMappingURL=menu-logged-in.module.js.map