import { Graph, InternalEvent, Cell } from '@maxgraph/core';
import { DSQueryConstant, DSQueryType } from "../types/DSQuery";
import { FlatDSQueryContainer, FlatDSQueryJoin, FlatDSQuerySelect, FlatDSQueryUnion } from "../types/FlatDSQuery";
import { SchemeCell, SchemeCellInfo, SchemeCellType } from './schemeCell'
import { SchemeTooltip } from './schemeTooltip';
import { SchemeLayout } from './schemeLayout';

export class SchemeGraph {
    graph: Graph
    layout: SchemeLayout
    private schemeCells: SchemeCell[]
    private tooltip: SchemeTooltip

    constructor(container: HTMLElement) {
        this.graph = new Graph(container);
        this.graph.setPanning(true);
        this.graph.setEnabled(false);
        this.tooltip = new SchemeTooltip(container, this.graph);
        this.layout = new SchemeLayout(this.graph);

        this.graph.addListener(InternalEvent.CLICK, (_: any, event: any): void => {
            const cell = event.properties.cell;
            if (cell !== null) {
                const schemeCell = this.getSchemeCellByCell(cell);
                if (schemeCell !== undefined && schemeCell.info.hint !== undefined) {
                    this.tooltip.showTooltip(cell, schemeCell.info.hint); 
                }
            } else {
                this.tooltip.hideTooltip();
            }
        });
        this.schemeCells = [];
    }

    drawGraph = (model: FlatDSQueryContainer): void => {
        this.graph.batchUpdate(() => {
            this.makeScheme(model);
        });
    }

    private makeScheme = (model: FlatDSQueryContainer): void => {
        const queries = model.queries;
        for (const queryId of Object.keys(queries)) {
            const query = queries[queryId];
            console.log(query);
            if (query.type === DSQueryType.constant) {
                this.processConstantQuery(query, queryId);
            } else if (query.type === DSQueryType.select) {
                this.processSelectQuery(query, queryId);
            } else if (query.type === DSQueryType.join) {
                this.processJoinQuery(query, queryId);
            } else if (query.type === DSQueryType.union) {
                this.processUnionQuery(query, queryId);
            }
        }
    }

    private cellExists = (id: string): boolean => {
        for (const schemeCell of this.schemeCells) {
            if (schemeCell.info.id === id) {
                return true;
            }
        }
        return false;
    }

    private processConstantQuery = (query: DSQueryConstant, queryId: string): void => {
        if (!this.cellExists(queryId)) {
            const selectFields = [];
            for (const selectField of query.select) {
                selectFields.push(selectField.expression);
            }
            this.createCell({
                id: queryId,
                name: "SELECT",
                type: SchemeCellType.Select,
                hint: selectFields.join(", ")
            })
        }

        this.layout.layoutGraph();
    }

    private processSelectQuery = (query: FlatDSQuerySelect, queryId: string): void => {
        let tableId = query.from;
        if (!this.cellExists(tableId)) {
            this.createCell({
                id: tableId,
                name: query.fromAs,
                type: SchemeCellType.Table
            });
        }
        if (query.groupBy !== undefined) {
            const groupById = queryId + "-g";
            const groupFields: string[] = [];
            for (const groupNumber of query.groupBy) {
                groupFields.push(query.select[groupNumber].expression);
            }
            this.createCell({
                id: groupById,
                name: "GROUP BY",
                type: SchemeCellType.GroupBy,
                hint: groupFields.join(", ")
            })
            this.makeGroupBy(tableId, groupById);
            tableId = groupById;
        }

        if (query.where !== undefined) {
            const whereId = queryId + "-w";
            const whereFields = [];
            for (const whereField of query.where) {
                whereFields.push(whereField.expression);
            }
            this.createCell({
                id: whereId,
                name: "WHERE",
                type: SchemeCellType.Where,
                hint: whereFields.join(", ")
            });
            this.makeWhere(tableId, whereId);
            tableId = whereId;
        }
        
        if (!this.cellExists(queryId)) {
            const selectFields = [];
            for (const selectField of query.select) {
                selectFields.push(selectField.expression);
            }
            this.createCell({
                id: queryId,
                name: "SELECT",
                type: SchemeCellType.Select,
                hint: selectFields.join(", ")
            });
        }
        this.makeSelect(tableId, queryId);

        this.layout.layoutGraph();
    }

    private processJoinQuery = (query: FlatDSQueryJoin, queryId: string): void => {
        const joinSources = query.joinSources;
        const joinTable1Id = joinSources.root.source.from;
        if (!this.cellExists(joinTable1Id)) {
            this.createCell({
                id: joinTable1Id,
                name: joinSources.root.source.fromAs,
                type: SchemeCellType.Table
            })
        }
        for (const joinId of joinSources.root.relations) {
            const relation = joinSources.relationIndex[joinId];
            if (!this.cellExists(joinId)) {
            this.createCell({
                id: joinId,
                name: relation.type.toUpperCase() + " JOIN",
                type: SchemeCellType.Join,
                hint: relation.condition
            });
            }
            const joinTable2Id = relation.source.from;
            if (!this.cellExists(joinTable2Id)) {
            this.createCell({
                id: joinTable2Id,
                name: relation.source.fromAs,
                type: SchemeCellType.Table
            });
            }
    
            this.makeJoin(joinTable1Id, joinTable2Id, joinId);

            //this.layout.layoutGraph();
        }

        let lastTableId = query.joinSources.root.relations.slice(-1)[0];
        if (query.groupBy !== undefined) {
            const groupById = queryId + "-g";
            const groupFields: string[] = [];
            for (const groupNumber of query.groupBy) {
                groupFields.push(query.select[groupNumber].expression);
            }
            this.createCell({
                id: groupById,
                name: "GROUP BY",
                type: SchemeCellType.GroupBy,
                hint: groupFields.join(", ")
            })
            this.makeGroupBy(lastTableId, groupById);
            lastTableId = groupById;
        }

        if (!this.cellExists(queryId)) {
            const selectFields = [];
            for (const selectField of query.select) {
                selectFields.push(selectField.expression);
            }
            this.createCell({
                id: queryId,
                name: "SELECT",
                type: SchemeCellType.Select,
                hint: selectFields.join(", ")
            })
        }
        this.makeSelect(lastTableId, queryId);

        this.layout.layoutGraph();
    }

