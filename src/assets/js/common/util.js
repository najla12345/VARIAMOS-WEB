/* begin util */
// converts the first letter in uppercase
export function jsUcfirst(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// setup main modal view
export function setupModal(header_content,body_content="",footer_content="") 
{
    let main_modal=document.getElementById('main_modal');
    let main_modal_header=document.getElementById('main_modal_header');
    let main_modal_body=document.getElementById('main_modal_body');
    let main_modal_footer=document.getElementById('main_modal_footer');
    main_modal_header.innerHTML="";
    main_modal_body.innerHTML="";
    main_modal_footer.innerHTML="";
    main_modal.style.display="inline-table";

    main_modal_header.appendChild(header_content);
    if(body_content!=""){
        main_modal_body.appendChild(body_content);
    }
    if(footer_content!=""){
        if(Array.isArray(footer_content)){
            footer_content.forEach(footer_element => {
                main_modal_footer.appendChild(footer_element);
            });
        } else {
            main_modal_footer.appendChild(footer_content);
        }
    }
}

export function modalH3(text,type="normal"){
    let c_h3 = document.createElement('h3');
    c_h3.innerText=text;
    if(type=="error"){
        c_h3.style.color="crimson";
    }else if(type=="success"){
        c_h3.style.color="forestgreen";
    }
    return c_h3;
}

export function modalSimpleText(text){
    let c_span = document.createElement('span');
    c_span.innerText=text;
    return c_span;
}

export function modalInputTexts(texts,inputs,default_vals){
    let table = document.createElement('table');
    for(let i=0;i<texts.length;i++){
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        td.innerHTML=texts[i];
        tr.appendChild(td);
        
        let input = document.createElement('input');
        input.value=default_vals[i];
        input.type="text";
        input.id=inputs[i];
        input.size=40;
        input.name=inputs[i];
        let td2 = document.createElement('td');
        td2.appendChild(input);
        tr.appendChild(td2);
        table.appendChild(tr);
    }
    return table;
}

export function modalComponentInformation(structure, idx_cat, idx_subcat){
    let table = document.createElement('table');
    const category_keys = Object.keys(structure);
    const subcategory_keys = Object.keys(structure[category_keys[idx_cat]]);
    const elements = structure[category_keys[idx_cat]][subcategory_keys[idx_subcat]];

    elements.forEach(element => {
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        td.innerHTML=element.element_id;
        tr.appendChild(td);

        let input = null;

        if(element.element_type === 'label'){
            input = document.createElement('th');
            input.innerHTML = element.element_txt !== undefined ? element.element_txt.bold() : '';
            input.setAttribute('align', 'center');
        }
        else if(element.element_type === 'text'){
            input = document.createElement('input');
            input.size=48;
        }
        else if(element.element_type === 'combo'){
            input = document.createElement('select');
            let index = 0;
         
            element.element_items.forEach(optionText => {
                const option = document.createElement('option');
                option.value = index++;
                option.text = optionText;
                input.appendChild(option);
            });
         /*  if(element.files!== undefined)
           {  input = document.createElement('select');
           let index = 0;
        
           element.files.forEach(optionText => {
               const option = document.createElement('option');
               console.log('jjjj');
               option.value = index++;
               option.text = optionText;
               input.appendChild(option);});
           }*/}
         else if(element.element_type === 'textarea'){
            input = document.createElement('textarea');
            input.cols = 50;

            const a = [];
            a.forEach

            if(element.interfaces !== undefined){
                let str = '[';
                element.interfaces.forEach((int, idx) => {
                    str = str + int + (idx < element.interfaces.length - 1 ? ', ' : '');
                })
                str = str + ']';
                input.innerText = str;
            }  if(element.LoadedFiles !== undefined){
                let str = '[';
                element.LoadedFiles.forEach((int, idx) => {
                    str = str + int + (idx < element.LoadedFiles.length - 1 ? ', ' : '');
                })
                str = str + ']';
                input.innerText = str;
            }

            
          /*  if(element.Relations !== undefined){
                let str = '';
                element.Relations.forEach((int, idx) => {
                    str = str + int + (idx < element.interfaces.length - 1 ? ', ' : '');
                })
                str = str + ']';
                input.innerText = str;
            }*/
        } else if(element.element_type === 'button') {
            input = document.createElement('div');
            const b1 = document.createElement('button');
            b1.innerHTML = element.button1_txt !== undefined ? element.button1_txt.bold() : '';
            b1.addEventListener('click', () => {
                const count = (structure.basic_information.functions.length - 1)/2 + 1;
                structure.basic_information.functions.push({element_id: `function${count}-name`, element_type: 'text'},{element_id: `function${count}-Description`, element_type: 'text'})
                let main_modal_body = document.getElementById('main_modal_body');
                main_modal_body.innerHTML="";
                let c_body = modalComponentInformation(structure, idx_cat, idx_subcat);
                main_modal_body.appendChild(c_body);
            });
            
            const b2 = document.createElement('button');
            b2.innerHTML = element.button2_txt !== undefined ? element.button2_txt.bold() : '';
            b2.addEventListener('click', () => {
                structure.basic_information.functions.pop();
                structure.basic_information.functions.pop();
                let main_modal_body = document.getElementById('main_modal_body');
                main_modal_body.innerHTML="";
                let c_body = modalComponentInformation(structure, idx_cat, idx_subcat);
                main_modal_body.appendChild(c_body);
            });
            input.appendChild(b1);
            input.appendChild(b2);
        }
        else if(element.element_type === 'button2') {
            input = document.createElement('div');
            const b3 = document.createElement('button');
            b3.innerHTML = element.button3_txt !== undefined ? element.button3_txt.bold() : '';
            b3.addEventListener('click', () => {
                const count = (structure.Files.functions.length - 1)/3 +1;
              console.log(count);
                structure.Files.functions.push({element_id: `file${count}-name`, element_type: 'text'},{element_id: `file${count}-type`, element_type: 'combo',element_items:['component description','file of source code','class diagram','test case', 'configuration file','Service','configuration file','image']},{element_id: `file${count}-path`, element_type: 'text'})
                let main_modal_body = document.getElementById('main_modal_body');
                main_modal_body.innerHTML="";
                let c_body = modalComponentInformation(structure, idx_cat, idx_subcat);
                main_modal_body.appendChild(c_body);
            });
            
            const b4 = document.createElement('button');
            b4.innerHTML = element.button4_txt !== undefined ? element.button4_txt.bold() : '';
            b4.addEventListener('click', () => {
                structure.Files.functions.pop();
                structure.Files.functions.pop();
                structure.Files.functions.pop();
                let main_modal_body = document.getElementById('main_modal_body');
                main_modal_body.innerHTML="";
                let c_body = modalComponentInformation(structure, idx_cat, idx_subcat);
                main_modal_body.appendChild(c_body);
            });
            input.appendChild(b3);
            input.appendChild(b4);
        }
        else if(element.element_type === 'button3') {
            input = document.createElement('div');
            const b5 = document.createElement('button');
            b5.innerHTML = element.button5_txt !== undefined ? element.button5_txt.bold() : '';
            b5.addEventListener('click', () => {
                const count = (structure.Files.Relatione.length - 1)/3 + 1;
              console.log(count);
              const files=structure.Files.Relatione[1].element_items;
              console.log(files);
                structure.Files.Relatione.push({element_id: `fileSource${count}-name`, element_type: 'combo',element_items:files},{element_id: `file${count}-relation`, element_type: 'combo',element_items:['use','sub-class of','depend from','related with']},{element_id: `filetarget${count}-name`, element_type: 'combo',element_items:files})
                let main_modal_body = document.getElementById('main_modal_body');
                main_modal_body.innerHTML="";
                let c_body = modalComponentInformation(structure, idx_cat, idx_subcat);
                main_modal_body.appendChild(c_body);
            });
            
            const b6 = document.createElement('button');
            b6.innerHTML = element.button6_txt !== undefined ? element.button6_txt.bold() : '';
            b6.addEventListener('click', () => {
                structure.Files.Relatione.pop();
                structure.Files.Relatione.pop();
                structure.Files.Relatione.pop();
             
                let main_modal_body = document.getElementById('main_modal_body');
                main_modal_body.innerHTML="";
                let c_body = modalComponentInformation(structure, idx_cat, idx_subcat);
                main_modal_body.appendChild(c_body);
            });
            input.appendChild(b5);
            input.appendChild(b6);
        }
        else
        
        {
            alert("A problem occurred");
        }

        let td2 = document.createElement('td');
        if(input !== null){
            input.addEventListener('input', function(){
                element.value = input.value;
            });
            if(element.value !== undefined && element.value !== null){
                if(element.element_type === 'combo'){
                    input.selectedIndex = element.value;
                } else {
                    input.value = element.value;
                    input.innerHTML = element.value;
                }
            }
            td2.appendChild(input);
        }
        tr.appendChild(td2);
        table.appendChild(tr);
    });
    return table;
}

export function modalCustomization(texts,inputs,default_vals){
    let table = document.createElement('table');
    for(let i=0;i<texts.length;i++){
        let tr = document.createElement('tr');
        if(i==3){
            tr.id="filetouploadtr";
            tr.style.display="none";
        }
        let td = document.createElement('td');
        td.innerHTML=texts[i];
        tr.appendChild(td);

        let input = {};

        if(i==0){
            input = document.createElement('input');
            input.size=48;
        }
        else if(i==3){
            input = document.createElement('input');
            input.type="file";
        }else{
            input = document.createElement('textarea');
            input.cols=50;
        }

        input.value=default_vals[i];
        input.id=inputs[i];
        input.name=inputs[i];
        if(i==0 || i==1 || i==4){
            input.disabled="disabled";
        }

        let td2 = document.createElement('td');
        td2.appendChild(input);
        tr.appendChild(td2);
        table.appendChild(tr);
    }
    return table;
}

export function modalButton(text,function_to_append){
        let button = document.createElement('button');
        button.innerText=text;
        button.id=text;
        button.addEventListener("click", function_to_append, false);
        return button;
}
 
export function downloadFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename); 
    element.style.display = 'none';
    document.body.appendChild(element); 
    element.click(); 
    document.body.removeChild(element);
}

