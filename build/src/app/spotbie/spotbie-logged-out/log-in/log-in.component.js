"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogInComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const preferences_1 = require("@capacitor/preferences");
let LogInComponent = class LogInComponent {
    constructor(host = null, formBuilder, userAuthService, router, loadingCtrl) {
        this.host = host;
        this.formBuilder = formBuilder;
        this.userAuthService = userAuthService;
        this.router = router;
        this.loadingCtrl = loadingCtrl;
        this.faEye = free_solid_svg_icons_1.faEye;
        this.faEyeSlash = free_solid_svg_icons_1.faEyeSlash;
        this.loading$ = new rxjs_1.BehaviorSubject(undefined);
        this.submitted$ = new rxjs_1.BehaviorSubject(false);
        this.passwordShow = false;
        this.business = false;
        this.initLoading();
    }
    ngOnInit() {
        this.initLogInForm();
        this.checkTokenLogin();
    }
    async checkTokenLogin() {
        const retLastUsername = await preferences_1.Preferences.get({
            key: 'spotbie_lastLoggedUserName',
        });
        this.current_login_username = retLastUsername.value;
        const retRememberMe = await preferences_1.Preferences.get({ key: 'spotbie_rememberMe' });
        const rememberMe = retRememberMe.value;
        const retIsLoggedIn = await preferences_1.Preferences.get({ key: 'spotbie_loggedIn' });
        const isLoggedIn = retIsLoggedIn.value;
        if (rememberMe === '1' && isLoggedIn !== '1') {
            this.initTokenLogin();
        }
    }
    /**
     * Shows and hide the password text.
     */
    togglePassword() {
        this.passwordShow = !this.passwordShow;
    }
    /**
     * Will log the user in.
     * @param userLogin
     * @param userPass
     * @param userRememberMe
     * @param userReMemberMeToken
     */
    loginUser(userLogin, userPass, userRememberMe) {
        this.userAuthService
            .initLogin(userLogin, userPass, userRememberMe)
            .subscribe(resp => {
            this.loginCallback(resp);
        }, e => {
            this.loading$.next(false);
            this.spotbieSignUpIssues.nativeElement.innerHTML =
                "<span class='spotbie-text-gradient spotbie-error'>INVALID USERNAME OR PASSWORD.</span>";
            this.spotbieSignUpIssues.nativeElement.style.display = 'block';
            this.logInForm.get('spotbiePassword').setErrors({ required: false });
            this.logInForm.get('spotbieUsername').setErrors({ required: false });
            return;
        });
    }
    loginCallback(loginResponse) {
        if (loginResponse.error === 'popup_closed_by_user') {
            this.loading$.next(false);
            return;
        }
        if (!loginResponse) {
            this.logInForm.setErrors(null);
            this.logInForm.get('spotbieUsername').setErrors({ invalidUorP: true });
            this.loading$.next(false);
        }
        const loginStatus = loginResponse.message;
        if (loginStatus === 'success' || loginStatus === 'confirm') {
            preferences_1.Preferences.set({
                key: 'spotbie_userLogin',
                value: loginResponse.user.username,
            });
            preferences_1.Preferences.set({ key: 'spotbie_loggedIn', value: '1' });
            preferences_1.Preferences.set({
                key: 'spotbie_rememberMe',
                value: this.userAuthService.userRememberMe,
            });
            preferences_1.Preferences.set({
                key: 'spotbie_userType',
                value: loginResponse.spotbie_user.user_type,
            });
            preferences_1.Preferences.set({
                key: 'spotbiecom_session',
                value: loginResponse.token_info.original.access_token,
            });
            if (this.userAuthService.userRememberMe === '1') {
                this.rememberMeToken = loginResponse.remember_me_token;
                preferences_1.Preferences.set({
                    key: 'spotbie_rememberMeToken',
                    value: this.rememberMeToken,
                });
            }
            this.router.navigate(['/user-home']);
            this.loading$.next(false);
        }
        else {
            this.spotbieSignUpIssues.nativeElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
            if (loginStatus === 'invalid_cred' ||
                loginStatus === 'spotbie_account' ||
                loginStatus === 'wrong_account_type') {
                if (loginStatus === 'invalid_cred') {
                    this.spotbieSignUpIssues.nativeElement.innerHTML =
                        "<span class='spotbie-text-gradient spotbie-error'>INVALID USERNAME OR PASSWORD.</span>";
                    this.spotbieSignUpIssues.nativeElement.style.display = 'block';
                }
                else if (loginStatus === 'spotbie_account') {
                    this.logInForm
                        .get('spotbieUsername')
                        .setErrors({ spotbie_account: true });
                }
                else if (loginStatus === 'wrong_account_type') {
                    this.logInForm
                        .get('spotbieUsername')
                        .setErrors({ wrong_account_type: true });
                }
            }
        }
        this.loading$.next(false);
    }
    /**
     * Initiate the user login.
     */
    initLogIn() {
        this.loading$.next(true);
        this.submitted$.next(true);
        this.userAuthService.route = this.router.url;
        this.loginUser(this.email, this.password, '1');
    }
    /**
     * Initiate the login form.
     * @private
     */
    async initLogInForm() {
        const usernameValidators = [forms_1.Validators.required];
        const passwordValidators = [forms_1.Validators.required];
        this.logInForm = this.formBuilder.group({
            spotbieUsername: ['', usernameValidators],
            spotbiePassword: ['', passwordValidators],
        });
        this.loading$.next(false);
    }
    /**
     * Log the user in with the stored token.
     */
    async initTokenLogin() {
        const retSavedUsernmae = await preferences_1.Preferences.get({ key: 'spotbie_userLogin' });
        const savedUsername = retSavedUsernmae.value;
        // The userPass is set to a random key because the user doesn't need a password to log-in with a token.
        this.loginUser(savedUsername, 'randomkey', '1');
    }
    get email() {
        return this.logInForm.get('spotbieUsername').value;
    }
    get password() {
        return this.logInForm.get('spotbiePassword').value;
    }
    get f() {
        return this.logInForm.controls;
    }
    /**
     * Close this window.
     * It'd be better to navigate between sign-up and log-in using router instead.
     */
    closeWindow() {
        this.host.logInWindow$.next(false);
    }
    /**
     * Navigate to forgot password route.
     */
    openForgotPassword() {
        this.router.navigate(['/forgot-password']);
    }
    /**
     * Opens the sign up component.
     */
    signUp() {
        this.host.signUpWindow$.next(true);
        this.host.logInWindow$.next(false);
    }
    /**
     * subscribe to the loading behavior subject to toggle the loading screen on/off.
     */
    initLoading() {
        this.loading$
            .pipe((0, operators_1.filter)(loading => loading !== undefined))
            .subscribe(async (loading) => {
            if (loading) {
                this.loader = await this.loadingCtrl.create({
                    message: 'LOADING...',
                });
                this.loader.present();
            }
            else {
                if (this.loader) {
                    this.loader.dismiss();
                    this.loader = null;
                }
            }
        });
    }
};
tslib_1.__decorate([
    (0, core_1.ViewChild)('spotbieSignUpIssues')
], LogInComponent.prototype, "spotbieSignUpIssues", void 0);
LogInComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: ' app-log-in',
        templateUrl: './log-in.component.html',
        styleUrls: ['../../menu.component.css', './log-in.component.css'],
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
    })
], LogInComponent);
exports.LogInComponent = LogInComponent;
//# sourceMappingURL=log-in.component.js.map