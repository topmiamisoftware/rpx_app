"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDistanceFromLatLngInMiles = void 0;
function getDistanceFromLatLngInMiles(lat1, lon1, lat2, lon2) {
    const R = 3958; // Radius of the earth in miles
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in miles
    return d;
}
exports.getDistanceFromLatLngInMiles = getDistanceFromLatLngInMiles;
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}
//# sourceMappingURL=measure-units.helper.js.map