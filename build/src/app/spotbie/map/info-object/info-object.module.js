"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfoObjectModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const info_object_component_1 = require("./info-object.component");
const buttons_1 = require("ngx-sharebuttons/buttons");
const reward_menu_module_1 = require("../../spotbie-logged-in/reward-menu/reward-menu.module");
const nearby_ads_three_component_1 = require("./nearby-ads-three/nearby-ads-three.component");
const nearby_featured_ad_component_1 = require("./nearby-featured-ad/nearby-featured-ad.component");
const helper_module_1 = require("../../../helpers/helper.module");
const angular_1 = require("@ionic/angular");
let InfoObjectModule = class InfoObjectModule {
};
InfoObjectModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        declarations: [
            info_object_component_1.InfoObjectComponent,
            nearby_ads_three_component_1.NearbyAdsThreeComponent,
            nearby_featured_ad_component_1.NearbyFeaturedAdComponent,
        ],
        imports: [
            common_1.CommonModule,
            reward_menu_module_1.RewardMenuModule,
            helper_module_1.HelperModule,
            buttons_1.ShareButtonsModule.withConfig({
                include: [
                    'facebook',
                    'twitter',
                    'linkedin',
                    'reddit',
                    'tumblr',
                    'mix',
                    'viber',
                    'messenger',
                    'whatsapp',
                ],
            }),
            angular_1.IonicModule,
        ],
        exports: [info_object_component_1.InfoObjectComponent],
    })
], InfoObjectModule);
exports.InfoObjectModule = InfoObjectModule;
//# sourceMappingURL=info-object.module.js.map