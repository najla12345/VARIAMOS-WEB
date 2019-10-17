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
                                {element_id: 'Identification :', element_type: 'label',element_parent:'yes'},
                                {element_id: 'id', element_type: 'text'},
                                {element_id: 'name', element_type: 'text'},
                                {element_id: 'type', element_type: 'combo', element_items:['Subsystem','Actor Component','Procedure', 'Service Component']},
                                {element_id: 'overview', element_type: 'textarea'},
                                {element_id: 'History :', element_type: 'label',element_parent:'yes'},
                                {element_id: 'Version', element_type: 'text'},
                                {element_id: 'Date', element_type: 'text'},
                                {element_id: 'Developer', element_type: 'text'},
                                {element_id: 'Improvements', element_type: 'text'},
                                {element_id: 'Special terms and rules :', element_type: 'label',element_parent:'yes'},
                                {element_id: 'term', element_type: 'text'},
                                {element_id: 'description', element_type: 'text'},
                                {element_id: 'rule', element_type: 'text'},
                                {element_id: 'description', element_type: 'text'}
                             ],
                            interfaces: [  
                              /*  {element_id: 'Interface :', element_type: 'label'},
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
                                {element_id: 'function-Description', element_type: 'text'}*/
                            
                            ],
                         /*   Configuration: [
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
                       */   
                        },
                        detailed_information: {
                           /* technical_detail: [
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
                              
                            ],*/
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
               // c_body.style.overflowX='scroll';
                //c_body.style.overflowY='scroll';

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