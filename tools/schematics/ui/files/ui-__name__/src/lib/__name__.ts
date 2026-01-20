import { Component } from "@angular/core";

@Component({
  selector: "<%= prefix %>-<%= name %>",
  imports: [],
  template: ` <p>ui-<%= name %> works!</p> `,
  styles: ``,
})
export class <%= classify(name) %> {}
