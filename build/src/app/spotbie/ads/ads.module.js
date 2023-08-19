"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdsModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const community_member_module_1 = require("../community-member/community-member.module");
const bottom_ad_banner_component_1 = require("./bottom-ad-banner/bottom-ad-banner.component");
const nearby_featured_ad_component_1 = require("./nearby-featured-ad/nearby-featured-ad.component");
const header_ad_banner_component_1 = require("./header-ad-banner/header-ad-banner.component");
const spotbie_pipes_module_1 = require("../../spotbie-pipes/spotbie-pipes.module");
let AdsModule = class AdsModule {
};
AdsModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        declarations: [
            header_ad_banner_component_1.HeaderAdBannerComponent,
            bottom_ad_banner_component_1.BottomAdBannerComponent,
            nearby_featured_ad_component_1.NearbyFeaturedAdComponent,
        ],
        imports: [common_1.CommonModule, spotbie_pipes_module_1.SpotbiePipesModule, community_member_module_1.CommunityMemberModule],
        exports: [
            header_ad_banner_component_1.HeaderAdBannerComponent,
            bottom_ad_banner_component_1.BottomAdBannerComponent,
            nearby_featured_ad_component_1.NearbyFeaturedAdComponent,
        ],
    })
], AdsModule);
exports.AdsModule = AdsModule;
//# sourceMappingURL=ads.module.js.map