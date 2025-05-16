import { Cell } from "@maxgraph/core";
import { DSQueryConstant, DSQueryType } from "../types/DSQuery";
import { FlatDSQuery, FlatDSQueryContainer, FlatDSQueryJoin, FlatDSQuerySelect, FlatDSQueryUnion, FlatJoinSources, KeyValue } from "../types/FlatDSQuery";
import { VisualizerCellManager } from "./сell-manager";
import { CellType, LineConditionOperators } from "../components/сell";
import { GraphTooltipFormatter } from "../utils/graph-tooltip-formatter";

/** Менеджер запросов визуализатора */
export class VisualizerQueryManager {

    /** Менеджер ячеек */
    private readonly cellManager: VisualizerCellManager;
    /** Словарь запросов */
    private queries: KeyValue<FlatDSQuery> = {};

    /**
     * Конструктор менеджера запросов.
     * @param cellManager менеджер ячеек взуализатора
     */
    constructor(cellManager: VisualizerCellManager) {
        this.cellManager = cellManager;
    }

    /**
     * Создаёт визуальную схему запроса.
     * @param model модель запроса
     */
    makeScheme(model: FlatDSQueryContainer): void {
        this.queries = model.queries;

        const rootId = model.rootId;
        const query = this.queries[rootId];
        switch (query.type) {
            case DSQueryType.constant:
                this.processConstantQuery(query, rootId);
                break;
            case DSQueryType.select:
                this.processSelectQuery(query, rootId);
                break;
            case DSQueryType.join:
                this.processJoinQuery(query, rootId);
                break;
            case DSQueryType.union:
                this.processUnionQuery(query, rootId);
                break;
        }
    }

    /**
     * Обработка запроса "константа".
     * @param query запрос
     * @param queryId идентификатор запроса
     * @param name название запроса (если нет, то `undefined`)
     * @returns идентификатор запроса
     */
    private processConstantQuery (query: DSQueryConstant, queryId: string, name: string | undefined = undefined): string {
        if (!this.cellManager.cellExists(queryId)) {
            const selectFields = [];
            for (const selectField of query.select) {
                selectFields.push(GraphTooltipFormatter.makeHintForField(selectField));
            }
            this.cellManager.createSelectCell(queryId, selectFields.join('\n'), name);
        }
        return queryId;
    }

    /**
     * Обработка запроса "выборка".
     * @param query запрос
     * @param queryId идентификатор запроса
     * @param name название запроса (если нет, то `undefined`)
     * @returns идентификатор запроса
     */
    private processSelectQuery(query: FlatDSQuerySelect, queryId: string, name: string | undefined = undefined): string {
        let tableId = query.from;
        tableId = this.processSubquery(this.queries[tableId], tableId, query.fromAs);
        if (query.groupBy !== undefined) {
            const groupById = queryId + '-g';
            const groupFields: string[] = [];
            for (const groupNumber of query.groupBy) {
                groupFields.push(GraphTooltipFormatter.makeHintForField(query.select[groupNumber]));
            }
            this.cellManager.createGroupByCell(groupById, groupFields.join('\n'));
            this.cellManager.makeGroupBy(tableId, groupById);
            tableId = groupById;
        }

        if (query.where !== undefined) {
            const whereId = queryId + '-w';
            const whereFields = [];
            for (const whereField of query.where) {
                whereFields.push(whereField.expression);
            }
            this.cellManager.createWhereCell(whereId, whereFields.join('\n'));
            this.cellManager.makeWhere(tableId, whereId);
            tableId = whereId;
        }
        
        if (!this.cellManager.cellExists(queryId)) {
            const selectFields = [];
            for (const selectField of query.select) {
                selectFields.push(GraphTooltipFormatter.makeHintForField(selectField));
            }
            this.cellManager.createSelectCell(queryId, selectFields.join('\n'), name);
        }
        this.cellManager.makeSelect(tableId, queryId);

        return queryId;
    }

