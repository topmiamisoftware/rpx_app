"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SanitizePipe = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let SanitizePipe = class SanitizePipe {
    transform(value) {
        let new_text;
        new_text = value.replace(/\\(.)/mg, '$1');
        // console.log("Sanitize pipe : " , new_text);
        return new_text;
    }
};
SanitizePipe = tslib_1.__decorate([
    (0, core_1.Pipe)({
        name: 'sanitize'
    })
], SanitizePipe);
exports.SanitizePipe = SanitizePipe;
//# sourceMappingURL=sanitize.pipe.js.map