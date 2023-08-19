"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateUniqueEmail = void 0;
const operators_1 = require("rxjs/operators");
const retry_operators_1 = require("../helpers/retry.operators");
class ValidateUniqueEmail {
    static valid(checkEmailUniqueService, userEmail) {
        return (control) => checkEmailUniqueService.checkIfEmailUnique(control.value).pipe((0, retry_operators_1.retryWithBackOff)(1000), (0, operators_1.map)(res => {
            if (res === undefined || res === null) {
                return null;
            }
            if (userEmail === control.value || res.is_valid) {
                return null;
            }
            else {
                return { emailTaken: true };
            }
        }));
    }
}
exports.ValidateUniqueEmail = ValidateUniqueEmail;
//# sourceMappingURL=email-unique.validator.js.map