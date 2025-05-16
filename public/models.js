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

const Query3 = {
    "id": "94de40279f7244b99e2b53e32c75a81e",
    "loading": false,
    "dataVersion": "f2ec27c8e49e440fb5a653c4652b17f7",
    "baseDataVersion": "6222537dced1411ea2cc10158b003779",
    "domainType": "query",
    "owner": "6b4f0f40-c74c-4e0d-91bd-6dd7adf33603",
    "ownerName": "Администратор1",
    "updated": "2025-05-12T13:32:57.504Z",
    "currentUndoIndex": 0,
    "undoes": [],
    "name": "Новый источник данных 16:22:50 · 12.05.2025",
    "rootId": "54a5669031bf47c19c1c9b22476c3eb1",
    "queries": {
        "54a5669031bf47c19c1c9b22476c3eb1": {
            "type": "join",
            "select": [
                {
                    "role": "dimension",
                    "expression": "ТоварыНаСкладах.SUM",
                    "name": "Активность",
                    "synonym": "Активность",
                    "sort": "none"
                },
                {
                    "role": "dimension",
                    "expression": "ТоварыНаСкладах.ВидДвижения",
                    "name": "ВидДвижения",
                    "synonym": "Вид движения",
                    "sort": "none"
                },
                {
                    "role": "dimension",
                    "expression": "ТоварыНаСкладах.Номенклатура",
                    "name": "Номенклатура",
                    "synonym": "Номенклатура",
                    "sort": "none"
                }
            ],
            "joinSources": {
                "root": {
                    "source": {
                        "fromAs": "ТоварыНаСкладахОстаткиИОбороты",
                        "from": "5221a70cd1044dddbfcd042f56d3a3dc"
                    },
                    "relations": [
                        "d19ed96b6e74411492e3620d572d40b9"
                    ]
                },
                "relationIndex": {
                    "d19ed96b6e74411492e3620d572d40b9": {
                        "condition": "ТоварыНаСкладахОстаткиИОбороты.Период = ТоварыНаСкладах.Период И ТоварыНаСкладахОстаткиИОбороты.Номенклатура = ТоварыНаСкладах.Номенклатура И ТоварыНаСкладахОстаткиИОбороты.Склад = ТоварыНаСкладах.Склад",
                        "type": "left",
                        "source": {
                            "fromAs": "ТоварыНаСкладах",
                            "from": "acbfa759c48b4f67bce44944ec8f1e84"
                        },
                        "relations": []
                    }
                }
            }
        },
        "5221a70cd1044dddbfcd042f56d3a3dc": {
            "type": "system",
            "from": "РегистрНакопления.ТоварыНаСкладах|remains"
        },
        "acbfa759c48b4f67bce44944ec8f1e84": {
            "type": "system",
            "from": "РегистрНакопления.ТоварыНаСкладах"
        }
    },
    "tempTableList": []
}

const Query4 = {
    "id": "ab6ace1218d04c69af0e5c6019422576",
    "loading": false,
    "dataVersion": "4e86146a12a943bd95f8551321ffa23e",
    "baseDataVersion": "08501fc2801c4e9688e62f081fbb4209",
    "domainType": "query",
    "owner": "6b4f0f40-c74c-4e0d-91bd-6dd7adf33603",
    "ownerName": "Администратор1",
    "updated": "2025-05-13T22:46:00.964Z",
    "currentUndoIndex": 0,
    "undoes": [],
    "name": "Новый источник данных 03:24:09 · 14.05.2025",
    "rootId": "5e4eec017fae4ace8ddec805e7da9520",
    "queries": {
        "5e4eec017fae4ace8ddec805e7da9520": {
            "type": "join",
            "select": [],
            "joinSources": {
                "root": {
                    "source": {
                        "fromAs": "ЗаказКлиента",
                        "from": "28e01c95888c425abb420540ac6949e5"
                    },
                    "relations": [
                        "58140cf4838344dbb780216e54952045",
                        "607d7ad38d564462af1d90e7ad566806"
                    ]
                },
                "relationIndex": {
                    "58140cf4838344dbb780216e54952045": {
                        "condition": "ЗаказКлиента.Контрагент = РеализацияТоваровУслуг.Контрагент",
                        "type": "left",
                        "source": {
                            "fromAs": "РеализацияТоваровУслуг",
                            "from": "1f93b763232447df8ad999986213c60a"
                        },
                        "relations": []
                    },
                    "607d7ad38d564462af1d90e7ad566806": {
                        "condition": "ЗаказКлиента.Дата = ВозвратТоваровОтКлиента.Дата",
                        "type": "left",
                        "source": {
                            "fromAs": "ВозвратТоваровОтКлиента",
                            "from": "08b26967ec42431ca797d2b68e884a89"
                        },
                        "relations": []
                    }
                }
            }
        },
        "28e01c95888c425abb420540ac6949e5": {
            "type": "system",
            "from": "Документ.ЗаказКлиента"
        },
        "1f93b763232447df8ad999986213c60a": {
            "type": "system",
            "from": "Документ.РеализацияТоваровУслуг"
        },
        "08b26967ec42431ca797d2b68e884a89": {
            "type": "system",
            "from": "Документ.ВозвратТоваровОтКлиента"
        }
    },
    "tempTableList": []
}

