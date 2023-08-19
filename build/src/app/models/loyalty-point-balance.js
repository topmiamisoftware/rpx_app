"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoyaltyPointBalance = void 0;
class LoyaltyPointBalance {
    constructor() {
        this._balance = null;
        this._reset_balance = null;
        this._loyalty_point_dollar_percent_value = null;
        this._end_of_month = null;
    }
    get balance() {
        return this._balance;
    }
    set balance(value) {
        this._balance = value;
    }
    get reset_balance() {
        return this._reset_balance;
    }
    set reset_balance(value) {
        this._reset_balance = value;
    }
    get loyalty_point_dollar_percent_value() {
        return this._loyalty_point_dollar_percent_value;
    }
    set loyalty_point_dollar_percent_value(value) {
        this._loyalty_point_dollar_percent_value = value;
    }
    get end_of_month() {
        return this._end_of_month;
    }
    set end_of_month(value) {
        this._end_of_month = value;
    }
}
exports.LoyaltyPointBalance = LoyaltyPointBalance;
//# sourceMappingURL=loyalty-point-balance.js.map