import { <%= camelize(name) %>Example } from "./<%= name %>";

describe("<%= classify(name) %> utilities", () => {
  it("should work", () => {
    expect(<%= camelize(name) %>Example()).toBe("<%= name %> utility works!");
  });
});
