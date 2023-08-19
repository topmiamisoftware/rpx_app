"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdCreatorService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const spotbieGlobals = require("../../../../globals");
const error_helper_1 = require("../../../../helpers/error-helper");
const operators_1 = require("rxjs/operators");
const ADS_API = spotbieGlobals.API + 'in-house';
let AdCreatorService = class AdCreatorService {
    constructor(http) {
        this.http = http;
    }
    saveAd(adObj) {
        const placeToEatAdApi = `${ADS_API}/create`;
        const adObjToSave = {
            name: adObj.name,
            description: adObj.description,
            type: adObj.type,
            images: adObj.images,
            images_mobile: adObj.images_mobile,
        };
        return this.http
            .post(placeToEatAdApi, adObjToSave)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('completeReset')));
    }
    activateMembership() {
        const placeToEatAdApi = `${ADS_API}/make-payment`;
        return this.http
            .post(placeToEatAdApi, null)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('completeReset')));
    }
    updateAd(adObj) {
        const placeToEatAdApi = `${ADS_API}/update`;
        const adObjToSave = {
            name: adObj.name,
            description: adObj.description,
            type: adObj.type,
            id: adObj.id,
            images: adObj.images,
            images_mobile: adObj.images_mobile,
        };
        return this.http
            .post(placeToEatAdApi, adObjToSave)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('completeReset')));
    }
    deleteMe(adObj) {
        const placeToEatAdApi = `${ADS_API}/delete`;
        const adObjToSave = {
            id: adObj.id,
        };
        return this.http
            .post(placeToEatAdApi, adObjToSave)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('deleteMe')));
    }
};
AdCreatorService = tslib_1.__decorate([
    (0, core_1.Injectable)({
        providedIn: 'root',
    })
], AdCreatorService);
exports.AdCreatorService = AdCreatorService;
//# sourceMappingURL=ad-creator.service.js.map