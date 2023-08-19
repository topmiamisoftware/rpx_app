"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtraMediaUploadPipe = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const spotbieGlobals = require("../globals");
const SPOTBIE_TOP_DOMAIN = spotbieGlobals.API;
let ExtraMediaUploadPipe = class ExtraMediaUploadPipe {
    transform(extra_media_path) {
        if (!extra_media_path) {
            return;
        }
        // console.log("Extra Media Path from pipe : ", extra_media_path);
        const new_path = extra_media_path.split('../');
        extra_media_path = SPOTBIE_TOP_DOMAIN + new_path[1];
        // console.log("the Extra Media Path : ", extra_media_path);
        return extra_media_path;
    }
};
ExtraMediaUploadPipe = tslib_1.__decorate([
    (0, core_1.Pipe)({
        name: 'extraMediaPath'
    })
], ExtraMediaUploadPipe);
exports.ExtraMediaUploadPipe = ExtraMediaUploadPipe;
//# sourceMappingURL=extra-media-upload.pipe.js.map