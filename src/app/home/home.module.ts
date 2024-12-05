import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import {RouterModule, Routes} from '@angular/router';
import {SpotbiePipesModule} from '../spotbie-pipes/spotbie-pipes.module';
import {MapModule} from '../spotbie/map/map.module';
import {HelperModule} from '../helpers/helper.module';
import {MenuLoggedOutModule} from '../spotbie/spotbie-logged-out/menu-logged-out.module';
import {WelcomeModule} from '../spotbie/welcome/welcome.module';
import {IonicModule} from '@ionic/angular';

const routes: Routes = [{path: '', component: HomeComponent}];

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    MenuLoggedOutModule,
    SpotbiePipesModule,
    MapModule,
    HelperModule,
    WelcomeModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  exports: [HomeComponent, MenuLoggedOutModule],
})
export class HomeModule {}
