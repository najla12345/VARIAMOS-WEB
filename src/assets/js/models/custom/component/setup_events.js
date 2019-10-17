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
            if(cell.getAttribute('type') === 'component'){
                const compId = cell.getId();
                let structure = {};
                let idx_cat = 0;
                let idx_subcat = 0;
                if(componentMap.has(compId)){
                    structure = componentMap.get(compId).structure;
                } else {
                    structure = create_structure();
                    componentMap.set(compId, {structure, idx_cat: idx_cat, idx_subcat: idx_subcat})
                }
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

    function create_structure(){
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
                interfaces: [  
                    {element_id: 'Interface :', element_type: 'label'},
                    {element_id: 'version_interface', element_type: 'text'} ,
                    {element_id: 'interface-usage', element_type: 'text'} ,
                    {element_id: 'Required Interface :', element_type: 'label'},
                    {element_id: 'interface-name', element_type: 'text'},
                    {element_id: 'interface-type', element_type: 'text'}, 
                    {element_id: 'interface-description', element_type: 'text'},
                    {element_id: 'behavior', element_type: 'combo', element_items:['Static','Dynamic']},
                    {element_id: 'interface-function', element_type: 'label'},
                    {element_id: 'function-name', element_type: 'text'},
                    {element_id: 'function-Description', element_type: 'text'},
                    {element_id: 'Provided Interface :', element_type: 'label'},
                    {element_id: 'interface-name', element_type: 'text'},
                    {element_id: 'interface-type', element_type: 'text'}, 
                    {element_id: 'interface-description', element_type: 'text'},
                    {element_id: 'behavior', element_type: 'combo', element_items:['Static','Dynamic']},
                    {element_id: 'interface-function', element_type: 'label'},
                    {element_id: 'function-name', element_type: 'text'},
                    {element_id: 'function-Description', element_type: 'text'}
                
                ],
                configuration: [
                        {element_id: 'Configuration and composition :', element_type: 'label'},
                        {element_id: 'Configuration_composition :', element_type: 'text'},
                ],
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
                restrictions: [],
                implementation: [],
                delivery: [],
            },
            acceptance_information: {
                test_criteria: [],
                test_overview: [],
                test_environment: [],
                test_cases: [],
                test_summary: [],
                test_support: [],
            },
            support_information: {
                installation_guide: [],
                tailoring_support: [],
                customer_support: [],
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
    }
}

export default setup_events