    private processUnionQuery = (query: FlatDSQueryUnion, queryId: string): void => {
        const tableIds: string[] = [];
        for (const union of query.unions) {
            const tableId = union.from;
            if (!this.cellExists(tableId)) {
                this.createCell({
                    id: tableId,
                    name: union.fromAs,
                    type: SchemeCellType.Table
                });
            }
            tableIds.push(union.from);
        }
        const unionId = queryId + "-u";
        if (!this.cellExists(unionId)) {
            this.createCell({
                id: unionId,
                name: "UNION",
                type: SchemeCellType.Union
            });
        }
        this.makeUnion(tableIds, unionId);

        if (!this.cellExists(queryId)) {
            const selectFields: string[] = [];
            for (let i = 0; i < query.select[0].expressionUnion.length; i++) {
                const correspondingFields: string[] = [];
                for (let j = 0; j < query.select.length; j++) {
                    if (query.select[j].expressionUnion[i] !== null) {
                        correspondingFields.push(query.unions[j].fromAs + "." + query.select[j].expressionUnion[i]!);
                    } else {
                        correspondingFields.push("null");
                    }
                }
                selectFields.push(correspondingFields.join(", "));
            }
            this.createCell({
                id: queryId,
                name: "SELECT",
                type: SchemeCellType.Select,
                hint: selectFields.join("; ")
            });
        }
        this.makeSelect(unionId, queryId);

        this.layout.layoutGraph();
    }

    private createCell = (cellInfo: SchemeCellInfo): SchemeCell => {
        const parent = this.graph.getDefaultParent();
        const cell = this.graph.insertVertex({
            parent,
            position: [10, 10],
            size: [100, 25],
            value: cellInfo.name,
            style:{
                shape: cellInfo.type.cellShape
            }
        });
        const newCell: SchemeCell = {cell: cell, info: cellInfo};
        this.schemeCells.push(newCell);
        return newCell;
    }

    private makeSelect = (tableId: string, selectId: string): void => {
        const selectTable = this.getSchemeCellById(tableId);
        const selectCell = this.getSchemeCellById(selectId);
        if (selectTable === undefined || selectCell === undefined) {
            return;
        }
        this.addEdge(selectCell.cell, selectTable.cell);
    }

    private makeWhere = (tableId: string, whereId: string): void => {
        const selectTable = this.getSchemeCellById(tableId);
        const whereCell = this.getSchemeCellById(whereId);
        if (selectTable === undefined || whereCell === undefined) {
            return;
        }
        this.addEdge(whereCell.cell, selectTable.cell);
    }

    private makeGroupBy = (tableId: string, groupById: string): void => {
        const selectTable = this.getSchemeCellById(tableId);
        const groupByCell = this.getSchemeCellById(groupById);
        if (selectTable === undefined || groupByCell === undefined) {
            return;
        }
        this.addEdge(groupByCell.cell, selectTable.cell);
    }

    private makeJoin = (table1Id: string, table2Id: string, joinId: string): void => {
        const joinTable1 = this.getSchemeCellById(table1Id);
        const joinTable2 = this.getSchemeCellById(table2Id);
        const joinCell = this.getSchemeCellById(joinId);
        if (joinTable1 === undefined || joinTable2 === undefined || joinCell === undefined) {
            return;
        }
        this.addEdge(joinCell.cell, joinTable1.cell);
        this.addEdge(joinCell.cell, joinTable2.cell);
    }

    private makeUnion = (tableIds: string[], unionId: string): void => {
        const unionTables: SchemeCell[] = [];
        for (const tableId of tableIds) {
            const unionTable = this.getSchemeCellById(tableId);
            if (unionTable !== undefined) {
                unionTables.push(unionTable);
            }
        }
        const unionCell = this.getSchemeCellById(unionId);
        if (unionCell === undefined || unionTables.length === 0) {
            return;
        }
        for (const unionTable of unionTables) {
            this.addEdge(unionCell.cell, unionTable.cell);
        }
    }
    
    private addEdge = (fromVertex: Cell, toVertex: Cell): void => {
        const parent = this.graph.getDefaultParent();   
        this.graph.insertEdge({
            parent,
            source: fromVertex,
            target: toVertex,
            style: {
                edgeStyle: 'orthogonalEdgeStyle',
                rounded: true,
                verticalAlign: 'top',
                verticalLabelPosition: 'top'
            }
        });
    }

    private getSchemeCellByCell = (cell: Cell): SchemeCell | undefined => {
        for (const schemeCell of this.schemeCells) {
            if (schemeCell.cell === cell) {
                return schemeCell;
            }
        }
        return undefined;
    }

    private getSchemeCellById = (id: string): SchemeCell | undefined => {
        for (const schemeCell of this.schemeCells) {
            if (schemeCell.info.id === id) {
                return schemeCell;
            }
        }
        return undefined;
    }
}