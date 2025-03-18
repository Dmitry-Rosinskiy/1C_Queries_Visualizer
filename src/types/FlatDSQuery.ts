/**
 * 
 * Вложенная структура запроса является удобной для хранения,
 * так как нет избыточной структуры. Однако с такой структурой
 * неудобно работать в режиме редактирования, так как для обращения
 * к какому-либо позапросу необходимо было бы пройти все "надзапросы".
 * 
 * Поэтому вложенная структура используется для хранения, но для активной работы
 * раскладывается в плоскую структуру. Плоская структура это контейнер содержащий все
 * подзапросы. Каждому подзапросу назначается идентификатор для прямого доступа и он же 
 * используется в местах использования. 
 * 
 * Т.е. например в блоке from используется уже не объект, который описывает подзапрос или
 * системный источник данных, а просто идентификатор подзапроса по которому его можно получить
 * в контейнере подзапросов queries.
 * 
 * Самый родительский запрос, т.е. корень дерева также лежит в контейнере. Чтобы было понятно, откуда
 * начинать разбор идентификатор корневого запроса находится в rootId.
 * 
 */


import type {
  DSQueryJoin,
  DSQuerySelect,
  DSQuerySystem,
  DSQueryUnion,
  DSItem,
  DSQueryConstant,
  JoinType,
} from "./DSQuery";

type ID = string;

export type KeyValue<T> = { [key: string]: T };

export interface FlatDSItem extends Omit<DSItem, "from"> {
  /** Синтетический идентификатор подзапроса */
  from: ID;
}

export type FlatUnions = FlatDSItem[];

export interface FlatDSQuerySelect extends Omit<DSQuerySelect, "from"> {
  from: ID;
}

export interface FlatDSQueryJoin extends Omit<DSQueryJoin, "joinSources"> {
  joinSources: FlatJoinSources;
}

// Пример соединения A LEFT JOIN B ON E1 RIGHT JOIN C ON E2
// {
// 	root: {
// 		source: { A },
// 		relations: [id1],
// 	};
// 	relations: {
// 		id1: {
// 			source: { B },
// 			type: JoinType.left,
// 			condition: E1,
// 			relations: [id2],
// 		},
// 		id2: {
// 			source: { C },
// 			type: JoinType.right,
// 			condition: E2,
// 			relations: [],
// 		}
// 	}
// }

export type FlatJoinSources = {
  root: FlatJoinRoot;
  relationIndex: Record<string, FlatJoinRelation>;
};

export type FlatJoinRoot = {
  source: FlatDSItem;
  relations: string[];
};

export type FlatJoinRelation = {
  source: FlatDSItem;
  type: JoinType;
  condition: string;
  relations: string[];
};

export type FlatJoinItem = FlatJoinRoot | FlatJoinRelation;

export interface FlatDSQueryUnion extends Omit<DSQueryUnion, "unions"> {
  unions: FlatUnions;
}

export type FlatDSQuery =
  | FlatDSQuerySelect
  | FlatDSQueryJoin
  | FlatDSQueryUnion
  | DSQuerySystem
  | DSQueryConstant;

export interface FlatDSQueryContainer {
  /** id основного верхнеуровнего (корневого) подзапроса */
  rootId: ID;

  /**
   * хранит основной запрос и все подзапросы по их id
   * id подзапроса -> подзапрос
   * На сервере хранится в одной рекурсивной структуре,
   * на клиенте раскладывается в плоскую
   */
  queries: KeyValue<FlatDSQuery>;
}