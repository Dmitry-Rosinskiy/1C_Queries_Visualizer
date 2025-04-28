const DSQueryType = {
    /** Подзапрос селект (выборка) */
    select: "select",
    /** Подзапрос соединение */
    join: "join",
    /** Подзапрос объединение */
    union: "union",
    /** Системный подзапрос - подзапросы из платформы, доп источники, пользовательские источники */
    system: "system",
    /** Константный подзапрос - содержит только литералы или выражения из литералов */
    constant: "constant",
  }

/**
 * Тип соединения источников данных.
 * Значения должны быть синхронизированы с сервером.
 */
const JoinType = {
    /** Внутреннее соединение */
    inner: "inner",
  
    /** Левое соединение */
    left: "left",
  
    /** Правое соединение */
    right: "right",
  
    /** Полное соединение */
    full: "full",
  }

const Sort = {
    DESC: "desc",
    ASC: "asc",
    NONE: "none",
}

export const FlatConstant = {
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
          type: "string"
        },
        {
          role: "measure",
          expression: "42",
          name: "Число",
          synonym: "Число",
          sort: Sort.NONE,
          type: "number"
        },
      ],
    },
  },
  rootId: "520f4ac13e284c7f89f5aeedc5ce54ed",
};

export const FlatSelect = {
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
          type: "string"
        },
        {
          role: "dimension",
          expression: "Товар.Наименование",
          name: "Товар",
          synonym: "Товар",
          sort: Sort.NONE,
          type: "string"
        },
        {
          role: "measure",
          expression: "SUM(Количество)",
          name: "Количество",
          synonym: "Количество",
          sort: Sort.NONE,
          type: "number"
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

export const FlatJoin = {
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
          type: "ref"
        },
        {
          role: "measure",
          expression: "SUM(Продажи.Количество)",
          name: "КоличествоПроданных",
          synonym: "Количество проданных",
          sort: Sort.NONE,
          type: "number"
        },
        {
          role: "measure",
          expression: "SUM(ТоварныеЗапасы.Количество)",
          name: "КоличествоЗапасов",
          synonym: "Количество запасов",
          sort: Sort.NONE,
          type: "number"
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

export const FlatUnion = {
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
          type: "ref"
        },
        {
          role: "dimension",
          expressionUnion: ["Дата", "Дата"],
          name: "Дата",
          synonym: "Дата",
          sort: Sort.NONE,
          type: "date"
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

export const Query1 = {
  "rootId": "bc4d794b72cc4561bd1204e0c9f68d46",
  "queries": {
      "bc4d794b72cc4561bd1204e0c9f68d46": {
          "type": DSQueryType.union,
          "select": [
              {
                  "name": "Ссылка",
                  "role": "dimension",
                  "sort": Sort.NONE,
                  "synonym": "Ссылка",
                  "expressionUnion": [
                      "Ссылка",
                      "Ссылка"
                  ],
                  type: "ref"
              },
              {
                  "name": "НомерСтроки",
                  "role": "dimension",
                  "sort": Sort.NONE,
                  "synonym": "Номер строки",
                  "expressionUnion": [
                      "НомерСтроки",
                      "НомерСтроки"
                  ],
                  type: "number"
              },
              {
                  "name": "Номенклатура",
                  "role": "dimension",
                  "sort": Sort.NONE,
                  "synonym": "Номенклатура",
                  "expressionUnion": [
                      "Номенклатура",
                      "Номенклатура"
                  ],
                  type: "ref"
              },
              {
                  "name": "Упаковка",
                  "role": "dimension",
                  "sort": Sort.NONE,
                  "synonym": "Упаковка",
                  "expressionUnion": [
                      "Упаковка",
                      "Упаковка"
                  ],
                  type: "ref"
              },
              {
                  "name": "Количество",
                  "role": "measure",
                  "sort": Sort.NONE,
                  "synonym": "Количество (в единицах хранения)",
                  "expressionUnion": [
                      "Количество",
                      "Количество"
                  ],
                  type: "number"
              },
              {
                  "name": "Цена",
                  "role": "measure",
                  "sort": Sort.NONE,
                  "synonym": "Цена",
                  "expressionUnion": [
                      "Цена",
                      "Цена"
                  ],
                  type: "number"
              },
              {
                  "name": "Сумма",
                  "role": "measure",
                  "sort": Sort.NONE,
                  "synonym": "Сумма",
                  "expressionUnion": [
                      "Сумма",
                      "Сумма"
                  ],
                  type: "number"
              },
              {
                  "name": "СтавкаНДС",
                  "role": "dimension",
                  "sort": Sort.NONE,
                  "synonym": "Ставка НДС",
                  "expressionUnion": [
                      "СтавкаНДС",
                      "СтавкаНДС"
                  ],
                  type: "number"
              },
              {
                  "name": "СуммаНДС",
                  "role": "measure",
                  "sort": Sort.NONE,
                  "synonym": "Сумма НДС",
                  "expressionUnion": [
                      "СуммаНДС",
                      "СуммаНДС"
                  ],
                  type: "number"
              },
              {
                  "name": "СуммаСНДС",
                  "role": "measure",
                  "sort": Sort.NONE,
                  "synonym": "Сумма с НДС",
                  "expressionUnion": [
                      "СуммаСНДС",
                      "СуммаСНДС"
                  ],
                  type: "number"
              },
              {
                  "name": "Склад",
                  "role": "dimension",
                  "sort": Sort.NONE,
                  "synonym": "Склад",
                  "expressionUnion": [
                      "Склад",
                      "Склад"
                  ],
                  type: "ref"
              },
              {
                  "name": "КодСтроки",
                  "role": "measure",
                  "sort": Sort.NONE,
                  "synonym": "Код строки",
                  "expressionUnion": [
                      "КодСтроки",
                      "КодСтроки"
                  ],
                  type: "string"
              }
          ],
          "unions": [
              {
                  "fromAs": "ПриобретениеТоваровУслугТовары",
                  "from": "f0d29d9d64f54b8983e769a021e1bdd6"
              },
              {
                  "fromAs": "РеализацияТоваровУслугТовары",
                  "from": "03cccb0e54e94d5d8310d2b1d43ee0b9"
              }
          ],
          "withDuplicates": true
      },
      "f0d29d9d64f54b8983e769a021e1bdd6": {
          "type": DSQueryType.system,
          "from": "Документ.ПриобретениеТоваровУслуг.Товары"
      },
      "03cccb0e54e94d5d8310d2b1d43ee0b9": {
          "type": DSQueryType.system,
          "from": "Документ.РеализацияТоваровУслуг.Товары"
      }
  }
}

const Query2 = {
  "rootId": "154b754ba235496f8da03cb4d8959865",
  "queries": {
      "154b754ba235496f8da03cb4d8959865": {
          "type": "join",
          "select": [
              {
                  "role": "dimension",
                  "expression": "ТоварыНаСкладах.Активность",
                  "name": "Активность",
                  "synonym": "Активность",
                  "sort": "none",
                  "type": "boolean"
              }
          ],
          "where": [
              {
                  "id": "a",
                  "expression": "ТоварыНаСкладах.Активность = \"ДА\""
              }
          ],
          "joinSources": {
              "root": {
                  "source": {
                      "from": "e247367955824a33a2793dc240015b63",
                      "fromAs": "ТоварыНаСкладах"
                  },
                  "relations": [
                      "1f5fbb63248742f0bff88d3897643a96",
                      "b4e26848daf3428aa66e7581d95c9ca7"
                  ]
              },
              "relationIndex": {
                  "1f5fbb63248742f0bff88d3897643a96": {
                      "source": {
                          "from": "b235df5474504a24b4ce373557020707",
                          "fromAs": "ЗаказКлиента"
                      },
                      "condition": "ТоварыНаСкладах.Период = ЗаказКлиента.Дата",
                      "type": "left",
                      "relations": []
                  },
                  "b4e26848daf3428aa66e7581d95c9ca7": {
                      "type": "left",
                      "condition": "ТоварыНаСкладах.Номенклатура = Партнеры.Наименование",
                      "source": {
                          "from": "2204cb64d1a7464cbf41f040b5894afa",
                          "fromAs": "Партнеры"
                      },
                      "relations": []
                  }
              }
          }
      },
      "e247367955824a33a2793dc240015b63": {
          "type": "system",
          "from": "РегистрНакопления.ТоварыНаСкладах"
      },
      "b235df5474504a24b4ce373557020707": {
          "type": "system",
          "from": "Документ.ЗаказКлиента"
      },
      "2204cb64d1a7464cbf41f040b5894afa": {
          "type": "system",
          "from": "Справочник.Партнеры"
      }
  }
}

/**
 * Показывает панель с запросами.
 * @param {AppModelVisualizer} visualizer приложение визуализатора
 */
export const showQueriesPanel = (visualizer) => {
    const queriesSelectElem = document.getElementById("queries-select");
    const queriesSelectHeader = document.createElement("h2");
    queriesSelectHeader.innerText = "Примеры запросов";
    queriesSelectElem.append(queriesSelectHeader);
    const queries = [];
    queries.push(makeQuery("constant", FlatConstant));
    queries.push(makeQuery("select", FlatSelect));
    queries.push(makeQuery("join", FlatJoin));
    queries.push(makeQuery("union", FlatUnion));
    queries.push(makeQuery("query1", Query1));
    queries.push(makeQuery("query2", Query2));
    makeQuerySelectElement(queriesSelectElem, queries, visualizer);
}

/**
 * Создаёт именованный запрос.
 * @param {string} name название запроса
 * @param {FlatDSQueryContainer} query запрос 
 * @returns именованный запрос
 */
const makeQuery = (name, query) => {
  return {
    "name": name,
    "query": query
  };
}

/**
 * Связывает кнопки панели с запросами.
 * @param {HTMLDivElement} queriesSelectElem 
 * @param {{name:string, query:FlatDSQueryContainer}[]} queries 
 * @param {AppModelVisualizer} visualizer 
 */
const makeQuerySelectElement = (queriesSelectElem, queries, visualizer) => {
  for (const query of queries) {
    const queryButton = document.createElement("button");
    queryButton.innerText = query.name;
    queryButton.classList.add("query-button-unselected");
    queryButton.addEventListener("click", (sender, event) => {
      console.log(query.query);
      const selectedQueryButton = document.querySelector(".query-button-selected");
      if (selectedQueryButton) {
        selectedQueryButton.classList.remove("query-button-selected");
      }
      queryButton.classList.add("query-button-selected");
      visualizer.visualizeQuery(query.query);
    });
    queriesSelectElem.append(queryButton);
  }
  const brElem1 = document.createElement('br');
  const brElem2 = document.createElement('br');
  const customQueryText = document.createElement('textarea');
  const customQueryButton = document.createElement('button');
  customQueryButton.classList.add("query-button-unselected");
  customQueryButton.innerText = 'Визуализировать модель';
  customQueryButton.addEventListener('click', (sender, event) => {
    const queryObject = JSON.parse(customQueryText.value);
    console.log(queryObject);
    const selectedQueryButton = document.querySelector(".query-button-selected");
      if (selectedQueryButton) {
        selectedQueryButton.classList.remove("query-button-selected");
      }
      customQueryButton.classList.add("query-button-selected");
    visualizer.visualizeQuery(queryObject);
  })
  queriesSelectElem.append(brElem1, customQueryText, brElem2, customQueryButton);
}

