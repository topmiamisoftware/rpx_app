"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const error_helper_1 = require("../../helpers/error-helper");
const spotbieGlobals = require("../../globals");
const operators_1 = require("rxjs/operators");
const USER_LOCATION_API = `${spotbieGlobals.API}user-location`;
const SEARCH_BUSINESS_API = `${spotbieGlobals.API}surroundings/search-businesses`;
const SB_COMMUNITY_MEMBERS_API = `${spotbieGlobals.API}surroundings/get-community-members`;
const SEARCH_EVENTS_API = `${spotbieGlobals.API}surroundings/search-events`;
const GET_CLASSIFICATIONS = `${spotbieGlobals.API}surroundings/get-classifications`;
let LocationService = class LocationService {
    constructor(http) {
        this.http = http;
    }
    getClassifications() {
        const getClassificationsApi = `${GET_CLASSIFICATIONS}`;
        return this.http
            .get(getClassificationsApi)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('getClassifications')));
    }
    getEvents(searchObj) {
        const getEventsApi = `${SEARCH_EVENTS_API}`;
        return this.http
            .post(getEventsApi, searchObj)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('getEvents')));
    }
    getBusinesses(searchObj) {
        const getBusinessesApi = `${SEARCH_BUSINESS_API}`;
        return this.http
            .post(getBusinessesApi, searchObj)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('getBusinesses')));
    }
    getSpotBieCommunityMemberList(searchObj) {
        const getBusinessesApi = `${SB_COMMUNITY_MEMBERS_API}`;
        return this.http
            .post(getBusinessesApi, searchObj)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('getSpotBieCommunityMemberList')));
    }
    saveCurrentLocation(saveLocationObj) {
        const locationApi = `${USER_LOCATION_API}/save-current-location`;
        return this.http
            .post(locationApi, saveLocationObj)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('saveCurrentLocation Error')));
    }
    retrieveSurroudings(retrieveSurroundingsObj) {
        const locationApi = `${USER_LOCATION_API}/retrieve-surroundings`;
        return this.http
            .post(locationApi, retrieveSurroundingsObj)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('retrieveSurroudings Error')));
    }
};
LocationService = tslib_1.__decorate([
    (0, core_1.Injectable)({
        providedIn: 'root',
    })
], LocationService);
exports.LocationService = LocationService;
//# sourceMappingURL=location.service.js.map