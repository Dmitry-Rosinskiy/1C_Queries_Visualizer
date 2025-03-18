import query from './model';
import { SchemeGraph } from './scheme/schemeGraph';

declare global {
  interface Window {
      appModelVisualizer: (containerId: string) => void;
  }
}

export const appModelVisualizer = (containerId: string): void => {
    const container = <HTMLElement>document.getElementById(containerId);
    if (!container) {
        console.error('Приложение не может работать, т.к. не был найден контейнер с id ' + containerId);
    } else {
        const schemeGraph: SchemeGraph = new SchemeGraph(container);
        schemeGraph.drawGraph(query);
    }
}

window.appModelVisualizer = appModelVisualizer;