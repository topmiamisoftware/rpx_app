"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromErrorResponse = exports.handleError = exports.dismissToast = exports.displayToast = exports.displayError = void 0;
const rxjs_1 = require("rxjs");
function displayError(error) {
    console.log('SpotBie Error : ', error);
}
exports.displayError = displayError;
function displayToast(toastMessage) {
    const newDiv = document.getElementById('spotbieToastErrorMsg');
    newDiv.innerHTML = toastMessage;
    document.getElementById('spotbieToastErrorOverlay').style.display = 'block';
    setTimeout(() => {
        dismissToast();
    }, 2000);
}
exports.displayToast = displayToast;
function dismissToast() {
    document.getElementById('spotbieToastErrorOverlay').style.display = 'none';
}
exports.dismissToast = dismissToast;
function handleError(operation = 'operation', result) {
    return (error) => {
        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead
        // TODO: better job of transforming error for user consumption
        //this.log(`${operation} failed: ${error.message}`);
        // Let the app keep running by returning an empty result.
        return (0, rxjs_1.of)(result);
    };
}
exports.handleError = handleError;
const fromErrorResponse = (errorResponse) => {
    // 1 - Create empty array to store errors
    const errors = [];
    // 2 - check if the error object is present in the response
    if (errorResponse.error) {
        // 3 - Push the main error message to the array of errors
        errors.push(errorResponse.error.message);
        // 4 - Check for Laravel form validation error messages object
        if (errorResponse.error.errors) {
            // 5 - For each error property (which is a form field)
            for (const property in errorResponse.error.errors) {
                if (errorResponse.error.errors.hasOwnProperty(property)) {
                    // 6 - Extract it's array of errors
                    const propertyErrors = errorResponse.error.errors[property];
                    // 7 - Push all errors in the array to the errors array
                    propertyErrors.forEach(error => errors.push(error));
                }
            }
        }
    }
    return errors;
};
exports.fromErrorResponse = fromErrorResponse;
//# sourceMappingURL=error-helper.js.map