"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfoObjectServiceService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const error_helper_1 = require("../../../helpers/error-helper");
const spotbieGlobals = require("../../../globals");
const operators_1 = require("rxjs/operators");
const PULL_INFO_API = `${spotbieGlobals.API}surroundings/pull-info-object`;
const PULL_INFO_EVENT_API = `${spotbieGlobals.API}surroundings/get-event`;
let InfoObjectServiceService = class InfoObjectServiceService {
    constructor(http) {
        this.http = http;
    }
    pullInfoObject(infoObjRequest) {
        return this.http
            .post(PULL_INFO_API, infoObjRequest)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('pullInfoObject')));
    }
    pullEventObject(infoObjRequest) {
        return this.http
            .post(PULL_INFO_EVENT_API, infoObjRequest)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('pullEventObject')));
    }
};
InfoObjectServiceService = tslib_1.__decorate([
    (0, core_1.Injectable)({
        providedIn: 'root',
    })
], InfoObjectServiceService);
exports.InfoObjectServiceService = InfoObjectServiceService;
//# sourceMappingURL=info-object-service.service.js.map