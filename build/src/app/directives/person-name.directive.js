"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonNameDirective = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
let PersonNameDirective = class PersonNameDirective {
    constructor(ref) {
        this.ref = ref;
    }
    lettersAndSpacesOnly(event) {
        const regex = /^[a-zA-Z\s]*$/;
        const replaceRegex = /[^a-zA-Z\s]+/;
        let str = event.target.value;
        // allow letters and spaces only.
        if (!regex.test(event.key.value)) {
            str = str.replace(replaceRegex, '');
            this.ref.nativeElement.value = str;
            event.preventDefault();
        }
    }
    replaceInvalidCharacters(event) {
        const replaceRegex = /[^a-zA-Z\s]+/;
        event.target.value = event.target.value.replace(replaceRegex, '');
    }
};
tslib_1.__decorate([
    (0, core_1.HostListener)('input', ['$event'])
], PersonNameDirective.prototype, "lettersAndSpacesOnly", null);
tslib_1.__decorate([
    (0, core_1.HostListener)('input', ['$event'])
], PersonNameDirective.prototype, "replaceInvalidCharacters", null);
PersonNameDirective = tslib_1.__decorate([
    (0, core_1.Directive)({
        selector: '[personName]',
        providers: [forms_1.NgModel],
    })
], PersonNameDirective);
exports.PersonNameDirective = PersonNameDirective;
//# sourceMappingURL=person-name.directive.js.map