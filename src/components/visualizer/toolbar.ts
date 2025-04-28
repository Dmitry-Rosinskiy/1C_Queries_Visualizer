import { InternalEvent } from '@maxgraph/core';
import { VisualizerGraph } from './graph';

/** Строитель панели инструментов визуализатора */
export class VisualizerToolbarBuilder {
    /** Панель инструментов */
    private toolbar: HTMLDivElement;
    /** Граф визуализатора */
    private visualizerGraph: VisualizerGraph;

    /**
     * Конструктор строителя панели инструментов.
     * @param graph граф визуализатора
     */
    constructor(graph: VisualizerGraph) {
        this.toolbar = document.createElement('div');
        this.setToolbarStyle();
        this.visualizerGraph = graph;
    }
    
    /**
     * Добавляет кнопку увеличения масштаба графа.
     * @returns строитель панели инструментов
     */
    addZoomInButton(): this {
        const buttonZoomIn = document.createElement('button');
        buttonZoomIn.innerHTML = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --><svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 5.5C7.51472 5.5 5.5 7.51472 5.5 10C5.5 12.4853 7.51472 14.5 10 14.5C10.7763 14.5 11.5046 14.3041 12.1403 13.9596C12.5244 13.7514 12.8751 13.4888 13.182 13.182C13.4888 12.8751 13.7514 12.5244 13.9596 12.1403C14.3041 11.5046 14.5 10.7763 14.5 10C14.5 7.51472 12.4853 5.5 10 5.5ZM4 10C4 6.68629 6.68629 4 10 4C13.3137 4 16 6.68629 16 10C16 11.032 15.7388 12.0052 15.2784 12.855C15.1212 13.145 14.9409 13.4206 14.7399 13.6792L20.003 18.9423L18.9423 20.003L13.6792 14.7399C13.4206 14.9408 13.1451 15.1212 12.855 15.2784C12.0052 15.7388 11.032 16 10 16C6.68629 16 4 13.3137 4 10Z" fill="#1F2328"/><path fill-rule="evenodd" clip-rule="evenodd" d="M9.24995 9.24993V7H10.7499V9.24993H13V10.7499H10.7499V13H9.24995V10.7499H7V9.24993H9.24995Z" fill="#1F2328"/></svg>`;
        buttonZoomIn.title = 'Увеличить масштаб';
        buttonZoomIn.addEventListener('click', () => {
            this.visualizerGraph.zoomIn();
        });
        this.setButtonStyle(buttonZoomIn);
        this.toolbar.append(buttonZoomIn);
        return this;
    }

    /**
     * Добавляет кнопку уменьшения масштаба графа.
     * @returns строитель панели инструментов
     */
    addZoomOutButton(): this {
        const buttonZoomOut = document.createElement('button');
        buttonZoomOut.innerHTML = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --><svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 5.5C7.51472 5.5 5.5 7.51472 5.5 10C5.5 12.4853 7.51472 14.5 10 14.5C10.7763 14.5 11.5046 14.3041 12.1403 13.9596C12.5244 13.7514 12.8751 13.4888 13.182 13.182C13.4888 12.8751 13.7514 12.5244 13.9596 12.1403C14.3041 11.5046 14.5 10.7763 14.5 10C14.5 7.51472 12.4853 5.5 10 5.5ZM4 10C4 6.68629 6.68629 4 10 4C13.3137 4 16 6.68629 16 10C16 11.032 15.7388 12.0052 15.2784 12.855C15.1212 13.145 14.9409 13.4206 14.7399 13.6792L20.003 18.9423L18.9423 20.003L13.6792 14.7399C13.4206 14.9408 13.1451 15.1212 12.855 15.2784C12.0052 15.7388 11.032 16 10 16C6.68629 16 4 13.3137 4 10Z" fill="#1F2328"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7 9.24993H13V10.7499H7V9.24993Z" fill="#1F2328"/></svg>`;
        buttonZoomOut.title = 'Уменьшить масштаб';
        buttonZoomOut.addEventListener('click', () => {
            this.visualizerGraph.zoomOut();
        });
        this.setButtonStyle(buttonZoomOut);
        this.toolbar.append(buttonZoomOut);
        return this;
    }

