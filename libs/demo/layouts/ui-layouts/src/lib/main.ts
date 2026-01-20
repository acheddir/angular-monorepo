import { Component } from "@angular/core";

@Component({
  selector: "demo-main",
  imports: [],
  template: `
    <main class="flex-1">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <ng-content />
      </div>
    </main>
  `,
  styles: ``,
})
export class Main {}
