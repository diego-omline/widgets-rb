import { Aux } from "../tools/auxFunctions";
import { DatePicker } from "../tools/datePicker";
import { inputCapacity, input, select, inputCounter } from "../tools/inputsBase";
import { WidgetBase } from "./WidgetBase";
import * as config from "../config/globalConfig";

export class SearchBar{

    static async checkBlockSearchBar(): Promise<void|false>{
        let elements: HTMLElement[] = WidgetBase.getHTMLElements("searchBar");
        if(elements.length > 0 ){
            Aux.setLoading(elements);

            let response = await WidgetBase.getDataWidget("searchBar");

            switch(response.response){
                case '1':
                    this.printSearchBar(elements, response.searchBar);
                    break;
                default:
                    Aux.error(response.error_text);
            }
        }
    }
    
    private static printSearchBar(elements: HTMLElement[], searchBar: dataSearchBar): void{
        let index: number = 0;
        for(const element of elements){
            index++;
            WidgetBase.setColorBase(searchBar.colorBackground, searchBar.colorText);

            let script = document.querySelector(`#rb-widget-searchBar`);
            if(!script) return;
            const arrivalDate               = script.getAttribute('arrivalDate')??'';
            const departureDate             = script.getAttribute('departureDate')??'';
            const adults                    = Number(script.getAttribute('adults')??2);
            const rentalType                = script.getAttribute('rentalType')??'';
            const childrens                 = Number(script.getAttribute('childrens')??0);
            const childrensAge              = script.getAttribute('childrensAge')??'';
            const submitOnChangeCalendar    = script.getAttribute('submitOnChangeCalendar')??'';

            let age: number[]       = [];
            if(childrensAge) age = (childrensAge.split(',')).map(Number);

            const target        = Aux.getData(element, "target");
            const requiredDate  = Aux.getData(element, "requireddate");

            const requiredDates: boolean = (requiredDate&&requiredDate==="true") as boolean;

            let html = `
            <div class="containerSearchBarRb">
                <form id="formSearchBarRb${index}" action="${searchBar.urlSearch}" method="GET">
                    ${input({type: 'hidden', name: 'id_est', value: searchBar.idUser})}
                    ${input({type: 'hidden', name: 'lang', value: searchBar.lang})}
                    ${input({type: 'hidden', name: 'origen', value: searchBar.origin})}

                    <div class="containerDateSearchBarRb">

                        ${input({
                            type: 'hidden', 
                            name: 'arrival_date', 
                            id:`startDateSearchBarRb${index}`, 
                            value: arrivalDate
                        })}

                        ${input({
                            type: 'hidden', 
                            name: 'departure_date', 
                            id:`finishDateSearchBarRb${index}`, 
                            value: departureDate
                        })}

                        ${input({
                            type: 'text', 
                            id:`inputDateSearchBarRb${index}`, 
                            placeholder: searchBar.textLang.placeholderDate, 
                            autocomplete:false, 
                            readonly:true
                        })}

                        <span class="iconInputRb"> 
                            <i aria-hidden="true"></i>
                        </span>
                        
                    </div>

                    <div class="containerTypeSearchBarRb">
                        ${select({
                            name: 'type',
                            id: `typeSearchBarRb${index}`,
                            textNoValue: searchBar.textLang.allRentals,
                            colletion: searchBar.rentalType,
                            itemTitle: 'name',
                            itemValue: 'idRentalType',
                            value: rentalType,
                        })}

                        <label for="typeSearchBarRb${index}" class="iconInputRb"> 
                            <i aria-hidden="true"></i>
                        </label>
                    </div>
            
                    <div class="containerCapacitySearchBarRb">
                        ${inputCapacity({
                            id: `capacitySearchBarRb${index}`,
                            textAdults:searchBar.textLang.adults,
                            textChildren: searchBar.textLang.childrens,
                            adults: {
                                id: `adultsSearchBarRb${index}`,
                                name: `capacity`,
                                minValue: (searchBar.requiredAdult?1:0),
                                value: adults,
                            },
                            childrens: {
                                id: `childrenSearchBarRb${index}`,
                                name: `capacityChildren`,
                                value: childrens,
                                age: age,
                                nameAge: 'ageChild_',
                                idAge: `ageChildSearchBarRb${index}_`,
                                textAge: searchBar.textLang.childAge,
                            },
                        })}

                        <label for="capacitySearchBarRb${index}" class="iconInputRb"> 
                            <i aria-hidden="true"></i>
                        </label>
                    </div>

                    <div class="containerBtnSearchBarRb">
                        <button type="submit" ${target?`formtarget="${target}"`:''}> 
                            <i aria-hidden="true"></i>
                        </button>
                    </div>
                </form>
            </div>
            `;

            element.innerHTML   = html;

            document.getElementById(`formSearchBarRb${index}`)?.addEventListener("submit", (e) => {
                if(!this.validateForm(index, requiredDates)){
                    e.preventDefault();
                }
            });

            this.activeInputCapacity(index, searchBar);

            DatePicker.bookingCalendar({
                elementSelector: `#inputDateSearchBarRb${index}`, 
                lang: searchBar.lang,
                cssFiles: [config.wConfig.urlBase+'/searchBar/'+config.wConfig.types.searchBar.file+".css"],
                initDate: searchBar.minDate, 
                endDate: searchBar.maxDate,
                startRange: arrivalDate,
                finishRange: departureDate,
                selectCallback: (e) => {
                    this.formatDateInput(e.detail.start, e.detail.end, index, searchBar);
                    if(submitOnChangeCalendar === 'true' || submitOnChangeCalendar === '1'){
                        const form = <HTMLFormElement>document.getElementById(`formSearchBarRb${index}`);
                        form?.submit();
                    }
                }
            });

            if(arrivalDate && departureDate){
                this.formatDateInput(Aux.returnDateFromString(arrivalDate, "YYYY-MM-DD"), Aux.returnDateFromString(departureDate, "YYYY-MM-DD"), index, searchBar);
            }

            document.querySelector(`#formSearchBarRb${index} .containerDateSearchBarRb .iconInputRb`)?.addEventListener(
                "click", 
                () => (document.getElementById(`inputDateSearchBarRb${index}`) as HTMLInputElement).click());

            // document.querySelector(`#formSearchBarRb${index} .containerTypeSearchBarRb .iconInputRb`)?.addEventListener(
            //     "click", 
            //     () => (document.getElementById(`typeSearchBarRb${index}`) as HTMLInputElement).click());

            // document.querySelector(`#formSearchBarRb${index} .containerCapacitySearchBarRb .iconInputRb`)?.addEventListener(
            //     "click", 
            //     () => {
            //         const element = (document.getElementById(`capacitySearchBarRb${index}`) as HTMLInputElement);
            //         element.click();
            //     });

        }
    }

