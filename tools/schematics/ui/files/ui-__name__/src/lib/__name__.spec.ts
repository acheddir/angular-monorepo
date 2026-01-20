import { ComponentFixture, TestBed } from "@angular/core/testing";

import { <%= classify(name) %> } from "./<%= name %>";

describe("<%= classify(name) %>", () => {
  let component: <%= classify(name) %>;
  let fixture: ComponentFixture<<%= classify(name) %>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [<%= classify(name) %>],
    }).compileComponents();

    fixture = TestBed.createComponent(<%= classify(name) %>);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
