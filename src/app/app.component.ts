import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { DatabaseService } from './services/database/database.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { applyPolyfills } from 'jeep-sqlite/loader';
import { defineCustomElements as jeepSqlite } from 'jeep-sqlite/loader';
import { Capacitor } from '@capacitor/core';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, NgIf],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // providers: [DatabaseService]
  // providers: []
})
export class AppComponent {
  isWeb: boolean = false;
  constructor(
    private platform: Platform,
    private database: DatabaseService) {
    this.initApp();
  }
  async initApp() {
    // applyPolyfills().then(async () => {
    if (Capacitor.getPlatform() === "web") {
      this.isWeb = true;
      await customElements.whenDefined('jeep-sqlite');
      const jeepSqliteEl = document.querySelector('jeep-sqlite');
      if (jeepSqliteEl != null) {
        await this.database.initWeb();
        console.log(`>>>> isStoreOpen ${await jeepSqliteEl.isStoreOpen()}`);
      } else {
        console.log('>>>> jeepSqliteEl is null');
      }
      this.database.initDb();
    }else{
      this.database.initDb();
    }
    SplashScreen.hide();

  }

}
