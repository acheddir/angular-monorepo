import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FeatureWelcome } from "./feature-welcome";

describe("FeatureWelcome", () => {
  let component: FeatureWelcome;
  let fixture: ComponentFixture<FeatureWelcome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureWelcome],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureWelcome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
