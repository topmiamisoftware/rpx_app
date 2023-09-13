import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {Router} from '@angular/router';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {ValidateUsername} from '../../../helpers/username.validator';
import {ValidatePassword} from '../../../helpers/password.validator';
import {SignUpService} from '../../../services/spotbie-logged-out/sign-up/sign-up.service';
import {catchError, filter, tap} from 'rxjs/operators';
import {Observable} from 'rxjs/internal/Observable';
import {BehaviorSubject, of} from 'rxjs';
import {EmailConfirmationService} from '../../email-confirmation/email-confirmation.service';
import {ValidateUniqueEmail} from '../../../validators/email-unique.validator';
import {
  faEye,
  faEyeSlash,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import {AppLauncher} from '@capacitor/app-launcher';
import {LoadingController} from '@ionic/angular';
import {Preferences} from '@capacitor/preferences';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['../../menu.component.css', './sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  @ViewChild('spotbieRegisterInfo') spotbieRegisterInfo;
  @ViewChild('spotbieSignUpIssues') spotbieSignUpIssues;

  @Output() closeWindow = new EventEmitter();
  @Output() logInEvent = new EventEmitter();
  @Input() windowObj;

  faEye = faEye;
  faEyeSlash = faEyeSlash;

  signUpFormx: UntypedFormGroup;
  signingUp$ = new BehaviorSubject<boolean>(false);
  submitted$ = new BehaviorSubject<boolean>(false);
  loading$ = new BehaviorSubject<boolean>(undefined);
  passwordShow$ = new BehaviorSubject<boolean>(false);
  business$ = new BehaviorSubject<boolean>(false);
  loader: HTMLIonLoadingElement;

  constructor(
    private router: Router,
    private signUpService: SignUpService,
    private formBuilder: UntypedFormBuilder,
    private emailUniqueCheckService: EmailConfirmationService,
    private loadingCtrl: LoadingController
  ) {
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
    if (this.router.url === '/business') {
      this.business$.next(true);
    } else {
      this.business$.next(false);
    }

    this.initSignUpForm();
  }

  closeWindowX(): void {
    this.closeWindow.emit(this.windowObj);
  }

  removeWhiteSpace(key) {
    this.signUpFormx.get(key).setValue(this.signUpFormx.get(key).value.trim());
  }

  togglePassword() {
    this.passwordShow$.next(!this.passwordShow$.getValue());
  }

  initSignUp(): void {
    this.submitted$.next(true);
    this.loading$.next(true);
    this.spotbieSignUpIssues.nativeElement.scrollTo(0, 0);
    this.signUpFormx.updateValueAndValidity();

    // stop here if form is invalid
    if (this.signUpFormx.invalid) {
      this.signingUp$.next(false);

      if (this.signUpFormx.get('spotbieUsername').invalid) {
        document.getElementById('spotbie_username').style.border =
          '1px solid red';
      } else {
        document.getElementById('spotbie_username').style.border = 'unset';
      }

      if (this.signUpFormx.get('spotbieEmail').invalid) {
        document.getElementById('user_email').style.border = '1px solid red';
      } else {
        document.getElementById('user_email').style.border = 'unset';
      }

      if (this.signUpFormx.get('spotbiePassword').invalid) {
        document.getElementById('user_pass').style.border = '1px solid red';
      } else {
        document.getElementById('user_pass').style.border = 'unset';
      }

      return;
    } else {
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
      .pipe(
        catchError(this.signUpError()),
        filter(r => !!r)
      )
      .subscribe(resp => {
        this.initSignUpCallback(resp);
      });
  }

  signUpError<T>(operation = 'operation', result?: T) {
    this.signingUp$.next(false);
    this.loading$.next(false);
    console.log('2', this.loading$.getValue());

    return (error: any): Observable<T> => {
      const signUpInstructions = this.spotbieSignUpIssues.nativeElement;
      signUpInstructions.style.display = 'none';

      const errorList = error.error.errors;

      if (errorList.username) {
        const errors: {[k: string]: any} = {};
        errorList.username.forEach(err => {
          errors[err] = true;
        });

        this.signUpFormx.get('spotbieUsername').setErrors(errors);
        document.getElementById('spotbie_username').style.border =
          '1px solid red';
      } else {
        document.getElementById('spotbie_username').style.border = 'unset';
      }

      if (errorList.email) {
        const errors: {[k: string]: any} = {};
        errorList.email.forEach(err => {
          errors[err] = true;
        });

        this.signUpFormx.get('spotbieEmail').setErrors(errors);
        document.getElementById('user_email').style.border = '1px solid red';
      } else {
        document.getElementById('user_email').style.border = 'unset';
      }

      if (errorList.password) {
        const errors: {[k: string]: any} = {};
        errorList.username.forEach(err => {
          errors[err] = true;
        });

        this.signUpFormx.get('spotbiePassword').setErrors(errors);
        document.getElementById('user_pass').style.border = '1px solid red';
      } else {
        document.getElementById('user_pass').style.border = 'unset';
      }

      this.signingUp$.next(false);

      setTimeout(() => {
        signUpInstructions.style.display = 'block';
      }, 200);

      return of(result as T);
    };
  }

  logIn() {
    this.logInEvent.emit();
    this.closeWindowX();
  }

  initSignUpForm() {
    const usernameValidators = [Validators.required];
    const passwordValidators = [Validators.required];
    const emailValidators = [Validators.required, Validators.email];

    this.signUpFormx = this.formBuilder.group(
      {
        spotbieUsername: ['', usernameValidators],
        spotbieEmail: ['', emailValidators],
        spotbiePassword: ['', passwordValidators],
      },
      {
        validators: [
          ValidateUsername('spotbieUsername'),
          ValidatePassword('spotbiePassword'),
        ],
      }
    );

    this.signUpFormx.setAsyncValidators(
      ValidateUniqueEmail.valid(this.emailUniqueCheckService, this.spotbieEmail)
    );
  }

  async openTerms() {
    await AppLauncher.openUrl({url: 'https://spotbie.com/terms'});
    return;
  }

  initLoading() {
    this.loading$
      .pipe(filter(loading => loading !== undefined))
      .subscribe(async loading => {
        if (loading) {
          this.loader = await this.loadingCtrl.create({
            message: 'LOADING...',
          });
          this.loader.present();
        } else {
          if (this.loader) {
            this.loader.dismiss();
            this.loader = null;
          }
        }
      });
  }

  private initSignUpCallback(resp: any) {
    const signUpInstructions = this.spotbieSignUpIssues.nativeElement;

    if (resp.message === 'success') {
      Preferences.set({key: 'spotbie_userLogin', value: resp.user.username});
      Preferences.set({key: 'spotbie_loggedIn', value: '1'});
      Preferences.set({key: 'spotbie_rememberMe', value: '0'});
      Preferences.set({
        key: 'spotbie_userType',
        value: resp.spotbie_user.user_type,
      });
      Preferences.set({
        key: 'spotbiecom_session',
        value: resp.token_info.original.access_token,
      });

      signUpInstructions.innerHTML =
        "<span class='spotbie-text-gradient'>Welcome to SpotBie!</span>";

      window.location.reload();
    } else {
      signUpInstructions.innerHTML =
        "<span class='spotbie-text-gradient spotbie-error'>There has been an error signing up.</span>";
    }

    this.loading$.next(false);
    this.signingUp$.next(false);
  }
}
