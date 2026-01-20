import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "demo-root-shell",
  imports: [RouterOutlet],
  template: `
    <header>
      <h1>This is a Header</h1>
    </header>
    <main>
      <router-outlet />
    </main>
    <footer>@2025 Demo</footer>
  `,
  styles: ``,
})
export class RootShell {}
