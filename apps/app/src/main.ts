import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { App } from "./app/app";
import "./styles.css";

bootstrapApplication(App, appConfig).catch((err: unknown) => {
  console.error(err);
});
