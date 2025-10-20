import { Injectable } from '@angular/core';
import { APP_VERSION } from '../../environments/version';

@Injectable({ providedIn: 'root' })
export class VersionService {
  get frontend() { return APP_VERSION; }
}
