import { Cell, Point } from "@maxgraph/core";
import { CellType, VisualizerCell, VisualizerCellInfo, SchemeCellStyle, VisualizerCellType } from "../components/сell";
import { GraphIcons } from "../assets/icons";
import { JoinType } from "../types/DSQuery";
import { VisualizerGraph } from "../components/visualizer/graph";

/** Менеджер ячеек визуализатора */
export class VisualizerCellManager {

    /** Граф визуализатора */
    private readonly visualizerGraph: VisualizerGraph;

    /**
     * Конструктор менеджера ячеек.
     * @param visualizerGraph граф визуализатора
     */
    constructor(visualizerGraph: VisualizerGraph) {
        this.visualizerGraph = visualizerGraph;
    }

    /**
     * Проверяет, существует ли ячейка с заданным идентификатором.
     * @param id идентификатор ячейки
     * @returns значение сущестования ячейки
     */
    cellExists = (id: string): boolean => {
        for (const visualizerCell of this.visualizerGraph.getSchemeCells()) {
            if (visualizerCell.info.id === id) {
                return true;
            }
        }
        return false;
    }

    /**
     * Создаёт ячейку "системная таблица".
     * @param tableId идентификатор таблицы
     * @param tableName название таблицы
     */
    createSystemCell(tableId: string, tableName: string): void {
        this.createCell({
            id: tableId,
            name: tableName,
            type: VisualizerCellType.System
        });
    }

    /**
     * Создаёт ячейку "SELECT" (выборка).
     * @param queryId идентификатор запроса
     * @param extraContent дополнительное содержание (поля выборки)
     * @param name название запроса (при наличии)
     */
    createSelectCell(queryId: string, extraContent: string, name: string | undefined): void {
        this.createCell({
            id: queryId,
            name: name !== undefined ? name : 'SELECT',
            type: VisualizerCellType.Select,
            extra: extraContent
        });
    }

    /**
     * Создаёт ячейку "JOIN" (соединение).
     * @param joinId идентификатор соединения
     * @param type тип соединения
     * @param hint подсказка (условия соединения)
     */
    createJoinCell(joinId: string, type: JoinType, hint: string) {
        this.createCell({
            id: joinId,
            name: type.toUpperCase() + ' JOIN',
            type: VisualizerCellType.Join,
            hint: hint
        });
    }

    /**
     * Создаёт ячейку "UNION" (объединение).
     * @param unionId идентификатор объединения
     */
    createUnionCell(unionId: string): void {
        this.createCell({
            id: unionId,
            name: 'UNION',
            type: VisualizerCellType.Union
        });
    }

    /**
     * Создаёт ячейку "WHERE" (фильтрация).
     * @param whereId идентификатор фильтрации
     * @param hint подсказка (условия фильтрации)
     */
    createWhereCell(whereId: string, hint: string): void {
        this.createCell({
            id: whereId,
            name: 'WHERE',
            type: VisualizerCellType.Where,
            hint: hint
        });
    }

    /**
     * Создаёт ячейку "GROUP BY" (группировка).
     * @param groupById идентификатор группировки
     * @param hint подсказка (условия группировки)
     */
    createGroupByCell(groupById: string, hint: string): void {
        this.createCell({
            id: groupById,
            name: 'GROUP BY',
            type: VisualizerCellType.GroupBy,
            hint: hint
        });
    }

    /**
     * Обновляет стиль ячейки.
     * @param cell ячейка
     * @param newStyle новый стиль
     */
    updateCellStyle(cell: Cell, newStyle: SchemeCellStyle) {
        const graph = this.visualizerGraph.getGraph();
        const cellStyle = { ...graph.getCellStyle(cell) }
        for (const key in newStyle) {
            const value = newStyle[key as keyof SchemeCellStyle];
            if (value !== undefined) {
                (cellStyle as any)[key] = value;
            }
        }
        graph.getDataModel().setStyle(cell, cellStyle);
    }

    /**
     * Добавляет стрелку между ячейками.
     * @param fromVertex ячейка, из которой исходит стрелка
     * @param toVertex ячейка, в которую входит стрелка
     */
    addArrow = (fromVertex: Cell, toVertex: Cell): void => {
        const graph = this.visualizerGraph.getGraph();
        const parent = graph.getDefaultParent();   
        graph.insertEdge({
            parent,
            source: fromVertex,
            target: toVertex
        });
    }

    /**
     * Возвращает ячейку визуализатора по ячейке.
     * @param cell ячейка
     * @returns ячейка визуализатора (если не найдена, то `undefined`)
     */
    getVisualizerCellByCell = (cell: Cell): VisualizerCell | undefined => {
        for (const visualizerCell of this.visualizerGraph.getSchemeCells()) {
            if (visualizerCell.cell === cell) {
                return visualizerCell;
            }
        }
        return undefined;
    }

