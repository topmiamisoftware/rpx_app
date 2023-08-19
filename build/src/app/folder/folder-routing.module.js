"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderPageRoutingModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const folder_page_1 = require("./folder.page");
const routes = [
    {
        path: '',
        component: folder_page_1.FolderPage
    }
];
let FolderPageRoutingModule = class FolderPageRoutingModule {
};
FolderPageRoutingModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        imports: [router_1.RouterModule.forChild(routes)],
        exports: [router_1.RouterModule],
    })
], FolderPageRoutingModule);
exports.FolderPageRoutingModule = FolderPageRoutingModule;
//# sourceMappingURL=folder-routing.module.js.map