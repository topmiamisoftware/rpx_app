"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERSION = exports.NEW_USER_DEFAULT = exports.CHAT = exports.FRONT_END = exports.DEFAULTS = exports.RESOURCES = exports.API = void 0;
const environment_1 = require("../environments/environment");
exports.API = `${environment_1.environment.apiEndpoint}`;
exports.RESOURCES = `${environment_1.environment.apiEndpoint}`;
exports.DEFAULTS = `${environment_1.environment.apiEndpoint}defaults/`;
exports.FRONT_END = '/';
exports.CHAT = 'https://express.spotbie.com:8080';
exports.NEW_USER_DEFAULT = `${exports.DEFAULTS}user.png`;
const today = new Date();
const date = today.getFullYear() + '.' + (today.getMonth() + 1) + '.' + today.getDate();
exports.VERSION = 'Version: Beta ' + date;
// export const LOGIN_USER_API = "https://www.spotbie.com/"
//# sourceMappingURL=globals.js.map