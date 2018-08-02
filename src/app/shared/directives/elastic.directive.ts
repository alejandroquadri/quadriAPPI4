import {
  Directive,
  ElementRef,
  HostListener,
  AfterViewInit,
  Optional,
  OnInit,
  OnDestroy,
  NgZone,
  Output,
  EventEmitter,
  Renderer2 } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


@Directive({
  selector: '[appElastic]'
})

export class ElasticDirective implements OnInit, OnDestroy, AfterViewInit {
  private modelSub: Subscription;
  private textareaEl: HTMLTextAreaElement;

  // tslint:disable-next-line:no-output-on-prefix
  @Output('on-resize') onResize = new EventEmitter();

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private ngZone: NgZone,
    @Optional() private model: NgModel
  ) {}

  ngOnInit() {
    console.log('onInit', this.element.nativeElement.style.height);
    if (!this.model) {
      return;
    }

    // Listen for changes to the underlying model
    // to adjust the textarea size.
    this.modelSub = this.model
      .valueChanges
      .pipe(debounceTime(100))
      .subscribe(() => this.adjust());
  }

  ngOnDestroy() {
    if (this.modelSub) {
      this.modelSub.unsubscribe();
    }
  }

  ngAfterViewInit() {
    console.log('after init', this.element.nativeElement.style.height);
    if (this.isTextarea(this.element.nativeElement)) {
      this.setupTextarea(this.element.nativeElement);
      return;
    }

    const children: HTMLElement[] = Array.from(this.element.nativeElement.children) as HTMLElement[];
    const textareaEl = children.find(el => this.isTextarea(el));
    if (textareaEl) {
      this.setupTextarea(textareaEl as HTMLTextAreaElement);
      return;
    }

    throw new Error('The `fz-elastic` attribute directive must be used on a `textarea` or an element that contains a `textarea`.');
  }

  @HostListener('input')
  onInput(): void {
    console.log('oninput');
    // This is run whenever the user changes the input.
    this.adjust();
  }

  private isTextarea(el: HTMLElement) {
    return el.tagName === 'TEXTAREA';
  }

  private setupTextarea(textareaEl: HTMLTextAreaElement) {
    this.textareaEl = textareaEl;

    // Set some necessary styles
    // const style = this.textareaEl.style;
    // style.overflow = 'hidden';
    // style.resize = 'none';

    this.renderer.setStyle(this.textareaEl, 'overflow', 'hidden');
    this.renderer.setStyle(this.textareaEl, 'resize', 'none');

    // Listen for window resize events
    this.ngZone.runOutsideAngular(() => {
      fromEvent(window, 'resize')
        .pipe(debounceTime(100))
        .subscribe(() => this.adjust());
    });

    // Ensure we adjust the textarea if
    // content is already present
    // this.adjust();
  }

  private adjust(): void {
    console.log('ajusta', this.textareaEl.style.height);
    if (!this.textareaEl) {
      return;
    }

    const previousHeight = parseInt(this.textareaEl.style.height, 10);
    const newHeight = this.textareaEl.scrollHeight;
    // this.textareaEl.style.height = 'auto';
    // this.textareaEl.style.height = `${newHeight}px`;

    this.renderer.setStyle(
      this.textareaEl,
      'height',
      'auto'
    );

    this.renderer.setStyle(
      this.textareaEl,
      'height',
      `${newHeight}px`
    );


    if (previousHeight !== newHeight) {
      // send resize event
      this.onResize.emit(newHeight);
    }
  }
}
