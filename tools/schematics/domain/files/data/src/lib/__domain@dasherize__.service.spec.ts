import { TestBed } from "@angular/core/testing";

import { <%= classify(domain) %>Service } from "./<%= dasherize(domain) %>.service";

describe("<%= classify(domain) %>Service", () => {
  let service: <%= classify(domain) %>Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(<%= classify(domain) %>Service);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
