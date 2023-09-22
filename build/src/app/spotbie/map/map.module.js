"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MapModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const slider_1 = require("@angular/material/slider");
const input_1 = require("@angular/material/input");
const spotbie_pipes_module_1 = require("../../spotbie-pipes/spotbie-pipes.module");
const map_component_1 = require("./map.component");
const map_object_icon_pipe_1 = require("../../pipes/map-object-icon.pipe");
const helper_module_1 = require("../../helpers/helper.module");
const forms_1 = require("@angular/forms");
const user_info_object_component_1 = require("./user-info-object/user-info-object.component");
const router_1 = require("@angular/router");
const user_dashboard_module_1 = require("../spotbie-logged-in/user-dashboard/user-dashboard.module");
const icons_1 = require("ngx-sharebuttons/icons");
const info_object_module_1 = require("./info-object/info-object.module");
const ads_module_1 = require("../ads/ads.module");
const stop_click_propagation_directive_1 = require("../../directives/stop-click-propagation.directive");
const google_maps_1 = require("@angular/google-maps");
const angular_1 = require("@ionic/angular");
let MapModule = class MapModule {
};
MapModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        declarations: [map_component_1.MapComponent, user_info_object_component_1.UserInfoObjectComponent],
        imports: [
            common_1.CommonModule,
            slider_1.MatSliderModule,
            input_1.MatInputModule,
            spotbie_pipes_module_1.SpotbiePipesModule,
            forms_1.ReactiveFormsModule,
            forms_1.FormsModule,
            icons_1.ShareIconsModule,
            info_object_module_1.InfoObjectModule,
            router_1.RouterModule,
            helper_module_1.HelperModule,
            user_dashboard_module_1.UserDashboardModule,
            ads_module_1.AdsModule,
            google_maps_1.GoogleMapsModule,
            angular_1.IonicModule,
        ],
        providers: [map_object_icon_pipe_1.MapObjectIconPipe, stop_click_propagation_directive_1.StopClickPropagationDirective],
        exports: [map_component_1.MapComponent],
    })
], MapModule);
exports.MapModule = MapModule;
//# sourceMappingURL=map.module.js.map