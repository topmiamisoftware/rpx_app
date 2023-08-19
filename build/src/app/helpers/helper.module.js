"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelperModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const loading_screen_component_1 = require("./loading-helper/loading-screen/loading-screen.component");
const on_scroll_directive_1 = require("../directives/on-scroll.directive");
const stop_click_propagation_directive_1 = require("../directives/stop-click-propagation.directive");
const scroll_to_top_component_1 = require("./scroll-to-top/scroll-to-top.component");
const error_handler_component_1 = require("./error-handler/error-handler.component");
const username_directive_1 = require("../directives/username.directive");
const person_name_directive_1 = require("../directives/person-name.directive");
let HelperModule = class HelperModule {
};
HelperModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        declarations: [
            loading_screen_component_1.LoadingScreenComponent,
            on_scroll_directive_1.OnScrollDirective,
            stop_click_propagation_directive_1.StopClickPropagationDirective,
            username_directive_1.UsernameDirective,
            person_name_directive_1.PersonNameDirective,
            scroll_to_top_component_1.ScrollToTopComponent,
            error_handler_component_1.ErrorHandlerComponent,
        ],
        imports: [common_1.CommonModule],
        exports: [
            loading_screen_component_1.LoadingScreenComponent,
            on_scroll_directive_1.OnScrollDirective,
            stop_click_propagation_directive_1.StopClickPropagationDirective,
            person_name_directive_1.PersonNameDirective,
            username_directive_1.UsernameDirective,
            scroll_to_top_component_1.ScrollToTopComponent,
            error_handler_component_1.ErrorHandlerComponent,
        ],
    })
], HelperModule);
exports.HelperModule = HelperModule;
//# sourceMappingURL=helper.module.js.map