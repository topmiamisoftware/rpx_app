"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loyaltyPointsReducer = exports.initialState = void 0;
const store_1 = require("@ngrx/store");
const loyalty_points_actions_1 = require("./loyalty-points.actions");
exports.initialState = 0;
const _loyaltyPointsReducer = (0, store_1.createReducer)(exports.initialState, (0, store_1.on)(loyalty_points_actions_1.setValue, (state, { loyaltyPointBalance }) => loyaltyPointBalance));
function loyaltyPointsReducer(state, action) {
    return _loyaltyPointsReducer(state, action);
}
exports.loyaltyPointsReducer = loyaltyPointsReducer;
//# sourceMappingURL=loyalty-points.reducer.js.map