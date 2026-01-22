import { Component } from "@angular/core";

@Component({
  selector: "app-header",
  imports: [],
  template: `
    <header class="bg-white shadow-sm">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="flex-shrink-0">
            <span class="text-xl font-bold text-indigo-600">App</span>
          </div>
          <nav class="flex space-x-4">
            <ng-content />
          </nav>
        </div>
      </div>
    </header>
  `,
  styles: ``,
})
export class Header {}
