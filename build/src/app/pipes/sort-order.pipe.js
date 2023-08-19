"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortOrderPipe = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let SortOrderPipe = class SortOrderPipe {
    transform(value) {
        if (value == 'asc') {
            return 'fas fa-arrow-up';
        }
        else {
            return 'fas fa-arrow-down';
        }
    }
};
SortOrderPipe = tslib_1.__decorate([
    (0, core_1.Pipe)({
        name: 'sortOrderPipe'
    })
], SortOrderPipe);
exports.SortOrderPipe = SortOrderPipe;
//# sourceMappingURL=sort-order.pipe.js.map