"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpotbiePipesModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const sanitize_pipe_1 = require("../pipes/sanitize.pipe");
const safe_pipe_1 = require("../pipes/safe.pipe");
const default_image_pipe_1 = require("../pipes/default-image.pipe");
const date_format_pipe_1 = require("../pipes/date-format.pipe");
const number_format_pipe_1 = require("../pipes/number-format.pipe");
const sort_order_pipe_1 = require("../pipes/sort-order.pipe");
const truncate_text_pipe_1 = require("../pipes/truncate-text.pipe");
let SpotbiePipesModule = class SpotbiePipesModule {
};
SpotbiePipesModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        declarations: [
            sanitize_pipe_1.SanitizePipe,
            safe_pipe_1.SafePipe,
            default_image_pipe_1.DefaultImagePipe,
            date_format_pipe_1.DateFormatPipe,
            date_format_pipe_1.TimeFormatPipe,
            number_format_pipe_1.NumberFormatPipe,
            sort_order_pipe_1.SortOrderPipe,
            truncate_text_pipe_1.TruncateTextPipe
        ],
        imports: [
            common_1.CommonModule
        ],
        exports: [
            sanitize_pipe_1.SanitizePipe,
            safe_pipe_1.SafePipe,
            default_image_pipe_1.DefaultImagePipe,
            date_format_pipe_1.DateFormatPipe,
            date_format_pipe_1.TimeFormatPipe,
            number_format_pipe_1.NumberFormatPipe,
            sort_order_pipe_1.SortOrderPipe,
            truncate_text_pipe_1.TruncateTextPipe
        ]
    })
], SpotbiePipesModule);
exports.SpotbiePipesModule = SpotbiePipesModule;
//# sourceMappingURL=spotbie-pipes.module.js.map