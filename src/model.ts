import { DSQueryType, JoinType, Sort } from "./types/DSQuery";
import { FlatDSQueryContainer } from "./types/FlatDSQuery";

const FlatConstant: FlatDSQueryContainer = {
  queries: {
    "520f4ac13e284c7f89f5aeedc5ce54ed": {
      type: DSQueryType.constant,
      select: [
        {
          role: "dimension",
          expression: '"Строковая констранта"',
          name: "СтроковаяКонстранта",
          synonym: "Строковая констранта",
          sort: Sort.NONE,
        },
        {
          role: "measure",
          expression: "42",
          name: "Число",
          synonym: "Число",
          sort: Sort.NONE,
        },
      ],
    },
  },
  rootId: "520f4ac13e284c7f89f5aeedc5ce54ed",
};

const FlatSelect: FlatDSQueryContainer = {
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

const FlatJoin: FlatDSQueryContainer = {
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

const FlatUnion: FlatDSQueryContainer = {
  queries: {
    "604d5c2b247f4ef19fceb0bad659b62e": {
      type: DSQueryType.union,
      select: [
        {
          role: "dimension",
          expressionUnion: ['"Расход"', '"Приход"'],
          name: "ТипДвижения",
          synonym: "Тип движения",
          sort: Sort.NONE,
        },
        {
          role: "dimension",
          expressionUnion: ["Дата", "Дата"],
          name: "Дата",
          synonym: "Дата",
          sort: Sort.NONE,
        },
      ],
      unions: [
        {
          from: "997e4a4a6a2544408a0e9ff5956839f8",
          fromAs: "РасходТовара",
        },
        {
          from: "a43c1eb1276d483fac139b6de8644fc8",
          fromAs: "ПриходТовара",
        },
      ],
      withDuplicates: true,
    },
    "997e4a4a6a2544408a0e9ff5956839f8": {
      type: DSQueryType.system,
      from: "Документ.РасходТовара",
    },
    a43c1eb1276d483fac139b6de8644fc8: {
      type: DSQueryType.system,
      from: "Документ.ПриходТовара",
    },
  },
  rootId: "604d5c2b247f4ef19fceb0bad659b62e",
}

export default FlatJoin;