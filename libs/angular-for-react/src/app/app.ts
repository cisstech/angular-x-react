import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ElementLoaderService } from './services/element-loader.service';

@Component({
  selector: 'ngx-root',
  template: '',
})
export class App implements OnInit, OnDestroy {
  private readonly elementDetectorService = inject(ElementLoaderService);

  ngOnInit(): void {
    this.elementDetectorService.connect();
  }

  ngOnDestroy(): void {
    this.elementDetectorService.disconnect();
  }
}
