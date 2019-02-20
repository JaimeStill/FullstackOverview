import { CoreService } from './core.service';
import { IdentityService } from './identity.service';
import { ObjectMapService } from './object-map.service';
import { SidepanelService } from './sidepanel.service';
import { SnackerService } from './snacker.service';
import { SocketService } from './socket.service';
import { ThemeService } from './theme.service';

export const Services = [
  CoreService,
  IdentityService,
  ObjectMapService,
  SidepanelService,
  SnackerService,
  SocketService,
  ThemeService
];

export * from './channel.service';
export * from './core.service';
export * from './identity.service';
export * from './object-map.service';
export * from './sidepanel.service';
export * from './snacker.service';
export * from './socket.service';
export * from './theme.service';
export * from './upload.service';
