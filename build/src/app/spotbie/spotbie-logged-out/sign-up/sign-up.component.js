"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignUpComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const username_validator_1 = require("../../../helpers/username.validator");
const password_validator_1 = require("../../../helpers/password.validator");
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
const free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
const app_launcher_1 = require("@capacitor/app-launcher");
const preferences_1 = require("@capacitor/preferences");
let SignUpComponent = class SignUpComponent {
    constructor(router, signUpService, formBuilder, loadingCtrl, changeDetection) {
        this.router = router;
        this.signUpService = signUpService;
        this.formBuilder = formBuilder;
        this.loadingCtrl = loadingCtrl;
        this.changeDetection = changeDetection;
        this.closeWindow = new core_1.EventEmitter();
        this.logInEvent = new core_1.EventEmitter();
        this.faEye = free_solid_svg_icons_1.faEye;
        this.faEyeSlash = free_solid_svg_icons_1.faEyeSlash;
        this.signingUp$ = new rxjs_1.BehaviorSubject(false);
        this.submitted$ = new rxjs_1.BehaviorSubject(false);
        this.loading$ = new rxjs_1.BehaviorSubject(undefined);
        this.passwordShow$ = new rxjs_1.BehaviorSubject(false);
        this.initLoading();
    }
    get spotbieUsername() {
        return this.signUpFormx.get('spotbieUsername').value;
    }
    get spotbieEmail() {
        return this.signUpFormx.get('spotbieEmail').value;
    }
    get spotbiePassword() {
        return this.signUpFormx.get('spotbiePassword').value;
    }
    get f() {
        return this.signUpFormx.controls;
    }
    ngOnInit() {
        this.initSignUpForm();
    }
    closeWindowX() {
        this.closeWindow.emit(this.windowObj);
    }
    removeWhiteSpace(key) {
        this.signUpFormx.get(key).setValue(this.signUpFormx.get(key).value.trim());
    }
    togglePassword() {
        this.passwordShow$.next(!this.passwordShow$.getValue());
    }
    initSignUp() {
        this.submitted$.next(true);
        this.spotbieSignUpIssues.nativeElement.scrollTo(0, 0);
        this.signUpFormx.updateValueAndValidity();
        // stop here if form is invalid
        if (this.signUpFormx.invalid) {
            if (this.signUpFormx.get('spotbieUsername').invalid) {
                document.getElementById('spotbie_username').style.border =
                    '1px solid red';
            }
            else {
                document.getElementById('spotbie_username').style.border = 'unset';
            }
            if (this.signUpFormx.get('spotbieEmail').invalid) {
                document.getElementById('user_email').style.border = '1px solid red';
            }
            else {
                document.getElementById('user_email').style.border = 'unset';
            }
            if (this.signUpFormx.get('spotbiePassword').invalid) {
                document.getElementById('user_pass').style.border = '1px solid red';
            }
            else {
                document.getElementById('user_pass').style.border = 'unset';
            }
            return;
        }
        else {
            document.getElementById('spotbie_username').style.border = 'unset';
            document.getElementById('user_email').style.border = 'unset';
            document.getElementById('user_pass').style.border = 'unset';
        }
        const username = this.spotbieUsername;
        const password = this.spotbiePassword;
        const email = this.spotbieEmail;
        const signUpObj = {
            username,
            password,
            email,
            route: this.router.url,
        };
        this.loading$.next(true);
        this.signUpService
            .initRegister(signUpObj)
            .pipe((0, operators_1.catchError)(this.signUpError()), (0, operators_1.filter)(r => !!r))
            .subscribe(resp => {
            this.initSignUpCallback(resp);
        });
    }
    populateErrors(r) {
        const errorList = r.errors;
        if (errorList.username) {
            const errors = {};
            errorList.username.forEach(err => {
                errors[err] = true;
            });
            this.signUpFormx.controls['spotbieUsername'].setErrors(errors);
            document.getElementById('spotbie_username').style.border =
                '1px solid red';
        }
        else {
            document.getElementById('spotbie_username').style.border = 'unset';
        }
        if (errorList.email) {
            const errors = {};
            errorList.email.forEach(err => {
                errors[err] = true;
            });
            this.signUpFormx.get('spotbieEmail').setErrors(errors);
            document.getElementById('user_email').style.border = '1px solid red';
        }
        else {
            document.getElementById('user_email').style.border = 'unset';
        }
        if (errorList.password) {
            const errors = {};
            errorList.password.forEach(err => {
                errors[err] = true;
            });
            this.signUpFormx.get('spotbiePassword').setErrors(errors);
            document.getElementById('user_pass').style.border = '1px solid red';
        }
        else {
            document.getElementById('user_pass').style.border = 'unset';
        }
        this.changeDetection.markForCheck();
        this.loading$.next(false);
    }
    signUpError(operation = 'operation', result) {
        return (error) => {
            return (0, rxjs_1.of)(error);
        };
    }
    logIn() {
        this.logInEvent.emit();
        this.closeWindowX();
    }
    initSignUpForm() {
        const usernameValidators = [forms_1.Validators.required];
        const passwordValidators = [forms_1.Validators.required];
        const emailValidators = [forms_1.Validators.required, forms_1.Validators.email];
        this.signUpFormx = this.formBuilder.group({
            spotbieUsername: ['', usernameValidators],
            spotbieEmail: ['', emailValidators],
            spotbiePassword: ['', passwordValidators],
        }, {
            validators: [
                (0, username_validator_1.ValidateUsername)('spotbieUsername'),
                (0, password_validator_1.ValidatePassword)('spotbiePassword'),
            ],
        });
    }
    async openTerms() {
        await app_launcher_1.AppLauncher.openUrl({ url: 'https://spotbie.com/terms' });
        return;
    }
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
    initSignUpCallback(resp) {
        console.log('error', resp);
        const signUpInstructions = this.spotbieSignUpIssues.nativeElement;
        if (resp.message === 'success') {
            preferences_1.Preferences.set({ key: 'spotbie_userLogin', value: resp.user.username });
            preferences_1.Preferences.set({ key: 'spotbie_loggedIn', value: '1' });
            preferences_1.Preferences.set({ key: 'spotbie_rememberMe', value: '0' });
            preferences_1.Preferences.set({
                key: 'spotbie_userType',
                value: resp.spotbie_user.user_type,
            });
            preferences_1.Preferences.set({
                key: 'spotbiecom_session',
                value: resp.token_info.original.access_token,
            });
            signUpInstructions.innerHTML =
                "<span class='spotbie-text-gradient'>Welcome to SpotBie!</span>";
            window.location.reload();
        }
        else {
            signUpInstructions.innerHTML =
                "<span class='spotbie-text-gradient spotbie-error'>There has been an error signing up.</span>";
            this.populateErrors(resp.error);
        }
        this.loading$.next(false);
        this.signingUp$.next(false);
    }
};
tslib_1.__decorate([
    (0, core_1.ViewChild)('spotbieRegisterInfo')
], SignUpComponent.prototype, "spotbieRegisterInfo", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('spotbieSignUpIssues')
], SignUpComponent.prototype, "spotbieSignUpIssues", void 0);
tslib_1.__decorate([
    (0, core_1.Output)()
], SignUpComponent.prototype, "closeWindow", void 0);
tslib_1.__decorate([
    (0, core_1.Output)()
], SignUpComponent.prototype, "logInEvent", void 0);
tslib_1.__decorate([
    (0, core_1.Input)()
], SignUpComponent.prototype, "windowObj", void 0);
SignUpComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-sign-up',
        templateUrl: './sign-up.component.html',
        styleUrls: ['../../menu.component.css', './sign-up.component.css'],
    })
], SignUpComponent);
exports.SignUpComponent = SignUpComponent;
//# sourceMappingURL=sign-up.component.js.map