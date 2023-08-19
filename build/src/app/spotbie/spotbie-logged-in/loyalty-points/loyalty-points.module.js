"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoyaltyPointsModule = exports.options = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const loyalty_points_component_1 = require("./loyalty-points.component");
const forms_1 = require("@angular/forms");
const ngx_mask_1 = require("ngx-mask");
const helper_module_1 = require("../../../helpers/helper.module");
exports.options = null;
let LoyaltyPointsModule = class LoyaltyPointsModule {
};
LoyaltyPointsModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        declarations: [loyalty_points_component_1.LoyaltyPointsComponent],
        imports: [
            common_1.CommonModule,
            forms_1.ReactiveFormsModule,
            forms_1.FormsModule,
            ngx_mask_1.NgxMaskDirective,
            ngx_mask_1.NgxMaskPipe,
            helper_module_1.HelperModule,
        ],
        exports: [loyalty_points_component_1.LoyaltyPointsComponent],
        providers: [(0, ngx_mask_1.provideNgxMask)()],
    })
], LoyaltyPointsModule);
exports.LoyaltyPointsModule = LoyaltyPointsModule;
//# sourceMappingURL=loyalty-points.module.js.map