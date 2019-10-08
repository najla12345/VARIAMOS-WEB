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
                console.log('cell :', cell);
                let c_header = modalH3(cell.getAttribute('type'),"success");

                const structure = {
                    elements: [
                        {element_id: 'id', element_type: 'text'},
                        {element_id: 'name', element_type: 'text'},
                        {element_id: 'type', element_type: 'combo', element_items:['Subsystem','Actor Component','Procedure', 'Service Component']}
                    ]
                }
                
                let c_body = modalComponentInformation(structure);

                let c_footer = modalButton(graph.currentVueInstance.$t("modal_save"),save_parameters);
                setupModal(c_header, c_body, c_footer);
            }
        }
        evt.consume();
    });

    function save_parameters(){

    }
}

export default setup_events