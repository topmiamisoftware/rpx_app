"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logOutCallback = void 0;
const environment_1 = require("../../environments/environment");
const logOutCallback = function (resp, locationReload = true) {
    if (resp.success) {
        let loggedOutFavorites = localStorage.getItem('spotbie_currentFavorites');
        localStorage.clear();
        localStorage.setItem('spotbie_currentFavorites', loggedOutFavorites);
        localStorage.setItem('spotbie_locationPrompted', '1');
        localStorage.setItem('spotbie_userId', '0');
        localStorage.setItem('spotbie_loggedIn', '0');
        localStorage.setItem('spotbie_userApiKey', null);
        localStorage.setItem('spotbie_rememberMe', '0');
        localStorage.setItem('spotbie_rememberMeToken', null);
        localStorage.setItem('spotbie_userType', null);
        if (locationReload)
            window.open(environment_1.environment.baseUrl + 'home', '_self');
    }
};
exports.logOutCallback = logOutCallback;
//# sourceMappingURL=logout-callback.js.map