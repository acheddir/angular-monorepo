import { Component, input } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

export interface NavItem {
  label: string;
  path: string;
}

@Component({
  selector: "app-navigation",
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="flex space-x-4">
      @for (item of items(); track item.path) {
        <a
          [routerLink]="item.path"
          routerLinkActive="bg-indigo-100 text-indigo-700"
          [routerLinkActiveOptions]="{ exact: item.path === '/' }"
          class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          {{ item.label }}
        </a>
      }
    </nav>
  `,
  styles: ``,
})
export class Navigation {
  public items = input<NavItem[]>([]);
}