    private static validateForm(index: number, requiredDates: boolean): boolean{
        const arrivalDate: HTMLInputElement = document.getElementById(`startDateSearchBarRb${index}`) as HTMLInputElement;
        const departureDate: HTMLInputElement = document.getElementById(`finishDateSearchBarRb${index}`) as HTMLInputElement;
        
        if(requiredDates && (!arrivalDate || !arrivalDate.value || !departureDate || !departureDate.value) ){
            return false;
        }

        return true;
    }

    private static formatDateInput(arrival: Date|null, departure: Date|null, index: number, searchBar: dataSearchBar): void{
        const hiddenStart: HTMLInputElement = <HTMLInputElement>document.getElementById(`startDateSearchBarRb${index}`);
        const hiddenEnd: HTMLInputElement   = <HTMLInputElement>document.getElementById(`finishDateSearchBarRb${index}`);
        hiddenEnd.value     = '';
        hiddenStart.value   = '';
        
        if(!arrival || !departure) return;
        const startDate   = Aux.returnStringFromDate(arrival, "DD-MM-YYYY");
        const endDate     = Aux.returnStringFromDate(departure, "DD-MM-YYYY");
        hiddenStart.value = startDate??'';
        hiddenEnd.value = endDate??'';
        const inputDate: HTMLInputElement = <HTMLInputElement>document.getElementById(`inputDateSearchBarRb${index}`);
        inputDate.value = `${searchBar.textLang.from} ${startDate} ${searchBar.textLang.to} ${endDate}`;
    }

