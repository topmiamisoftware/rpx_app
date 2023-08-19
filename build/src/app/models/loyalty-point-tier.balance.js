"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoyaltyTier = void 0;
class LoyaltyTier {
    get id() {
        return this._id;
    }
    get uuid() {
        return this._uuid;
    }
    set uuid(value) {
        this._uuid = value;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    get description() {
        return this._description;
    }
    set description(value) {
        this._description = value;
    }
    get entranceValue() {
        return this._entranceValue;
    }
    set entranceValue(value) {
        this._entranceValue = value;
    }
    set lp_entrance(value) {
        this._entranceValue = value;
    }
}
exports.LoyaltyTier = LoyaltyTier;
//# sourceMappingURL=loyalty-point-tier.balance.js.map