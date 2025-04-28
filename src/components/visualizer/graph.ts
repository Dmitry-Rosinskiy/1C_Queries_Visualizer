import { Graph, InternalEvent, Cell, Point, PrintPreview} from '@maxgraph/core';
import { FlatDSQueryContainer } from '../../types/FlatDSQuery';
import { VisualizerCell, SELECTABLE_CELL_TYPES } from '../сell'
import { VisualizerTooltip as VisualizerTooltip } from './tooltip';
import { VisualizerLayout as VisualizerLayout } from './layout';
import { VisualizerToolbarBuilder } from './toolbar';
import { EditorHandler, VisualizerGraphHandlers as VisualizerGraphHandlers, TooltipMouseHandler } from './handlers';
import { GraphAnimation } from '../../utils/graph-animation';
import { EasingFunctions } from '../../utils/easing-functions';
import { VisualizerCellManager as VisualizerCellManager } from '../../managers/сell-manager';
import { VisualizerQueryManager as VisualizerQueryManager } from '../../managers/query-manager';

/** Граф визуализатора */
export class VisualizerGraph {
    /** Граф */
    private readonly graph: Graph;
    /** Менеджер запросов */
    private readonly queryManager: VisualizerQueryManager;
    /** Менеджер ячеек */
    private readonly cellManager: VisualizerCellManager;
    /** Контейнер */
    private readonly container: HTMLElement;
    /** Размещение (упорядочивание) графа */
    private readonly layout: VisualizerLayout;
    /** Обработчики */
    private readonly graphHandlers: VisualizerGraphHandlers;
    /** Всплывающая подсказка */
    private readonly tooltip: VisualizerTooltip;
    /** Обработчик редактирования ячейки */
    private readonly editorHandler?: EditorHandler;
    /** Анимация */
    private graphAnimation: GraphAnimation;
    /** Массив ячеек */
    private visualizerCells: VisualizerCell[];
    /** Выбранная ячейка */
    private selectedCell: Cell | undefined;
    /** Выделенные ячейки */
    private highlightedCells: Cell[];

    /**
     * Конструктор графа визуализатора.
     * @param container контейнер, в котором находится граф
     * @param editorHandler обработчик редактирования ячеек
     */
    constructor(container: HTMLElement, editorHandler: EditorHandler | undefined = undefined) {
        this.graph = new Graph(container);
        this.graphHandlers = new VisualizerGraphHandlers(this);
        this.initGraph();
        this.cellManager = new VisualizerCellManager(this);
        this.queryManager = new VisualizerQueryManager(this.cellManager);

        this.container = container;
        this.initContainer();

        this.editorHandler = editorHandler;
        this.graphAnimation = new GraphAnimation(this.graph, EasingFunctions.easeInOutQuad);
        this.graphAnimation.setDuration(500);

        this.tooltip = new VisualizerTooltip(container, this.graph);
        this.layout = new VisualizerLayout(this.graph);

        this.visualizerCells = [];
        this.highlightedCells = [];
        this.selectedCell = undefined;
    }

    /**
     * Инициализация графа.
     */
    private initGraph(): void {
        this.graph.setCellsMovable(false);
        this.graph.setCellsResizable(false);
        this.graph.setCellsSelectable(false);
        this.graph.setPanning(false);
        //this.graph.setEnabled(false);
        this.graph.setHtmlLabels(true);
        this.graph.isCellEditable = () => false;

        const mouseHandler = new TooltipMouseHandler(this);
        this.graph.addMouseListener(mouseHandler);

        this.graph.addListener(InternalEvent.CLICK, this.graphHandlers.getClickHandler());

        this.graph.addListener(InternalEvent.DOUBLE_CLICK, this.graphHandlers.getDoubleClickHandler());
    }

