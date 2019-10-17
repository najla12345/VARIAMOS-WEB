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
    if(body_content!=""){main_modal_body.appendChild(body_content);}
    if(footer_content!=""){main_modal_footer.appendChild(footer_content);}
    main_modal_body.scrollTo(0,200);
    main_modal_body.style.overflowX='scroll';
    main_modal_body.style.overflowY='scroll';
    main_modal.style.overflowX='auto';
    main_modal.style.overflowY='auto';
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

export function modalComponentInformation(structure){
    let table = document.createElement('table');

    Object.keys(structure).forEach(function(key_category,index) {
        let olaux=document.createElement('ol');
        
        // key: the name of the object key
        // index: the ordinal position of the key within the object
        const subcategory = structure[key_category];
        Object.keys(subcategory).forEach(function(key_subcategory,index) {
            subcategory[key_subcategory].forEach(element => {
               let ol=null;
               // let ol = document.createElement('ol');
            
                let tr = document.createElement('tr');
                let td = document.createElement('td');
                let x;
                if ((element.element_type === 'label') && (element.element_parent === 'yes'))
                {if(ol==null)
                    {ol = document.createElement('ol');
                   
                }
                     x=element.element_id;
                     ol.innerHTML=element.element_id;
             
                
                
                   olaux=ol;
                  //tr.appendChild(olaux);
                }
                if((element.element_type === 'text')||(element.element_type === 'combo')||(element.element_type === 'textarea'))
                   { let li = document.createElement('li');  
                    li.innerHTML=element.element_id;;
                    olaux.appendChild(li);
                    console.log('mon pere est');
                
                    console.log('je suis le fils');
                
                  //  td=li;  
           //   td=li
               // tr.appendChild(td);
            
        
            
                let input = null;

                if(element.element_type === 'label'){
                    /* input = document.createElement('Label');
                    input.innerHTML = ''; */
                 
                }
                else if(element.element_type === 'text'){
                    input = document.createElement('input');
                    input.size=48;
                }
                else if(element.element_type === 'textarea'){
                    input = document.createElement('textarea');
                    input.cols=50;
                }
                else if(element.element_type === 'combo'){
                    input = document.createElement("select");
                    let index = 0;
                    element.element_items.forEach(optionText => {
                        const option = document.createElement('option');
                        option.value = index++;
                        option.text = optionText;
                        input.appendChild(option);
                    });
                }else{
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
                    td.appendChild(olaux);
                
                    td2.appendChild(input);
                  
                }
               
                tr.appendChild(td);
                tr.appendChild(td2);
                
            }
         
                table.appendChild(tr);
   
                
//table.scrollTo(200,0);
            });
        });
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

/* end util */

