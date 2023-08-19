"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailConfirmationService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const environment_1 = require("../../../environments/environment");
const retry_operators_1 = require("../../helpers/retry.operators");
const EMAIL_API = `${environment_1.environment.apiEndpoint}user/unique-email`;
const SEND_EMAIL_CODE_API = `${environment_1.environment.apiEndpoint}user/send-code`;
const EMAIL_CONFIRM_PIN_API = `${environment_1.environment.apiEndpoint}user/check-confirm`;
let EmailConfirmationService = class EmailConfirmationService {
    constructor(httpClient) {
        this.httpClient = httpClient;
    }
    sendCode(firstName, email) {
        const sendCodeApi = `${SEND_EMAIL_CODE_API}`;
        const sendCodeObj = {
            first_name: firstName,
            email,
        };
        return this.httpClient
            .post(sendCodeApi, sendCodeObj)
            .pipe((0, retry_operators_1.retryWithBackOff)(1000));
    }
    checkCode(code, email) {
        const sendCodeApi = `${EMAIL_CONFIRM_PIN_API}`;
        const sendCodeObj = {
            confirm_code: code,
            email,
        };
        return this.httpClient
            .post(sendCodeApi, sendCodeObj)
            .pipe((0, retry_operators_1.retryWithBackOff)(1000));
    }
    checkIfEmailUnique(email) {
        const testEmailApi = EMAIL_API;
        const emailObj = {
            email,
        };
        return this.httpClient
            .post(testEmailApi, emailObj)
            .pipe((0, retry_operators_1.retryWithBackOff)(1000));
    }
};
EmailConfirmationService = tslib_1.__decorate([
    (0, core_1.Injectable)({
        providedIn: 'root',
    })
], EmailConfirmationService);
exports.EmailConfirmationService = EmailConfirmationService;
//# sourceMappingURL=email-confirmation.service.js.map