    /**
     * Добавляет кнопку подборки масштаба графа.
     * @returns строитель панели инструментов
     */
    addZoomToFitButton(): this {
        const buttonZoomToFit = document.createElement('button');
        buttonZoomToFit.innerHTML = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --><svg width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 16H2v6h6v-1H3zM16 3h5v5h1V2h-6zm5 18h-5v1h6v-6h-1zM8 2H2v6h1V3h5z"/><path fill="none" d="M0 0h24v24H0z"/></svg>`;
        buttonZoomToFit.title = 'Подогнать масштаб';
        buttonZoomToFit.addEventListener('click', () => {
            this.visualizerGraph.zoomToFit(50);
        });

        this.setButtonStyle(buttonZoomToFit);
        this.toolbar.append(buttonZoomToFit);
        return this;
    }

    /**
     * Добавляет плитку (индикатор) текущего масштаба графа.
     * @returns строитель панели инструментов
     */
    addCurrentScaleTile(): this {
        const tileCurrentScale = document.createElement('div');
        const view = this.visualizerGraph.getGraph().getView();
        const scale = view.getScale();
        tileCurrentScale.innerText = `${(scale * 100).toFixed(0)}%`;
        tileCurrentScale.title = 'Текущий масштаб';
        
        view.addListener(InternalEvent.SCALE_AND_TRANSLATE, (sender: any, event: any) => {
            const scale = view.getScale();
            tileCurrentScale.innerText = `${(scale * 100).toFixed(0)}%`;
        });
        view.addListener(InternalEvent.SCALE, (sender: any, event: any) => {
            const scale = view.getScale();
            tileCurrentScale.innerText = `${(scale * 100).toFixed(0)}%`;
        });

        this.setTileStyle(tileCurrentScale);
        this.toolbar.append(tileCurrentScale);
        return this;
    }

    /**
     * Добавляет кнопку горизонтального размещения графа.
     * @returns строитель панели инструментов
     */
    addLayoutHorizontallyButton(): this {
        const buttonLayoutHorizontally = document.createElement('button');
        buttonLayoutHorizontally.innerHTML = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --><svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.0609 11.75L13.5285 16.2804L12.4681 15.2196L15.1888 12.5H6.00001V11H15.1888L12.4681 8.28045L13.5285 7.21955L18.0609 11.75Z" fill="#1F2328"/></svg>`;
        buttonLayoutHorizontally.title = 'Расположить горизонтально';
        buttonLayoutHorizontally.addEventListener('click', () => {
            this.visualizerGraph.setHorizontalLayout(true);
            this.visualizerGraph.layoutGraph();
        });
        this.setButtonStyle(buttonLayoutHorizontally);
        this.toolbar.append(buttonLayoutHorizontally);
        return this;
    }

    /**
     * Добавляет кнопку вертикального размещения графа.
     * @returns строитель панели инструментов
     */
    addLayoutVerticallyButton(): this {
        const buttonLayoutVertically = document.createElement('button');
        buttonLayoutVertically.innerHTML = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --><svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 18.0609L7.46955 13.5285L8.53044 12.468L11.25 15.1888L11.25 5.99998H12.75L12.75 15.1888L15.4695 12.468L16.5304 13.5285L12 18.0609Z" fill="#1F2328"/></svg>`;
        buttonLayoutVertically.title = 'Расположить вертикально';
        buttonLayoutVertically.addEventListener('click', () => {
            this.visualizerGraph.setHorizontalLayout(false);
            this.visualizerGraph.layoutGraph();
        });
        this.setButtonStyle(buttonLayoutVertically);
        this.toolbar.append(buttonLayoutVertically);
        return this;
    }

