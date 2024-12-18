import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SanitizePipe} from '../pipes/sanitize.pipe';
import {SafePipe} from '../pipes/safe.pipe';
import {DefaultImagePipe} from '../pipes/default-image.pipe';
import {DateFormatPipe, TimeFormatPipe} from '../pipes/date-format.pipe';
import {NumberFormatPipe} from '../pipes/number-format.pipe';
import {SortOrderPipe} from '../pipes/sort-order.pipe';
import {TruncateTextPipe} from '../pipes/truncate-text.pipe';
import {ShortenDisplayNamePipe} from "../pipes/shorten-display-name.pipe";

@NgModule({
  declarations: [
    SanitizePipe,
    SafePipe,
    DefaultImagePipe,
    DateFormatPipe,
    TimeFormatPipe,
    NumberFormatPipe,
    SortOrderPipe,
    ShortenDisplayNamePipe,
    TruncateTextPipe,
  ],
  imports: [CommonModule],
  exports: [
    SanitizePipe,
    SafePipe,
    DefaultImagePipe,
    DateFormatPipe,
    TimeFormatPipe,
    NumberFormatPipe,
    SortOrderPipe,
    ShortenDisplayNamePipe,
    TruncateTextPipe,
  ],
})
export class SpotbiePipesModule {}
