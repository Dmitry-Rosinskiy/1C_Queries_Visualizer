import { DSQuery, DSQueryType, Sort } from "../types/DSQuery";
import { FlatDSQueryContainer } from "../types/FlatDSQuery";

// Запрос простой выборки данных c фильтром и группировкой

/**  SELECT
        Продажи.Покупатель.Наименование AS Покупатель, 
        Продажи.Товар.Наименование AS Товар, 
        SUM(Продажи.Количество) AS Количество
    FROM
        РегистрНакопления.Продажи AS Продажи
    WHERE
        Продажи.Товар.Наименование = "Йогурт"
    GROUP BY
        Продажи.Покупатель.Наименование, 
        Продажи.Товар.Наименование
*/

export const FlatSelect: FlatDSQueryContainer = {
  queries: {
    "604d5c2b247f4ef19fceb0bad659b62e": {
      type: DSQueryType.select,
      from: "b04382fb55b248608ef43cf9b055a361",
      fromAs: "Продажи",
      select: [
        {
          role: "dimension",
          expression: "Покупатель.Наименование",
          name: "Покупатель",
          synonym: "Покупатель",
          sort: Sort.NONE,
        },
        {
          role: "dimension",
          expression: "Товар.Наименование",
          name: "Товар",
          synonym: "Товар",
          sort: Sort.NONE,
        },
        {
          role: "measure",
          expression: "SUM(Количество)",
          name: "Количество",
          synonym: "Количество",
          sort: Sort.NONE,
        },
      ],
      groupBy: [0, 1],
      where: [
        {
          id: "13f5550942ba4c3e9cc61f62d655505e",
          expression: 'Товар.Наименование = "Йогурт"',
        },
      ],
    },
    b04382fb55b248608ef43cf9b055a361: {
      type: DSQueryType.system,
      from: "РегистрНакопления.Продажи",
    },
  },
  rootId: "604d5c2b247f4ef19fceb0bad659b62e",
};

export const NestedSelect: DSQuery = {
  type: DSQueryType.select,
  from: {
    type: DSQueryType.system,
    from: "РегистрНакопления.Продажи",
  },
  fromAs: "Продажи",
  select: [
    {
      role: "dimension",
      expression: "Покупатель.Наименование",
      name: "Покупатель",
      synonym: "Покупатель",
      sort: Sort.NONE,
    },
    {
      role: "dimension",
      expression: "Товар.Наименование",
      name: "Товар",
      synonym: "Товар",
      sort: Sort.NONE,
    },
    {
      role: "measure",
      expression: "SUM(Количество)",
      name: "Количество",
      synonym: "Количество",
      sort: Sort.NONE,
    },
  ],
  groupBy: [0, 1],
  where: [
    {
      id: "2cea05dcbd4c41c8b55e77c840460564",
      expression: 'Товар.Наименование = "Йогурт"',
    },
  ],
};
