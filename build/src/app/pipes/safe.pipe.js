"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafePipe = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let SafePipe = class SafePipe {
    constructor(sanitizer) {
        this.sanitizer = sanitizer;
    }
    transform(url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
};
SafePipe = tslib_1.__decorate([
    (0, core_1.Pipe)({ name: 'safe' })
], SafePipe);
exports.SafePipe = SafePipe;
//# sourceMappingURL=safe.pipe.js.map