    private static activeInputCapacity(index: number, searchBar: dataSearchBar): void{
        document.getElementById(`capacitySearchBarRb${index}`)?.addEventListener("click", () => {
            
            const inputCapacity:HTMLElement|null = document.getElementById(`capacitySearchBarRb${index}`);
            if(!inputCapacity || document.getElementById(`modalCapacitySearchBarRb${index}`)) return;
            
            const inputAdults:HTMLInputElement|null = document.getElementById(`adultsSearchBarRb${index}`) as HTMLInputElement;
            const inputChildren:HTMLInputElement|null = document.getElementById(`childrenSearchBarRb${index}`) as HTMLInputElement;
            const adults      = parseInt(inputAdults?inputAdults.value:'0');
            const children    = parseInt(inputChildren?inputChildren.value:'0');       

            document.createElement("div");
            let modal       = document.createElement("div");
            modal.id        = `modalCapacitySearchBarRb${index}`;
            modal.classList.add("modalCapacitySearchBarRb");
            modal.innerHTML = `
            <div class="row">
                <div class="w-50">
                    ${searchBar.textLang.adults}
                </div>
                <div class="w-50">
                    ${input({
                        id: `inputModalAdultsSearchBarRb${index}`,
                        type: 'number',
                        value: adults,

                    })}
                </div>
            </div>
            <div class="row">
                <div class="w-50">
                    ${searchBar.textLang.childrens}
                </div>
                <div class="w-50">
                    ${input({
                        id: `inputModalChildrenSearchBarRb${index}`,
                        type: 'number',
                        value: children,
                    })}
                </div>
            </div>
            <div id="containerModalAgeChildrenSearchBarRb${index}"></div>
            <div class="row">
                <button type="button">${searchBar.textLang.save}</button>
            </div>
            `;
            
            inputCapacity.insertAdjacentElement("afterend", modal);

            inputCounter({
                element: document.getElementById(`inputModalAdultsSearchBarRb${index}`),
                minValue: (searchBar.requiredAdult?1:0),
                maxValue: searchBar.maxCapacity,
                callback: (input) => {
                    let adults = input?.value;
                    this.calculateCapacity(index, searchBar, parseInt(adults??'0'), "adults");
                }
            });

            inputCounter({
                element: document.getElementById(`inputModalChildrenSearchBarRb${index}`),
                minValue: 0,
                maxValue: searchBar.maxCapacity - (searchBar.requiredAdult?1:0),
                callback: (input) => {
                    let children = input?.value;

                    this.calculateCapacity(index, searchBar, parseInt(children??'0'), "children");

                    this.checkInputAgeChildren(index, searchBar);
                }
            });

            for(let i = 0; i <children; i++){
                this.createInputAgeChildren(index, i, searchBar);
            }

            let position = Aux.checkPosition(modal, document.getElementById(`capacitySearchBarRb${index}`));
            if(typeof(position) === 'object'){
                modal.style.top = position.top+"px";
            }

            document.querySelector(`#${modal.id} button`)?.addEventListener("click", this.closeModalCapacity);
            window.addEventListener("click", this.checkClickOnCapacity);
        });
    }

    private static checkInputAgeChildren(index: number, searchBar: dataSearchBar){
        const inputChildren:HTMLInputElement|null = document.getElementById(`childrenSearchBarRb${index}`) as HTMLInputElement;
        const children    = parseInt(inputChildren?inputChildren.value:'0');
        if(children){
            let containerChildren = Array.from(document.querySelectorAll(`.containerAgeChildrenSearchBarRb${index}`));
            let ageChildren = Array.from(document.querySelectorAll(`.ageChildrenSearchBarRb${index}`));
            const nActualChildren: number = containerChildren.length;
            if(nActualChildren > children){
                for(let i = 0; i < nActualChildren;i++){
                    if(i >= children){
                        containerChildren[i].remove();
                        ageChildren[i].remove();
                    }
                }
            }else{
                for(let i = 0; i <children; i++){
                    if(i >= nActualChildren){
                        this.createInputAgeChildren(index, i, searchBar);
                    }
                }
            }
        }else{
            Array.from(document.querySelectorAll(`.containerAgeChildrenSearchBarRb${index}`)).forEach((e) => e.remove());
            Array.from(document.querySelectorAll(`.ageChildrenSearchBarRb${index}`)).forEach((e) => e.remove());
        }
    }

