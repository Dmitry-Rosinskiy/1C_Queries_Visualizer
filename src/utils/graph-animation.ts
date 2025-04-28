import { Graph, Point } from "@maxgraph/core";
import { EasingFunction } from "./easing-functions";

/** Анимация графа */
export class GraphAnimation {

    /** Граф */
    private readonly graph: Graph;
    /** Функция плавности */
    private readonly easingFunction: EasingFunction;
    /** Продолжительность анимации */
    private duration = 500;

    /**
     * Конструктор анимации графа.
     * @param graph граф
     * @param easingFunction функция плавности
     */
    constructor(graph: Graph, easingFunction: EasingFunction) {
        this.graph = graph;
        this.easingFunction = easingFunction;
    }

    /**
     * Устанавливает длительность анимации.
     * @param duration длительность анимации
     */
    setDuration(duration: number) {
        this.duration = duration;
    }

    /**
     * Анимация сдвига графа.
     * @param targetTranslate сдвиг графа
     */
    translateGraph(targetTranslate: Point) {
        const translate = this.graph.getView().getTranslate();
        const startTranslate = new Point(translate.x, translate.y);
        const startTime = performance.now();

        requestAnimationFrame(() => {
            this.animateTranslate(startTime, startTranslate, targetTranslate);
        });
    }

    /**
     * Анимация сдвига и масштабирования графа.
     * @param targetScale сдвиг графа
     * @param targetTranslate масштаб графа
     */
    scaleAndTranslate(targetScale: number, targetTranslate: Point) {
        const startScale = this.graph.getView().getScale();
        const translate = this.graph.getView().getTranslate();
        const startTranslate = new Point(translate.x, translate.y);
        const startTime = performance.now();

        requestAnimationFrame(() => {
            this.animateScaleAndTranslate(startTime, startScale, targetScale, startTranslate, targetTranslate);
        });
    }

    /**
     * Шаг анимации сдвига графа.
     * @param startTime время начала анимации
     * @param startTranslate начальный сдивг графа
     * @param targetTranslate конечный сдивг графа
     */
    private animateTranslate(startTime: number, startTranslate: Point, targetTranslate: Point) {
        const time = performance.now();
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / this.duration, 1);
        const ease = this.easingFunction(progress);
        
        const deltaX = targetTranslate.x - startTranslate.x;
        const deltaY = targetTranslate.y - startTranslate.y;

        const newX = startTranslate.x + deltaX * ease;
        const newY = startTranslate.y + deltaY * ease;

        this.graph.getView().setTranslate(newX, newY);
        if (progress < 1) {
            requestAnimationFrame(() => this.animateTranslate(startTime, startTranslate, targetTranslate));
        }
    }

    /**
     * Шаг анимации сдвига и масштабирования графа.
     * @param startTime время начала анимации
     * @param startScale начальный масштаб графа
     * @param targetScale конечный масштаб графа
     * @param startTranslate начальный сдвиг графа
     * @param targetTranslate конечный сдвиг графа
     */
    private animateScaleAndTranslate(startTime: number, startScale: number, targetScale: number, startTranslate: Point, targetTranslate: Point) {
        const time = performance.now();
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / this.duration, 1);
        const ease = this.easingFunction(progress);

        const deltaScale = targetScale - startScale;
        const deltaX = targetTranslate.x - startTranslate.x;
        const deltaY = targetTranslate.y - startTranslate.y;
        const newScale = startScale + deltaScale * ease;
        const newX = startTranslate.x + deltaX * ease;
        const newY = startTranslate.y + deltaY * ease;
        
        this.graph.getView().scaleAndTranslate(newScale, newX, newY);
        
        if (progress < 1) {
            requestAnimationFrame(() => this.animateScaleAndTranslate(startTime, startScale, targetScale, startTranslate, targetTranslate));
        }
    }
}