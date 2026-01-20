import { Route } from "@angular/router";
import { RootShell } from "./root-shell";

export const routes: Route[] = [
  {
    path: "",
    component: RootShell,
    children: [
      {
        path: "",
        loadComponent: async () => (await import("@demo/home/welcome")).FeatureWelcome,
      },
    ],
  },
];