    private processJoinRelation(joinSources: FlatJoinSources, joinId: string, mainQueryId: string): string {
        const relation = joinSources.relationIndex[joinId];
        //let joinTable1Id = this.processSubquery(this.queries[relation.source.from], relation.source.from, relation.source.fromAs);
        let joinTable1Id = `${mainQueryId}-${joinId}`;
        for (const relationJoinId of relation.relations) {
            const relation = joinSources.relationIndex[relationJoinId];
            let joinTable2Id = this.processSubquery(this.queries[relation.source.from], relation.source.from, relation.source.fromAs);
            // const relation = joinSources.relationIndex[relationJoinId];
            // const joinTable2Id = this.processJoinRelation(joinSources, relationJoinId);
            if (!this.cellManager.cellExists(relationJoinId)) {
                const condition = GraphTooltipFormatter.makeHintForCondition(relation.condition);
                this.cellManager.createJoinCell(`${mainQueryId}-${relationJoinId}`, relation.type, condition);
            }
            this.cellManager.makeJoin(joinTable1Id, joinTable2Id, `${mainQueryId}-${relationJoinId}`);
            //joinTable1Id = relationJoinId;
            joinTable1Id = this.processJoinRelation(joinSources, relationJoinId, mainQueryId);
        }
        return joinTable1Id;
    }

    /**
     * Обработка запроса "соединение".
     * @param query запрос
     * @param queryId идентификатор запроса
     * @param name название запроса (если нет, то `undefined`)
     * @returns идентификатор запроса
     */
    private processJoinQuery(query: FlatDSQueryJoin, queryId: string, name: string | undefined = undefined): string {
        const joinSources = query.joinSources;
        let joinTable1Id = joinSources.root.source.from;
        joinTable1Id = this.processSubquery(this.queries[joinTable1Id], joinTable1Id, joinSources.root.source.fromAs);
        for (const joinId of joinSources.root.relations) {
            // rd
            // const joinTable2Id = this.processJoinRelation(joinSources, joinId);
            const relation = joinSources.relationIndex[joinId];
            let joinTable2Id = this.processSubquery(this.queries[relation.source.from], relation.source.from, relation.source.fromAs);

            // for (const relationJoinId of relation.relations) {
            //     const relation = joinSources.relationIndex[relationJoinId];
            //     let joinTable3Id = this.processSubquery(this.queries[relation.source.from], relation.source.from, relation.source.fromAs);
            //     if (!this.cellManager.cellExists(relationJoinId)) {
            //         const condition = GraphTooltipFormatter.makeHintForCondition(relation.condition);
            //         this.cellManager.createJoinCell(relationJoinId, relation.type, condition);
            //     }
            //     this.cellManager.makeJoin(joinTable2Id, joinTable3Id, relationJoinId);
            //     joinTable2Id = relationJoinId;
            // }

            if (!this.cellManager.cellExists(joinId)) {
                const condition = GraphTooltipFormatter.makeHintForCondition(relation.condition);
                this.cellManager.createJoinCell(`${queryId}-${joinId}`, relation.type, condition);
            }
            //this.cellManager.makeJoin(joinTable1Id, joinTable2Id, joinId);
            this.cellManager.makeJoin(joinTable1Id, joinTable2Id, `${queryId}-${joinId}`);
            joinTable1Id = this.processJoinRelation(joinSources, joinId, queryId);
            // joinTable1Id = joinId;
        }

        //let lastTableId = query.joinSources.root.relations.slice(-1)[0];
        let lastTableId = joinTable1Id;

        if (query.groupBy !== undefined) {
            const groupById = queryId + '-g';
            const groupFields: string[] = [];
            for (const groupNumber of query.groupBy) {
                groupFields.push(GraphTooltipFormatter.makeHintForField(query.select[groupNumber]));
            }
            this.cellManager.createGroupByCell(groupById, groupFields.join('\n'));
            this.cellManager.makeGroupBy(joinTable1Id, groupById);
            lastTableId = groupById;
        }

        if (query.where !== undefined) {
            const whereId = queryId + '-w';
            const whereFields = [];
            for (const whereField of query.where) {
                whereFields.push(whereField.expression);
            }
            this.cellManager.createWhereCell(whereId, whereFields.join(LineConditionOperators.AND + '\n'));
            this.cellManager.makeWhere(lastTableId, whereId);
            lastTableId = whereId;
        }

        if (!this.cellManager.cellExists(queryId)) {
            const selectFields = [];
            for (const selectField of query.select) {
                selectFields.push(GraphTooltipFormatter.makeHintForField(selectField));
            }
            this.cellManager.createSelectCell(queryId, selectFields.join('\n'), name);
        }
        this.cellManager.makeSelect(lastTableId, queryId);
        
        return queryId;
    }

