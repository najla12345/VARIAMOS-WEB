import { setupModal, modalH3, modalComponentInformation, modalButton } from '../../../common/util'

let setup_events = function setup_events(graph){

    const componentMap = load_parameters();

    //clean previous generated events
    if(graph.eventListeners.length>22){
        graph.eventListeners.pop();graph.eventListeners.pop();
        graph.eventListeners.pop();graph.eventListeners.pop();
        graph.eventListeners.pop();graph.eventListeners.pop();
        graph.eventListeners.pop();graph.eventListeners.pop();
    }
    //redirect to the original model when double click on a clon cell
    graph.addListener(mxEvent.DOUBLE_CLICK, function(_sender, evt){
        let cell = evt.getProperty('cell');
        
        if (cell !== null){
            const type = cell.getAttribute('type');
            if(['component','interface'].includes(type)){
                const compId = cell.getId();
                let structure = {};
                let idx_cat = 0;
                let idx_subcat = 0;
                if(componentMap.has(compId)){
                    const map_element = componentMap.get(compId);
                    structure = map_element.structure;
                    console.log(map_element);
                    //Recalculate dynamic properties.
                   // const interfaces = get_interfaces(cell);
                   // structure.basic_information.interfaces[1].interfaces = interfaces.exposed;
                    //structure.basic_information.interfaces[2].interfaces = interfaces.required;

                    //Reset indexes
                    map_element.idx_cat = 0;
                    map_element.idx_subcat = 0;
                    console.log("STRUCTURE IS !!!!");
            // console.log(structure.value);
                    //Save after recalculating:
                 if(structure.Files!=undefined)
                 {    console.log("files....!!!!");
                     const files = get_files(structure);
                    console.log(files);
              // console.log(files);
              const n_relation =structure.Files.Relatione.length;
              
            for(let i = 1; i < n_relation-2; i=i+11){
                structure.Files.Relatione[i].element_items = files.names;
                console.log('je suis i');
                console.log(i);
                structure.Files.Relatione[i+2].element_items = files.names;
                structure.Files.Relatione[i].value=structure.Files.Relatione[i].value;
                structure.Files.Relatione[i+2].value=structure.Files.Relatione[i+2].value;
               // structure.Files.Relatione[i].value = files.names;  
                  console.log(structure.Files.Relatione[i].value);}}
                    localStorage.setItem('ComponentMap', serialize(componentMap));
                } else {
                   structure = create_structure(type === 'component', cell);
                  // structure.Files.Relations[0] = [];
               //   const files = get_files(structure);
               //   console.log("files....");
            // console.log(files);
           //  structure.Files.Relatione[0].LoadedFiles = files.value;
                 
             //  console.log(structure.Files.Relatione[0].LoadedFiles);
                    componentMap.set(compId, {structure, idx_cat: idx_cat, idx_subcat: idx_subcat});
                   // structure.Files.Relations[0] = [];
                }
             
              //  console.log("files....");
              //  console.log(structure.Files.Relations[1]);
             // const files = get_files(structure);
              //structure.Files.Relatione[0].value = files.value;
              
                const limits = calculate_limits(componentMap.get(compId));
                let c_header = modalH3(cell.getAttribute('label') 
                    + ' - Cat ' + (idx_cat+1) + ' / ' + limits.category_keys.length 
                    + ' - SubCat ' + (idx_subcat+1) + ' / ' + limits.subcategory_keys.length);
                let c_body = modalComponentInformation(structure, idx_cat, idx_subcat);

                let c_footer = [];
                c_footer.push(modalButton(graph.currentVueInstance.$t("modal_save"), function(){save_parameters(cell, structure);}));
                c_footer.push(modalButton("Next", function(){next_index(cell, true);}));
                c_footer.push(modalButton("Back", function(){next_index(cell, false);}));
                setupModal(c_header, c_body, c_footer);
            }
        }
        evt.consume();
    });

    function load_parameters(){
        const store = JSON.parse(localStorage.getItem('ComponentMap'));
        if(store !== null) return new Map(store);
        else return new Map();
    }

    function serialize(map) {
        return JSON.stringify([...map])
    }
    
    function save_parameters(_cell, _structure){
        const main_modal = document.getElementById("main_modal");
        main_modal.style.display = 'none';
        const btn_save = document.getElementById('buttonSAVE').children[0];
        btn_save.click();
        localStorage.setItem('ComponentMap', serialize(componentMap));
    }

    function next_index(cell, next){
        let main_modal_header=document.getElementById('main_modal_header');
        let main_modal_body=document.getElementById('main_modal_body');
        //let main_modal_footer=document.getElementById('main_modal_footer');
        main_modal_body.innerHTML="";
        main_modal_header.innerHTML="";

        const cellObj = componentMap.get(cell.getId());
        const prevlimits = calculate_limits(cellObj);
        const subcat_limit = cellObj.idx_subcat === prevlimits.subcategory_keys.length - 1;
        const cat_limit = cellObj.idx_cat === prevlimits.category_keys.length - 1;
        if(next){
            if(subcat_limit && cat_limit){
                //Desactiver next
                console.log('Can\'t go further forward');
            } else if(subcat_limit) { 
                //Augmenter cat
                cellObj.idx_subcat = 0;
                cellObj.idx_cat++;
            } else {
                //Augmenter subcat
                cellObj.idx_subcat++;
            }
        } else {
            if(cellObj.idx_cat === 0 && cellObj.idx_subcat === 0){
                //Desactiver Back
                console.log('Can\'t go further back');
            } else if(cellObj.idx_cat !== 0 && cellObj.idx_subcat !== 0){
                //Reduire la subcat
                cellObj.idx_subcat--;
            } else if(cellObj.idx_cat !== 0 && cellObj.idx_subcat === 0){
                cellObj.idx_cat--;
                cellObj.idx_subcat = calculate_limits(cellObj).subcategory_keys.length-1;
            } else {
                cellObj.idx_subcat--;
            }
        }
        console.log('cellObj.idx_cat :', cellObj.idx_cat);
        console.log('cellObj.idx_subcat :', cellObj.idx_subcat);
        const newlimits = calculate_limits(cellObj);
        let c_header = modalH3(cell.getAttribute('label') 
        + ' - Cat ' + (cellObj.idx_cat+1) + ' / ' + newlimits.category_keys.length 
        + ' - SubCat ' + (cellObj.idx_subcat+1) + ' / ' + newlimits.subcategory_keys.length);
        let c_body = modalComponentInformation(cellObj.structure, cellObj.idx_cat, cellObj.idx_subcat);
        main_modal_header.appendChild(c_header);
        main_modal_body.appendChild(c_body);
    }

    function calculate_limits(cellObj){
        const category_keys = Object.keys(cellObj.structure);
        const subcategory_keys = Object.keys(cellObj.structure[category_keys[cellObj.idx_cat]]);
        return {
            category_keys,
            subcategory_keys        
        };
    }

    function create_structure(component, cell){
        if(component){
            //const interfaces = get_interfaces(cell);

            const files=get_files(structure);
            
           // console.log('interface....');
        
           //console.log(structure.Files.functions[1]);
            const structure = {
                basic_information: {
                    general_information: [
                        {element_id: 'Identification :', element_type: 'label'/*, element_txt: cell.getAttribute('label')*/},
                        {element_id: 'id', element_type: 'text'},
                        {element_id: 'name', element_type: 'text'},
                        {element_id: 'type', element_type: 'combo', element_items:['Subsystem','Actor Component','Procedure', 'Service Component']},
                        {element_id: 'overview', element_type: 'textarea'},
                        {element_id: 'History :', element_type: 'label'},
                        {element_id: 'Version', element_type: 'text'},
                        {element_id: 'Date', element_type: 'text'},
                        {element_id: 'Developer', element_type: 'text'},
                        {element_id: 'Improvements', element_type: 'text'},
                        {element_id: 'Special terms and rules :', element_type: 'label'},
                        {element_id: 'term', element_type: 'text'},
                        {element_id: 'description', element_type: 'text'},
                        {element_id: 'rule', element_type: 'text'},
                        {element_id: 'description', element_type: 'text'}
                        ],
                    /*interfaces: [  
                        {element_id: 'Interfaces :', element_type: 'label'},
                        {element_id: 'Exposed Interfaces', element_type: 'textarea', interfaces: interfaces.exposed},
                        {element_id: 'Required Interfaces', element_type: 'textarea', interfaces: interfaces.required},
                    
                    ],
                   */
                    constraints: [
                        {element_id: 'Protocol :', element_type: 'label'},
                        {element_id: 'name', element_type: 'text'},
                        {element_id: 'description', element_type: 'text'} ,
                        {element_id: 'standard :', element_type: 'label'},
                        {element_id: 'used-standard :', element_type: 'label'},
                        {element_id: 'component-model', element_type: 'text'},
                        {element_id: 'other-standard', element_type: 'text'},
                        {element_id: 'required-standard', element_type: 'text'}   
                        ],
                        functionality: [
                        {element_id: 'Functionality:', element_type: 'label'},
                        {element_id: 'name', element_type: 'text'},
                        {element_id: 'description', element_type: 'text'},
                        {element_id: 'Inputs', element_type: 'text'},
                        {element_id: 'Outputs', element_type: 'text'},
                    ],
                    quality_attributes: [ 
                        {element_id: 'Quality:', element_type: 'label'},
                        {element_id: 'Modifiability', element_type: 'text'},
                        {element_id: 'Expandability', element_type: 'text'},
                        {element_id: 'Performance', element_type: 'label'},
                        {element_id: 'Size', element_type: 'text'},
                        {element_id: 'Prioritization of events', element_type: 'text'},
                        {element_id: 'Capacity', element_type: 'text'},
                        {element_id: 'Throughput', element_type: 'text'},
                        {element_id: 'Error detection', element_type: 'text'},
                        {element_id: 'Allocation time of resources', element_type: 'text'},
                        {element_id: 'Security', element_type: 'text'},
                        {element_id: 'Reliability', element_type: 'text'},
                    ]   
                },
                Files: {
                    Relatione: [
                        {element_id: 'relation-function', element_type: 'button3', button5_txt: 'Create new relation', button6_txt: 'Delete the last relation'},
                        {element_id: 'fileSource', element_type: 'combo', element_items: files.names},
                        {element_id: 'Relation', element_type: 'combo',element_items:['use','sub-class of','depend from','related with']},
                        {element_id: 'fileTarget', element_type: 'combo', element_items: files.names}
                    
                     ],
                    functions: [
                        {element_id: 'file-function', element_type: 'button2', button3_txt: 'Create new File', button4_txt: 'Delete the last File'},
                        {element_id: 'file-name', element_type: 'text'},
                        {element_id: 'file-type', element_type: 'combo', element_items:['component description','file of source code','class diagram','test case', 'configuration file','Service','configuration file','image']},
                        {element_id: 'file-path', element_type: 'text'}

                    ]
                  

                },
                detailed_information: {
                    technical_detail: [
                        {element_id: 'Technical detail :', element_type: 'label'},
                        {element_id: 'Application Area :', element_type: 'text'},
                        {element_id: 'Developement Environment :', element_type: 'text'},
                        {element_id: 'Platforms :', element_type: 'label'},
                        {element_id: 'Hardware :', element_type: 'label'},
                        {element_id: 'name :', element_type: 'text'},
                        {element_id: 'description :', element_type: 'text'},
                        {element_id: 'Software :', element_type: 'label'},
                        {element_id: 'name :', element_type: 'text'},
                        {element_id: 'description :', element_type: 'text'},
                        {element_id: 'Interdependencies  :', element_type: 'text'},
                        {element_id: 'Prerequistes :', element_type: 'label'},
                        {element_id: 'Class:', element_type: 'text'},
                        {element_id: 'name :', element_type: 'text'},
                        {element_id: 'description :', element_type: 'text'},
                        {element_id: 'name :', element_type: 'text'},
                        {element_id: 'TypeLibrary :', element_type: 'label'},
                        {element_id: 'Name :', element_type: 'text'},
                        {element_id: 'Version :', element_type: 'text'},
                        {element_id: 'Special physical resource needs :', element_type: 'text'}
                        
                    ],
                    restrictions: [{element_id: 'Restriction :', element_type: 'label'},
                     {element_id: 'Restrictions :', element_type: 'text'}],
                    implementation: [{element_id: 'Implemtation :', element_type: 'label'},
                                     {element_id: 'Composition :', element_type: 'text'},
                                     {element_id: 'Context :', element_type: 'text'},
                                     {element_id: 'Configuration :', element_type: 'text'},
                                     {element_id: 'Interface Implementation :', element_type: 'label'},
                                     {element_id: 'Implementation (code):', element_type: 'text'}],
                    delivery: [ {element_id: 'Delivery :', element_type: 'label'},
                    {element_id: 'Format of delivery', element_type: 'combo', element_items:['Binary format','Source code','Library format']}
                ]
                },
                acceptance_information: {
                    info: [ {element_id: 'Acceptance information ', element_type: 'label'},
                    {element_id: 'test_criteria ', element_type: 'text'},
                    {element_id: 'test_overview ', element_type: 'text'},
                    {element_id: 'test_environment ', element_type: 'text'},
                    {element_id: 'test_cases ', element_type: 'text'},
                    {element_id: 'test_summary ', element_type: 'text'},
                    {element_id: 'test_support ', element_type: 'text'},
                    ]
                },
                support_information: {
                    installation_guide: [{element_id: 'Support_information ', element_type: 'label'},
                    {element_id: 'installation_guide ', element_type: 'textarea'},
                    {element_id: 'tailoring_support ', element_type: 'textarea'},
                    {element_id: 'customer_support ', element_type: 'textarea'}]
                    
                }
             
            };
        
            Object.keys(structure).forEach(function(key_category,_index) {
                // key_category: the name of the object key
                // _index: the ordinal position of the key within the object
                const subcategory = structure[key_category];
                Object.keys(subcategory).forEach(function(key_subcategory,_index) {
                    // key_subcategory: the name of the object key
                    // _index: the ordinal position of the key within the object
                    subcategory[key_subcategory].forEach(element => {
                        if(element.value === undefined) {
                            element.value = null;
                            
                        }
                    });
                });
            });
            return structure;
        } else {
            return {
                basic_information: {
                    interfaces: [  
                        {element_id: 'Interface :', element_type: 'label'},
                        {element_id: 'version_interface', element_type: 'text'} ,
                        {element_id: 'interface-usage', element_type: 'text'} ,
                        {element_id: 'interface-name', element_type: 'text'},
                        {element_id: 'interface-type', element_type: 'text'}, 
                        {element_id: 'interface-description', element_type: 'text'},
                        {element_id: 'behavior', element_type: 'combo', element_items:['Static','Dynamic']},
                        
                    ],
                    functions: [
                        {element_id: 'interface-function', element_type: 'button', button1_txt: 'Create new Function', button2_txt: 'Delete the last function'},
                        {element_id: 'function1-name', element_type: 'text'},
                        {element_id: 'function1-Description', element_type: 'text'}
                    ]
                }
            };
        }   
    }

   /* function get_interfaces(cell){
        const n_edges = cell.getEdgeCount();
        const interfaces = {
            required: [],
            exposed: []
        }
        if(n_edges !== 0){
            for(let i = 0; i < n_edges; i++){
                const edge = cell.getEdgeAt(i);
                const relType = edge.getAttribute('type');
                if(relType === 'rel_interface_component'){
                    interfaces.exposed.push(edge.source.getAttribute('label'));
                }
                if(relType === 'rel_component_interface'){
                    interfaces.required.push(edge.target.getAttribute('label'));
                }
            }
        }
        return interfaces;
    }*/
   function get_files(structure){
    let files = {
        names: ['not selected']
        
    }
       if (structure!==undefined)
        {
    
            const n_edges =structure.Files.functions.length;
       console.log( structure);
        console.log(n_edges);
      
        if(n_edges !== 0){
            for(let i = 1; i < n_edges-2; i=i+3){
                const fileName = structure.Files.functions[i].value;
                console.log(fileName);
                if(fileName!==null)
               {files.names.push(fileName);}
              
            }
        }
        console.log('xxxx........');
        console.log(files);}
        return files;
      
    }

}

export default setup_events