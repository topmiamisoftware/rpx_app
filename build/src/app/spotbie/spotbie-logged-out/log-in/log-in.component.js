"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogInComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
const logout_callback_1 = require("../../../helpers/logout-callback");
const rxjs_1 = require("rxjs");
let LogInComponent = class LogInComponent {
    constructor(host = null, formBuilder, userAuthService, router) {
        this.host = host;
        this.formBuilder = formBuilder;
        this.userAuthService = userAuthService;
        this.router = router;
        this.faEye = free_solid_svg_icons_1.faEye;
        this.faEyeSlash = free_solid_svg_icons_1.faEyeSlash;
        this.loading$ = new rxjs_1.BehaviorSubject(false);
        this.submitted = false;
        this.helpToggle = false;
        this.rememberMeState = '0';
        this.rememberMeLight = 'red';
        this.rememberMeTextOff = 'Remember Me is set to OFF.';
        this.rememberMeTextOn = 'Remember Me is set to ON.';
        this.rememberMeToggleStateText = this.rememberMeTextOff;
        this.forgotPasswordWindow = { open: false };
        this.passwordShow = false;
        this.business = false;
    }
    togglePassword() {
        this.passwordShow = !this.passwordShow;
    }
    toggleRememberMe() {
        if (this.rememberMeState === '0') {
            this.rememberMeState = '1';
            this.rememberMeLight = '#7bb126';
            this.rememberMeToggleStateText = this.rememberMeTextOn;
        }
        else {
            this.rememberMeState = '0';
            this.rememberMeLight = 'red';
            this.rememberMeToggleStateText = this.rememberMeTextOff;
        }
    }
    toggleRememberMeHelp() {
        this.helpToggle = !this.helpToggle;
    }
    loginUser() {
        this.spotbieSignUpIssues.nativeElement.style.display = 'none';
        this.userAuthService.initLogin().subscribe(resp => {
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
            localStorage.setItem('spotbie_userLogin', loginResponse.user.username);
            localStorage.setItem('spotbie_loggedIn', '1');
            localStorage.setItem('spotbie_rememberMe', this.userAuthService.userRememberMe);
            localStorage.setItem('spotbie_userId', loginResponse.user.id);
            localStorage.setItem('spotbie_userDefaultImage', loginResponse.spotbie_user.default_picture);
            localStorage.setItem('spotbie_userType', loginResponse.spotbie_user.user_type);
            localStorage.setItem('spotbiecom_session', loginResponse.token_info.original.access_token);
            if (this.userAuthService.userRememberMe === '1') {
                this.rememberMeToken = loginResponse.remember_me_token;
                localStorage.setItem('spotbie_rememberMeToken', this.rememberMeToken);
            }
            this.router.navigate(['/user-home']);
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
                (0, logout_callback_1.logOutCallback)({ success: true }, false);
            }
        }
        this.loading$.next(false);
    }
    initLogIn() {
        this.loading$.next(true);
        this.submitted = true;
        this.userAuthService.userLogin = this.email;
        this.userAuthService.userPassword = this.password;
        this.userAuthService.userRememberMe = this.rememberMeState;
        this.userAuthService.route = this.router.url;
        this.loginUser();
    }
    initLogInForm() {
        const usernameValidators = [forms_1.Validators.required];
        const passwordValidators = [forms_1.Validators.required];
        if (localStorage.getItem('spotbie_rememberMe') === '1')
            this.toggleRememberMe();
        this.logInForm = this.formBuilder.group({
            spotbieUsername: ['', usernameValidators],
            spotbiePassword: ['', passwordValidators],
        });
        if (this.current_login_username !== '')
            this.logInForm
                .get('spotbieUsername')
                .setValue(this.current_login_username);
        this.loading$.next(false);
    }
    initTokenLogin() {
        const savedRememberMeToken = localStorage.getItem('spotbie_rememberMeToken');
        const savedUsername = localStorage.getItem('spotbie_userLogin');
        this.userAuthService.userLogin = savedUsername;
        this.userAuthService.userPassword = '';
        this.userAuthService.userRememberMe = '1';
        this.userAuthService.userRememberMeToken = savedRememberMeToken;
        this.loginUser();
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
    closeWindow() {
        this.host.closeWindow(this.host.logInWindow);
    }
    openWindow(window) {
        window.open = true;
    }
    signUp() {
        this.host.openWindow(this.host.signUpWindow);
        this.host.closeWindow(this.host.logInWindow);
    }
    openIg() {
        if (this.business) {
            window.open('https://www.instagram.com/spotbie.business/', '_blank');
        }
        else {
            window.open('https://www.instagram.com/spotbie.loyalty.points/', '_blank');
        }
    }
    openYoutube() {
        window.open('https://www.youtube.com/channel/UCtxkgw0SYiihwR7O8f-xIYA', '_blank');
    }
    openTwitter() {
        window.open('https://twitter.com/SpotBie', '_blank');
    }
    openBlog() {
        window.open('https://blog.spotbie.com/', '_blank');
    }
    ngOnInit() {
        this.loading$.next(true);
        this.current_login_username = localStorage.getItem('spotbie_lastLoggedUserName');
        this.bg_color = '#181818';
        this.current_login_photo = 'assets/images/user.png';
        this.business = false;
        this.initLogInForm();
        if (localStorage.getItem('spotbie_rememberMe') === '1' &&
            localStorage.getItem('spotbie_loggedIn') !== '1') {
            this.initTokenLogin();
        }
    }
};
tslib_1.__decorate([
    (0, core_1.ViewChild)('spotbieSignUpIssues')
], LogInComponent.prototype, "spotbieSignUpIssues", void 0);
LogInComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-log-in',
        templateUrl: './log-in.component.html',
        styleUrls: ['../../menu.component.css', './log-in.component.css'],
        changeDetection: core_1.ChangeDetectionStrategy.OnPush,
    })
], LogInComponent);
exports.LogInComponent = LogInComponent;
//# sourceMappingURL=log-in.component.js.map