"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyFavoritesModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const my_favorites_component_1 = require("./my-favorites.component");
const helper_module_1 = require("../../helpers/helper.module");
const info_object_module_1 = require("../map/info-object/info-object.module");
let MyFavoritesModule = class MyFavoritesModule {
};
MyFavoritesModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        declarations: [my_favorites_component_1.MyFavoritesComponent],
        imports: [common_1.CommonModule, helper_module_1.HelperModule, info_object_module_1.InfoObjectModule],
        exports: [my_favorites_component_1.MyFavoritesComponent],
    })
], MyFavoritesModule);
exports.MyFavoritesModule = MyFavoritesModule;
//# sourceMappingURL=my-favorites.module.js.map