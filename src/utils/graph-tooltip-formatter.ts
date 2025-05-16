import { AggregateFunctions, LineConditionOperators } from "../components/сell";
import { DSQueryField, Type } from "../types/DSQuery";

/** Используется для форматирования всплывающих подсказок графа */
export class GraphTooltipFormatter {

    /**
     * Создаёт текст подсказки по полю.
     * @param field поле
     * @returns текст подсказки
     */
    static makeHintForField(field: DSQueryField): string {
        return this.makeHintForExpression(field.expression, field.type);
    }

    /**
     * Создаёт текст подсказки по выражению.
     * @param expression выражение
     * @param type тип выражения (при наличии, иначе `undefined`)
     * @returns текст подсказки
     */
    static makeHintForExpression(expression: string, type: Type | undefined = undefined): string {
        Object.entries(AggregateFunctions).forEach(entries => {
            for (const func of entries) {
                const regexp = new RegExp(`${func}\\(`, 'g');
                expression = expression.replace(regexp, `<font color="orangered">${func}</font>(`);
            }
        });
        return type !== undefined ? `${expression}: <font color="green">${type}</font>` : expression;
    }

    /**
     * Создаёт текст подсказки по условию.
     * @param condition условие
     * @returns текст подсказки
     */
    static makeHintForCondition(condition: string): string {
        Object.entries(LineConditionOperators).forEach(entries => {
            for (const oper of entries) {
                const regexp = new RegExp(` ${oper} `, 'g');
                condition = condition.replace(regexp, `\n${oper} `);
            }
        });
        return condition;
    }
}