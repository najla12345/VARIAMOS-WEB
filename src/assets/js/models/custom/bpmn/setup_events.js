import { setupModal, modalH3, modalComponentInformation, modalButton } from '../../../common/util'

let setup_events = function setup_events(graph){

    const cellMap = new Map();
var targetCell=[];
var indice=0;
    //clean previous generated events
    /*if(graph.eventListeners.length>22){
        graph.eventListeners.pop();graph.eventListeners.pop();
        graph.eventListeners.pop();graph.eventListeners.pop();
        graph.eventListeners.pop();graph.eventListeners.pop();
        graph.eventListeners.pop();graph.eventListeners.pop();
    }*/
    //redirect to the original model when double click on a clon cell
   

    //TODO FIX
    graph.addListener(mxEvent.DOUBLE_CLICK, function(_sender, evt){
        //Get cell for event
        const cell = evt.getProperty('cell');
        var elements=[];
        let tar;
        if (cell !== null){
            //get the cell type
            const cellType = cell.getAttribute('type');
          
            //if the type is task
            if(cellType === 'VariantTask'){
              
                //get graphModel ref
                const model = graph.getModel();
                //get graph Root
                const parent = model.getRoot();
                //get cell id
                const cellId = cell.getId();
                let cellTarget=[];
                targetCell=cellTarget;
                if(cell.edges!==null){
                cell.edges.forEach(cell => {
                    if(cell.target.getAttribute('type')==="Variant")
                    {
                    targetCell[indice]=cell.target;
                    indice++;
                    cellTarget[indice]=cell.target;
                console.log(cell.target);}
            
            })}
                //get bpmn layer
                const bpmnLayer = model.getCell("bpmn"); 
               // console.log(bpmnLayer);
               const cellGeo = cell.getGeometry().clone();
                if(cellMap.has(cellId)){
                    //Existing subGraph
                    const newSubGraphRoot = cellMap.get(cellId);
                    console.log("1"+newSubGraphRoot);
                    cellTarget.forEach(cell => {
                    model.setVisible(cell, false);
                    })
                  //  model.setVisible(bpmnLayer, false);
                    model.setVisible(newSubGraphRoot, true);
                    graph.setDefaultParent(newSubGraphRoot);
                
                    //const backbtn = graph.insertVertex(newSubGraphRoot, null, node, 0, 0, 40, 40, 'shape=triangle;align=left;fillColor=#C3D9FF;strokeColor=#4096EE');
                } else {
                    //New subGraph
                    const newSubGraphRoot = parent.insert(new mxCell());
                    console.log("2"+newSubGraphRoot);
                    //Set the mapping in the map
                    cellMap.set(cellId, newSubGraphRoot);
                    //Set to invisible the bpmn main graph
                    cellTarget.forEach(cell => {
                        model.setVisible(cell, false);
                        })
                   //model.setVisible(bpmnLayer, false);
                   graph.setDefaultParent(newSubGraphRoot);
                    let type = 'backbtn'
                    let doc = mxUtils.createXmlDocument();
                    let node = doc.createElement(type);
                    node.setAttribute('label', type);
                    node.setAttribute('type', type);
                    node.setAttribute('cellId', cellId);
                    const backbtn = graph.insertVertex(newSubGraphRoot, null, node, cellGeo.x, cellGeo.y, 40, 40, 'shape=triangle;align=left;fillColor=#C3D9FF;strokeColor=#4096EE');
                }
            } else if(cellType === 'backbtn') {
                const model = graph.getModel();
                //get bpmn layer
                const bpmnLayer = model.getCell("bpmn");
                const taskLayer = cellMap.get(cell.getAttribute('cellId'));
                model.setVisible(taskLayer, false);
                targetCell.forEach(cell => {
                    model.setVisible(cell, true);
                    })
               // model.setVisible(targetCell, true);
                //graph.setDefaultParent(bpmnLayer); 
               
            }
        }
        evt.consume();
    });

    //Control group resizes
    graph.addListener(mxEvent.CELLS_RESIZED, handleResize);

    function handleResize(_sender, evt){
        const cells = evt.getProperty('cells');
        if (cells != null)
        {
            cells.forEach(cell => {
                //Set up handling for classes
                const type=cell.getAttribute('type');
                if(["horizontalPool", "Lane"].includes(type)){
                
                    const model = graph.getModel();
                    const cellGeo = cell.getGeometry().clone();

                    const name_container = cell.getChildAt(1);
                    const name_geo = name_container.getGeometry().clone();


                    //Set geometry for name
                    name_geo.x = 0;
                    name_geo.y = 0;
                    name_geo.width = cellGeo.width;
                    model.setGeometry(cell.getChildAt(1), name_geo);
                    console.log(cellGeo.width);
                    console.log(name_geo.width);

                }
            });
        }
    }

    


   
  

   
    }



export default setup_events