"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadingScreenComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let LoadingScreenComponent = class LoadingScreenComponent {
    constructor() {
        this.loadingText = 'LOADING...';
    }
    ngOnInit() {
    }
};
tslib_1.__decorate([
    (0, core_1.Input)()
], LoadingScreenComponent.prototype, "loadingText", void 0);
LoadingScreenComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-loading-screen',
        templateUrl: './loading-screen.component.html',
        styleUrls: ['./loading-screen.component.css']
    })
], LoadingScreenComponent);
exports.LoadingScreenComponent = LoadingScreenComponent;
//# sourceMappingURL=loading-screen.component.js.map