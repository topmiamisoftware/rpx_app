"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoutingModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const login_guard_service_service_1 = require("./services/route-services/login-guard-service.service");
const info_object_component_1 = require("./spotbie/map/info-object/info-object.component");
const loyalty_points_component_1 = require("./spotbie/spotbie-logged-in/loyalty-points/loyalty-points.component");
const reward_menu_component_1 = require("./spotbie/spotbie-logged-in/reward-menu/reward-menu.component");
const my_list_component_1 = require("./spotbie/spotbie-logged-in/my-list/my-list.component");
const routes = [
    {
        path: 'home',
        loadChildren: () => Promise.resolve().then(() => require('./home/home.module')).then(m => m.HomeModule),
    },
    {
        path: 'forgot-password',
        loadChildren: () => Promise.resolve().then(() => require('./spotbie/spotbie-logged-out/forgot-password/forgot-password.module')).then(m => m.ForgotPasswordModule),
    },
    {
        path: 'user-home',
        loadChildren: () => Promise.resolve().then(() => require('./user-home/user-home.module')).then(m => m.UserHomeModule),
        canActivate: [login_guard_service_service_1.LoginGuardServiceService],
    },
    { path: 'business-menu/:qrCode/:rewardUuid', component: reward_menu_component_1.RewardMenuComponent },
    { path: 'business-menu/:qrCode', component: reward_menu_component_1.RewardMenuComponent },
    {
        path: 'community',
        loadChildren: () => Promise.resolve().then(() => require('./spotbie/community-member/community-member.module')).then(m => m.CommunityMemberModule),
    },
    {
        path: 'loyalty-points/:qrCode/:totalSpent/:loyaltyPointReward',
        component: loyalty_points_component_1.LoyaltyPointsComponent,
    },
    { path: 'place-to-eat/:name/:id', component: info_object_component_1.InfoObjectComponent },
    { path: 'shopping/:name/:id', component: info_object_component_1.InfoObjectComponent },
    { path: 'event/:name/:id', component: info_object_component_1.InfoObjectComponent },
    {
        path: 'my-list',
        component: my_list_component_1.MyList,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'balance-list',
            },
            {
                path: 'balance-list',
                loadChildren: () => Promise.resolve().then(() => require('./spotbie/spotbie-logged-in/my-list/balances/balances.module')).then(m => m.BalancesModule),
            },
            {
                path: 'rewards',
                loadChildren: () => Promise.resolve().then(() => require('./spotbie/spotbie-logged-in/my-list/redeemable/redeemable.module')).then(m => m.RedeemableModule),
            },
            {
                path: 'ledger',
                loadChildren: () => Promise.resolve().then(() => require('./spotbie/spotbie-logged-in/my-list/ledger/ledger.module')).then(m => m.LedgerModule),
            },
            {
                path: 'redeemed',
                loadChildren: () => Promise.resolve().then(() => require('./spotbie/spotbie-logged-in/my-list/redeemed/redeemed.module')).then(m => m.RedeemedModule),
            },
        ],
    },
    { path: 'login-success', redirectTo: '/user-home', pathMatch: 'full' },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        imports: [
            router_1.RouterModule.forRoot(routes, { preloadingStrategy: router_1.PreloadAllModules }),
        ],
        exports: [router_1.RouterModule],
    })
], AppRoutingModule);
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app-routing.module.js.map