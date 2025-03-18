import { DSQuery, DSQueryType, JoinType, Sort } from "../types/DSQuery";
import { FlatDSQueryContainer } from "../types/FlatDSQuery";

// Описывает запрос с соединением (join) двух таблиц и группировкой результатов

/**
 *  SELECT
        Продажи.Товар AS Товар, 
        SUM(Продажи.Количество) AS КоличествоПроданных, 
        SUM(ТоварныеЗапасы.Количество) AS КоличествоЗапасов
    FROM
        РегистрНакопления.Продажи AS Продажи
        LEFT JOIN
            РегистрНакопления.ТоварныеЗапасы AS ТоварныеЗапасы
        ON
            Продажи.Товар = ТоварныеЗапасы.Товар AND Продажи.Период = ТоварныеЗапасы.Период
    GROUP BY
        Продажи.Товар
 */

export const FlatJoin: FlatDSQueryContainer = {
  queries: {
    "70652d9d935342ba8ba0f93f0577221e": {
      type: DSQueryType.join,
      select: [
        {
          role: "dimension",
          expression: "Продажи.Товар",
          name: "Товар",
          synonym: "Товар",
          sort: Sort.NONE,
        },
        {
          role: "measure",
          expression: "SUM(Продажи.Количество)",
          name: "КоличествоПроданных",
          synonym: "Количество проданных",
          sort: Sort.NONE,
        },
        {
          role: "measure",
          expression: "SUM(ТоварныеЗапасы.Количество)",
          name: "КоличествоЗапасов",
          synonym: "Количество запасов",
          sort: Sort.NONE,
        },
      ],
      joinSources: {
        root: {
          source: {
            from: "2b658a5fe79a4f62833b6bd8a58adcf9",
            fromAs: "Продажи",
          },
          relations: ["f9f26afd86c04220a08666032ebb21b0"],
        },
        relationIndex: {
          f9f26afd86c04220a08666032ebb21b0: {
            source: {
              from: "74f8d65af8d4417b9f115fbc7a8cbae9",
              fromAs: "ТоварныеЗапасы",
            },
            condition:
              "Продажи.Товар = ТоварныеЗапасы.Товар AND Продажи.Период = ТоварныеЗапасы.Период",
            type: JoinType.left,
            relations: [],
          },
        },
      },
      groupBy: [0],
    },
    "2b658a5fe79a4f62833b6bd8a58adcf9": {
      type: DSQueryType.system,
      from: "РегистрНакопления.Продажи",
    },
    "74f8d65af8d4417b9f115fbc7a8cbae9": {
      type: DSQueryType.system,
      from: "РегистрНакопления.ТоварныеЗапасы",
    },
  },
  rootId: "70652d9d935342ba8ba0f93f0577221e",
};

export const NestedJoin: DSQuery = {
  type: DSQueryType.join,
  select: [
    {
      role: "dimension",
      expression: "Продажи.Товар",
      name: "Товар",
      synonym: "Товар",
      sort: Sort.NONE,
    },
    {
      role: "measure",
      expression: "SUM(Продажи.Количество)",
      name: "КоличествоПроданных",
      synonym: "Количество проданных",
      sort: Sort.NONE,
    },
    {
      role: "measure",
      expression: "SUM(ТоварныеЗапасы.Количество)",
      name: "КоличествоЗапасов",
      synonym: "Количество запасов",
      sort: Sort.NONE,
    },
  ],
  joinSources: {
    source: {
      fromAs: "Продажи",
      from: {
        type: DSQueryType.system,
        from: "РегистрНакопления.Продажи",
      },
    },
    relations: [
      {
        source: {
          fromAs: "ТоварныеЗапасы",
          from: {
            type: DSQueryType.system,
            from: "РегистрНакопления.ТоварныеЗапасы",
          },
        },
        type: JoinType.left,
        condition:
          "Продажи.Товар = ТоварныеЗапасы.Товар AND Продажи.Период = ТоварныеЗапасы.Период",
        relations: [],
      },
    ],
  },
  groupBy: [0],
};
