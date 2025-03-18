import { CompactTreeLayout, Graph } from "@maxgraph/core";

export class SchemeLayout {
    private graph: Graph
    private layout: CompactTreeLayout

    constructor(graph: Graph) {
        this.graph = graph;
        this.layout = new CompactTreeLayout(this.graph);
        this.layout.nodeDistance = 50;
        this.layout.levelDistance = 10;
        this.layout.horizontal = false;
        this.layoutGraph()
    }

    layoutGraph = (): void => {
        this.layout.execute(this.graph.getDefaultParent());
    }
}