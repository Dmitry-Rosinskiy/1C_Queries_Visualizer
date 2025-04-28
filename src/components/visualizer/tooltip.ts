import { Cell, Graph } from '@maxgraph/core';

/** Всплывающая подсказка визуализатора */
export class VisualizerTooltip {
    /** Контейнер */
    private container: HTMLElement
    /** Граф */
    private graph: Graph
    /** Всплывающая подсказка */
    private tooltip: HTMLDivElement

    /**
     * Конструктор всплывающей подсказки.
     * @param container контейнер
     * @param graph граф
     */
    constructor(container: HTMLElement, graph: Graph) {
        this.container = container;
        this.graph = graph
        this.tooltip = document.createElement('div');
        //this.tooltip.classList.add("scheme-tooltip");
        this.setStyle();
        this.container.appendChild(this.tooltip);
        //console.log(this.tooltip);
    }

    /**
     * Устанавливает стили для всплывающей подсказки.
     */
    private setStyle(): void {
        Object.assign(this.tooltip.style, {
            // position: "absolute",
            // backgroundColor: "#ffd700ee",
            // border: "1px solid black",
            // padding: "5px",
            // fontSize: "0.5em",
            // borderRadius: "5px",
            position: 'absolute',
            backgroundColor: '#ffd700ee',
            color: '#555',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            pointerEvents: 'none',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            whiteSpace: 'nowrap'
        });
    }

    /**
     * Показывает подсказку с однострочным текстом.
     * @param cell ячейка
     * @param text текст
     */
    showTooltipText(cell: Cell, text: string): void {
        const bounds = this.graph.getCellBounds(cell);
        if (bounds !== null) {
            this.tooltip.innerHTML = text;
            this.tooltip.style.left = `${bounds.x}px`;
            this.tooltip.style.top = `${bounds.y + bounds.height + 50}px`;
            this.tooltip.style.visibility = 'visible';
        }
    }

    /**
     * Показывает подсказку с многострочным текстом.
     * @param cell ячейка
     * @param texts массив текстов
     */
    showTooltipTexts(cell: Cell, texts: string[]): void {
        const bounds = this.graph.getCellBounds(cell);
        if (bounds !== null) {
            this.tooltip.innerHTML = texts.join('<br>');
            this.tooltip.style.left = `${bounds.x}px`;
            this.tooltip.style.top = `${bounds.y + bounds.height + 50}px`;
            this.tooltip.style.visibility = 'visible';
        }
    }

    /**
     * Скрывает подсказку.
     */
    hideTooltip(): void {
        this.tooltip.style.visibility = 'hidden';
    }

    /**
     * Возвращает значение видимости подсказки.
     * @returns значение видимости подсказки
     */
    isVisible(): boolean {
        return this.tooltip.style.visibility === 'visible';
    }
}