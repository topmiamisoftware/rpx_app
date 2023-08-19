import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MenuLoggedOutComponent} from './menu-logged-out.component';
import {LogInComponent} from './log-in/log-in.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ForgotPasswordModule} from './forgot-password/forgot-password.module';
import {HelperModule} from '../../helpers/helper.module';
import {SignUpComponent} from './sign-up/sign-up.component';
import {IonicModule} from '@ionic/angular';

@NgModule({
  declarations: [MenuLoggedOutComponent, LogInComponent, SignUpComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    HelperModule,
    FontAwesomeModule,
    ForgotPasswordModule,
    IonicModule.forRoot(),
  ],
  exports: [MenuLoggedOutComponent],
})
export class MenuLoggedOutModule {}
