"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbumMediaUploadPipe = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const spotbieGlobals = require("../globals");
const SPOTBIE_TOP_DOMAIN = spotbieGlobals.RESOURCES;
let AlbumMediaUploadPipe = class AlbumMediaUploadPipe {
    transform(extra_media_path) {
        return extra_media_path;
    }
};
AlbumMediaUploadPipe = tslib_1.__decorate([
    (0, core_1.Pipe)({
        name: 'albumMediaPath'
    })
], AlbumMediaUploadPipe);
exports.AlbumMediaUploadPipe = AlbumMediaUploadPipe;
//# sourceMappingURL=album-media-upload.pipe.js.map