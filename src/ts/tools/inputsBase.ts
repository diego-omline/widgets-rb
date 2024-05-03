
export function inputCapacity(data: DataInputCapacity): string{

    let html:string = input({
        id: data.id, 
        name: data.name, 
        class: data.class, 
        placeholder: `${data.adults?.value??0} ${data.textAdults} · ${data.childrens?.value??0} ${data.textChildren}`,
        autocomplete: false, 
        readonly:true,
    });

    if(data.adults){
        html += input({type:'hidden', id: data.adults.id, name: data.adults.name, value: data.adults.value??(data.adults.minValue??0)});
    }
    if(data.childrens){
        html += input({type:'hidden', id: data.childrens.id, name: data.childrens.name, value: data.childrens.value??0});
        if((data.childrens.requestAge??true) && data.childrens.value){
            for(let i = 0; i < data.childrens.value;i++){
                html += input({type:'hidden', 
                                id: `${data.childrens.idAge??data.childrens.id+'Age_'}${i}`, 
                                name: `${data.childrens.nameAge??data.childrens.name+'Age_'}${i}`, 
                                value: `${data.childrens.age![i]??0}`});
            }
        }
    }

    return html;
}

export function input(data: DataInput): string{
    return `<input type="${data.type??'text'}" 
            ${typeof(data.id) !== 'undefined'?`id="${data.id}"`:``} 
            ${typeof(data.name) !== 'undefined'?`name="${data.name}"`:``} 
            ${typeof(data.value) !== 'undefined'?`value="${data.value}"`:``} 
            ${typeof(data.class) !== 'undefined'?`class="${data.class}"`:``} 
            ${typeof(data.placeholder) !== 'undefined'?`placeholder="${data.placeholder}"`:``} 
            ${typeof(data.autocomplete) !== 'undefined'?`autocomplete="${data.autocomplete?'on':'off'}"`:``} 
            ${typeof(data.readonly) !== 'undefined'?`readonly="${data.readonly?'true':'false'}"`:``}
            >`
}

export function select(data: DataSelect): string{
    let select = `<select 
            ${typeof(data.id) !== 'undefined'?`id="${data.id}"`:``} 
            ${typeof(data.name) !== 'undefined'?`name="${data.name}"`:``} 
            ${typeof(data.class) !== 'undefined'?`class="${data.class}"`:``} 
            >
            <option value="">${data.textNoValue}</option>`;
            for(let c of data.colletion){
                select += `
                <option value="${c[data.itemValue]}" ${c[data.itemValue] === data.value?'selected':''}>
                    ${c[data.itemTitle]}
                </option>`
            }
    select += `</select>`;
    return select;
}

export function inputCounter(data: DataInputCounter): void{
    if(!data.element) return;
    data.element.classList.add("inputCounter");
    data.element.setAttribute("readonly", "readonly");
    data.element.setAttribute("type", "text");
    if(data.minValue) data.element.setAttribute("min", data.minValue.toString());
    if(data.maxValue) data.element.setAttribute("max", data.maxValue.toString());
    data.element.setAttribute("step", (data.step??1).toString());
    
    if(data.element.parentElement){
        data.element.parentElement.classList.add("containerInputCounter");
    }

    let spanPlus = document.createElement("span");
    let spanMinus = document.createElement("span");
    spanMinus.classList.add("btnInputCounter");
    spanPlus.classList.add("btnInputCounter");
    spanMinus.innerHTML = '-';
    spanPlus.innerHTML = '+';
    spanMinus.addEventListener("click", function(){ changeValue(this)});
    spanPlus.addEventListener("click", function(){ changeValue(this)});

    data.element.insertAdjacentElement("beforebegin", spanMinus);
    data.element.insertAdjacentElement("afterend", spanPlus);

    function changeValue(span: HTMLSpanElement): void{
        let input: HTMLInputElement|null;
        if(span.innerHTML === '-'){
            input = span.nextSibling as HTMLInputElement;
            if(!input) return;
            input.value = (parseInt(input.value) - 1).toString();
        }else if(span.innerHTML === '+'){
            input = span.previousSibling as HTMLInputElement;
            if(!input) return;
            input.value = (parseInt(input.value) + 1).toString();

        }else return;

        let min = parseInt(input.getAttribute('min')??'0');
        let max = parseInt(input.getAttribute('max')??'99');
        if(parseInt(input.value) < min){
            input.value = min.toString();
        }else if(parseInt(input.value) > max){
            input.value = max.toString();
        } 
            

        if(data.callback) data.callback(input);
    }

}