"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WelcomeModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const welcome_component_1 = require("./welcome.component");
let WelcomeModule = class WelcomeModule {
};
WelcomeModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        declarations: [
            welcome_component_1.WelcomeComponent
        ],
        imports: [
            common_1.CommonModule
        ],
        exports: [
            welcome_component_1.WelcomeComponent
        ]
    })
], WelcomeModule);
exports.WelcomeModule = WelcomeModule;
//# sourceMappingURL=welcome.module.js.map