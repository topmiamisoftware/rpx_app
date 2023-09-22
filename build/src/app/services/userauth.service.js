"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserauthService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const operators_1 = require("rxjs/operators");
const error_helper_1 = require("../helpers/error-helper");
const spotbieGlobals = require("../globals");
const USER_API = spotbieGlobals.API + 'user';
let UserauthService = class UserauthService {
    constructor(http) {
        this.http = http;
    }
    async checkIfLoggedIn() {
        const checkLoginObject = {};
        const loginApi = `${USER_API}/check-user-auth`;
        return new Promise((resolve, reject) => {
            this.http.post(loginApi, checkLoginObject).subscribe(resp => {
                if (resp.message === '1') {
                    resolve(resp);
                }
                else {
                    reject();
                }
            });
        });
    }
    logOut() {
        const logOutApi = `${USER_API}/logout`;
        return this.http.post(logOutApi, null);
    }
    initLogin(userLogin, userPassword, userRememberMe) {
        this.userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const params = {
            login: userLogin,
            password: userPassword,
            remember_me_opt: userRememberMe,
            timezone: this.userTimezone,
            route: this.route,
        };
        const logInApi = `${USER_API}/login`;
        return this.http.post(logInApi, params).pipe((0, operators_1.catchError)(err => {
            throw err;
        }));
    }
    getSettings() {
        const getSettingsApi = `${USER_API}/settings`;
        return this.http.post(getSettingsApi, null).pipe((0, operators_1.tap)(settings => {
            this.userProfile = settings;
        }), (0, operators_1.catchError)(err => {
            throw err;
        }));
    }
    saveSettings(user) {
        const saveSettingsApi = `${USER_API}/update`;
        let saveSettingsObj;
        if (user.business === undefined) {
            saveSettingsObj = {
                _method: 'PUT',
                username: user.username,
                email: user.email,
                first_name: user.spotbie_user.first_name,
                last_name: user.spotbie_user.last_name,
                phone_number: user.spotbie_user.phone_number,
                ghost_mode: user.spotbie_user.ghost_mode,
                privacy: user.spotbie_user.privacy,
                account_type: user.spotbie_user.user_type,
            };
        }
        else {
            saveSettingsObj = {
                _method: 'PUT',
                username: user.username,
                email: user.email,
                first_name: user.spotbie_user.first_name,
                last_name: user.spotbie_user.last_name,
                phone_number: user.spotbie_user.phone_number,
                ghost_mode: user.spotbie_user.ghost_mode,
                privacy: user.spotbie_user.privacy,
                account_type: user.spotbie_user.user_type,
                origin_description: user.business.description,
                origin_address: user.business.address,
                origin_title: user.business.name,
                origin_x: user.business.loc_x,
                origin_y: user.business.loc_y,
            };
        }
        return this.http.post(saveSettingsApi, saveSettingsObj).pipe((0, operators_1.catchError)(err => {
            throw err;
        }));
    }
    setPassResetPin(emailOrPhone) {
        const resetPasswordApi = `${USER_API}/send-pass-email`;
        const setPassResetObj = {
            email: emailOrPhone,
        };
        return this.http.post(resetPasswordApi, setPassResetObj).pipe((0, operators_1.catchError)(err => {
            throw err;
        }));
    }
    completeReset(password, passwordConfirmation, email, token) {
        const resetPasswordApi = `${USER_API}/complete-pass-reset`;
        const passResetObj = {
            _method: 'PUT',
            password,
            password_confirmation: passwordConfirmation,
            email,
            token,
        };
        return this.http
            .post(resetPasswordApi, passResetObj)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('completeReset')));
    }
    passwordChange(passwordChangeObj) {
        const resetPasswordApi = `${USER_API}/change-password`;
        const passResetObj = {
            _method: 'PUT',
            password: passwordChangeObj.password,
            password_confirmation: passwordChangeObj.passwordConfirmation,
            current_password: passwordChangeObj.currentPassword,
        };
        return this.http
            .post(resetPasswordApi, passResetObj)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('passwordChange')));
    }
    deactivateAccount(password, is_social_account) {
        const resetPasswordApi = `${USER_API}/deactivate`;
        const passResetObj = {
            _method: 'DELETE',
            password,
            is_social_account,
        };
        return this.http
            .post(resetPasswordApi, passResetObj)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('deactivateAccount')));
    }
};
UserauthService = tslib_1.__decorate([
    (0, core_1.Injectable)({
        providedIn: 'root',
    })
], UserauthService);
exports.UserauthService = UserauthService;
//# sourceMappingURL=userauth.service.js.map