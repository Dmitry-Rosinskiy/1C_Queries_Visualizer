import { Cell, Graph } from "@maxgraph/core";

export class SchemeTooltip {
    private container: HTMLElement
    private graph: Graph
    private tooltip: HTMLDivElement

    constructor(container: HTMLElement, graph: Graph) {
        this.container = container;
        this.graph = graph
        this.tooltip = document.createElement("div");
        this.tooltip.classList.add("scheme-tooltip");
        this.tooltip.style.visibility = "hidden";
        this.container.appendChild(this.tooltip);
        console.log(this.tooltip);
    }

    showTooltip = (cell: Cell, text: string): void => {
        const bounds = this.graph.getCellBounds(cell);
        if (bounds !== null) {
            this.tooltip.innerHTML = text;
            this.tooltip.style.left = `${bounds.x}px`;
            this.tooltip.style.top = `${bounds.y + bounds.height + 10}px`;
            this.tooltip.style.visibility = "visible";
        }
    }

    hideTooltip = (): void => {
        this.tooltip.style.visibility = "hidden";
    }

    isVisible = (): boolean => {
        return this.tooltip.style.visibility === "visible";
    }
}