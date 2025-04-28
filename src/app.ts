//import query from './model';
import { EditorHandler } from './components/visualizer/handlers';
import { VisualizerGraph } from './components/visualizer/graph';
import { FlatDSQueryContainer } from './types/FlatDSQuery';

// declare global {
//   interface Window {
//       //appModelVisualizer: (containerId: string, query: FlatDSQueryContainer, editorHandler: EditorHandler) => void;
//       AppModelVisualizer: any;
//   }
// }

/** Приложение визуализатора */
export class AppModelVisualizer {
    schemeGraph: VisualizerGraph | undefined;

    /**
     * Конструктор приложения визуализатора.
     * @param containerId идентификатор контейнера
     * @param editorHandler обработчик редактирования ячеек
     */
    constructor(containerId: string, editorHandler: EditorHandler) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Приложение не может работать, т.к. не был найден контейнер с id ' + containerId);
            this.schemeGraph = undefined;
        } else {
            this.schemeGraph = new VisualizerGraph(container, editorHandler);
        }
    }

    /**
     * Визуализация модели запроса.
     * @param query модель запроса
     */
    visualizeQuery(query: FlatDSQueryContainer): void {
        if (this.schemeGraph !== undefined) {
            this.schemeGraph.drawGraph(query);
        }
    }
}

export default AppModelVisualizer;

// export const appModelVisualizer = (containerId: string, query: FlatDSQueryContainer, editorHandler: EditorHandler): void => {
//     const container = <HTMLElement>document.getElementById(containerId);
//     if (!container) {
//         console.error('Приложение не может работать, т.к. не был найден контейнер с id ' + containerId);
//     } else {
//         const schemeGraph: SchemeGraph = new SchemeGraph(container, editorHandler);
//         schemeGraph.drawGraph(query);
//     }
// }

//window.appModelVisualizer = appModelVisualizer;
//window.AppModelVisualizer = AppModelVisualizer;