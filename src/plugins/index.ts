/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import "primeicons/primeicons.css";
import Calendar from "primevue/calendar";
import PrimeVue from "primevue/config";
import "primevue/resources/primevue.min.css";
import "primevue/resources/themes/saga-blue/theme.css";
import vuetify from "./vuetify";
import { loadFonts } from "./webfontloader";

// Types
import type { App } from "vue";

export function registerPlugins(app: App) {
  loadFonts();
  app.use(vuetify);
  app.use(PrimeVue);
  app.component("Calendar", Calendar);
}