const Query5 = {
    "id": "ab6ace1218d04c69af0e5c6019422576",
    "loading": false,
    "dataVersion": "f270b152016f4212a39b6fdfd3c8ff9a",
    "baseDataVersion": "4e86146a12a943bd95f8551321ffa23e",
    "domainType": "query",
    "owner": "6b4f0f40-c74c-4e0d-91bd-6dd7adf33603",
    "ownerName": "Администратор1",
    "updated": "2025-05-13T22:55:27.283Z",
    "currentUndoIndex": 0,
    "undoes": [],
    "name": "Новый источник данных 03:24:09 · 14.05.2025",
    "rootId": "5e4eec017fae4ace8ddec805e7da9520",
    "queries": {
        "5e4eec017fae4ace8ddec805e7da9520": {
            "type": "join",
            "select": [],
            "joinSources": {
                "root": {
                    "source": {
                        "fromAs": "ЗаказКлиента",
                        "from": "28e01c95888c425abb420540ac6949e5"
                    },
                    "relations": [
                        "58140cf4838344dbb780216e54952045",
                        "607d7ad38d564462af1d90e7ad566806"
                    ]
                },
                "relationIndex": {
                    "58140cf4838344dbb780216e54952045": {
                        "condition": "ЗаказКлиента.Контрагент = РеализацияТоваровУслуг.Контрагент",
                        "type": "left",
                        "source": {
                            "fromAs": "РеализацияТоваровУслуг",
                            "from": "1f93b763232447df8ad999986213c60a"
                        },
                        "relations": [
                            "2281592b66ee432aa83090ba3bef6302"
                        ]
                    },
                    "607d7ad38d564462af1d90e7ad566806": {
                        "condition": "ЗаказКлиента.Дата = ВозвратТоваровОтКлиента.Дата",
                        "type": "left",
                        "source": {
                            "fromAs": "ВозвратТоваровОтКлиента",
                            "from": "08b26967ec42431ca797d2b68e884a89"
                        },
                        "relations": []
                    },
                    "2281592b66ee432aa83090ba3bef6302": {
                        "type": "left",
                        "condition": "РеализацияТоваровУслуг.Дата = КорректировкаРеализации.Дата",
                        "source": {
                            "from": "4e033db1a45a435685967e6eda8f806d",
                            "fromAs": "КорректировкаРеализации"
                        },
                        "relations": []
                    }
                }
            }
        },
        "28e01c95888c425abb420540ac6949e5": {
            "type": "system",
            "from": "Документ.ЗаказКлиента"
        },
        "1f93b763232447df8ad999986213c60a": {
            "type": "system",
            "from": "Документ.РеализацияТоваровУслуг"
        },
        "08b26967ec42431ca797d2b68e884a89": {
            "type": "system",
            "from": "Документ.ВозвратТоваровОтКлиента"
        },
        "4e033db1a45a435685967e6eda8f806d": {
            "type": "system",
            "from": "Документ.КорректировкаРеализации"
        }
    },
    "tempTableList": []
}

