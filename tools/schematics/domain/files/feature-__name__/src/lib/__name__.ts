import { Component } from "@angular/core";

@Component({
  selector: "<%= prefix %>-<%= name %>",
  template: ` <p>feature-<%= name %> works!</p> `,
  styles: ``,
})
export class Feature<%= classify(name) %> {}
