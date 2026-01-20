import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Feature<%= classify(name) %> } from "./<%= name %>";

describe("Feature<%= classify(name) %>", () => {
  let component: Feature<%= classify(name) %>;
  let fixture: ComponentFixture<Feature<%= classify(name) %>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Feature<%= classify(name) %>],
    }).compileComponents();

    fixture = TestBed.createComponent(Feature<%= classify(name) %>);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
