"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlSanitizerPipe = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let UrlSanitizerPipe = class UrlSanitizerPipe {
    constructor(sanitizer) {
        this.sanitizer = sanitizer;
    }
    transform(url) {
        if (!url) {
            return null;
        }
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }
};
UrlSanitizerPipe = tslib_1.__decorate([
    (0, core_1.Pipe)({
        name: 'urlSanitizer'
    })
], UrlSanitizerPipe);
exports.UrlSanitizerPipe = UrlSanitizerPipe;
//# sourceMappingURL=url-sanitizer.pipe.js.map