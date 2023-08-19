"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnScrollDirective = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let OnScrollDirective = class OnScrollDirective {
    constructor() {
        this.spotbieOnScroll = new core_1.EventEmitter();
    }
    onScroll(event) {
        this.spotbieOnScroll.emit(event);
    }
};
tslib_1.__decorate([
    (0, core_1.Output)()
], OnScrollDirective.prototype, "spotbieOnScroll", void 0);
tslib_1.__decorate([
    (0, core_1.HostListener)('scroll', ['$event'])
], OnScrollDirective.prototype, "onScroll", null);
OnScrollDirective = tslib_1.__decorate([
    (0, core_1.Directive)({
        selector: '[spotbieOnScroll]'
    })
], OnScrollDirective);
exports.OnScrollDirective = OnScrollDirective;
//# sourceMappingURL=on-scroll.directive.js.map