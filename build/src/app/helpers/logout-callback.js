"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logOutCallback = void 0;
const preferences_1 = require("@capacitor/preferences");
const logOutCallback = function (resp) {
    if (resp.success) {
        preferences_1.Preferences.set({
            key: 'spotbie_loggedIn',
            value: '0',
        });
        preferences_1.Preferences.set({
            key: 'spotbie_userApiKey',
            value: null,
        });
        preferences_1.Preferences.set({
            key: 'spotbie_rememberMe',
            value: '0',
        });
        preferences_1.Preferences.set({
            key: 'spotbie_rememberMeToken',
            value: null,
        });
        preferences_1.Preferences.set({
            key: 'spotbie_userType',
            value: null,
        });
        location.href = '/home';
    }
};
exports.logOutCallback = logOutCallback;
//# sourceMappingURL=logout-callback.js.map