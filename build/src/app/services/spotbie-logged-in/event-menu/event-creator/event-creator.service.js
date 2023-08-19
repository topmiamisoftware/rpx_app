"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventCreatorService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const spotbieGlobals = require("../../../../globals");
const error_helper_1 = require("../../../../helpers/error-helper");
const operators_1 = require("rxjs/operators");
const REWARD_API = `${spotbieGlobals.API}reward`;
let EventCreatorService = class EventCreatorService {
    constructor(http) {
        this.http = http;
    }
    saveItem(itemObj) {
        const placeToEatRewardApi = `${REWARD_API}/create`;
        const itemObjToSave = {
            name: itemObj.name,
            description: itemObj.description,
            images: itemObj.images,
            point_cost: itemObj.point_cost,
            type: itemObj.type,
        };
        return this.http
            .post(placeToEatRewardApi, itemObjToSave)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('completeReset')));
    }
    updateItem(itemObj) {
        const placeToEatRewardApi = `${REWARD_API}/update`;
        const itemObjToSave = {
            name: itemObj.name,
            description: itemObj.description,
            images: itemObj.images,
            point_cost: itemObj.point_cost,
            type: itemObj.type,
            id: itemObj.id,
        };
        return this.http
            .post(placeToEatRewardApi, itemObjToSave)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('completeReset')));
    }
    deleteMe(itemObj) {
        const placeToEatRewardApi = `${REWARD_API}/delete`;
        const itemObjToSave = {
            id: itemObj.id,
        };
        return this.http
            .post(placeToEatRewardApi, itemObjToSave)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('completeReset')));
    }
};
EventCreatorService = tslib_1.__decorate([
    (0, core_1.Injectable)({
        providedIn: 'root',
    })
], EventCreatorService);
exports.EventCreatorService = EventCreatorService;
//# sourceMappingURL=event-creator.service.js.map