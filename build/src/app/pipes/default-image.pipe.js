"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultImagePipe = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let DefaultImagePipe = class DefaultImagePipe {
    transform(value) {
        return value;
    }
};
DefaultImagePipe = tslib_1.__decorate([
    (0, core_1.Pipe)({
        name: 'defaultImage'
    })
], DefaultImagePipe);
exports.DefaultImagePipe = DefaultImagePipe;
//# sourceMappingURL=default-image.pipe.js.map