"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionCheckService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
let VersionCheckService = class VersionCheckService {
    constructor(http) {
        this.http = http;
        // this will be replaced by actual hash post-build.js
        this.currentHash = '{{POST_BUILD_ENTERS_HASH_HERE}}';
    }
    /**
     * Checks in every set frequency the version of frontend application
     *
     * @param url
     * @param frequency - in milliseconds, defaults to 30 minutes
     */
    initVersionCheck(url, frequency = 1000 * 60 * 30) {
        setInterval(() => {
            this.checkVersion(url);
        }, frequency);
    }
    /**
     * Will do the call and check if the hash has changed or not
     *
     * @param url
     */
    checkVersion(url) {
        // timestamp these requests to invalidate caches
        this.http.get(url + '?t=' + new Date().getTime()).subscribe((response) => {
            const hash = response.hash;
            const hashChanged = this.hasHashChanged(this.currentHash, hash);
            // If new version, do something
            if (hashChanged) {
                // ENTER YOUR CODE TO DO SOMETHING UPON VERSION CHANGE
                // for an example: location.reload();
            }
            // store the new hash so we wouldn't trigger versionChange again
            // only necessary in case you did not force refresh
            this.currentHash = hash;
        }, err => {
            console.error(err, 'Could not get version');
        });
    }
    /**
     * Checks if hash has changed.
     * This file has the JS hash, if it is a different one than in the version.json
     * we are dealing with version change
     *
     * @param currentHash
     * @param newHash
     * @returns
     */
    hasHashChanged(currentHash, newHash) {
        if (!currentHash || currentHash === '{{POST_BUILD_ENTERS_HASH_HERE}}') {
            return false;
        }
        return currentHash !== newHash;
    }
};
VersionCheckService = tslib_1.__decorate([
    (0, core_1.Injectable)()
], VersionCheckService);
exports.VersionCheckService = VersionCheckService;
//# sourceMappingURL=version-check.service.js.map