    /**
     * Добавляет кнопку раскрытия дополнительной информации ячеек графа.
     * @returns строитель панели инструментов
     */
    addShowExtra(): this {
        const buttonShowExtra = document.createElement('button');
        buttonShowExtra.innerHTML = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --><svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 10C4 10 5.6 15 12 15M12 15C18.4 15 20 10 20 10M12 15V18M18 17L16 14.5M6 17L8 14.5" stroke="#464455" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
        buttonShowExtra.title = 'Раскрыть доп. содержание';
        let showExtra = false;
        buttonShowExtra.addEventListener('click', () => {
            showExtra = !showExtra;
            if (showExtra) {
                this.visualizerGraph.showExtraContent();
                buttonShowExtra.innerHTML = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --><svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12C4 12 5.6 7 12 7M12 7C18.4 7 20 12 20 12M12 7V4M18 5L16 7.5M6 5L8 7.5M15 13C15 14.6569 13.6569 16 12 16C10.3431 16 9 14.6569 9 13C9 11.3431 10.3431 10 12 10C13.6569 10 15 11.3431 15 13Z" stroke="#464455" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
                buttonShowExtra.title = 'Скрыть доп. содержание';
            } else {
                this.visualizerGraph.hideExtraContent();
                buttonShowExtra.innerHTML = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --><svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 10C4 10 5.6 15 12 15M12 15C18.4 15 20 10 20 10M12 15V18M18 17L16 14.5M6 17L8 14.5" stroke="#464455" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
                buttonShowExtra.title = 'Раскрыть доп. содержание';
            }
        });

        this.setButtonStyle(buttonShowExtra);
        this.toolbar.append(buttonShowExtra);
        return this;
    }

    // addSaveGraphAsImage() {
    //     const buttonSaveAsImage = document.createElement('button');
    //     buttonSaveAsImage.innerHTML = `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools --><svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 3.75H19.5L20.25 4.5V20.25H4.5L3.75 19.5V3.75ZM5.25 5.25V12.9166L7.90909 10.2575L13.3636 15.7121L16.7727 12.303L18.75 14.2802V5.25H5.25ZM18.75 16.4016L16.7727 14.4243L13.3636 17.8334L7.90909 12.3788L5.25 15.0379V18.75H18.75V16.4016ZM14.7273 7.97727C14.0118 7.97727 13.4318 8.55727 13.4318 9.27273C13.4318 9.98819 14.0118 10.5682 14.7273 10.5682C15.4427 10.5682 16.0227 9.98819 16.0227 9.27273C16.0227 8.55727 15.4427 7.97727 14.7273 7.97727ZM11.9318 9.27273C11.9318 7.72884 13.1834 6.47727 14.7273 6.47727C16.2712 6.47727 17.5227 7.72884 17.5227 9.27273C17.5227 10.8166 16.2712 12.0682 14.7273 12.0682C13.1834 12.0682 11.9318 10.8166 11.9318 9.27273Z" fill="#080341"/></svg>`;
    //     buttonSaveAsImage.title = 'Сохранить граф';
    //     buttonSaveAsImage.addEventListener('click', () => {
    //         this.schemeGraph.saveGraphAsPng();
    //     });

    //     this.setButtonStyle(buttonSaveAsImage);
    //     this.toolbar.append(buttonSaveAsImage);
    //     return this;
    // }

    /**
     * Добавляет пропуск между элементами панели инструментов.
     * @param length длина пропуска
     * @returns строитель панели инструментов
     */
    addTileGap(length: number): this {
        const tileGap = document.createElement('div');
        tileGap.style.width = `${length}px`;
        this.toolbar.append(tileGap);
        return this;
    }

    /**
     * Возвращает панель инструментов.
     * @returns панель инструментов 
     */
    getToolbar(): HTMLDivElement {
        return this.toolbar;
    }

    /**
     * Устанавливет стили для панели инструментов.
     */
    private setToolbarStyle(): void {
        this.toolbar.style.margin = '5px 10px';
        this.toolbar.style.padding = '5px';
        this.toolbar.style.display = 'flex';
        this.toolbar.style.flexDirection = 'row';
        this.toolbar.style.alignItems = 'center';
        this.toolbar.style.backgroundColor = '#f0f0f0';
        this.toolbar.style.borderRadius = '10px';
        this.toolbar.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    }

    /**
     * Устанавливает стили для кнопки панели инструментов.
     * @param button кнопка
     */
    private setButtonStyle(button: HTMLButtonElement): void {
        button.style.backgroundColor = 'gold';
        button.style.margin = '0px 2px';
        button.style.padding = '1px 10px';
        button.style.borderRadius = '3px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        button.style.transition = 'all 0.2s ease-in-out';
    }

    /**
     * Устанавливает стили для плиток панели инструментов.
     * @param tile плитка
     */
    private setTileStyle(tile: HTMLDivElement): void {
        tile.style.backgroundColor = 'gainsboro';
        tile.style.margin = '0px 2px';
        tile.style.padding = '1px 10px';
        tile.style.borderRadius = '3px';
        tile.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    }
}