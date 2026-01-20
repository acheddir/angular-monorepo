import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FeatureList } from "./list";

describe("FeatureList", () => {
  let component: FeatureList;
  let fixture: ComponentFixture<FeatureList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeatureList],
    }).compileComponents();

    fixture = TestBed.createComponent(FeatureList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