    /**
     * Инициализация контейнера.
     */
    private initContainer(): void {
        const tileGapSize = 30;
        const toolbar = new VisualizerToolbarBuilder(this)
                        .addZoomToFitButton()
                        .addCurrentScaleTile()
                        .addZoomInButton()
                        .addZoomOutButton()
                        .addTileGap(tileGapSize)
                        .addLayoutHorizontallyButton()
                        .addLayoutVerticallyButton()
                        .addTileGap(tileGapSize)
                        .addShowExtra()
                        .addTileGap(tileGapSize)
                        //.addSaveGraphAsImage()
                        .getToolbar();

        this.container.prepend(toolbar);

        this.container.addEventListener('mousedown', this.graphHandlers.getMouseDownHandler());
        this.container.addEventListener('mousemove', this.graphHandlers.getMouseMoveHandler());
        this.container.addEventListener('mouseup', this.graphHandlers.getMouseUpHandler());
        this.container.addEventListener('wheel', this.graphHandlers.getWheelHandler());
    }

    /**
     * Визуализирует граф.
     * @param model модель запроса
     */
    drawGraph = (model: FlatDSQueryContainer): void => {
        this.graph.getDataModel().clear();
        this.visualizerCells = [];
        this.graph.batchUpdate(() => {
            this.queryManager.makeScheme(model);
            this.layoutGraph();
            this.graph.cellsOrdered(this.graph.getChildVertices(this.graph.getDefaultParent()), false);
        });
    }

    /**
     * Возвращает граф.
     * @returns граф
     */
    getGraph(): Graph {
        return this.graph;
    }

    /**
     * Возвращает всплывающую подсказку.
     * @returns всплывающая подсказка
     */
    getTooltip(): VisualizerTooltip {
        return this.tooltip;
    }

    /**
     * Возвращает контейнер.
     * @returns контейнер
     */
    getContainer(): HTMLElement {
        return this.container;
    }

    /**
     * Возвращает размещение графа.
     * @returns размещение (упорядочивание) графа
     */
    getLayout(): VisualizerLayout {
        return this.layout;
    }

    /**
     * Размещает (упорядочивает) элементы графа
     */
    layoutGraph(): void {
        this.layout.layoutGraph();
    }

    /**
     * Устанавливает способ размещения графа.
     * @param horizontal горизонтальный способ (в противном случае - вертикальный)
     */
    setHorizontalLayout(horizontal: boolean): void {
        this.layout.setHorizontalLayout(horizontal);
    }

    /**
     * Показывает дополнительное содержание всех ячеек (раскрывает их).
     */
    showExtraContent(): void {
        for (const visualizerCell of this.visualizerCells) {
            if (visualizerCell.info.extra !== undefined && !visualizerCell.info.expanded) {
                this.cellManager.toggleExtraContent(visualizerCell);
            }
        }
    }

    /**
     * Убирает дополнительное содержание всех ячеек (заворачивает их).
     */
    hideExtraContent(): void {
        for (const visualizerCell of this.visualizerCells) {
            if (visualizerCell.info.extra !== undefined && visualizerCell.info.expanded) {
                this.cellManager.toggleExtraContent(visualizerCell);
            }
        }
    }

    /**
     * Нажатие ячейки графа.
     * @param cell ячейка
     */
    clickCell(cell: Cell): void {
        const visualizerCell = this.cellManager.getVisualizerCellByCell(cell);
        if (visualizerCell === undefined) {
            return;
        }
        this.graph.getDataModel().beginUpdate();
        if (SELECTABLE_CELL_TYPES.includes(visualizerCell.info.type.name)) {
            if (!this.cellManager.isSelected(cell)) {
                this.cellManager.centerCell(cell);
                this.cellManager.selectCell(cell);
                const highlightCells = this.queryManager.getSelectSources(cell);
                //console.info('highlightCells', highlightCells);
                this.cellManager.highlightCells(highlightCells);
            } else {
                this.cellManager.unselectCell(cell);
                this.cellManager.unhighlightCells();
            }
        } else if (visualizerCell.info.extra !== undefined) {
            this.cellManager.toggleExtraContent(visualizerCell);
        }
        this.graph.getDataModel().endUpdate();
    }

