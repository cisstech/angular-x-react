import 'react'

declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'ngx-hello-world': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        name?: string;
      };
      'ngx-charts': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        data?: string;
        view?: string;
        xAxisLabel?: string;
        yAxisLabel?: string;
        colorScheme?: string;
        showXAxis?: boolean | string;
        showYAxis?: boolean | string;
        gradient?: boolean | string;
        showLegend?: boolean | string;
        showXAxisLabel?: boolean | string;
        showYAxisLabel?: boolean | string;
      };
    }
  }
}
