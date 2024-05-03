import { RequestAnimationFrame } from "./requestAnimationFrame";

export class MultiSlideRb {
    
    allCarourel: HTMLCollectionOf<HTMLElement>;
    private static durationMove: number = 1; //Seconds
    private requestAnimation: RequestAnimationFrame|null = null;
    private btnVisible = true;
    private _automaticMove: boolean = true;
    get automaticMove(): boolean {
        return this._automaticMove;
    }
    set automaticMove(value: boolean) {
        this._automaticMove = value;
        if(value) this.activateAutomaticMove();
        else this.cancelAutomaticMove();
    }

    constructor(slide: HTMLElement|null = null){
        this.allCarourel = (slide?[slide]:document.getElementsByClassName('slideMultiRb')) as HTMLCollectionOf<HTMLElement>;
    }

    create(automaticMove: boolean = true, btnVisible: boolean = true): void {
        if(this.allCarourel.length > 0){
            for (let sliderMulti of this.allCarourel) {
                let p: number = 0;
                sliderMulti.dataset.firstItem = '1';   
                sliderMulti.dataset.changingSlider = '0'; 
        
                (sliderMulti.querySelectorAll(".itemSlideRb") as NodeListOf<HTMLElement>).forEach(e => {
                    e.dataset.position = p.toString();
                    e.style.order = (p+1).toString();
                    p++;
                });
            }
            this.automaticMove = automaticMove;
            this.btnVisible = btnVisible;

            MultiSlideRb.resize(this.allCarourel, btnVisible);
            this.activateEventListener();
        }

    }

    activateAutomaticMove(): void{
        this.requestAnimation = new RequestAnimationFrame(() => MultiSlideRb.moveAutomatic(this.allCarourel), 3000);
    }
    
    cancelAutomaticMove(): void{
        this.requestAnimation?.cancel();
    }

    static resize(all: HTMLCollectionOf<HTMLElement>, btnVisible: boolean): void {
        for (let sliderMulti of all) {
            let contItem: HTMLElement           = sliderMulti.querySelector('.contItemSlideRb') as HTMLElement;
            sliderMulti.style.width = '';
            contItem.style.display  = 'none';
            let nItems: number 		            = sliderMulti.querySelectorAll(".itemSlideRb").length;
            let numItems: number                = MultiSlideRb.calculateItems(sliderMulti.offsetWidth);
            let paddingItem: number             = MultiSlideRb.getPaddingItem(sliderMulti); 

            sliderMulti.style.width     = sliderMulti.offsetWidth+'px';

            contItem.style.marginLeft   = (paddingItem*-1)+'px';
            contItem.style.width        = ((sliderMulti.offsetWidth + (paddingItem*2)) / numItems * nItems) + 'px';
            contItem.style.display      = '';

            sliderMulti.querySelector('.containerBtnsMultiSlideRb')?.remove();

            if(nItems > numItems && btnVisible) MultiSlideRb.addBtns(sliderMulti);
        }
    }

    private activateEventListener(){
        let eventRezise = () => MultiSlideRb.resize(this.allCarourel, this.btnVisible);
        window.removeEventListener('resize', eventRezise);
        window.addEventListener('resize', eventRezise);    
    }

    private static getPaddingItem(element: HTMLElement): number{
        let sPaddingItem: string    = window.getComputedStyle((element.querySelector('.itemSlideRb') as HTMLElement), null).getPropertyValue('padding-left');
        return sPaddingItem?parseInt(sPaddingItem.replace('px','')):0; 
    }

    private static moveAutomatic(all: HTMLCollectionOf<HTMLElement>){
        for (let sliderMulti of all) {
            let nItems  = sliderMulti.querySelectorAll(".itemSlideRb").length;
            let maxItems = MultiSlideRb.calculateItems(sliderMulti.offsetWidth);
            if(nItems > maxItems) MultiSlideRb.move('R', sliderMulti);
        }
    }

