"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityMemberModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const community_member_component_1 = require("./community-member.component");
const router_1 = require("@angular/router");
const info_object_module_1 = require("../map/info-object/info-object.module");
const routes = [{ path: ':qrCode', component: community_member_component_1.CommunityMemberComponent }];
let CommunityMemberModule = class CommunityMemberModule {
};
CommunityMemberModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        declarations: [community_member_component_1.CommunityMemberComponent],
        imports: [common_1.CommonModule, info_object_module_1.InfoObjectModule, router_1.RouterModule.forChild(routes)],
        exports: [community_member_component_1.CommunityMemberComponent],
    })
], CommunityMemberModule);
exports.CommunityMemberModule = CommunityMemberModule;
//# sourceMappingURL=community-member.module.js.map