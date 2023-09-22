"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const preferences_1 = require("@capacitor/preferences");
let MenuComponent = class MenuComponent {
    constructor() { }
    ngOnInit() {
        // save timezone
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        preferences_1.Preferences.set({
            key: 'spotbie_userTimeZone',
            value: userTimezone,
        });
    }
};
tslib_1.__decorate([
    (0, core_1.ViewChild)('spotbieMainMenu')
], MenuComponent.prototype, "spotbieMainMenu", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('spotbieHoveredApp')
], MenuComponent.prototype, "spotbieHoveredApp", void 0);
MenuComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-menu',
        templateUrl: './menu.component.html',
        styleUrls: ['./menu.component.css'],
    })
], MenuComponent);
exports.MenuComponent = MenuComponent;
//# sourceMappingURL=menu.component.js.map