"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventMenuServiceService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const spotbieGlobals = require("../../../globals");
const error_helper_1 = require("../../../helpers/error-helper");
const operators_1 = require("rxjs/operators");
const REWARD_API = `${spotbieGlobals.API}reward`;
let EventMenuServiceService = class EventMenuServiceService {
    constructor(http) {
        this.http = http;
    }
    fetchRewards(fetchRewardsReq = null) {
        const placeToEatApi = `${REWARD_API}/index`;
        return this.http
            .post(placeToEatApi, fetchRewardsReq)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('fetchRewards')));
    }
};
EventMenuServiceService = tslib_1.__decorate([
    (0, core_1.Injectable)({
        providedIn: 'root',
    })
], EventMenuServiceService);
exports.EventMenuServiceService = EventMenuServiceService;
//# sourceMappingURL=event-menu-service.service.js.map