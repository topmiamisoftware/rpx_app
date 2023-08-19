"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsernameDirective = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let UsernameDirective = class UsernameDirective {
    constructor(ref) {
        this.ref = ref;
    }
    onInput(event) {
        const regex = /^[a-zA-Z0-9]*$/;
        const replaceRegex = /[^a-zA-Z0-9/-]+/;
        let str = event.target.value;
        // allow letters and numbers only.
        if (!regex.test(event.key.value)) {
            str = str.replace(replaceRegex, '');
            this.ref.nativeElement.value = str;
            event.preventDefault();
        }
    }
    onBlur(event) {
        const replaceRegex = /[^a-zA-Z0-9/-]+/;
        event.target.value = event.target.value.replace(replaceRegex, '');
    }
};
tslib_1.__decorate([
    (0, core_1.HostListener)('input', ['$event'])
], UsernameDirective.prototype, "onInput", null);
tslib_1.__decorate([
    (0, core_1.HostListener)('input', ['$event'])
], UsernameDirective.prototype, "onBlur", null);
UsernameDirective = tslib_1.__decorate([
    (0, core_1.Directive)({
        selector: '[username]',
    })
], UsernameDirective);
exports.UsernameDirective = UsernameDirective;
//# sourceMappingURL=username.directive.js.map