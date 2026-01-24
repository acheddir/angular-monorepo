import { Component, input } from "@angular/core";

@Component({
  selector: "app-hero",
  imports: [],
  template: `
    <div class="bg-linear-to-r from-indigo-600 to-purple-600">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            {{ title() }}
          </h1>
          @if (subtitle()) {
            <p class="mx-auto mt-6 max-w-2xl text-xl text-indigo-100">
              {{ subtitle() }}
            </p>
          }
          <div class="mt-10 flex justify-center gap-4">
            <ng-content />
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class Hero {
  public title = input.required<string>();
  public subtitle = input<string>();
}
