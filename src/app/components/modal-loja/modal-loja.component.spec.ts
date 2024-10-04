import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreModalComponent } from './modal-loja.component';

describe('StoreModalComponent', () => {
  let component: StoreModalComponent;
  let fixture: ComponentFixture<StoreModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoreModalComponent]
    });
    fixture = TestBed.createComponent(StoreModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