    /**
     * Двойное нажатие ячейки графа.
     * @param cell ячейка
     */
    doubleClickCell(cell: Cell): void {
        const visualizerCell = this.cellManager.getVisualizerCellByCell(cell);
        if (visualizerCell !== undefined && this.editorHandler !== undefined) {
            //console.info('query update');
            const newQuery = this.editorHandler(`${visualizerCell.info.name} (${visualizerCell.info.id})`);
            if (newQuery !== undefined) {
                this.drawGraph(newQuery);
            }
        }
    }

    /**
     * Наведение на ячейку графа.
     * @param cell ячейка
     */
    hoverOnCell(cell: Cell | null): void {
        if (cell !== null && cell.vertex) {
            const visualizerCell = this.cellManager.getVisualizerCellByCell(cell);
            if (visualizerCell === undefined) {
                this.container.style.cursor = 'default';
                return;
            }
            if (visualizerCell.info.hint !== undefined) {
                const hintLines = visualizerCell.info.hint.split('\n');
                if (hintLines.length > 1) {
                    this.tooltip.showTooltipTexts(cell, hintLines);
                } else {
                    this.tooltip.showTooltipText(cell, visualizerCell.info.hint); 
                }
            }
            if (SELECTABLE_CELL_TYPES.includes(visualizerCell.info.type.name) || visualizerCell.info.extra !== undefined) {
                this.container.style.cursor = 'pointer';
            } else {
                this.container.style.cursor = 'default';
            }
        } else {
            if (this.container.style.cursor != 'default') {
                this.container.style.cursor = 'default';
            }
            if (this.tooltip.isVisible()) {
                this.tooltip.hideTooltip();
            }
        }
    }

    /**
     * Увеличение масштаба графа.
     */
    zoomIn(): void {
        const maxScale = 10;
        if (this.graph.getView().getScale() >= maxScale) {
            return;
        }
        this.graph.zoomIn();
        if (this.graph.getView().getScale() > maxScale) {
            this.graph.getView().setScale(maxScale);
        }
    }

    /**
     * Уменьшение масштаба графа.
     */
    zoomOut(): void {
        const minScale = 0.1;
        if (this.graph.getView().getScale() <= minScale) {
            return;
        }
        this.graph.zoomOut();
        if (this.graph.getView().getScale() < minScale) {
            this.graph.getView().setScale(minScale);
        }
    }

    /**
     * Подборка масштаба графа.
     * @param border отступ от контейнера
     */
    zoomToFit(border: number): void {
        if (this.graph.getChildVertices().length <= 1) {
            return;
        }
        const bounds = this.graph.getGraphBounds();
        //console.info('bounds', bounds);
        const view = this.graph.getView();
        const scale = view.getScale();

        const availableWidth = this.container.clientWidth - 2 * border;
        const availableHeight = this.container.clientHeight - 2 * border;

        const scaleX = availableWidth / (bounds.width / scale);
        const scaleY = availableHeight / (bounds.height / scale);

        const targetScale = Math.min(scaleX, scaleY);
        const targetTranslate = new Point(0, 0);
        
        this.graphAnimation.scaleAndTranslate(targetScale, targetTranslate);
    }

    /**
     * Возвращает ячейки визуализатора.
     * @returns массив ячеек
     */
    getSchemeCells(): VisualizerCell[] {
        return this.visualizerCells;
    }

    /**
     * Возвращает выбранную ячейку.
     * @returns выбранная ячейка (если ни одна не выбрана, то `undefined`)
     */
    getSelectedCell(): Cell | undefined  {
        return this.selectedCell;
    }

    /**
     * Возвращает анимацию графа.
     * @returns анимация графа
     */
    getGraphAnimation(): GraphAnimation {
        return this.graphAnimation;
    }

    /**
     * Устанавливает анимацию графа.
     * @param animation анимация графа
     */
    setGraphAnimation(animation: GraphAnimation): void {
        this.graphAnimation = animation;
    }

    /**
     * Устанавливает выбранной ячейку графа.
     * @param cell ячейка графа (если передан `undefined`, то у графа текущая ячейка перестаёт быть выбранной)
     */
    setSelectedCell(cell: Cell | undefined): void {
        this.selectedCell = cell;
    }

