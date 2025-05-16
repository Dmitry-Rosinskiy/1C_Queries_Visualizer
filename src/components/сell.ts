import { Cell, CellStyle } from '@maxgraph/core';

/** Виды ячеек визуализатора */
export enum CellType {
    constant = 'constant',
    system = 'system',
    select = 'select',
    join = 'join',
    union = 'union',
    where = 'where',
    group_by = 'group_by'
}

/** Функции агрегации (группировки) */
export enum AggregateFunctions {
    SUM = 'СУММА',
    MIN = 'МИН',
    MAX = 'МАКС',
    AVG = 'СРЕДНЕЕ',
    COUNT = 'КОЛ',
    RCOUNT = 'РКОЛ'
}

/** Операторы отношений, выводящиеся с новой строки */
export enum LineConditionOperators {
    AND = 'И',
    OR = 'ИЛИ'
}

/** Ячейки, которые можно выбрать в визуализаторе */
export const SELECTABLE_CELL_TYPES: readonly CellType[] = [CellType.join, CellType.union] as const;

/** Ячейки, которые можно редактировать в визуализаторе */
export const EDITABLE_CELL_TYPES: readonly CellType[] = [CellType.join, CellType.union] as const;

/** Стиль ячеек, которые используются в визуализаторе */
export type SchemeCellStyle = Pick<CellStyle, 'shape' | 'fontColor' | 'fillColor' | 'strokeColor' | 'strokeWidth' | 'rounded' | 'arcSize'>

/** Метаданные вида ячеек визуализатора */
export interface VisualizerCellTypeData {
    /** Вид ячейки */
    name: CellType;
    /** Стиль ячейки по умолчанию */
    defaultStyle: SchemeCellStyle;
    /** Стиль ячейки, когда она выбрана */
    selectedStyle?: SchemeCellStyle;
    /** Стиль ячейки, когда она выделена */
    highlightedStyle?: SchemeCellStyle;
}

/** Содержит метаданные по каждому виду ячеек визуализатора */
export class VisualizerCellType {

    /** Метаданные ячейки "системная таблица"*/
    static System: VisualizerCellTypeData = {
        name: CellType.system,
        defaultStyle: {
            shape: 'rectangle',
            fontColor: 'black',
            fillColor: 'orange',
            strokeColor: 'gold',
            strokeWidth: 1,
            rounded: true
        },
        highlightedStyle: {
            shape: 'rectangle',
            fontColor: 'white',
            fillColor: 'blue',
            strokeColor: 'indigo',
            strokeWidth: 1,
            rounded: true
        }
    }

    /** Метаданные ячейки "SELECT" (выборка) */
    static Select: VisualizerCellTypeData = {
        name: CellType.select,
        defaultStyle: {
            shape: 'rectangle',
            fontColor: 'black',
            fillColor: 'lightblue',
            strokeColor: 'black',
            strokeWidth: 2,
            rounded: true,
            arcSize: 5
        },
        highlightedStyle: {
            shape: 'rectangle',
            fontColor: 'white',
            fillColor: 'blue',
            strokeColor: 'indigo',
            strokeWidth: 1,
            rounded: true
        }
    }

    /** Метаданные ячейки "JOIN" (соединение) */
    static Join: VisualizerCellTypeData = {
        name: CellType.join,
        defaultStyle: {
            shape: 'ellipse',
            fontColor: 'black',
            fillColor: 'white',
            strokeColor: 'black',
            strokeWidth: 2,
            rounded: true
        },
        selectedStyle: {
            shape: 'ellipse',
            fontColor: 'black',
            fillColor: 'white',
            strokeColor: 'blue',
            strokeWidth: 2,
            rounded: true 
        }
    }

    /** Метаданные ячейки "UNION" (объединение) */
    static Union: VisualizerCellTypeData = {
        name: CellType.union,
        defaultStyle: {
            shape: 'ellipse',
            fontColor: 'black',
            fillColor: 'white',
            strokeColor: 'black',
            strokeWidth: 2,
            rounded: true
        },
        selectedStyle: {
            shape: 'ellipse',
            fontColor: 'black',
            fillColor: 'white',
            strokeColor: 'blue',
            strokeWidth: 2,
            rounded: true 
        }
    }

    /** Метаданные ячейки "GROUP BY" (группировка) */
    static GroupBy: VisualizerCellTypeData = {
        name: CellType.group_by,
        defaultStyle: {
            shape: 'ellipse',
            fontColor: 'black',
            fillColor: 'white',
            strokeColor: 'black',
            strokeWidth: 2,
            rounded: true
        }   
    }

    /** Метаданные ячейки "WHERE" (фильтрация) */
    static Where: VisualizerCellTypeData = {
        name: CellType.where,
        defaultStyle: {
            shape: 'ellipse',
            fontColor: 'black',
            fillColor: 'white',
            strokeColor: 'black',
            strokeWidth: 2,
            rounded: true
        },
    }
}

/** Информация, содержащаяся в ячейке визуализатора */
export interface VisualizerCellInfo {
    /** Идентификатор */
    id: string;
    /** Название */
    name: string;
    /** Вид */
    type: VisualizerCellTypeData;
    /** Подсказка */
    hint?: string;
    /** Дополнительное содержимое */
    extra?: string;
    /** Состояние (раскрыта) */
    expanded?: boolean;
}

/** Ячейка визуализатора */
export interface VisualizerCell {
    /** Ячейка */
    cell: Cell;
    /** Информация */
    info: VisualizerCellInfo;
}
