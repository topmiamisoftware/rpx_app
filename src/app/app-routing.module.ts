import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {LoginGuardServiceService} from './services/route-services/login-guard-service.service';
import {InfoObjectComponent} from './spotbie/map/info-object/info-object.component';
import {LoyaltyPointsComponent} from './spotbie/spotbie-logged-in/loyalty-points/loyalty-points.component';
import {RewardMenuComponent} from './spotbie/spotbie-logged-in/reward-menu/reward-menu.component';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'password',
    loadChildren: () =>
      import(
        './spotbie/spotbie-logged-out/forgot-password/forgot-password.module'
      ).then(m => m.ForgotPasswordModule),
  },
  {
    path: 'user-home',
    loadChildren: () =>
      import('./user-home/user-home.module').then(m => m.UserHomeModule),
    canActivate: [LoginGuardServiceService],
  },
  {path: 'business-menu/:qrCode/:rewardUuid', component: RewardMenuComponent},
  {path: 'business-menu/:qrCode', component: RewardMenuComponent},
  {
    path: 'community',
    loadChildren: () =>
      import('./spotbie/community-member/community-member.module').then(
        m => m.CommunityMemberModule
      ),
  },
  {
    path: 'loyalty-points/:qrCode/:totalSpent/:loyaltyPointReward',
    component: LoyaltyPointsComponent,
  },
  {path: 'place-to-eat/:name/:id', component: InfoObjectComponent},
  {path: 'shopping/:name/:id', component: InfoObjectComponent},
  {path: 'event/:name/:id', component: InfoObjectComponent},
  {path: 'login-success', redirectTo: '/user-home', pathMatch: 'full'},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules}),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
