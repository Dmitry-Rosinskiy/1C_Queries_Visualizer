import { DSQuery, DSQueryType, Sort } from "../types/DSQuery";
import { FlatDSQueryContainer } from "../types/FlatDSQuery";

// Описывает запрос который состоит только из констант

// SELECT "Строковая констранта" as СтроковаяКонстранта, 42 as Число

// Плоская структура запроса
export const FlatConstant: FlatDSQueryContainer = {
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

// Вложенная структура
export const NestedConstant: DSQuery = {
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
};
