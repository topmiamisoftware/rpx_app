"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityMemberComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const info_object_1 = require("../../models/info-object");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let CommunityMemberComponent = class CommunityMemberComponent {
    constructor(router, activatedRoute, businessMenuService) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.businessMenuService = businessMenuService;
        this.accountType = null;
        this.editMode = false;
        this.eventsClassification = null;
        this.qrCodeLink = null;
        this.closeWindowEvt = new core_1.EventEmitter();
        this.loadedBusiness$ = new rxjs_1.BehaviorSubject(null);
        this.infoObjectLoaded$ = new rxjs_1.BehaviorSubject(false);
        this.fullScreenMode = false;
        this.infoObject$ = new rxjs_1.BehaviorSubject(null);
    }
    closeWindow() {
        this.closeWindowEvt.emit();
    }
    getCommunityMember() {
        const getCommunityMemberReqObj = {
            qrCodeLink: this.qrCodeLink,
        };
        this.businessMenuService
            .getCommunityMember(getCommunityMemberReqObj)
            .pipe((0, operators_1.filter)(b => !!b), (0, operators_1.tap)(resp => {
            const business = resp.business;
            business.is_community_member = true;
            business.type_of_info_object = 'spotbie_community';
            business.loyalty_point_dollar_percent_value =
                business.loyalty_point_balance.loyalty_point_dollar_percent_value;
            business.rewardRate =
                business.loyalty_point_dollar_percent_value / 100;
            this.loadedBusiness$.next(business);
            const infoObject = new info_object_1.InfoObject();
            infoObject.business = business;
            infoObject.type_of_info_object = business.type_of_info_object;
            infoObject.type_of_info_object_category = this.accountType;
            infoObject.user_type = business.user_type;
            infoObject.is_community_member = business.is_community_member;
            infoObject.categories = business.categories;
            infoObject.description = business.description;
            infoObject.name = business.name;
            infoObject.qr_code_link = business.qr_code_link;
            infoObject.loyalty_point_dollar_percent_value =
                business.loyalty_point_dollar_percent_value;
            infoObject.rewardRate = business.rewardRate;
            this.infoObject$.next(infoObject);
            this.infoObjectLoaded$.next(true);
        }))
            .subscribe();
    }
    ngOnInit() {
        if (this.router.url.indexOf('community') > -1) {
            this.qrCodeLink = this.activatedRoute.snapshot.paramMap.get('qrCode');
            this.fullScreenMode = true;
        }
        this.getCommunityMember();
    }
};
tslib_1.__decorate([
    (0, core_1.Input)()
], CommunityMemberComponent.prototype, "lat", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], CommunityMemberComponent.prototype, "lng", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], CommunityMemberComponent.prototype, "business", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], CommunityMemberComponent.prototype, "ad", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], CommunityMemberComponent.prototype, "accountType", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], CommunityMemberComponent.prototype, "categories", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], CommunityMemberComponent.prototype, "editMode", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], CommunityMemberComponent.prototype, "eventsClassification", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], CommunityMemberComponent.prototype, "qrCodeLink", void 0);
tslib_1.__decorate([
    (0, core_1.Output)()
], CommunityMemberComponent.prototype, "closeWindowEvt", void 0);
CommunityMemberComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-community-member',
        templateUrl: './community-member.component.html',
        styleUrls: ['./community-member.component.css'],
    })
], CommunityMemberComponent);
exports.CommunityMemberComponent = CommunityMemberComponent;
//# sourceMappingURL=community-member.component.js.map