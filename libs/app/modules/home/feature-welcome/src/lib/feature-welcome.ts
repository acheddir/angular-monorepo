import { Component } from "@angular/core";
import { Hero } from "../../../ui-hero/src/public-api";

@Component({
  selector: "app-feature-welcome",
  imports: [Hero],
  template: `
    <app-hero
      title="Welcome "
      subtitle="Build amazing applications with this Angular monorepo starter template"
    >
      <a
        href="#"
        class="rounded-md bg-white px-6 py-3 text-base font-medium text-indigo-600 shadow-sm hover:bg-indigo-50"
      >
        Get Started
      </a>
      <a
        href="#"
        class="rounded-md border border-white px-6 py-3 text-base font-medium text-white hover:bg-white/10"
      >
        Learn More
      </a>
    </app-hero>
  `,
  styles: ``
})
export class FeatureWelcome {}
