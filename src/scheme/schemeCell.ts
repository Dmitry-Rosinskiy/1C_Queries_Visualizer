import { Cell } from '@maxgraph/core';

export type SchemeCellTypeData = {
    name: string
    cellShape: string
}

export class SchemeCellType {
    static Table: SchemeCellTypeData = {name: "table", cellShape: "rectangle"}
    static Select: SchemeCellTypeData = {name: "select", cellShape: "rhombus"}
    static Join: SchemeCellTypeData = {name: "join", cellShape: "ellipse"}
    static Union: SchemeCellTypeData = {name: "union", cellShape: "ellipse"}
    static GroupBy: SchemeCellTypeData = {name: "groupby", cellShape: "hexagon"}
    static Where: SchemeCellTypeData = {name: "where", cellShape: "hexagon"}
}

export type SchemeCellInfo = {
    id: string,
    name: string,
    type: SchemeCellTypeData
    hint?: string
}

export type SchemeCell = {
    cell: Cell,
    info: SchemeCellInfo
}
