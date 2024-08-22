import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import {FormBuilder, Validators, FormGroup, FormControl} from '@angular/forms';
import {User} from '../../../models/user';
import {ValidatePassword} from '../../../helpers/password.validator';
import {MustMatch} from '../../../helpers/must-match.validator';
import {ValidateUsername} from '../../../helpers/username.validator';
import {ValidatePersonName} from '../../../helpers/name.validator';
import {UserauthService} from '../../../services/userauth.service';
import {Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import {Preferences} from '@capacitor/preferences';
import {logOutCallback} from '../../../helpers/logout-callback';
import {AlertDialogComponent} from '../../../helpers/alert/alert.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  @ViewChild('spotbieSettingsInfoText') spotbieSettingsInfoText: ElementRef;
  @ViewChild('spotbiePasswordInfoText') spotbiePasswordInfoText: ElementRef;
  @ViewChild('currentPasswordInfo') spotbieCurrentPasswordInfoText: ElementRef;
  @ViewChild('spotbieDeactivationInfo') spotbieAccountDeactivationInfo;
  @ViewChild('spotbieSettingsWindow') spotbieSettingsWindow;

  @Output() closeWindowEvt = new EventEmitter();

  settingsForm: FormGroup;
  passwordForm: FormGroup;
  savePasswordBool$ = new BehaviorSubject<boolean>(false);
  deactivationForm: FormGroup;
  accountDeactivation$ = new BehaviorSubject<boolean>(false);
  deactivationSubmitted$ = new BehaviorSubject<boolean>(false);
  loading$ = new BehaviorSubject<boolean>(false);
  user$ = new BehaviorSubject<User>(new User());
  submitted$ = new BehaviorSubject<boolean>(false);
  passwordSubmitted$ = new BehaviorSubject<boolean>(false);
  settingsFormInitiated$ = new BehaviorSubject<boolean>(false);
  isSocialAccount$ = new BehaviorSubject<boolean>(false);
  errorText$ = new BehaviorSubject<string>(null);
  spotbieSettingsInfoText$ = new BehaviorSubject<string>(null);
  currentPasswordInfoText$ = new BehaviorSubject<string>(
    'To complete the change, enter your CURRENT password.'
  );
  showSmsOptIn$ = new BehaviorSubject<boolean>(false);

  constructor(
    private formBuilder: FormBuilder,
    private userAuthService: UserauthService,
    private router: Router,
    public dialog: MatDialog
  ) {}

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

  get smsOptIn() {
    return this.settingsForm.get('smsOptIn').value;
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
    return this.passwordForm.get('spotbieCurrentPassword').value;
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

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.loading$.next(true);
    this.initSettingsForm();
  }

  savePassword(): void {
    this.passwordSubmitted$.next(true);

    this.spotbiePasswordInfoText.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    if (this.passwordForm.invalid) {
      if (this.password !== this.confirmPassword) {
        this.errorText$.next('Passwords must match.');
        return;
      }
      return;
    }

    this.currentPasswordInfoText$.next(
      'Great, now enter your current password.'
    );
    this.savePasswordBool$.next(true);

    const currentPasswordValidators = [Validators.required];

    this.passwordForm.addControl(
      'spotbieCurrentPassword',
      new FormControl('', currentPasswordValidators)
    );

    this.passwordForm.get('spotbieCurrentPassword').setValue('123456789');
  }

  completeSavePassword(): void {
    if (this.loading$.getValue()) {
      return;
    }

    this.loading$.next(true);

    if (this.passwordForm.invalid) {
      return;
    }

    const savePasswordObj = {
      password: this.password,
      passwordConfirmation: this.confirmPassword,
      currentPassword: this.currentPassword,
    };

    this.userAuthService.passwordChange(savePasswordObj).subscribe(
      resp => {
        this.passwordChangeCallback(resp);
      },
      error => {
        console.log('error', error);
      }
    );
  }

  cancelPasswordSet() {
    this.passwordSubmitted$.next(false);
    this.savePasswordBool$.next(false);
  }

  infoSms() {
    const d = this.dialog.open(AlertDialogComponent, {
      data: {
        alertText: `By providing your phone number in the settings form you are agreeing 
                    to receive recurring promotional and personalized text messages (e.g. promotions going on at
                    restaurants) from SpotBie Community Members at the phone number you are providing in this settings form.
                    Consent is not a condition to use other features in the SpotBie Platform. Reply HELP for help and STOP
                    to stop receiving text messages once you consent. Msg. frequency varies. Msg and data rates may apply.`,
        alertLinkText: 'View terms and conditions.',
        alertLink: 'https://spotbie.com/terms',
        alertTitle: 'SMS Policy',
      },
      enterAnimationDuration: '0ms',
      exitAnimationDuration: '0ms',
    });

    d.afterClosed().subscribe((result: {continueWithAction: boolean}) => {
      if (!result.continueWithAction) {
        this.loading$.next(false);
        return;
      }

      this.finishSaveSettings();
    });
  }

  saveSettings() {
    this.loading$.next(true);
    this.submitted$.next(true);

    if (this.settingsForm.errors) {
      this.loading$.next(false);
      this.spotbieSettingsWindow.nativeElement.scrollTo(0, 0);

      return;
    }

    if (this.spotbiePhoneNumber !== '' &&
        this.smsOptIn !== '' &&
        this.smsOptIn == true
    ) {
      this.infoSms();
    } else {
      this.finishSaveSettings();
    }
  }

  finishSaveSettings() {
    this.user$.next({
      ...this.user$.getValue(),
      username: this.username,
      email: this.email,
      spotbie_user: {
        ...this.user$.getValue().spotbie_user,
        first_name: this.firstName,
        last_name: this.lastName,
        phone_number: this.spotbiePhoneNumber,
        sms_opt_in: this.smsOptIn
      },
    });

    this.userAuthService.saveSettings(this.user$.getValue()).subscribe({
      next: resp => {
        this.saveSettingsCallback(resp);
      },
      error: (error: any) => {
        let message = '';
        if (error.error?.errors?.email && error?.error?.errors?.email[0] === 'notUnique') {
          this.settingsForm.get('spotbieEmail').setErrors({notUnique: true});
          message = 'E-mail already in use';
        }

        if (error.error?.errors?.phone_number && error.error?.errors?.phone_number[0] === 'notUnique') {
          this.settingsForm.get('spotbiePhoneNumber').setErrors({notUnique: true});
          message = 'Phone already in use';
        }

        this.spotbieSettingsInfoText$.next(`${message}.`);

        this.spotbieSettingsWindow.nativeElement.scrollTo(0, 0);

        this.loading$.next(false);
      },
    });
  }

  cancelDeactivateAccount() {
    this.accountDeactivation$.next(false);
  }

  startDeactivateAccount(): void {
    this.accountDeactivation$.next(true);

    const deactivationPasswordValidator = [Validators.required];

    this.deactivationForm = this.formBuilder.group({
      spotbieDeactivationPassword: ['', deactivationPasswordValidator],
    });

    this.deactivationForm
      .get('spotbieDeactivationPassword')
      .setValue('123456789');
  }

  deactivateAccount() {
    const r = confirm('Are you sure you want to deactivate your account?');

    if (!r) {
      return;
    }

    if (this.loading$.getValue()) {
      return;
    }

    this.loading$.next(true);

    if (this.deactivationForm.invalid) {
      this.spotbieAccountDeactivationInfo.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      return;
    }

    const deactivationPassword = this.deactivationPassword;

    this.userAuthService
      .deactivateAccount(deactivationPassword, this.isSocialAccount$.getValue())
      .subscribe(resp => {
        this.deactivateCallback(resp);
      });
  }

  closeWindow() {
    this.closeWindowEvt.emit();
  }

  private populateSettings(settingsResponse: any) {
    if (settingsResponse.success) {
      this.user$.next({
        ...settingsResponse.user,
        spotbie_user: settingsResponse.spotbie_user,
        uuid: settingsResponse.user.hash,
      });


      console.log("POPULATE SETTINGS", settingsResponse);

      this.settingsFormInitiated$.next(true);

      if (settingsResponse.spotbie_user.phone_number === '' ||
          settingsResponse.spotbie_user.phone_number === null) {
        this.showSmsOptIn$.next(false);
      } else {
        this.showSmsOptIn$.next(true);
      }

      this.settingsForm
        .get('spotbieUsername')
        .setValue(this.user$.getValue().username);
      this.settingsForm
        .get('spotbieFirstName')
        .setValue(this.user$.getValue().spotbie_user.first_name);
      this.settingsForm
        .get('spotbieLastName')
        .setValue(this.user$.getValue().spotbie_user.last_name);
      this.settingsForm
        .get('spotbieEmail')
        .setValue(this.user$.getValue().email);
      this.settingsForm
        .get('spotbiePhoneNumber')
        .setValue(this.user$.getValue().spotbie_user.phone_number?.replace('+1', ''));
      this.settingsForm
          .get('smsOptIn')
          .setValue(this.user$.getValue().spotbie_user.sms_opt_in);
    } else {
      console.log('Settings Error: ', settingsResponse);
    }

    this.loading$.next(false);
  }

  private passwordChangeCallback(resp: any) {
    if (resp.success) {
      switch (resp.message) {
        case 'saved':
          this.spotbieSettingsInfoText$.next('Your password was updated.');

          this.passwordForm.get('spotbieCurrentPassword').setValue(null);
          this.passwordForm.get('spotbiePassword').setValue(null);
          this.passwordForm.get('spotbieConfirmPassword').setValue(null);

          this.passwordSubmitted$.next(false);
          this.savePasswordBool$.next(false);

          break;
      }

      this.spotbieSettingsWindow.nativeElement.scrollTo(0, 0);
    } else {
      switch (resp.message) {
        case 'SB-E-000':
          // server error
          this.currentPasswordInfoText$.next(
            'You entered the incorrect current password.'
          );
          break;
      }
    }

    this.loading$.next(false);
  }

  private async initSettingsForm() {
    const usernameValidators = [Validators.required, Validators.maxLength(135)];
    const firstNameValidators = [Validators.required, Validators.maxLength(72)];
    const lastNameValidators = [Validators.required, Validators.maxLength(72)];
    const emailValidators = [
      Validators.email,
      Validators.required,
      Validators.maxLength(135),
    ];
    const phoneValidators = [];

    const passwordValidators = [Validators.required];
    const passwordConfirmValidators = [Validators.required];

    const settingsFormInputObj: any = {
      spotbieUsername: ['', usernameValidators],
      spotbieFirstName: ['', firstNameValidators],
      spotbieLastName: ['', lastNameValidators],
      spotbieEmail: ['', emailValidators],
      spotbiePhoneNumber: ['', phoneValidators],
      smsOptIn: ['', [Validators.required]],
    };

    this.settingsForm = this.formBuilder.group(settingsFormInputObj, {
      validators: [
        ValidateUsername('spotbieUsername'),
        ValidatePersonName('spotbieFirstName'),
        ValidatePersonName('spotbieLastName'),
      ],
    });

    this.passwordForm = this.formBuilder.group(
      {
        spotbiePassword: ['', passwordValidators],
        spotbieConfirmPassword: ['', passwordConfirmValidators],
      },
      {
        validators: [
          ValidatePassword('spotbiePassword'),
          MustMatch('spotbiePassword', 'spotbieConfirmPassword'),
        ],
      }
    );

    this.fetchCurrentSettings();
  }

  updateSubscribedToSms(evt: any) {
    this.settingsForm.get('smsOptIn').setValue(evt.checked);
  }

  private fetchCurrentSettings(): any {
    this.userAuthService.getSettings().subscribe(
      resp => {
        this.populateSettings(resp);
      },
      error => {
        console.log('Error', error);
      }
    );
  }

  private saveSettingsCallback(resp: any) {
    this.loading$.next(false);

    if (resp.success) {
      this.spotbieSettingsInfoText$.next('Your settings were saved.');

      this.spotbieSettingsWindow.nativeElement.scrollTo(0, 0);

      Preferences.set({key: 'spotbie_userLogin', value: resp.user.username});
      Preferences.set({
        key: 'spotbie_userType',
        value: resp.user.spotbie_user.user_type,
      });
    } else {
      this.spotbieSettingsInfoText$.next('There was an error saving.');
    }
  }

  private deactivateCallback(resp: any) {
    this.loading$.next(false);
    if (resp.success) {
      // Account has been deactivated. Let's log out.
      logOutCallback(resp);
    } else {
      console.log('deactivateCallback', resp);
    }
  }
}
