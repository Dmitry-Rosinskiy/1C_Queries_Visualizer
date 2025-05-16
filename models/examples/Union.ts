import { DSQuery, DSQueryType, Sort } from "../types/DSQuery";
import { FlatDSQueryContainer } from "../types/FlatDSQuery";

// Описывает запрос с объединением (union) двух таблиц

/**
 * SELECT
        "Расход" AS ТипДвижения, 
        РасходТовара.Дата AS Дата
    FROM
        Документ.РасходТовара AS РасходТовара
    
    UNION ALL
    
    SELECT
        "Приход" AS ТипДвижения, 
        ПриходТовара.Дата AS Дата
    FROM
        Документ.ПриходТовара AS ПриходТовара
 */


export const FlatUnion: FlatDSQueryContainer = {
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
    "a43c1eb1276d483fac139b6de8644fc8": {
      type: DSQueryType.system,
      from: "Документ.ПриходТовара",
    },
  },
  rootId: "604d5c2b247f4ef19fceb0bad659b62e",
};

export const NestedUnion: DSQuery = {
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
      fromAs: "РасходТовара",
      from: {
        type: DSQueryType.system,
        from: "Документ.РасходТовара",
      },
    },
    {
      fromAs: "ПриходТовара",
      from: {
        type: DSQueryType.system,
        from: "Документ.ПриходТовара",
      },
    },
  ],
  withDuplicates: true,
};
