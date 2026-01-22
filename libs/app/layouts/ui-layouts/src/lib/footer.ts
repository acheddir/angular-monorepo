import { Component } from "@angular/core";

@Component({
  selector: "app-footer",
  imports: [],
  template: `
    <footer class="border-t border-gray-200 bg-gray-50">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <p class="text-center text-sm text-gray-500">
          &copy; {{ currentYear }} App. All rights reserved.
        </p>
      </div>
    </footer>
  `,
  styles: ``,
})
export class Footer {
  public currentYear = new Date().getFullYear();
}