    /**
     * Обработка запроса "объединение".
     * @param query запрос
     * @param queryId идентификатор запроса
     * @param name название запроса (если нет, то `undefined`)
     * @returns идентификатор запроса
     */
    private processUnionQuery(query: FlatDSQueryUnion, queryId: string, name: string | undefined = undefined): string {
        const tableIds: string[] = [];
        for (const union of query.unions) {
            let tableId = union.from;
            tableId = this.processSubquery(this.queries[tableId], tableId, union.fromAs);
            tableIds.push(union.from);
        }
        const unionId = queryId + '-u';
        if (!this.cellManager.cellExists(unionId)) {
            this.cellManager.createUnionCell(unionId);
        }
        this.cellManager.makeUnion(tableIds, unionId);

        if (!this.cellManager.cellExists(queryId)) {
            const selectFields: string[] = [];
            for (let i = 0; i < query.select.length; i++) {
                const correspondingFields: string[] = [];
                for (let j = 0; j < query.unions.length; j++) {
                    if (query.select[i].expressionUnion[j] !== null) {
                        correspondingFields.push(query.unions[j].fromAs + '.' + query.select[i].expressionUnion[j]!);
                    } else {
                        correspondingFields.push('null');
                    }
                }
                selectFields.push(GraphTooltipFormatter.makeHintForExpression(correspondingFields.join(' | '), query.select[i].type));
                
            }
            this.cellManager.createSelectCell(queryId, selectFields.join('\n'), name);
            this.cellManager.makeSelect(unionId, queryId);
        }

        return queryId;
    }

    /**
     * Обработка подзапроса.
     * @param subquery подзапрос
     * @param subqueryId идентификатор подзапроса
     * @param name название подзапроса (если нет, то `undefined`)
     * @returns идентификатор подзапроса
     */
    private processSubquery (subquery: FlatDSQuery, subqueryId: string, name: string): string {
        switch (subquery.type) {
            case DSQueryType.system:
                return this.processSystemTable(subqueryId, name);
            case DSQueryType.constant:
                return this.processConstantQuery(subquery, subqueryId, name);
            case DSQueryType.select:
                return this.processSelectQuery(subquery, subqueryId, name);
            case DSQueryType.join:
                return this.processJoinQuery(subquery, subqueryId, name);
            case DSQueryType.union:
                return this.processUnionQuery(subquery, subqueryId, name);
        }
    }

    /**
     * Обработка запроса "системная таблица".
     * @param tableId идентификатор таблицы
     * @param tableName название таблицы
     * @returns идентификатор запроса
     */
    private processSystemTable(tableId: string, tableName: string) {
        if (!this.cellManager.cellExists(tableId)) {
            this.cellManager.createSystemCell(tableId, tableName);
        }
        return tableId;
    }

    /**
     * Возвращает ближайшие источники выборки.
     * @param rootCell корневая ячейка
     * @returns массив ячеек
     */
    getSelectSources(rootCell: Cell): Cell[] {
        const foundCells: Cell[] = [];
        this.getSelectSourcesRecursively(rootCell, foundCells);
        return foundCells;
    }

    /**
     * Возвращает ближайшие источники выборки (рекурсивно).
     * @param currentCell текущая ячейка
     * @param foundCells найденные ячейки
     */
    private getSelectSourcesRecursively(currentCell: Cell, foundCells: Cell[]): void {
        const childCells = this.cellManager.getOutgoingCells(currentCell);
        if (childCells.length === 0) {
            return;
        } else {
            for (const childCell of childCells) {
                const visualizerCell = this.cellManager.getVisualizerCellByCell(childCell);
                if (visualizerCell !== undefined && (visualizerCell.info.type.name === CellType.system || visualizerCell.info.type.name === CellType.select)) {
                    foundCells.push(childCell);
                } else {
                    this.getSelectSourcesRecursively(childCell, foundCells);
                }
            }
        }
    }
}