"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderPageModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const forms_1 = require("@angular/forms");
const angular_1 = require("@ionic/angular");
const folder_routing_module_1 = require("./folder-routing.module");
const folder_page_1 = require("./folder.page");
let FolderPageModule = class FolderPageModule {
};
FolderPageModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        imports: [
            common_1.CommonModule,
            forms_1.FormsModule,
            angular_1.IonicModule,
            folder_routing_module_1.FolderPageRoutingModule
        ],
        declarations: [folder_page_1.FolderPage]
    })
], FolderPageModule);
exports.FolderPageModule = FolderPageModule;
//# sourceMappingURL=folder.module.js.map