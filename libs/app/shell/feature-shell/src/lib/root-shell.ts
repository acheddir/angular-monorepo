import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Header, Main, Footer } from "@app/layouts";
import { Navigation, NavItem } from "@app/layouts/navigation";

@Component({
  selector: "app-root-shell",
  imports: [RouterOutlet, Header, Main, Footer, Navigation],
  template: `
    <div class="flex min-h-screen flex-col">
      <app-header>
        <app-navigation [items]="navItems" />
      </app-header>
      <app-main>
        <router-outlet />
      </app-main>
      <app-footer />
    </div>
  `,
  styles: ``
})
export class RootShell {
  public navItems: NavItem[] = [{ label: "Home", path: "/" }];
}
