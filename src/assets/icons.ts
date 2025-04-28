import { JoinType } from '../types/DSQuery';
import { CellType } from '../components/сell';

import leftJoinIcon from '../assets/icons/left-join.svg';
import rightJoinIcon from '../assets/icons/right-join.svg';
import innerJoinIcon from '../assets/icons/inner-join.svg';
import fullJoinIcon from '../assets/icons/full-join.svg';
import unionIcon from '../assets/icons/union.svg';
import groupByIcon from '../assets/icons/group-by.svg';
import whereIcon from '../assets/icons/where.svg';

/** Иконки графа */
export class GraphIcons {

    /** Размер иконок */
    private static iconSize = 24;

    /**
     * Возвращает иконку для ячейки.
     * @param type тип ячейки
     * @param joinType тип соединения (если ячейка им не является, то `undefined`)
     * @returns HTML-строка иконки
     */
    static getIcon(type: CellType, joinType: JoinType | undefined = undefined): string {
        switch (type) {
            case CellType.constant:
                return '';
            case CellType.system:
                return '';
            case CellType.select:
                return '';
            case CellType.join:
                if (joinType !== undefined) {
                    return this.getJoinIcon(joinType);
                } else {
                    return '';
                }
            case CellType.union:
                return this.getUnionIcon();
            case CellType.group_by:
                return this.getGroupByIcon();
            case CellType.where:
                return this.getWhereIcon();
        }
    }

    /**
     * Возвращает иконку соединения.
     * @param joinType тип соединения
     * @returns HTML-строка иконки
     */
    private static getJoinIcon (joinType: JoinType): string {
        switch (joinType.toLowerCase()) {
            case JoinType.left:
                return this.getLeftJoinIcon();
            case JoinType.right:
                return this.getRightJoinIcon();
            case JoinType.inner:
                return this.getInnerJoinIcon();
            case JoinType.full:
                return this.getFullJoinIcon();
            default:
                return '';
        }
    }

    /**
     * Возвращает иконку левого соединения.
     * @returns HTML-строка иконки
     */
    private static getLeftJoinIcon(): string {
        return `<svg width="${this.iconSize}" height="${this.iconSize}"><use href="#${leftJoinIcon.id}"/></svg>`;
    }

    /**
     * Возвращает иконку правого соединения.
     * @returns HTML-строка иконки
     */
    private static getRightJoinIcon(): string {
        return `<svg width="${this.iconSize}" height="${this.iconSize}"><use href="#${rightJoinIcon.id}"/></svg>`;
    }

    /**
     * Возвращает иконку внутреннего соединения.
     * @returns HTML-строка иконки
     */
    private static getInnerJoinIcon(): string {
        return `<svg width="${this.iconSize}" height="${this.iconSize}"><use href="#${innerJoinIcon.id}"/></svg>`;
    }

    /**
     * Возвращает иконку полного соединения.
     * @returns HTML-строка иконки
     */
    private static getFullJoinIcon(): string {
        return `<svg width="${this.iconSize}" height="${this.iconSize}"><use href="#${fullJoinIcon.id}"/></svg>`;
    }

    /**
     * Возвращает иконку объединения.
     * @returns HTML-строка иконки
     */
    private static getUnionIcon(): string {
        return `<svg width="${this.iconSize}" height="${this.iconSize}"><use href="#${unionIcon.id}"/></svg>`;
    }

    /**
     * Возвращает иконку группировки.
     * @returns HTML-строка иконки
     */
    private static getGroupByIcon(): string {
        return `<svg width="${this.iconSize}" height="${this.iconSize}"><use href="#${groupByIcon.id}"/></svg>`;
    }

    /**
     * Возвращает иконку фильтрации.
     * @returns HTML-строка иконки
     */
    private static getWhereIcon(): string {
        return `<svg width="${this.iconSize}" height="${this.iconSize}"><use href="#${whereIcon.id}"/></svg>`;
    }

    /**
     * Устанавливает размер иконок.
     * @param size размер иконок
     */
    private static setIconSize(size: number): void {
        this.iconSize = size;
    }
}