import { Route } from "@angular/router";
import { RootShell } from "./root-shell";

export const routes: Route[] = [
  {
    path: "",
    component: RootShell,
    children: [
      {
        path: "",
        loadComponent: async () =>
          (await import("../../../../modules/home/feature-welcome/src/public-api")).FeatureWelcome,
      },
    ],
  },
];
