import { Route } from '@angular/router';

import { ChannelComponent } from './channels/channel.component';
import { ChannelsComponent } from './channels/channels.component';
import { HomeComponent } from './home/home.component';
import { UploadsComponent } from './uploads/uploads.component';

export const RouteComponents = [
  ChannelComponent,
  ChannelsComponent,
  HomeComponent,
  UploadsComponent
];

export const Routes: Route[] = [
  { path: 'channels', component: ChannelsComponent },
  { path: 'channel/:name', component: ChannelComponent },
  { path: 'home', component: HomeComponent },
  { path: 'uploads', component: UploadsComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