const LongQuery = {
    "id": "40e932d0879643518867078074cc7377",
    "loading": false,
    "dataVersion": "bca49d9568c744838527194ca8a91a77",
    "baseDataVersion": "4bead0de40bb409f8866225352fb0323",
    "domainType": "query",
    "owner": "6b4f0f40-c74c-4e0d-91bd-6dd7adf33603",
    "ownerName": "Администратор1",
    "updated": "2025-04-27T16:19:16.359Z",
    "currentUndoIndex": 0,
    "undoes": [],
    "name": "Новый источник данных 14:37:24 · 28.05.2024",
    "rootId": "d80c53e3732749cc81c1962872d998c2",
    "queries": {
        "d80c53e3732749cc81c1962872d998c2": {
            "type": "join",
            "select": [
                {
                    "role": "dimension",
                    "expression": "ЗаказКлиента1.КлючСвязи",
                    "name": "КлючСвязи",
                    "synonym": "Ключ связи",
                    "sort": "none"
                },
                {
                    "role": "dimension",
                    "expression": "ЗаказКлиента1.НомерСтроки",
                    "name": "НомерСтроки",
                    "synonym": "Номер строки",
                    "sort": "none"
                },
                {
                    "role": "dimension",
                    "expression": "Номенклатура.ВесИспользовать",
                    "name": "Вес",
                    "synonym": "Вес",
                    "sort": "none"
                },
                {
                    "role": "dimension",
                    "expression": "Номенклатура.ПометкаУдаления",
                    "name": "ПометкаУдаления",
                    "synonym": "Пометка удаления",
                    "sort": "none"
                }
            ],
            "joinSources": {
                "root": {
                    "source": {
                        "fromAs": "ТоварыНаСкладах1",
                        "from": "df7000f2989b4b73abeb60ef3b5b8f4d"
                    },
                    "relations": [
                        "1dbd8226eb2b43fda8c256445785caf3",
                        "0dbe78db999e4c78bd5a8037b61588b3",
                        "c11692bfd37443328773e1f0b2b1e51e"
                    ]
                },
                "relationIndex": {
                    "1dbd8226eb2b43fda8c256445785caf3": {
                        "condition": "Условие4",
                        "type": "right",
                        "source": {
                            "fromAs": "ЗаказКлиента1",
                            "from": "2e6e646c7ede4eddaeca639c1a9efc22"
                        },
                        "relations": []
                    },
                    "0dbe78db999e4c78bd5a8037b61588b3": {
                        "condition": "Условие1\n",
                        "type": "left",
                        "source": {
                            "fromAs": "Партнеры",
                            "from": "730c695c44e04623b79637281f63d6a1"
                        },
                        "relations": []
                    },
                    "c11692bfd37443328773e1f0b2b1e51e": {
                        "condition": "Условие2\n",
                        "type": "inner",
                        "source": {
                            "fromAs": "Номенклатура",
                            "from": "a15e08700cb641c09129af1e39eb7cc8"
                        },
                        "relations": []
                    }
                }
            },
            "groupBy": [
                0,
                1,
                2,
                3
            ],
            "where": [
                {
                    "id": "78c934aceec84deea10a62b869bf9ae5",
                    "expression": "ЗаказКлиента1.Сумма = 500"
                }
            ]
        },
        "df7000f2989b4b73abeb60ef3b5b8f4d": {
            "type": "union",
            "select": [
                {
                    "name": "Активность",
                    "role": "dimension",
                    "sort": "none",
                    "synonym": "Активность",
                    "expressionUnion": [
                        "Активность",
                        "Активность",
                        null
                    ]
                }
            ],
            "unions": [
                {
                    "fromAs": "ТоварыНаСкладах2",
                    "from": "348f8849818644d19231acc1dce41f90"
                },
                {
                    "fromAs": "ЗаказыКлиентов",
                    "from": "7ffa9af618b74474b8954edce15d386e"
                },
                {
                    "from": "ca7a581f8a5149caa79a58d0d5fabc6c",
                    "fromAs": "ПрогрессОбновления"
                }
            ],
            "withDuplicates": true
        },
        "348f8849818644d19231acc1dce41f90": {
            "type": "join",
            "select": [
                {
                    "role": "dimension",
                    "expression": "ТоварыНаСкладах.Активность",
                    "name": "Активность",
                    "synonym": "Активность",
                    "sort": "none"
                },
                {
                    "role": "dimension",
                    "expression": "РеализацияТоваровУслуг.Менеджер",
                    "name": "Менеджер",
                    "synonym": "Менеджер",
                    "sort": "none"
                }
            ],
            "joinSources": {
                "root": {
                    "source": {
                        "from": "c95c9cfa0dd4454081ae0cc5ca6edfb3",
                        "fromAs": "ТоварыНаСкладах"
                    },
                    "relations": [
                        "ab700feb180f4a4a966d030a5f12861c"
                    ]
                },
                "relationIndex": {
                    "ab700feb180f4a4a966d030a5f12861c": {
                        "source": {
                            "from": "66f0cd7bffc14a56ab65d4c0ae174320",
                            "fromAs": "РеализацияТоваровУслуг"
                        },
                        "condition": "Условие1\n",
                        "type": "left",
                        "relations": []
                    }
                }
            },
            "groupBy": [
                0,
                1
            ]
        },
        "c95c9cfa0dd4454081ae0cc5ca6edfb3": {
            "type": "system",
            "from": "РегистрНакопления.ТоварыНаСкладах"
        },
        "7ffa9af618b74474b8954edce15d386e": {
            "type": "system",
            "from": "РегистрНакопления.ЗаказыКлиентов"
        },
        "da9ed8057c114a40a01e2376375514dd": {
            "type": "system",
            "from": "Документ.ЗаказКлиента"
        },
        "730c695c44e04623b79637281f63d6a1": {
            "type": "system",
            "from": "Справочник.Партнеры"
        },
        "a15e08700cb641c09129af1e39eb7cc8": {
            "type": "system",
            "from": "Справочник.Номенклатура"
        },
        "66f0cd7bffc14a56ab65d4c0ae174320": {
            "type": "system",
            "from": "Документ.РеализацияТоваровУслуг"
        },
        "2e6e646c7ede4eddaeca639c1a9efc22": {
            "type": "join",
            "select": [
                {
                    "role": "dimension",
                    "expression": "ЗаказКлиентаСкидкиНаценки.НомерСтроки",
                    "name": "НомерСтроки",
                    "synonym": "Номер строки",
                    "sort": "none"
                },
                {
                    "role": "dimension",
                    "expression": "ЗаказКлиентаСкидкиНаценки.СкидкаНаценка",
                    "name": "СкидкаНаценка",
                    "synonym": "Скидка наценка",
                    "sort": "none"
                },
                {
                    "role": "dimension",
                    "expression": "ЗаказКлиентаСкидкиНаценки.КлючСвязи",
                    "name": "КлючСвязи",
                    "synonym": "Ключ связи",
                    "sort": "none"
                },
                {
                    "role": "dimension",
                    "expression": "ЗаказКлиентаСкидкиНаценки.Сумма",
                    "name": "Сумма",
                    "synonym": "Сумма",
                    "sort": "none"
                }
            ],
            "joinSources": {
                "root": {
                    "source": {
                        "from": "f3be90d9b8314c3e8b8efe4a5d4e784a",
                        "fromAs": "ЗаказКлиента2"
                    },
                    "relations": [
                        "8305f1f0424f471ea721c55aa08011c9"
                    ]
                },
                "relationIndex": {
                    "8305f1f0424f471ea721c55aa08011c9": {
                        "source": {
                            "from": "fa17946c725140ccb841fe27f1949ca5",
                            "fromAs": "ЗаказКлиентаСкидкиНаценки"
                        },
                        "condition": "Условие5\n",
                        "type": "full",
                        "relations": []
                    }
                }
            },
            "groupBy": [
                0,
                1,
                2,
                3
            ]
        },
        "fa17946c725140ccb841fe27f1949ca5": {
            "type": "system",
            "from": "Документ.ЗаказКлиента.СкидкиНаценки"
        },
        "ca7a581f8a5149caa79a58d0d5fabc6c": {
            "type": "system",
            "from": "РегистрСведений.ПрогрессОбновления"
        },
        "f3be90d9b8314c3e8b8efe4a5d4e784a": {
            "type": "join",
            "select": [
                {
                    "role": "dimension",
                    "expression": "ГруппыВнешнихПользователей.Родитель",
                    "name": "ВходитВГруппу",
                    "synonym": "Входит в группу",
                    "sort": "none"
                },
                {
                    "role": "dimension",
                    "expression": "ЗаказКлиента.guid",
                    "name": "УникальныйИдентификатор",
                    "synonym": "Уникальный идентификатор",
                    "sort": "none"
                },
                {
                    "role": "dimension",
                    "expression": "ЗаказКлиента.Дата = СЕЙЧАС()",
                    "name": "Поле",
                    "synonym": "Поле",
                    "sort": "none"
                }
            ],
            "joinSources": {
                "root": {
                    "source": {
                        "from": "da9ed8057c114a40a01e2376375514dd",
                        "fromAs": "ЗаказКлиента"
                    },
                    "relations": [
                        "1400724e68df48528bce0b44121fe6b4"
                    ]
                },
                "relationIndex": {
                    "1400724e68df48528bce0b44121fe6b4": {
                        "source": {
                            "from": "3f18bb6c5e3d487a9b8f80afac4ffefb",
                            "fromAs": "ГруппыВнешнихПользователей"
                        },
                        "condition": "Условие3\n",
                        "type": "left",
                        "relations": []
                    }
                }
            }
        },
        "3f18bb6c5e3d487a9b8f80afac4ffefb": {
            "type": "system",
            "from": "Справочник.ГруппыВнешнихПользователей"
        }
    },
    "tempTableList": []
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
    queries.push(makeQuery("query3", Query3));
    queries.push(makeQuery("query4", Query4));
    queries.push(makeQuery("query5", Query5));
    queries.push(makeQuery("long query", LongQuery));
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

