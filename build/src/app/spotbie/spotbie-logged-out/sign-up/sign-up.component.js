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
const email_unique_validator_1 = require("../../../validators/email-unique.validator");
const free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
const web_intent_1 = require("../../../helpers/cordova/web-intent");
let SignUpComponent = class SignUpComponent {
    constructor(router, signUpService, formBuilder, emailUniqueCheckService, userAuthService) {
        this.router = router;
        this.signUpService = signUpService;
        this.formBuilder = formBuilder;
        this.emailUniqueCheckService = emailUniqueCheckService;
        this.userAuthService = userAuthService;
        this.closeWindow = new core_1.EventEmitter();
        this.logInEvent = new core_1.EventEmitter();
        this.faEye = free_solid_svg_icons_1.faEye;
        this.faInfo = free_solid_svg_icons_1.faInfoCircle;
        this.faEyeSlash = free_solid_svg_icons_1.faEyeSlash;
        this.signingUp = false;
        this.signUpBox = false;
        this.submitted = false;
        this.loading = false;
        this.alreadyConfirmedEmail = '';
        this.emailIsConfirmed = false;
        this.passwordShow = false;
        this.business = false;
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
        this.loading = true;
        if (this.router.url === '/business') {
            this.business = true;
        }
        else {
            this.business = false;
        }
        this.initSignUpForm();
    }
    scrollTo(el) {
        $('html, body').animate({ scrollTop: $(el).offset().top }, 'slow');
    }
    closeWindowX() {
        this.closeWindow.emit(this.windowObj);
    }
    removeWhiteSpace(key) {
        this.signUpFormx.get(key).setValue(this.signUpFormx.get(key).value.trim());
    }
    togglePassword() {
        this.passwordShow = !this.passwordShow;
    }
    initSignUp() {
        this.submitted = true;
        this.loading = true;
        this.spotbieSignUpIssues.nativeElement.scrollTo(0, 0);
        this.signUpFormx.updateValueAndValidity();
        // stop here if form is invalid
        if (this.signUpFormx.invalid) {
            this.signingUp = false;
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
            this.loading = false;
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
        this.signUpService
            .initRegister(signUpObj)
            .pipe((0, operators_1.catchError)(this.signUpError()))
            .subscribe(resp => {
            this.initSignUpCallback(resp);
        });
    }
    signUpError(operation = 'operation', result) {
        this.signingUp = false;
        this.loading = false;
        return (error) => {
            const signUpInstructions = this.spotbieSignUpIssues.nativeElement;
            signUpInstructions.style.display = 'none';
            const errorList = error.error.errors;
            if (errorList.username) {
                const errors = {};
                errorList.username.forEach(err => {
                    errors[err] = true;
                });
                this.signUpFormx.get('spotbieUsername').setErrors(errors);
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
                errorList.username.forEach(err => {
                    errors[err] = true;
                });
                this.signUpFormx.get('spotbiePassword').setErrors(errors);
                document.getElementById('user_pass').style.border = '1px solid red';
            }
            else {
                document.getElementById('user_pass').style.border = 'unset';
            }
            this.signingUp = false;
            setTimeout(() => {
                signUpInstructions.style.display = 'block';
            }, 200);
            return (0, rxjs_1.of)(result);
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
        this.signUpFormx.setAsyncValidators(email_unique_validator_1.ValidateUniqueEmail.valid(this.emailUniqueCheckService, this.spotbieEmail));
        this.loading = false;
    }
    usersHome() {
        this.router.navigate(['/home']);
    }
    businessHome() {
        this.router.navigate(['/business']);
    }
    getCurrentWindowBg() {
        if (this.business) {
            return 'sb-businessBg';
        }
        else {
            return 'sb-regularBg';
        }
    }
    openTerms() {
        (0, web_intent_1.externalBrowserOpen)('https://spotbie.com/terms');
    }
    initSignUpCallback(resp) {
        const signUpInstructions = this.spotbieSignUpIssues.nativeElement;
        if (resp.message === 'success') {
            localStorage.setItem('spotbie_userLogin', resp.user.username);
            localStorage.setItem('spotbie_loggedIn', '1');
            localStorage.setItem('spotbie_rememberMe', '0');
            localStorage.setItem('spotbie_userId', resp.user.id);
            localStorage.setItem('spotbie_userDefaultImage', resp.spotbie_user.default_picture);
            localStorage.setItem('spotbie_userType', resp.spotbie_user.user_type);
            localStorage.setItem('spotbiecom_session', resp.token_info.original.access_token);
            signUpInstructions.innerHTML =
                "<span class='spotbie-text-gradient'>Welcome to SpotBie!</span>";
            window.location.reload();
        }
        else {
            signUpInstructions.innerHTML =
                "<span class='spotbie-text-gradient spotbie-error'>There has been an error signing up.</span>";
        }
        this.loading = false;
        this.signingUp = false;
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