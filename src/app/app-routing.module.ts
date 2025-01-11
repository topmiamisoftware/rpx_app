import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {LoginGuardServiceService} from './services/route-services/login-guard-service.service';
import {InfoObjectComponent} from './spotbie/map/info-object/info-object.component';
import {LoyaltyPointsComponent} from './spotbie/spotbie-logged-in/loyalty-points/loyalty-points.component';
import {RewardMenuComponent} from './spotbie/spotbie-logged-in/reward-menu/reward-menu.component';
import {MyList} from './spotbie/spotbie-logged-in/my-list/my-list.component';
import {AcceptMuiInvitesComponent} from "./pages/accept-mui-invites/accept-mui-invites.component";

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import(
        './spotbie/spotbie-logged-out/forgot-password/forgot-password.module'
      ).then(m => m.ForgotPasswordModule),
  },
  {path: 'business-menu/:qrCode/:rewardUuid', component: RewardMenuComponent},
  {path: 'business-menu/:qrCode', component: RewardMenuComponent},
  {path: 'accept-invitation/:uuid', component: AcceptMuiInvitesComponent},
  {
    path: 'settings',
    loadChildren: () =>
      import('./spotbie/spotbie-logged-in/settings/settings.module').then(
        m => m.SettingsModule
      ),
    canActivate: [LoginGuardServiceService],
  },
  {
    path: 'my-friends',
    loadChildren: () =>
      import('./spotbie/spotbie-logged-in/my-friends/my-friends.module').then(
        m => m.MyFriendsModule
      ),
    canActivate: [LoginGuardServiceService],
  },
  {
    path: 'user-home',
    loadChildren: () =>
      import('./spotbie/spotbie-logged-in/menu-logged-in.module').then(
        m => m.MenuLoggedInModule
      ),
    canActivate: [LoginGuardServiceService],
  },
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
  {
    path: 'my-list',
    component: MyList,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'balance-list',
      },
      {
        path: 'balance-list',
        loadChildren: () =>
          import(
            './spotbie/spotbie-logged-in/my-list/balances/balances.module'
          ).then(m => m.BalancesModule),
      },
      {
        path: 'rewards',
        loadChildren: () =>
          import(
            './spotbie/spotbie-logged-in/my-list/redeemable/redeemable.module'
          ).then(m => m.RedeemableModule),
      },
      {
        path: 'ledger',
        loadChildren: () =>
          import(
            './spotbie/spotbie-logged-in/my-list/ledger/ledger.module'
          ).then(m => m.LedgerModule),
      },
      {
        path: 'redeemed',
        loadChildren: () =>
          import(
            './spotbie/spotbie-logged-in/my-list/redeemed/redeemed.module'
          ).then(m => m.RedeemedModule),
      },
    ],
    canActivate: [LoginGuardServiceService],
  },
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