    /**
     * Возвращает выделенные ячейки графа.
     * @returns массив выделенных ячеек
     */
    getHighlightedCells(): Cell[] {
        return this.highlightedCells;
    }

    /**
     * Устанавливает выделенные ячейки графа.
     * @param highlightedCells ячейки графа
     */
    setHighlightedCells(highlightedCells: Cell[]): void {
        this.highlightedCells = highlightedCells;
    }

    // saveGraphAsPng() {
    //     const svgElement = this.container.querySelector(':scope > svg') as SVGSVGElement;
    //     if (!svgElement) {
    //         console.warn("Граф не был найден");
    //         return;
    //     }

    //     const rect = svgElement.getBoundingClientRect();

    //     const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
    //     clonedSvg.setAttribute('width', rect.width.toString());
    //     clonedSvg.setAttribute('height', rect.height.toString());

    //     this.inlineUses(clonedSvg);
    //     clonedSvg.querySelectorAll('foreignObject').forEach(el => el.remove());
    //     console.info(clonedSvg);

    //     //svgElement.style.outline = '3px solid red';
    //     const serializer = new XMLSerializer();
    //     const svgString = serializer.serializeToString(clonedSvg);

    //     const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    //     const url = URL.createObjectURL(svgBlob);

    //     const img = new Image();
    //     img.crossOrigin = "anonymous";
    //     img.onload = () => {
    //         const canvas = document.createElement('canvas');

    //         //const baseVal = clonedSvg.viewBox.baseVal;
    //         //let width = baseVal.width;
    //         //let height = baseVal.height;
    //         let width = svgElement.width.baseVal.value;
    //         let height = svgElement.height.baseVal.value;

    //         // if (!width || !height) {
    //         //     const bbox = clonedSvg.getBoundingClientRect();
    //         //     console.info('bbox', clonedSvg.getBoundingClientRect());
    //         //     width = bbox.width;
    //         //     height = bbox.height;
    //         // }

    //         canvas.width = width;
    //         canvas.height = height;
    //         console.log(canvas.width, canvas.height);

    //         // canvas.width = clonedSvg.viewBox.baseVal.width || clonedSvg.width.baseVal.value;
    //         // canvas.height = clonedSvg.viewBox.baseVal.height || clonedSvg.height.baseVal.value;

    //         const ctx = canvas.getContext('2d');
    //         if (ctx !== null) {
    //             ctx.drawImage(img, 0, 0);
    //             canvas.toBlob(blob => {
    //                 if (blob !== null) {
    //                     //const url = URL.createObjectURL(blob);
    //                     const link = document.createElement('a');
    //                     link.href = URL.createObjectURL(blob);
    //                     link.download = 'graph.png';
    //                     link.click();
    //                     URL.revokeObjectURL(link.href);
    //                     console.log(url);
    //                 } else {
    //                     console.warn('blob is null');
    //                 }
    //             }, 'image/png');
    //         }
    //         //URL.revokeObjectURL(url);
    //     };
    //     img.onerror = (err) => {
    //         console.error('Ошибка загрузки изображения', err);
    //     };
    //     //img.setAttribute('crossorigin', 'anonymous');
    //     img.src = url;
    //     console.log('img', img);
    // }

    // private inlineUses(svgElement: SVGSVGElement) {
    //     const uses = svgElement.querySelectorAll('use');

    //     uses.forEach(use => {
    //         const href = use.getAttribute('href');
    //         if (href === null || !href.startsWith('#')) {
    //             return;
    //         }
    //         const id = href.slice(1);
    //         const symbol = document.getElementById(id);
    //         if (symbol === null) {
    //             console.warn(`Symbol with id ${id} not found`);
    //             return;
    //         }

    //         const clonedNodes = Array.from(symbol.cloneNode(true).childNodes);
    //         const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    //         clonedNodes.forEach(node => g.appendChild(node));

    //         use.parentNode?.replaceChild(g, use);
    //     });
    // }

    // saveGraphAsPng() {
    //     const printPreview = new PrintPreview(this.graph);
    //     printPreview.scale = 1;
    //     printPreview.border = 10;

    //     printPreview.print();
    // }
}