"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrModule = exports.options = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const qr_component_1 = require("./qr.component");
const ngx_mask_1 = require("ngx-mask");
const forms_1 = require("@angular/forms");
const reward_menu_module_1 = require("../reward-menu/reward-menu.module");
exports.options = null;
let QrModule = class QrModule {
};
QrModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        declarations: [qr_component_1.QrComponent],
        imports: [
            common_1.CommonModule,
            forms_1.ReactiveFormsModule,
            reward_menu_module_1.RewardMenuModule,
            forms_1.FormsModule,
            ngx_mask_1.NgxMaskDirective,
            ngx_mask_1.NgxMaskPipe,
        ],
        exports: [qr_component_1.QrComponent],
        providers: [(0, ngx_mask_1.provideNgxMask)()],
    })
], QrModule);
exports.QrModule = QrModule;
//# sourceMappingURL=qr.module.js.map