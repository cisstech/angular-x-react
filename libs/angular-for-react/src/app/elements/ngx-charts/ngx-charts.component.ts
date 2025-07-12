import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
} from '@angular/core';
import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { coerceObject } from '../../utils/coerce';

export interface ChartData {
  name: string;
  value: number;
}

@Component({
  selector: 'ngx-charts-element',
  templateUrl: './ngx-charts.component.html',
  styleUrls: ['./ngx-charts.component.scss'],
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxChartsComponent {
  data = input.required<ChartData[], string>({
    transform: (value: string) => coerceObject<ChartData[]>(value) ?? [],
  });

  view = input<[number, number], string | [number, number]>([700, 400], {
    transform: (value) => coerceObject(value) ?? [700, 400],
  });
  showXAxis = input(true);
  showYAxis = input(true);
  gradient = input(false);
  showLegend = input(true);
  showXAxisLabel = input(true);
  xAxisLabel = input('Country');
  showYAxisLabel = input(true);
  yAxisLabel = input('Value');
  colorScheme = input<Color, string | Color>(
    {
      name: 'cool',
      selectable: true,
      group: ScaleType.Ordinal,
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
    },
    {
      transform: (value) =>
        coerceObject(value) ?? {
          name: 'default',
          selectable: true,
          group: ScaleType.Ordinal,
          domain: [],
        },
    }
  );

  constructor() {
    effect(() => {
      console.log('Data changed:', this.data());
    })
  }
}
