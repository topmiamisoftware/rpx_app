"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberFormatPipe = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let NumberFormatPipe = class NumberFormatPipe {
    transform(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
};
NumberFormatPipe = tslib_1.__decorate([
    (0, core_1.Pipe)({
        name: 'numberFormat'
    })
], NumberFormatPipe);
exports.NumberFormatPipe = NumberFormatPipe;
//# sourceMappingURL=number-format.pipe.js.map