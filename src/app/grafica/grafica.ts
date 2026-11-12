import { AfterViewInit, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-grafica',
  templateUrl: './grafica.html',
  styleUrl: './grafica.css',
})
export class Grafica implements AfterViewInit, OnChanges {
  @Input() nombre = '';
  @Input() dot = '';
  @ViewChild('graphContainer') graphContainer!: ElementRef<HTMLDivElement>;

  private viewReady = false;

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.renderGraph();
  }

  ngOnChanges(): void {
    if (this.viewReady) this.renderGraph();
  }

  private async renderGraph(): Promise<void> {
    if (!this.dot) return;

    const d3 = await import('d3');
    await import('d3-graphviz');
    (d3.select(this.graphContainer.nativeElement) as any).graphviz().renderDot(this.dot);
  }
}
