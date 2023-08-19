"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderPage = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
let FolderPage = class FolderPage {
    constructor() {
        this.activatedRoute = (0, core_1.inject)(router_1.ActivatedRoute);
    }
    ngOnInit() {
        this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    }
};
FolderPage = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-folder',
        templateUrl: './folder.page.html',
        styleUrls: ['./folder.page.scss'],
    })
], FolderPage);
exports.FolderPage = FolderPage;
//# sourceMappingURL=folder.page.js.map