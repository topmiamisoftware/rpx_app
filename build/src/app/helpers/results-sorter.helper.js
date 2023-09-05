"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.priceSortAsc = exports.reviewsSortDesc = exports.reviewsSortAsc = exports.ratingSortDesc = exports.ratingSortAsc = exports.distanceSortDesc = exports.distanceSortAsc = void 0;
function distanceSortAsc(a, b) {
    a = parseFloat(a.distance);
    b = parseFloat(b.distance);
    return a > b ? 1 : b > a ? -1 : 0;
}
exports.distanceSortAsc = distanceSortAsc;
function distanceSortDesc(a, b) {
    a = parseFloat(a.distance);
    b = parseFloat(b.distance);
    return a > b ? -1 : b > a ? 1 : 0;
}
exports.distanceSortDesc = distanceSortDesc;
function ratingSortAsc(a, b) {
    a = a.rating;
    b = b.rating;
    return a > b ? 1 : b > a ? -1 : 0;
}
exports.ratingSortAsc = ratingSortAsc;
function ratingSortDesc(a, b) {
    a = a.rating;
    b = b.rating;
    return a > b ? -1 : b > a ? 1 : 0;
}
exports.ratingSortDesc = ratingSortDesc;
function reviewsSortAsc(a, b) {
    a = a.review_count;
    b = b.review_count;
    return a > b ? 1 : b > a ? -1 : 0;
}
exports.reviewsSortAsc = reviewsSortAsc;
function reviewsSortDesc(a, b) {
    a = a.review_count;
    b = b.review_count;
    return a > b ? -1 : b > a ? 1 : 0;
}
exports.reviewsSortDesc = reviewsSortDesc;
function priceSortAsc(a, b) {
    a = a.price;
    b = b.price;
    if (a === undefined) {
        return -1;
    }
    else if (b === undefined) {
        return 1;
    }
    return a.length > b.length ? 1 : b.length > a.length ? -1 : 0;
}
exports.priceSortAsc = priceSortAsc;
//# sourceMappingURL=results-sorter.helper.js.map