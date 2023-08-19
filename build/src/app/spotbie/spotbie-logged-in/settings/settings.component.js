"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsComponent = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const password_validator_1 = require("../../../helpers/password.validator");
const must_match_validator_1 = require("../../../helpers/must-match.validator");
const username_validator_1 = require("../../../helpers/username.validator");
const name_validator_1 = require("../../../helpers/name.validator");
let SettingsComponent = class SettingsComponent {
    constructor(formBuilder, userAuthService, router) {
        this.formBuilder = formBuilder;
        this.userAuthService = userAuthService;
        this.router = router;
        this.closeWindowEvt = new core_1.EventEmitter();
        this.personalAccount = true;
        this.savePasswordBool = false;
        this.accountDeactivation = false;
        this.deactivationSubmitted = false;
        this.loading = false;
        this.helpText = '';
        this.submitted = false;
        this.placeFormSubmitted = false;
        this.adSettingsWindow = { open: false };
        this.passwordSubmitted = false;
        this.settingsFormInitiated = false;
        this.showNoResultsBox = false;
        this.showMobilePrompt = false;
        this.showMobilePrompt2 = false;
        this.isSocialAccount = false;
    }
    get username() {
        return this.settingsForm.get('spotbieUsername').value;
    }
    get firstName() {
        return this.settingsForm.get('spotbieFirstName').value;
    }
    get lastName() {
        return this.settingsForm.get('spotbieLastName').value;
    }
    get email() {
        return this.settingsForm.get('spotbieEmail').value;
    }
    get spotbiePhoneNumber() {
        return this.settingsForm.get('spotbiePhoneNumber').value;
    }
    get f() {
        return this.settingsForm.controls;
    }
    get password() {
        return this.passwordForm.get('spotbiePassword').value;
    }
    get confirmPassword() {
        return this.passwordForm.get('spotbieConfirmPassword').value;
    }
    get currentPassword() {
        return this.passwordForm.get('spotbieConfirmPassword').value;
    }
    get g() {
        return this.passwordForm.controls;
    }
    get deactivationPassword() {
        return this.deactivationForm.get('spotbieDeactivationPassword').value;
    }
    get h() {
        return this.deactivationForm.controls;
    }
    ngOnInit() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.loading = true;
        this.initSettingsForm('personal');
    }
    openWindow(window) {
        window.open = true;
    }
    savePassword() {
        this.spotbiePasswordInfoText.nativeElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
        if (this.passwordForm.invalid) {
            this.spotbiePasswordInfoText.nativeElement.style.display = 'block';
            return;
        }
        if (this.password !== this.confirmPassword) {
            console.log('confirm password error');
            this.spotbiePasswordInfoText.nativeElement.style.display = 'block';
            this.spotbiePasswordInfoText.nativeElement.innerHTML =
                'Passwords must match.';
            return;
        }
        this.spotbiePasswordInfoText.nativeElement.style.display = 'block';
        this.spotbiePasswordInfoText.nativeElement.innerHTML =
            'Great, your passwords match!';
        this.savePasswordBool = true;
        const currentPasswordValidators = [forms_1.Validators.required];
        this.passwordForm.addControl('spotbieCurrentPassword', new forms_1.FormControl('', currentPasswordValidators));
        this.passwordForm.get('spotbieCurrentPassword').setValue('123456789');
    }
    completeSavePassword() {
        if (this.loading) {
            return;
        }
        this.loading = true;
        if (this.passwordForm.invalid) {
            return;
        }
        const savePasswordObj = {
            password: this.password,
            passwordConfirmation: this.confirmPassword,
            currentPassword: this.confirmPassword,
        };
        this.userAuthService.passwordChange(savePasswordObj).subscribe(resp => {
            this.passwordChangeCallback(resp);
        }, error => {
            console.log('error', error);
        });
    }
    cancelPasswordSet() {
        this.passwordSubmitted = false;
        this.savePasswordBool = false;
    }
    saveSettings() {
        this.loading = true;
        this.submitted = true;
        if (this.settingsForm.invalid) {
            this.loading = false;
            this.spotbieSettingsWindow.nativeElement.scrollTo(0, 0);
            return;
        }
        this.user.username = this.username;
        this.user.email = this.email;
        this.user.spotbie_user.first_name = this.firstName;
        this.user.spotbie_user.last_name = this.lastName;
        this.user.spotbie_user.phone_number = this.spotbiePhoneNumber;
        this.userAuthService.saveSettings(this.user).subscribe({
            next: resp => {
                this.saveSettingsCallback(resp);
            },
            error: (error) => {
                if (error.error.errors.email[0] === 'notUnique') {
                    this.settingsForm.get('spotbie_email').setErrors({ notUnique: true });
                }
                this.spotbieSettingsInfoText.nativeElement.innerHTML = `
                    <span class='spotbie-text-gradient spotbie-error'>
                        There was an error saving.
                    </span>
                `;
                this.spotbieSettingsWindow.nativeElement.scrollTo(0, 0);
                this.loading = false;
            },
        });
    }
    cancelDeactivateAccount() {
        this.accountDeactivation = false;
    }
    startDeactivateAccount() {
        this.accountDeactivation = true;
        const socialId = localStorage.getItem('spotbiecom_social_id');
        if (socialId && socialId.length > 0) {
            this.isSocialAccount = true;
        }
        else {
            this.isSocialAccount = false;
        }
        if (!this.isSocialAccount) {
            const deactivationPasswordValidator = [forms_1.Validators.required];
            this.deactivationForm = this.formBuilder.group({
                spotbieDeactivationPassword: ['', deactivationPasswordValidator],
            });
            this.deactivationForm
                .get('spotbieDeactivationPassword')
                .setValue('123456789');
        }
    }
    deactivateAccount() {
        const r = confirm('Are you sure you want to deactivate your account?');
        if (!r) {
            return;
        }
        if (this.loading) {
            return;
        }
        this.loading = true;
        let deactivationPassword = null;
        if (!this.isSocialAccount) {
            if (this.deactivationForm.invalid) {
                this.spotbieAccountDeactivationInfo.nativeElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
                return;
            }
            deactivationPassword = this.deactivationPassword;
        }
        this.userAuthService
            .deactivateAccount(deactivationPassword, this.isSocialAccount)
            .subscribe(resp => {
            this.deactivateCallback(resp);
        });
    }
    closeWindow() {
        this.router.navigate(['/home']);
    }
    populateSettings(settingsResponse) {
        if (settingsResponse.success) {
            this.user = settingsResponse.user;
            this.user.spotbie_user = settingsResponse.spotbie_user;
            this.user.uuid = settingsResponse.user.hash;
            this.settingsFormInitiated = true;
            this.settingsForm.get('spotbieUsername').setValue(this.user.username);
            this.settingsForm
                .get('spotbieFirstName')
                .setValue(this.user.spotbie_user.first_name);
            this.settingsForm
                .get('spotbieLastName')
                .setValue(this.user.spotbie_user.last_name);
            this.settingsForm.get('spotbieEmail').setValue(this.user.email);
            this.settingsForm
                .get('spotbiePhoneNumber')
                .setValue(this.user.spotbie_user.phone_number);
            this.passwordForm.get('spotbiePassword').setValue('userpassword');
            this.passwordForm.get('spotbieConfirmPassword').setValue('123456789');
        }
        else {
            console.log('Settings Error: ', settingsResponse);
        }
        this.loading = false;
    }
    passwordChangeCallback(resp) {
        if (resp.success) {
            switch (resp.message) {
                case 'saved':
                    this.spotbieCurrentPasswordInfoText.nativeElement.innerHTML =
                        'Your password was updated.';
                    this.passwordForm.get('spotbieCurrentPassword').setValue('123456789');
                    this.passwordForm.get('spotbiePassword').setValue('asdrqweee');
                    this.passwordForm.get('spotbieConfirmPassword').setValue('asdeqweqq');
                    this.spotbiePasswordInfoText.nativeElement.style.display = 'block';
                    this.spotbiePasswordInfoText.nativeElement.innerHTML =
                        'Would you like to change your password?';
                    setTimeout(() => {
                        this.passwordSubmitted = false;
                        this.savePasswordBool = false;
                    }, 2000);
                    break;
                case 'SB-E-000':
                    // server error
                    this.savePasswordBool = false;
                    this.passwordSubmitted = false;
                    this.spotbiePasswordInfoText.nativeElement.style.display = 'block';
                    this.spotbiePasswordInfoText.nativeElement.innerHTML =
                        'There was an error with the server. Try again.';
                    break;
            }
            this.spotbieSettingsWindow.nativeElement.scrollTo(0, 0);
        }
        else {
            console.log(resp);
        }
        this.loading = false;
    }
    async initSettingsForm(action) {
        const usernameValidators = [forms_1.Validators.required, forms_1.Validators.maxLength(135)];
        const firstNameValidators = [forms_1.Validators.required, forms_1.Validators.maxLength(72)];
        const lastNameValidators = [forms_1.Validators.required, forms_1.Validators.maxLength(72)];
        const emailValidators = [
            forms_1.Validators.email,
            forms_1.Validators.required,
            forms_1.Validators.maxLength(135),
        ];
        const phoneValidators = [];
        const passwordValidators = [forms_1.Validators.required];
        const passwordConfirmValidators = [forms_1.Validators.required];
        const settingsFormInputObj = {
            spotbieUsername: ['', usernameValidators],
            spotbieFirstName: ['', firstNameValidators],
            spotbieLastName: ['', lastNameValidators],
            spotbieEmail: ['', emailValidators],
            spotbiePhoneNumber: ['', phoneValidators],
        };
        switch (action) {
            case 'personal':
                this.settingsForm = this.formBuilder.group(settingsFormInputObj, {
                    validators: [
                        (0, username_validator_1.ValidateUsername)('spotbieUsername'),
                        (0, name_validator_1.ValidatePersonName)('spotbieFirstName'),
                        (0, name_validator_1.ValidatePersonName)('spotbieLastName'),
                    ],
                });
                this.passwordForm = this.formBuilder.group({
                    spotbiePassword: ['', passwordValidators],
                    spotbieConfirmPassword: ['', passwordConfirmValidators],
                }, {
                    validators: [
                        (0, password_validator_1.ValidatePassword)('spotbiePassword'),
                        (0, must_match_validator_1.MustMatch)('spotbiePassword', 'spotbieConfirmPassword'),
                    ],
                });
                this.fetchCurrentSettings();
                break;
        }
    }
    fetchCurrentSettings() {
        this.userAuthService.getSettings().subscribe(resp => {
            this.populateSettings(resp);
        }, error => {
            console.log('Error', error);
        });
    }
    saveSettingsCallback(resp) {
        this.loading = false;
        if (resp.success) {
            this.spotbieSettingsInfoText.nativeElement.innerHTML = `
                <span class='sb-text-light-green-gradient'>
                Your settings were saved.
                </span>
            `;
            this.spotbieSettingsWindow.nativeElement.scrollTo(0, 0);
            localStorage.setItem('spotbie_userLogin', resp.user.username);
            localStorage.setItem('spotbie_userType', resp.user.spotbie_user.user_type);
        }
        else {
            this.spotbieSettingsInfoText.nativeElement.innerHTML = `
                <span class='spotbie-text-gradient spotbie-error'>
                    There was an error saving.
                </span>
            `;
            console.log('Failed Save Settings: ', resp);
        }
    }
    deactivateCallback(resp) {
        this.loading = false;
        if (resp.success) {
        }
        else {
            console.log('deactivateCallback', resp);
        }
    }
};
tslib_1.__decorate([
    (0, core_1.ViewChild)('spotbieSettingsInfoText')
], SettingsComponent.prototype, "spotbieSettingsInfoText", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('spotbiePasswordChangeInfoText')
], SettingsComponent.prototype, "spotbiePasswordInfoText", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('currentPasswordInfo')
], SettingsComponent.prototype, "spotbieCurrentPasswordInfoText", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('spotbieDeactivationInfo')
], SettingsComponent.prototype, "spotbieAccountDeactivationInfo", void 0);
tslib_1.__decorate([
    (0, core_1.ViewChild)('spotbieSettingsWindow')
], SettingsComponent.prototype, "spotbieSettingsWindow", void 0);
tslib_1.__decorate([
    (0, core_1.Output)()
], SettingsComponent.prototype, "closeWindowEvt", void 0);
SettingsComponent = tslib_1.__decorate([
    (0, core_1.Component)({
        selector: 'app-settings',
        templateUrl: './settings.component.html',
        styleUrls: ['./settings.component.css'],
    })
], SettingsComponent);
exports.SettingsComponent = SettingsComponent;
//# sourceMappingURL=settings.component.js.map