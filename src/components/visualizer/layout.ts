import { CompactTreeLayout, EdgeStyle, Graph } from '@maxgraph/core';

/** Расположение (размещение) графа визуализатора */
export class VisualizerLayout {
    /** граф */
    private graph: Graph;
    /** способ размещения графа */
    private layout: CompactTreeLayout;

    /**
     * Конструктор размещения графа.
     * @param graph граф
     */
    constructor(graph: Graph) {
        this.graph = graph;
        this.layout = new CompactTreeLayout(this.graph);
        this.layout.nodeDistance = 30;
        this.layout.levelDistance = 20;
        this.layout.horizontal = false;
        this.layout.invert = false;
        this.layout.edgeRouting = false;
        this.layout.moveTree = true;
        // this.layout = new HierarchicalLayout(this.graph);
        // this.layout.intraCellSpacing = 30;
        // this.layout.interRankCellSpacing = 20;
        // this.layout.fineTuning = true;
        // this.layout.disableEdgeStyle = false;
        //this.layoutGraph()
    }

    /**
     * Размещает (упорядочивает) элементы графа.
     */
    layoutGraph = (): void => {
        this.graph.getDataModel().beginUpdate();

        this.graph.setCellsMovable(true);
        //this.graph.view.setTranslate(0, 0);
        //this.graph.container.scrollLeft = 0;
        //this.graph.container.scrollTop = 0;
        // const roots = this.graph.getChildVertices(this.graph.getDefaultParent()).filter(cell => {
        //     return this.graph.getOutgoingEdges(cell, null).length === 0;
        // });
        // const parent = this.graph.getDefaultParent();
        // const virtualRoot = this.graph.insertVertex({
        //     parent,
        //     position: [50, 50],
        //     size: [10, 25],
        //     value: "NULL",
        //     style: {
        //         //shape: cellInfo.type.cellShape
        //         shape: "rectangle",
        //         rounded: true,
        //         fillColor: "orange",
        //         strokeColor: "gold"
        //     }
        // });
        // console.info("roots", roots);
        // for (const root of roots) {
            // this.graph.insertEdge({
            //     parent,
            //     source: virtualRoot,
            //     target: root,
            //     style: {
            //         edgeStyle: 'orthogonalEdgeStyle',
            //         rounded: true,
            //         verticalAlign: 'top',
            //         verticalLabelPosition: 'top'
            //     }
            // });
        //     this.layout.execute(this.graph.getDefaultParent(), root);
        // }
        const newEdgeStyle = this.getArrowStyle(this.layout.horizontal);
        this.setArrowStyle(newEdgeStyle);
        this.layout.execute(this.graph.getDefaultParent());
        this.graph.setCellsMovable(false);

        this.graph.getDataModel().endUpdate();
    }

    /**
     * Возвращает стиль стрелок графа для расположения.
     * @param isHorizontal является ли расположение горизонтальным (в противном случае - вертикальным)
     * @returns стиль стрелок
     */
    private getArrowStyle(isHorizontal: boolean): Partial<EdgeStyle> {
        return {
            edgeStyle: 'orthogonalEdgeStyle',
            rounded: true,
            verticalAlign: 'top',
            verticalLabelPosition: 'top',
            ... (isHorizontal ? {
                exitX: 1,
                exitY: 0.5,
                entryX: 0,
                entryY: 0.5
            } : {
                exitX: 0.5,
                exitY: 1,
                entryX: 0.5,
                entryY: 0
            }),
            exitPerimeter: true,
            entryPerimeter: true
        };
    }

    /**
     * Устанавливает стиль стрелок графа.
     * @param arrowStyle стиль стрелок
     */
    private setArrowStyle(arrowStyle: Partial<EdgeStyle>): void {
        const edges = this.graph.getChildEdges(this.graph.getDefaultParent());
        this.graph.batchUpdate(() => {
            for (const edge of edges) {
                this.graph.getDataModel().setStyle(edge, arrowStyle);
            }
        })
    }

    /**
     * Возвращает расположение графа.
     * @returns расположение графа
     */
    getLayout() {
        return this.layout;
    }

    /**
     * Устанавливает способ размещения графа.
     * @param horizontal горизонтальный способ (в противном случае - вертикальный)
     */
    setHorizontalLayout(horizontal: boolean): void {
        this.layout.horizontal = horizontal;
    }
}