    /**
     * Возвращает ячейку визуализатора по идентификатору.
     * @param id идентификатор
     * @returns ячейка визуализатора (если не найдена, то `undefined`)
     */
    getVisualizerCellById = (id: string): VisualizerCell | undefined => {
        for (const visualizerCell of this.visualizerGraph.getSchemeCells()) {
            if (visualizerCell.info.id === id) {
                return visualizerCell;
            }
        }
        return undefined;
    }

    /**
     * Проверяет, выбрана ли ячейка.
     * @param cell ячейка
     * @returns значение, соответствующее тому, выбрана ли ячейка
     */
    isSelected(cell: Cell): boolean {
        return cell === this.visualizerGraph.getSelectedCell();
    }

    /**
     * Возвращает все ячейки, в которые входят стрелки, выходящие из заданной ячейки.
     * @param cell ячейка
     * @returns массив ячеек
     */
    getOutgoingCells(cell: Cell): Cell[] {
        const outgoingCells: Cell[] = [];
        for (const edge of cell.getOutgoingEdges()) {
            const target = edge.getTerminal(false);
            if (target !== null) {
                outgoingCells.push(target);
            }
        }
        return outgoingCells;
    }

    /**
     * Делает выбранной заданную ячейку.
     * @param cell ячейка
     */
    selectCell(cell: Cell): void {
        const selectedCell = this.visualizerGraph.getSelectedCell();
        if (selectedCell !== undefined) {
            this.unselectCell(selectedCell);
        }
        const visualizerCell = this.getVisualizerCellByCell(cell);
        if (visualizerCell !== undefined && visualizerCell.info.type.selectedStyle !== undefined) {
            this.updateCellStyle(cell, visualizerCell.info.type.selectedStyle);
        }
        this.visualizerGraph.setSelectedCell(cell);
    }

    /**
     * Отменяет выбор заданной ячейки.
     * @param cell ячейка
     */
    unselectCell(cell: Cell): void {
        const visualizerCell = this.getVisualizerCellByCell(cell);
        if (visualizerCell !== undefined) {
            this.updateCellStyle(cell, visualizerCell.info.type.defaultStyle);
        }
        this.visualizerGraph.setSelectedCell(undefined);
    }

    /**
     * Центрирует ячейку в графе.
     * @param cell ячейка
     */
    centerCell(cell: Cell): void {
        const view = this.visualizerGraph.getGraph().getView();
        const bounds = view.getState(cell);
        if (bounds === null) {
            return;
        }

        const scale = view.getScale();
        const translate = view.getTranslate();

        const container = this.visualizerGraph.getContainer();
        const cellCenterX = (bounds.x + bounds.width / 2) / scale - translate.x;
        const cellCenterY = (bounds.y + bounds.height / 2) / scale - translate.y;
        const targetCenterX = (container.clientWidth / 2) / scale;
        const targetCenterY = (container.clientHeight / 2) / scale;
        const targetTranslate = new Point(targetCenterX - cellCenterX, targetCenterY - cellCenterY);

        this.visualizerGraph.getGraphAnimation().translateGraph(targetTranslate);
    }

    /**
     * Переключает видимость дополнительного содержания ячейки (раскрывает/скрывает).
     * @param visualizerCell ячейка визуализатора
     */
    toggleExtraContent(visualizerCell: VisualizerCell): void {
        const graph = this.visualizerGraph.getGraph();
        if (visualizerCell.info.expanded === undefined || !visualizerCell.info.expanded) {
            graph.getDataModel().setValue(visualizerCell.cell, `<div style="padding:5px;">${visualizerCell.info.name}<hr><p style="text-align:left">${visualizerCell.info.extra}</p></div>`);
        } else {
            graph.getDataModel().setValue(visualizerCell.cell, visualizerCell.info.name);
        }
        visualizerCell.info.expanded = !visualizerCell.info.expanded;

        const geo = graph.updateCellSize(visualizerCell.cell);
        this.visualizerGraph.layoutGraph();
    }

    /**
     * Выделяет заданные ячейки (при этом сбрасывает выделение остальных ячеек).
     * @param cells массив ячеек
     */
    highlightCells(cells: Cell[]): void {
        if (this.highlightCells !== undefined) {
            this.unhighlightCells();
        }
        for (const cell of cells) {
            const visualizerCell = this.getVisualizerCellByCell(cell);
            if (visualizerCell !== undefined && visualizerCell.info.type.highlightedStyle !== undefined) {
                this.updateCellStyle(cell, visualizerCell.info.type.highlightedStyle);
            }
        }
        this.visualizerGraph.setHighlightedCells(cells);
    }

    /**
     * Сбрасывает выделение всех ячеек.
     */
    unhighlightCells(): void {
        for (const cell of this.visualizerGraph.getHighlightedCells()) {
            const visualizerCell = this.getVisualizerCellByCell(cell);
            if (visualizerCell !== undefined) {
                this.updateCellStyle(cell, visualizerCell.info.type.defaultStyle);
            }
        }
        this.visualizerGraph.setHighlightedCells([]);
    }

