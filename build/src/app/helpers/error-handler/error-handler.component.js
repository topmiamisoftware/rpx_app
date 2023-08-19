"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandlerComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
let ErrorHandlerComponent = class ErrorHandlerComponent {
    constructor() {
        this.displayMessage = null;
    }
    ngOnInit() {
        // this.displayMessage = this.dat.errorMessage;
    }
    close() {
        // this.dialogRef.close();
    }
};
ErrorHandlerComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-error-handler',
        templateUrl: './error-handler.component.html',
        styleUrls: ['./error-handler.component.css'],
    })
], ErrorHandlerComponent);
exports.ErrorHandlerComponent = ErrorHandlerComponent;
//# sourceMappingURL=error-handler.component.js.map