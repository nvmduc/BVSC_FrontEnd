import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoShareholderComponent } from './info-shareholder.component';

describe('InfoShareholderComponent', () => {
  let component: InfoShareholderComponent;
  let fixture: ComponentFixture<InfoShareholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoShareholderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoShareholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
