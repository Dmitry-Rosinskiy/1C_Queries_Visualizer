import { EventObject, EventSource, InternalMouseEvent } from "@maxgraph/core";
import { FlatDSQueryContainer } from "../../types/FlatDSQuery";
import { VisualizerGraph } from "./graph";

/** Тип обработчика визуализатора для редактирования ячейки */
export type EditorHandler = ((tableId: string) => FlatDSQueryContainer);

/** Обработчик мыши для всплывающей подсказки визуализатора */
export class TooltipMouseHandler {
    /** Граф визуализатора */
    private visualizerGraph: VisualizerGraph

    /**
     * Конструктор обработчика.
     * @param graph граф визуализатора
     */
    constructor(graph: VisualizerGraph) {
        this.visualizerGraph = graph;
    }

    /**
     * Обработчик перемещения мыши.
     * @param sender отправитель
     * @param event событие
     */
    mouseMove(sender: EventSource, event: InternalMouseEvent) {
        const cell = event.getCell();
        this.visualizerGraph.hoverOnCell(cell);
    }

    /**
     * Обрабочик нажатия мыши.
     * @param sender отправитель
     * @param event событие
     */
    mouseDown(sender: EventSource, event: InternalMouseEvent) { }

    /**
     * Обрабочик отпускания мыши.
     * @param sender отправитель
     * @param event событие
     */
    mouseUp(sender: EventSource, event: InternalMouseEvent) { }
}

/** Обработчики графа визуализатора */
export class VisualizerGraphHandlers {
    /** Граф визуализатора */
    private readonly visualizerGraph: VisualizerGraph;
    /** Происходит перемещение графа */
    private isPanning = false;
    /** Начальная x-координата перемещения графа */
    private startX = 0;
    /** Начальная y-координата перемещения графа */
    private startY = 0;
    /** Сдвиг графа по x-координате */
    private dx = 0;
    /** Сдвиг графа по y-координате */
    private dy = 0;

    /**
     * Конструктор обработчиков.
     * @param visualizerGraph граф визуализатора
     */
    constructor(visualizerGraph: VisualizerGraph) {
        this.visualizerGraph = visualizerGraph;
    }

    /**
     * Возвращает обработчик нажатия мыши.
     * @returns обработчик нажатия мыши
     */
    getMouseDownHandler(): (event: MouseEvent) => void {
        return (event: MouseEvent) => {
            this.isPanning = true;
            this.startX = event.clientX;
            this.startY = event.clientY;
            const translate = this.visualizerGraph.getGraph().getView().getTranslate();
            this.dx = translate.x;
            this.dy = translate.y;
        };
    }

    /**
     * Возвращает обработчик перемещения мыши.
     * @returns обработчик перемещения мыши
     */
    getMouseMoveHandler(): (event: MouseEvent) => void {
        return (event: MouseEvent) => {
            if (this.isPanning) {
                const view = this.visualizerGraph.getGraph().getView();
                const scale = view.getScale();
                const dxNew = (event.clientX - this.startX) / scale;
                const dyNew = (event.clientY - this.startY) / scale;
                view.setTranslate(this.dx + dxNew, this.dy + dyNew);
            }
        };
    }

    /**
     * Возвращает обработчик отпускания мыши.
     * @returns обработчик отпускания мыши
     */
    getMouseUpHandler(): (event: MouseEvent) => void {
        return (event: MouseEvent) => {
            this.isPanning = false;
        };
    }

    /**
     * Возвращает обработчик прокручивания колёсика мыши.
     * @returns обработчик прокручивания колёсика мыши
     */
    getWheelHandler(): (event: WheelEvent) => void {
        return (event: WheelEvent) => {
            this.visualizerGraph.getTooltip().hideTooltip();
            if (event.deltaY > 0) {
                this.visualizerGraph.zoomOut();
            } else {
                this.visualizerGraph.zoomIn();
            };
        }
    }

    /**
     * Возвращает обработчик нажатия по графу.
     * @returns обработчик нажатия по графу
     */
    getClickHandler(): (sender: any, event: EventObject) => void {
        return (sender: any, event: EventObject): void => {
            const cell = event.properties.cell;
            this.visualizerGraph.clickCell(cell);
        };
    }

    /**
     * Возвращает обработчик двойного нажатия по графу.
     * @returns обработчик двойного нажатия по графу
     */
    getDoubleClickHandler(): (sender: any, event: EventObject) => void {
        return (sender: any, event: EventObject): void => {
            const cell = event.properties.cell;
            this.visualizerGraph.doubleClickCell(cell);
        };
    }
}