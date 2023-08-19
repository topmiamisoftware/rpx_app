"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateUsername = void 0;
//allow letters, numbers, and underscores
const illegalChars = /^[0-9A-Za-z_.-]+$/;
//custom validator to check that two fields match
function ValidateUsername(username_control_name) {
    return (formGroup) => {
        const username = formGroup.controls[username_control_name];
        // return if another validator has already found an error on the username
        if (username.errors &&
            (!username.errors.emptyUsername &&
                !username.errors.wrongLength &&
                !username.errors.illegalChars)) {
            return;
        }
        // set error on matchingControl if validation fails
        if (username.value == '') {
            username.setErrors({ emptyUsername: true });
        }
        else if ((username.value.length < 1) || (username.value.length > 35)) {
            username.setErrors({ wrongLength: true });
        }
        else if (!illegalChars.test(username.value)) {
            username.setErrors({ illegalChars: true });
        }
        else {
            username.setErrors(null);
        }
    };
}
exports.ValidateUsername = ValidateUsername;
//# sourceMappingURL=username.validator.js.map