    private static createInputAgeChildren(index: number, nChild: number, searchBar: dataSearchBar){
        const inputActualAge = document.getElementById(`ageChildSearchBarRb${index}_${nChild}`) as HTMLInputElement;
        const actualAge:number = parseInt((inputActualAge?.value)??'3');
        let eHtml = document.createElement("div");
        eHtml.classList.add('row', `containerAgeChildrenSearchBarRb${index}`);
        let html: string = `<div class="w-50">${searchBar.textLang.childAge} ${nChild+1}</div>
                            <div class="w-50">
                                <select id="selectAgeChildrenSearchBarRb${index}_${nChild}">`
                                for(let i = 0; i<=17;i++){
                                    html += `<option value="${i}" ${actualAge===i?'selected':''}>${i}</option>`;
                                }
                        html += `</select>
                            </div>`;
        eHtml.innerHTML = html;

        if(!inputActualAge){
            let inputAge = document.createElement('input');
            inputAge.type = 'hidden';
            inputAge.id = `ageChildSearchBarRb${index}_${nChild}`;
            inputAge.name = `ageChild_${nChild}`;
            inputAge.value = actualAge.toString();
            inputAge.classList.add(`ageChildrenSearchBarRb${index}`);
            document.getElementById(`capacitySearchBarRb${index}`)?.insertAdjacentElement("afterend", inputAge);
        }

        let container = document.getElementById(`containerModalAgeChildrenSearchBarRb${index}`);
        if(container) container.insertAdjacentElement("beforeend",eHtml);
        document.getElementById(`selectAgeChildrenSearchBarRb${index}_${nChild}`)?.addEventListener("input", function(){
            const age = (this as HTMLInputElement).value;
            const inputActualAge = document.getElementById(`ageChildSearchBarRb${index}_${nChild}`) as HTMLInputElement;
            inputActualAge.value = age;
        });
        
    }

    private static calculateCapacity(index: number, searchBar: dataSearchBar, capacity: number, type: "adults" | "children"): void{
        let inputAdults:HTMLInputElement|null = document.getElementById(`adultsSearchBarRb${index}`) as HTMLInputElement;
        let inputChildren:HTMLInputElement|null = document.getElementById(`childrenSearchBarRb${index}`) as HTMLInputElement;
        let adults      = parseInt(inputAdults?inputAdults.value:'0');
        let children    = parseInt(inputChildren?inputChildren.value:'0');
        if(type === "adults"){
            if((capacity + children) <= searchBar.maxCapacity){
                adults = capacity;
                inputAdults.value = capacity.toString();
            }else{
                let inputModal = document.getElementById(`inputModalAdultsSearchBarRb${index}`) as HTMLInputElement;
                inputModal.value = adults.toString();
            }
        }else if(type === "children"){;
            if((capacity + adults) <= searchBar.maxCapacity){
                children = capacity;
                inputChildren.value = capacity.toString();
            }else{
                let inputModal = document.getElementById(`inputModalChildrenSearchBarRb${index}`) as HTMLInputElement;
                inputModal.value = children.toString();
            }
        }

        document.getElementById(`capacitySearchBarRb${index}`)?.setAttribute("placeholder", `${adults} ${searchBar.textLang.adults} · ${children} ${searchBar.textLang.childrens}`);
    }

    private static checkClickOnCapacity(event: MouseEvent): void{
        const target = event?.target as HTMLElement;
        const elements: Node[] = [...document.querySelectorAll("input[id^=capacitySearchBarRb]"), ...document.querySelectorAll(".modalCapacitySearchBarRb")];
        if(elements){
            for(let e of elements){
                if(e.contains(target)) return;
            }
        }
        SearchBar.closeModalCapacity();
    }

    private static closeModalCapacity(): void{
        const elements = document.querySelectorAll(".modalCapacitySearchBarRb") as NodeListOf<HTMLElement>;
        for(let e of elements){
            e.remove();
        }
        window.removeEventListener("click", SearchBar.checkClickOnCapacity);
    }
    
}