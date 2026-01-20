import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Header, Main, Footer } from "@demo/layouts";
import { Navigation, NavItem } from "@demo/layouts/navigation";

@Component({
  selector: "demo-root-shell",
  imports: [RouterOutlet, Header, Main, Footer, Navigation],
  template: `
    <div class="flex min-h-screen flex-col">
      <demo-header>
        <demo-navigation [items]="navItems" />
      </demo-header>
      <demo-main>
        <router-outlet />
      </demo-main>
      <demo-footer />
    </div>
  `,
  styles: ``,
})
export class RootShell {
  public navItems: NavItem[] = [{ label: "Home", path: "/" }];
}
