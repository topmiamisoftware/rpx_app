"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const angular_1 = require("@ionic/angular");
const platform_browser_1 = require("@angular/platform-browser");
const app_routing_module_1 = require("./app-routing.module");
const http_1 = require("@angular/common/http");
const app_component_1 = require("./app.component");
const home_module_1 = require("./home/home.module");
const user_home_module_1 = require("./user-home/user-home.module");
const url_sanitizer_pipe_1 = require("./pipes/url-sanitizer.pipe");
const version_check_service_1 = require("./services/version-check.service");
const helper_module_1 = require("./helpers/helper.module");
const animations_1 = require("@angular/platform-browser/animations");
const token_interceptor_service_1 = require("./helpers/token-interceptor/token-interceptor.service");
const forms_1 = require("@angular/forms");
const userauth_service_1 = require("./services/userauth.service");
const store_1 = require("@ngrx/store");
const loyalty_points_reducer_1 = require("./spotbie/spotbie-logged-in/loyalty-points/loyalty-points.reducer");
const stripe_angular_1 = require("stripe-angular");
let AppModule = class AppModule {
};
AppModule = tslib_1.__decorate([
    (0, core_1.NgModule)({
        declarations: [
            app_component_1.AppComponent,
            url_sanitizer_pipe_1.UrlSanitizerPipe,
        ],
        imports: [
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule,
            app_routing_module_1.AppRoutingModule,
            http_1.HttpClientModule,
            home_module_1.HomeModule,
            user_home_module_1.UserHomeModule,
            helper_module_1.HelperModule,
            animations_1.BrowserAnimationsModule,
            stripe_angular_1.StripeModule.forRoot(''),
            store_1.StoreModule.forRoot({
                loyaltyPoints: loyalty_points_reducer_1.loyaltyPointsReducer
            }),
            platform_browser_1.BrowserModule,
            angular_1.IonicModule.forRoot(),
        ],
        providers: [
            version_check_service_1.VersionCheckService,
            userauth_service_1.UserauthService,
            { provide: http_1.HTTP_INTERCEPTORS, useClass: token_interceptor_service_1.TokenInterceptor, multi: true },
        ],
        bootstrap: [app_component_1.AppComponent],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map