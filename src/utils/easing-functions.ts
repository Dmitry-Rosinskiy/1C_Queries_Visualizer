/** Тип функции плавности */
export type EasingFunction = (t: number) => number;

/** Функции плавности */
export class EasingFunctions {
    
    /**
     * Линейная функция плавности.
     * @param t значение
     * @returns значение функции плавности
     */
    static linear(t: number): number {
        return t;
    }

    /**
     * Квадратическая Ease-In функция плавности.
     * @param t значение
     * @returns значение функции плавности
     */
    static easeInQuad(t: number): number {
        return t * t;
    }

    /**
     * Квадратическая Ease-Out функция плавности.
     * @param t значение
     * @returns значение функции плавности
     */
    static easeOutQuad(t: number): number {
        return t * (2 - t);
    }

    /**
     * Квадратическая Ease-In-Out функция плавности.
     * @param t значение
     * @returns значение функции плавности
     */
    static easeInOutQuad(t: number): number {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    /**
     * Кубическая Ease-In-Out функция плавности.
     * @param t значение
     * @returns значение функции плавности
     */
    static easeInOutQubic(t: number): number {
        return t < 0.5 ? 4 * Math.pow(t, 3) : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    /**
     * Экспоненциальная Ease-In-Out функция плавности.
     * @param t значение
     * @returns значение функции плавности
     */
    static easeInOutExpo(t: number): number {
        if (t === 0 || t === 1) {
            return t;
        }
        if (t < 0.5) {
            return Math.pow(2, 20 * t - 10) / 2;
        }
        return (2 - Math.pow(2, -20 * t + 10)) / 2;
    }
}