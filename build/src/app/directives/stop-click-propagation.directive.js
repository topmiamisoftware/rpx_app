"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StopClickPropagationDirective = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let StopClickPropagationDirective = class StopClickPropagationDirective {
    onClick(event) {
        event.stopPropagation();
    }
};
tslib_1.__decorate([
    (0, core_1.HostListener)('click', ['$event'])
], StopClickPropagationDirective.prototype, "onClick", null);
StopClickPropagationDirective = tslib_1.__decorate([
    (0, core_1.Directive)({
        selector: '[SpotBieStopClickPropagation]',
    })
], StopClickPropagationDirective);
exports.StopClickPropagationDirective = StopClickPropagationDirective;
//# sourceMappingURL=stop-click-propagation.directive.js.map