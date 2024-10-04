import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StoreModalService {
  hidden: boolean = false;

  constructor() {}

  getStoreModal(): boolean {
    return this.hidden;
  }
  
  toggleStoreModal(): void {
    this.hidden = !this.hidden;
  }
}
