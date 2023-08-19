"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsModule = exports.options = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const router_1 = require("@angular/router");
const http_1 = require("@angular/common/http");
const forms_1 = require("@angular/forms");
const chips_1 = require("@angular/material/chips");
const autocomplete_1 = require("@angular/material/autocomplete");
const ngx_mask_1 = require("ngx-mask");
const settings_component_1 = require("./settings.component");
const helper_module_1 = require("../../../helpers/helper.module");
const form_field_1 = require("@angular/material/form-field");
exports.options = null;
let SettingsModule = class SettingsModule {
};
SettingsModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        declarations: [settings_component_1.SettingsComponent],
        imports: [
            common_1.CommonModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule,
            http_1.HttpClientModule,
            helper_module_1.HelperModule,
            router_1.RouterModule,
            chips_1.MatChipsModule,
            autocomplete_1.MatAutocompleteModule,
            form_field_1.MatFormFieldModule,
            ngx_mask_1.NgxMaskDirective,
            ngx_mask_1.NgxMaskPipe,
        ],
        exports: [settings_component_1.SettingsComponent],
        providers: [(0, ngx_mask_1.provideNgxMask)()],
    })
], SettingsModule);
exports.SettingsModule = SettingsModule;
//# sourceMappingURL=settings.module.js.map