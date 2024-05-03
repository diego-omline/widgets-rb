//import * as config from "../config/globalConfig";
import { Aux } from "../tools/auxFunctions";
//import { http } from '../tools/httpRequest';
import { MultiSlideRb } from "../tools/multiSlideRb";
import { WidgetBase } from "./WidgetBase";

export class Promo{

    static async checkBlockPromo(): Promise<void|false>{
        let elements: HTMLElement[] = WidgetBase.getHTMLElements("promo");
        if(elements.length > 0 ){
            Aux.setLoading(elements);

            let response = await WidgetBase.getDataWidget("promo");
            if(!response) return false;

            // let script = document.querySelector('#rb-widget-promo');

            // if(!script) return Aux.error('Script promo not found');

            // let id          = script.getAttribute('user');
            // let token       = script.getAttribute('token');
            // let lang        = script.getAttribute('lang');
            // let rental      = script.getAttribute('rental');
            // let origin      = script.getAttribute('origin');
    
            // if(!id || !token) return Aux.error('Browser not supported');

            // let response = await http.fetchJSON({id, token, lang, rental, origin}, config.dirServices+'/promo/getPromo.php');
            // if(!response) return Aux.error();
            switch(response.response){
                case '1':
                    this.printPromos(elements, response.promos, response.text_alerts.no_promos_rental);
                    break;
                case '2':
                    this.alertNoPromos(elements, response.error_text);
                    break;
                default:
                    Aux.error(response.error_text);
            }
        }
    }
    
    private static printPromos(elements: HTMLElement[], promos: dataPromo[], alert_no_promos_rental: string): void{
        for(let element of elements){
            let sIdRental = Aux.getData(element, 'rental');
            let id_rental: number = 0;
            let printSlide: boolean = true;
            if(sIdRental){
                id_rental = parseInt(sIdRental as string);
                printSlide = this.checkPromosRental(promos, id_rental);
                if(!printSlide) this.alertNoPromo(element, alert_no_promos_rental);
            } 

            if(printSlide){
                let html: string = '<div class="slideMultiRb">'
                                    +'<div class="contItemSlideRb">';
                for(let promo of promos){
                        if(!sIdRental || promo.id_rental == id_rental){
                        html += '<div class="itemSlideRb">'
                                    +'<div>'
                                        +'<h3>'+promo.title_promo+'</h3>'
                                        +'<h4>'+promo.rental_name+'</h4>'
                                        +'<div class="containerImgSlideMutiRb" style="background-image: url('+promo.url_img+')"></div>'
                                        //+'<img src="'+promo.url_img+'" alt=" img '+promo.rental_name+'" />'
                                        +'<p>'+promo.dates+'</p>'
                                        +'<div class="containerBtnItemSlideRb">'
                                            +'<a class="aItemSlideRb" href="'+promo.url_promo+'">'+promo.text_search+'</a>'
                                        +'</div>'
                                    +'</div>'
                                +'</div>';
                        }
                }
                html += '</div>'
                    +'</div>';
            

                element.innerHTML   = html;

                let multiSlide: MultiSlideRb            = new MultiSlideRb((element.querySelector('.slideMultiRb')) as HTMLElement);
                let automaticMove: boolean|undefined    = Aux.getData(element, 'automaticmove', true) as boolean|undefined;
                let btnVisible: boolean|undefined       = Aux.getData(element, 'btnvisible', true) as boolean|undefined;

                multiSlide.create(automaticMove??true, btnVisible??true);
            }
        }
        
    }
    
    private static alertNoPromos(elements: HTMLElement[], alert_text: string): void{
        for(let element of elements){
            this.alertNoPromo(element, alert_text);
        }
    }

    private static alertNoPromo(element: HTMLElement, alert_text: string): void{
        let showAlert: boolean|undefined = Aux.getData(element, 'alertnopromo', true) as boolean|undefined;
        element.innerHTML = typeof showAlert === 'undefined' || showAlert?'<div class="rb_alert">'+alert_text+'</div>':'';
    }

    private static checkPromosRental(promos: dataPromo[], id_rental: number): boolean{
        for(let promo of promos){
            if(promo.id_rental == id_rental) return true;
        }
        return false;
    }
    
}