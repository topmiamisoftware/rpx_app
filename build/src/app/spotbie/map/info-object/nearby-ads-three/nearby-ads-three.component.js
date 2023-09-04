"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NearbyAdsThreeComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
let NearbyAdsThreeComponent = class NearbyAdsThreeComponent {
    set accountType(accountType) {
        this.accountType$.next(accountType);
    }
    constructor() {
        this.lat = null;
        this.lng = null;
        this.eventsClassification = null;
        this.accountType$ = new rxjs_1.BehaviorSubject(null);
    }
    ngOnInit() { }
};
tslib_1.__decorate([
    (0, core_1.Input)()
], NearbyAdsThreeComponent.prototype, "lat", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], NearbyAdsThreeComponent.prototype, "lng", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], NearbyAdsThreeComponent.prototype, "accountType", null);
tslib_1.__decorate([
    (0, core_1.Input)()
], NearbyAdsThreeComponent.prototype, "eventsClassification", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], NearbyAdsThreeComponent.prototype, "categories", void 0);
NearbyAdsThreeComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-nearby-ads-three',
        templateUrl: './nearby-ads-three.component.html',
        styleUrls: ['./nearby-ads-three.component.css'],
    })
], NearbyAdsThreeComponent);
exports.NearbyAdsThreeComponent = NearbyAdsThreeComponent;
//# sourceMappingURL=nearby-ads-three.component.js.map