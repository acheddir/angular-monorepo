import { Component, input } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

export interface NavItem {
  label: string;
  path: string;
}

@Component({
  selector: "app-navigation",
  imports: [RouterLink, RouterLinkActive],
  templateUrl: "./navigation.html",
  styles: ``
})
export class Navigation {
  public items = input<NavItem[]>([]);
}
