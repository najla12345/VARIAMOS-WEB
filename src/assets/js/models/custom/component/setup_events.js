import { setupModal, modalH3, modalComponentInformation, modalButton } from '../../../common/util'

let setup_events = function setup_events(graph){
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
                let c_header = modalH3(cell.getAttribute('type'),"success");

                const structure = cell.structure !== undefined 
                    ? cell.structure 
                    : {
                        basic_information: {
                            general_information: [
                                {element_id: 'Identification :', element_type: 'label'},
                                {element_id: 'id', element_type: 'text'},
                                {element_id: 'name', element_type: 'text'},
                                {element_id: 'type', element_type: 'combo', element_items:['Subsystem','Actor Component','Procedure', 'Service Component']}
                            ],
                            interfaces: [],
                            configuration: [],
                            constraints: [],
                            functionality: [],
                            quality_attributes: []
                        },
                        detailed_information: {
                            technical_detail: [],
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
                    }
                ;
                
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
                
                let c_body = modalComponentInformation(structure);

                let c_footer = modalButton(graph.currentVueInstance.$t("modal_save"),save_parameters(cell, structure));
                setupModal(c_header, c_body, c_footer);
            }
        }
        evt.consume();
    });

    function save_parameters(cell, structure){
        return function(){
            cell.structure = structure;
        };
    }
}

export default setup_events