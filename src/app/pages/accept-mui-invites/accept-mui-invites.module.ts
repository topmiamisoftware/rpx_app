import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AcceptMuiInvitesComponent} from "./accept-mui-invites.component";
import {IonicModule} from "@ionic/angular";
import {SpotbiePipesModule} from "../../spotbie-pipes/spotbie-pipes.module";

@NgModule({
  declarations: [
    AcceptMuiInvitesComponent
  ],
  imports: [
    IonicModule,
    SpotbiePipesModule,
    CommonModule,
  ],
  exports: [
    AcceptMuiInvitesComponent
  ]
})
export class AcceptMuiInvitesModule { }