    /**
     * Создаёт ячейку визуализатора.
     * @param cellInfo информация о ячейке
     * @returns ячейка визуализатора
     */
    private createCell = (cellInfo: VisualizerCellInfo): VisualizerCell => {
        const graph = this.visualizerGraph.getGraph();
        const parent = graph.getDefaultParent();
        
        let iconElem: string;
        if (cellInfo.type.name === CellType.join) {
            iconElem = GraphIcons.getIcon(cellInfo.type.name, cellInfo.name.split(' ')[0] as JoinType);
        } else {
            iconElem = GraphIcons.getIcon(cellInfo.type.name);
        }

        let htmlContent: string;
        if (iconElem !== '') {
            htmlContent = `<div>${iconElem}</div>`;
        } else if (cellInfo.extra !== undefined) {
            if (cellInfo.expanded === undefined || !cellInfo.expanded) {
                htmlContent = cellInfo.name;
            } else {
                htmlContent = `<div>${cellInfo.name}<hr><p style="text-align:left">${cellInfo.extra}</p></div>`;
            }
        } else {
            htmlContent = cellInfo.name;
        }

        const cell = graph.insertVertex({
            parent,
            position: [50, 50],
            size: [cellInfo.name.length * 8, 25],
            value: htmlContent
        });
        this.updateCellStyle(cell, cellInfo.type.defaultStyle);
        const geo = graph.updateCellSize(cell);
        graph.scrollCellToVisible(cell);

        const newCell: VisualizerCell = {cell: cell, info: cellInfo};
        this.addVisualizerCell(newCell);
        return newCell;
    }

    /**
     * Добавляет в граф ячейку визуализатора.
     * @param visualizerCell ячейка визуализатора
     */
    private addVisualizerCell(visualizerCell: VisualizerCell): void {
        this.visualizerGraph.getSchemeCells().push(visualizerCell);
    }

    /**
     * Соединяет ячейку с ячейком выборки.
     * @param tableId идентификатор таблицы
     * @param selectId идентификатор выборки
     */
    makeSelect (tableId: string, selectId: string): void {
        const selectTable = this.getVisualizerCellById(tableId);
        const selectCell = this.getVisualizerCellById(selectId);
        if (selectTable === undefined || selectCell === undefined) {
            return;
        }
        this.addArrow(selectCell.cell, selectTable.cell);
    }

    /**
     * Соединяет ячейку с ячейкой фильтрации.
     * @param tableId идентификатор таблицы
     * @param whereId идентификатор фильтрации
     */
    makeWhere = (tableId: string, whereId: string): void => {
        const selectTable = this.getVisualizerCellById(tableId);
        const whereCell = this.getVisualizerCellById(whereId);
        if (selectTable === undefined || whereCell === undefined) {
            return;
        }
        this.addArrow(whereCell.cell, selectTable.cell);
    }

    /**
     * Соединяет ячейку с ячейкой группировки.
     * @param tableId идентификатор таблицы
     * @param groupById идентификатор группировки
     */
    makeGroupBy(tableId: string, groupById: string): void {
        const selectTable = this.getVisualizerCellById(tableId);
        const groupByCell = this.getVisualizerCellById(groupById);
        if (selectTable === undefined || groupByCell === undefined) {
            return;
        }
        this.addArrow(groupByCell.cell, selectTable.cell);
    }

    /**
     * Соединяет ячейку с ячейкой соединения.
     * @param table1Id идентификатор первой таблицы
     * @param table2Id идентификатор второй таблицы
     * @param joinId идентификатор соединения
     * @returns 
     */
    makeJoin(table1Id: string, table2Id: string, joinId: string): void {
        const joinTable1 = this.getVisualizerCellById(table1Id);
        const joinTable2 = this.getVisualizerCellById(table2Id);
        const joinCell = this.getVisualizerCellById(joinId);
        if (joinTable1 === undefined || joinTable2 === undefined || joinCell === undefined) {
            return;
        }
        this.addArrow(joinCell.cell, joinTable1.cell);
        this.addArrow(joinCell.cell, joinTable2.cell);
    }

    /**
     * Соединяет ячейку с объединением.
     * @param tableIds идентификатор таблицы
     * @param unionId идентификатор объединения
     */
    makeUnion(tableIds: string[], unionId: string): void {
        const unionTables: VisualizerCell[] = [];
        for (const tableId of tableIds) {
            const unionTable = this.getVisualizerCellById(tableId);
            if (unionTable !== undefined) {
                unionTables.push(unionTable);
            }
        }
        const unionCell = this.getVisualizerCellById(unionId);
        if (unionCell === undefined || unionTables.length === 0) {
            return;
        }
        for (const unionTable of unionTables) {
            this.addArrow(unionCell.cell, unionTable.cell);
        }
    }
}