import { Component, input } from "@angular/core";

@Component({
  selector: "app-hero",
  imports: [],
  templateUrl: "./hero.html",
  styles: ``
})
export class Hero {
  public title = input.required<string>();
  public subtitle = input<string>();
}
