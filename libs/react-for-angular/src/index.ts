import { defineLazyReactComponent } from './register';


defineLazyReactComponent(
  'react-hello-world',
  ['name'],
  () => import('./components/react-hello-world/react-hello-world'),
);

defineLazyReactComponent(
  'react-pdf-viewer',
  ['fileUrl', 'width', 'height', 'enableTextLayer'],
  () => import('./components/react-pdf-viewer/react-pdf-viewer'),
);
