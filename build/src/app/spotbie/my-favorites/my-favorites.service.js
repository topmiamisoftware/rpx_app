"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyFavoritesService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const operators_1 = require("rxjs/operators");
const error_helper_1 = require("../../helpers/error-helper");
const spotbieGlobals = require("../../globals");
const GET_FAVORITES_LOGGED_IN_API = `${spotbieGlobals.API}my-favorites/index`;
const SAVE_FAVORITES_API = `${spotbieGlobals.API}my-favorites/save-favorite`;
const REMOVE_FAVORITES_API = `${spotbieGlobals.API}my-favorites/remove-favorite`;
const IS_A_FAVORITE_API = `${spotbieGlobals.API}my-favorites/is-a-favorite`;
let MyFavoritesService = class MyFavoritesService {
    constructor(http) {
        this.http = http;
    }
    getFavoritesLoggedIn(page) {
        return this.http
            .post(GET_FAVORITES_LOGGED_IN_API, page)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('getFavoritesLoggedIn')));
    }
    getFavoritesLoggedOut() {
        const myFavoriteItems = JSON.parse(localStorage.getItem('spotbie_currentFavorites'));
        return myFavoriteItems;
    }
    addFavorite(favoriteObj) {
        const saveFavoritesApi = `${SAVE_FAVORITES_API}`;
        return this.http
            .post(saveFavoritesApi, favoriteObj)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('addFavorite')));
    }
    addFavoriteLoggedOut(favoriteObj) {
        let currentFavorites = JSON.parse(localStorage.getItem('spotbie_currentFavorites'));
        if (currentFavorites === null) {
            currentFavorites = [];
        }
        currentFavorites.push(favoriteObj);
        localStorage.setItem('spotbie_currentFavorites', JSON.stringify(currentFavorites));
    }
    removeFavorite(id) {
        const saveFavoritesApi = `${REMOVE_FAVORITES_API}`;
        const removeFavoriteObj = {
            _method: 'DELETE',
            id,
        };
        return this.http
            .post(saveFavoritesApi, removeFavoriteObj)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('addFavorite')));
    }
    removeFavoriteLoggedOut(id) {
        const currentFavorites = this.getFavoritesLoggedOut();
        let indextoSplice;
        currentFavorites.find((favorite, index) => {
            if (favorite.third_party_id === id) {
                indextoSplice = index;
            }
        });
        currentFavorites.splice(indextoSplice, 1);
        localStorage.setItem('spotbie_currentFavorites', JSON.stringify(currentFavorites));
        return;
    }
    isInMyFavorites(objId, objType) {
        const isInMyFavoritesObj = {
            obj_type: objType,
            third_party_id: objId,
        };
        return this.http
            .post(IS_A_FAVORITE_API, isInMyFavoritesObj)
            .pipe((0, operators_1.catchError)((0, error_helper_1.handleError)('pullInfoObject')));
    }
    isInMyFavoritesLoggedOut(objId) {
        const currentFavorites = this.getFavoritesLoggedOut();
        let found = false;
        if (currentFavorites === null) {
            return false;
        }
        currentFavorites.find((favorite, index) => {
            if (favorite.third_party_id === objId) {
                found = true;
            }
        });
        return found;
    }
};
MyFavoritesService = tslib_1.__decorate([
    (0, core_1.Injectable)({
        providedIn: 'root',
    })
], MyFavoritesService);
exports.MyFavoritesService = MyFavoritesService;
//# sourceMappingURL=my-favorites.service.js.map