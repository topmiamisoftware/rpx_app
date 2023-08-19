"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let MenuComponent = class MenuComponent {
    constructor() {
        this.isLoggedIn = false;
    }
    ngOnInit() {
        // save timezone
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        localStorage.setItem('spotbie_userTimeZone', userTimezone);
        // check log in status, turn map on if we are logged out
        const cookiedLoggedIn = localStorage.getItem('spotbie_loggedIn');
        if (cookiedLoggedIn === '1') {
            this.isLoggedIn = true;
        }
    }
    ngAfterViewInit() { }
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