    private static move(dir: 'L'|'R', element: HTMLElement): void {
        if(element.dataset.changingSlider === '1') return;
        element.dataset.changingSlider = '1';

        let paddingItem: number             = MultiSlideRb.getPaddingItem(element); 
        let nItems: number                  = element.querySelectorAll(".itemSlideRb").length;
        let numItems: number                = MultiSlideRb.calculateItems(element.offsetWidth);
        let tamImage: number                = (element.offsetWidth + (paddingItem*2)) / numItems;
        let contItemSlide: HTMLElement      = element.querySelector('.contItemSlideRb') as HTMLElement;
        //let porcentaje:number               = tamImage * 100 / (contItemSlide.offsetWidth);
        let porcentaje:number               = 100 / nItems;
        
        MultiSlideRb.changeFirstItem(dir, element);
        if(dir === 'L') MultiSlideRb.positioningSlide(dir, element);

        contItemSlide.style.left        = (dir == 'L'?-1*tamImage:0)+'px';
        contItemSlide.style.transform   = "translateX("+(porcentaje * (dir == 'L'?1: -1))+"%)";
        contItemSlide.style.transition  = MultiSlideRb.durationMove+"s";

        setTimeout(function(){
            contItemSlide.style.left = '';
            contItemSlide.style.transform = "";
            contItemSlide.style.transition = "";
            if(dir == 'R') MultiSlideRb.positioningSlide(dir, element);
            element.dataset.changingSlider = '0';
        }, MultiSlideRb.durationMove*1000);
    }

    private static addBtns(slide: HTMLElement){
        let container = document.createElement('div');
        container.classList.add('containerBtnsMultiSlideRb');
        let btnPrev = document.createElement('button');
        btnPrev.classList.add('multiSlidePrevRb');
        btnPrev.addEventListener('click', () => MultiSlideRb.move('L', slide));
        let btnNext = document.createElement('button');
        btnNext.classList.add('multiSlideNextRb');
        btnNext.addEventListener('click', () => MultiSlideRb.move('R', slide));
        container.insertAdjacentElement('beforeend', btnPrev);
        container.insertAdjacentElement('beforeend', btnNext);
        slide.insertAdjacentElement('beforeend', container);
    }
    
    private static calculateItems(resolucionActual: number): number {
        switch(true){
            case resolucionActual <= 520:
                return 1;
            case resolucionActual >= 521 && resolucionActual < 767:
                return 2;
            case resolucionActual >= 767 && resolucionActual < 991:
                return 3;
            case resolucionActual >= 992 && resolucionActual < 1199:
                return 4;
            case resolucionActual >= 1200 && resolucionActual < 2000:
                return 5;
            case resolucionActual >= 2001:
            default:
                return 6;
        }
    }

    private static changeFirstItem(dir: 'L'|'R', element: HTMLElement){
        let firstItem: number   = parseInt(element.dataset.firstItem!);
        let nItems: number 		= element.querySelectorAll(".itemSlideRb").length;
    
        switch(dir){
            case 'L':
                firstItem = firstItem === 1?nItems:firstItem-1;
                break;
            case 'R':
                firstItem = firstItem === nItems?1:firstItem+1;
                break;
        }
        element.dataset.firstItem = firstItem.toString();
    }

    private static positioningSlide(dir: 'L'|'R', sliderMulti: HTMLElement): void{
        let nItems: number  = sliderMulti.querySelectorAll(".itemSlideRb").length;

        (sliderMulti.querySelectorAll(".itemSlideRb") as NodeListOf<HTMLElement>).forEach(e => {
            let posActu: number = parseInt(e.style.order);
            switch(dir){
                case 'L':
                    posActu++;
                    if(posActu > nItems) posActu = 1;
                    break;
                case 'R':
                    posActu--;
                    if(posActu < 1) posActu = nItems;
                    break;
            }
            e.style.order = posActu.toString();
        });
    }
}