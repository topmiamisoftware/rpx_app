"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TruncateTextPipe = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let TruncateTextPipe = class TruncateTextPipe {
    transform(value, args) {
        const limit = args.length > 0 ? parseInt(args[0], 10) : 20;
        const trail = args.length > 1 ? args[1] : '...';
        return value.length > limit ? value.substring(0, limit) + trail : value;
    }
};
TruncateTextPipe = tslib_1.__decorate([
    (0, core_1.Pipe)({
        name: 'truncateText'
    })
], TruncateTextPipe);
exports.TruncateTextPipe = TruncateTextPipe;
//# sourceMappingURL=truncate-text.pipe.js.map