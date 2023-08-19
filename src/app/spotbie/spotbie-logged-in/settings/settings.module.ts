import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {IConfig, NgxMaskDirective, NgxMaskPipe, provideNgxMask} from 'ngx-mask';
import {environment} from '../../../../environments/environment';
import {SettingsComponent} from './settings.component';
import {HelperModule} from '../../../helpers/helper.module';
import {MatFormFieldModule} from '@angular/material/form-field';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HelperModule,
    RouterModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  exports: [SettingsComponent],
  providers: [provideNgxMask()],
})
export class SettingsModule {}
