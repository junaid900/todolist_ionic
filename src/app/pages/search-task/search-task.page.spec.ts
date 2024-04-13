import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchTaskPage } from './search-task.page';

describe('SearchTaskPage', () => {
  let component: SearchTaskPage;
  let fixture: ComponentFixture<SearchTaskPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SearchTaskPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
