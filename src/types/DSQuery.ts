/**
 * 
 * Описание типов данных объекта запроса
 * Запрос это вложенная структура состоящая из подзапросов
 * Объект этого типа также является неограниченной вложенной структурой
 * Главный тип - DSQuery.
 * 
 */


/**
 * Соответствует значению null в результатах запроса платформы.
 * В языке Аналитики нет выражения для представления null.
 */
export const COMPOSITE_FIELD_ABSENT_VALUE: null = null;

export type Role = "measure" | "dimension" | "filter";

export enum Sort {
  DESC = "desc",
  ASC = "asc",
  NONE = "none",
}

/** Возможные типы полей */
export type Type = "string" | "number" | "boolean" | "date" | "ref" | "composite";

export interface DSQueryField {
  /** Системное имя поля */
  name: string;

  /** Пользовательское имя поля */
  synonym: string;

  /** Роль поля
   *  отсутствует для перечислений
   */
  role: Role;

  /** Выражение выбора */
  expression: string;

  sort: Sort;

  /** Тип поля */
  type?: Type
}

/** Описывает одно объединение */
export interface DSItem {
  /** Какой источник добавлять к объединению/соединению. */
  from: DSQuery;
  /** Алиас для источника добавленного к объединению/соединению */
  fromAs: string;
}

/**
 * Массив объединений для источника.
 */
export type Unions = DSItem[];

/** Тип поля для выгрузки из объединения */
export interface UnionField extends Omit<DSQueryField, "expression"> {
  /** Поля хранятся в том же порядке, что и в списке объединенных источников (поле unions) */
  expressionUnion: (string | typeof COMPOSITE_FIELD_ABSENT_VALUE)[];
}

/**
 * Тип соединения источников данных.
 * Значения должны быть синхронизированы с сервером.
 */
export enum JoinType {
  /** Внутреннее соединение */
  inner = "inner",

  /** Левое соединение */
  left = "left",

  /** Правое соединение */
  right = "right",

  /** Полное соединение */
  full = "full",
}

export type JoinComparisonType =
  | "equal"
  | "notEqual"
  | "greaterThan"
  | "greaterThanOrEqual"
  | "lessThan"
  | "lessThanOrEqual";

export enum DSQueryType {
  /** Подзапрос селект (выборка) */
  select = "select",
  /** Подзапрос соединение */
  join = "join",
  /** Подзапрос объединение */
  union = "union",
  /** Системный подзапрос - подзапросы из платформы, доп источники, пользовательские источники */
  system = "system",
  /** Константный подзапрос - содержит только литералы или выражения из литералов */
  constant = "constant",
}

// QT - сокращение query type
export const {
  constant: QT_CONSTANT,
  join: QT_JOIN,
  select: QT_SELECT,
  system: QT_SYSTEM,
  union: QT_UNION,
} = DSQueryType;

export const EDITABLE_QUERY_TYPES = [QT_CONSTANT, QT_JOIN, QT_SELECT, QT_UNION] as const;
export type EditableDSQueryTypes = (typeof EDITABLE_QUERY_TYPES)[number];

export const READ_ONLY_QUERY_TYPES = [QT_SYSTEM] as const;
export type ReadOnlyDSQueryTypes = (typeof READ_ONLY_QUERY_TYPES)[number];

export interface DSQueryFilter {
  /** Уникальный идентификатор фильтра */
  id: string;

  /** Выражение фильтра */
  expression: string;
}

/** Базовый интерфейс для описания запроса */
export interface DSQueryBase {}

/** Базовый интерфейс для SELECT-модели запроса */
export interface DSQuerySelectBase extends DSQueryBase {
  /** Выборка полей источника */
  select: DSQueryField[];

  /** Сколько первых элементов выгружаем */
  top?: number;

  /** Все фильтры, применяемые к выгрузке (включая having) */
  where?: DSQueryFilter[];

  /** Номера полей, по которым происходит группировка. */
  groupBy?: number[];
}

/** Интерфейс для описания выгрузки данных из одного источника */
export interface DSQuerySelect extends DSQuerySelectBase {
  type: DSQueryType.select;

  /** Источник, из которого выгружаем */
  from: DSQuery;

  /** Алиас для источника, из которого происходит выбор */
  fromAs: string;
}

/** Интерфейс для описания выгрузки данных из соединения источников */
export interface DSQueryJoin extends DSQuerySelectBase {
  type: DSQueryType.join;

  /** Дерево источников соединения */
  joinSources: JoinSources;
}

/*
 * Пример соединения A LEFT JOIN B ON E1 RIGHT JOIN C ON E2
 * {
 *   source: { A },
 *   relations: [{
 *     source: { B },
 *     type: JoinType.left,
 *     condition: E1,
 *     relations: [{
 *       source: { C },
 *       type: JoinType.right,
 *       condition: E2,
 *       relations: []
 *     }]
 *   }]
 * }
 */

export type IJoinSources<S, T> = {
  /** Корневой источник соединения */
  source: S;
  /** Соединения к корневому источнику */
  relations: IJoinRelation<S, T>[];
};
/** Условие соединения источников и соединения с подысточниками */
export type IJoinRelation<S, T> = {
  /** Источник соединения */
  source: S;
  /** Тип соединения */
  type: JoinType;
  /** Условие соединения */
  condition: T;
  /** Соединения к текущему источнику */
  relations: IJoinRelation<S, T>[];
};

export type JoinSources = IJoinSources<DSItem, string>;
export type JoinRelation = IJoinRelation<DSItem, string>;

export interface DSQueryUnion extends DSQueryBase {
  type: DSQueryType.union;

  /** Задает выборку полей из объединения. */
  select: UnionField[];

  /** Описание объединенных источников в виде списка [алиас для выгрузки UnionField, id источника] */
  unions: Unions;

  /** Признак оставляет ли объединение дубликаты (ОБЪЕДИНИТЬ ВСЕ) или нет (ОБЪЕДИНИТЬ).
   * По умолчанию true - должно оставлять. */
  withDuplicates: boolean;
}

export interface DSQuerySystem extends DSQueryBase {
  type: DSQueryType.system;

  /** id системного источника */
  from: string;
}

/** Интерфейс для описания выгрузки данных без источников */
export interface DSQueryConstant extends DSQueryBase {
  type: DSQueryType.constant;

  /** Поля с фиксированными значениями */
  select: DSQueryField[];
}

/** union-тип для описания всех возможных источников. */
export type DSQuery =
  | DSQuerySelect
  | DSQueryUnion
  | DSQueryJoin
  | DSQuerySystem
  | DSQueryConstant;