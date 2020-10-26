var bpmn_main = function bpmn_main(graph)
{
    bpmn_constraints(graph);
    bpmn_custom_overrides();
    var data=[];
    data["m_type"]="normal" //custom type
    data["m_elements"]=bpmn_elements(); //custom elements
    data["m_attributes"]=bpmn_attributes(); //custom attributes
    data["m_relations"]=null; //custom relations
    data["m_properties_styles"]=BPMNPropertiesStyles();; //custom properties styles
    data["m_labels"]=null; //custom labels
    data["m_clon_cells"]=null; //custom clon cells
    data["m_constraints_ic"]=null; //custom constraints in element creation
    data["m_overlay"]=null; //custom overlays
    return data;

    function bpmn_custom_overrides(){
      graph.isHtmlLabel = function (cell) {
        return mxUtils.isNode(cell.value);
      }
    }
    
    function bpmn_constraints(graph){
        graph.multiplicities=[]; //reset multiplicities
        graph.multiplicities.push(new mxMultiplicity(
            true, "component", null, null, 0, 0, null,
            "Invalid connection",
            "Only shape targets allowed"));
        graph.multiplicities.push(new mxMultiplicity(
            true, "file", null, null, 0, 1, ["component"],
            "Only 1 target allowed",
            "Only shape targets allowed"));
    }

    function bpmn_elements(){
        const textOpts = 'overflow=visible;whiteSpace=wrap;html=1;';
        const offsetLabelOpts = 'verticalLabelPosition=top;verticalAlign=bottom;';
        var end = {src:projectPath+"images/models/bpmn/end.PNG", wd:100, hg:40, style:"shape=GeneralEnd", type:"GeneralEnd", pname:"GeneralEnd"};
        var task = {src:projectPath+"images/models/bpmn/task.PNG", wd:125, hg:50, style:"shape=Task;html=1;whiteSpace=wrap;;overflow=visible;fontColor=black;", type:"Task", pname:"Task"};
        var variantTask = {src:projectPath+"images/models/bpmn/task.PNG", wd:125, hg:50, style:"shape=Task;dashed=1;html=1;whiteSpace=wrap;;overflow=visible;fontColor=black;", type:"VariantTask", pname:"VariantTask"};
        var timer = {src:projectPath+"images/models/bpmn/timer.PNG", wd:125, hg:50, style:"shape=TimerStart;html=1;whiteSpace=wrap;;overflow=visible;fontColor=black;", type:"TimerStart", pname:"TimerStart"};
        var message = {src:projectPath+"images/models/bpmn/message.PNG", wd:125, hg:50, style:"shape=MessageStart;html=1;whiteSpace=wrap;;overflow=visible;fontColor=black;", type:"message", pname:"Message"};
        var GatewayEvent = {src:projectPath+"images/models/bpmn/GatewayEvent.PNG", wd:125, hg:50, style:"shape=GatewayEvent;html=1;whiteSpace=wrap;;overflow=visible;fontColor=black;", type:"GatewayEvent", pname:"GatewayEvent"};
        var GateWay = {src:projectPath+"images/models/bpmn/Gateaway.PNG", wd:125, hg:50, style:"shape=Gateway;html=1;whiteSpace=wrap;;overflow=visible;fontColor=black;", type:"Gateway", pname:"Gateway"};
        var GateWayAnd = {src:projectPath+"images/models/bpmn/paralell.PNG",wd:125, hg:50, style:"shape=GatewayAND;html=1;whiteSpace=wrap;;overflow=visible;fontColor=black;", type:"GatewayAND", pname:"GatewayAND"};
        var GateWayComplex = {src:projectPath+"images/models/bpmn/Complex.PNG", wd:125, hg:50, style:"shape=GatewayCOMPLEX;html=1;whiteSpace=wrap;;overflow=visible;fontColor=black;", type:"GatewayCOMPLEX", pname:"GatewayCOMPLEX"};
        var UserTask = {src:projectPath+"images/models/bpmn/UserTask.PNG", wd:125, hg:50, style:"shape=UserTask;html=1;whiteSpace=wrap;;overflow=visible;fontColor=black;", type:"UserTask", pname:"UserTask"};
        var ServiceTask = {src:projectPath+"images/models/bpmn/ServiceTask.PNG", wd:125, hg:50, style:"shape=ServiceTask;html=1;whiteSpace=wrap;;overflow=visible;fontColor=black;", type:"ServiceTask", pname:"ServiceTask"};
        var transaction = {src:projectPath+"images/models/bpmn/transaction.PNG", wd:125, hg:50, style:"shape=transaction;html=1;whiteSpace=wrap;;overflow=visible;fontColor=black;", type:"transaction", pname:"Transaction"};
        var CallActivity = {src:projectPath+"images/models/bpmn/CallActivity.PNG", wd:125, hg:50, style:"shape=CallActivity;html=1;whiteSpace=wrap;;overflow=visible;fontColor=black;", type:"CallActivity", pname:"CallActivity"};
        var eventsubprocess = {src:projectPath+"images/models/bpmn/eventsubprocess.PNG", wd:125, hg:50, style:"shape=eventsubprocess;html=1;whiteSpace=wrap;;overflow=visible;fontColor=black;", type:"eventsubprocess", pname:"EventSubProcess"};
        var loopedsubprocess = {src:projectPath+"images/models/bpmn/loopedsubprocess.PNG", wd:125, hg:50, style:"shape=loopedsubprocess;html=1;whiteSpace=wrap;;overflow=visible;fontColor=black;", type:"loopedsubprocess", pname:"LoopedSubProcess"};
        var processtimer = {src:projectPath+"images/models/bpmn/processtimer.PNG", wd:125, hg:50, style:"shape=loopedsubprocess;html=1;whiteSpace=wrap;;overflow=visible;fontColor=black;", type:"processtimer", pname:"ProcessTimer"};
        var receive = {src:projectPath+"images/models/bpmn/receive.PNG", wd:125, hg:50, style:"shape=receive;html=1;whiteSpace=wrap;;overflow=visible;fontColor=black;", type:"receive", pname:"Receive"};
        var scriptTask = {src:projectPath+"images/models/bpmn/scriptTask.PNG", wd:125, hg:50, style:"shape=scriptTask;html=1;whiteSpace=wrap;;overflow=visible;fontColor=black;", type:"scriptTask", pname:"ScriptTask"};
        var sendTask = {src:projectPath+"images/models/bpmn/sendTask.PNG", wd:125, hg:50, style:"shape=sendTask;html=1;whiteSpace=wrap;;overflow=visible;fontColor=black;", type:"sendTask", pname:"SendTask"};
        var messageStart= {src:projectPath+"images/models/bpmn/start.PNG", wd:125, hg:50, style:"shape=start;html=1;whiteSpace=wrap;;overflow=visible;fontColor=black;", type:"Start", pname:"Start"};
        var Terminate= {src:projectPath+"images/models/bpmn/terminate.PNG", wd:125, hg:50, style:"shape=Terminate;html=1;whiteSpace=wrap;;overflow=visible;fontColor=white;", type:"Terminate", pname:"Terminate"};
        const Pool= {src:projectPath+"images/models/component/file.png", wd:500, hg:300, style:"shape=horizontalPool;;html=1;whiteSpace=wrap;;overflow=visible;fontColor=black;", type:"horizontalPool", pname:"HorizontalPool"};
        const Lane= {src:projectPath+"images/models/component/file.png", wd:500, hg:300, style:"shape=rectangle;fillColor=transparent;strokeWidth=3;rounded=0;arcSize=15;verticalAlign=text-top;fontColor=black;fontSize=20;fontStyle=1;", type:"Lane", pname:"Lane"};
       // Lane.style.name.visibility="hidden";
       var input = {src:projectPath+"images/models/bpmn/Elementdatainput.png", wd:50, hg:80, style:"shape=dataObjectInput;html=1;whiteSpace=wrap;;overflow=visible;fontColor=black;", type:"dataObjectInput", pname:"DataObjectInput"};
       var dataObject = {src:projectPath+"images/models/bpmn/Elementdataobject.png", wd:50, hg:80, style:"shape=dataObject;html=1;whiteSpace=wrap;;overflow=visible;fontColor=black;", type:"dataObject", pname:"DataObject"}; 
       var dataObjectCollection = {src:projectPath+"images/models/bpmn/Elementdataobjectcollection.png", wd:50, hg:80, style:"shape=dataObject;html=1;whiteSpace=wrap;;overflow=visible;fontColor=black;", type:"dataObjectCollection", pname:"DataObjectCollection"}; 
       var datastore = {src:projectPath+"images/models/bpmn/datastore.png", wd:50, hg:80, style:"shape=datastore;html=1;whiteSpace=wrap;;overflow=visible;fontColor=black;", type:"datastore", pname:"datastore"}; 
       var base= {src:projectPath+"images/models/component/file.png", wd:500, hg:300,style: "shape=rectangle;fillColor=transparent;strokeWidth=3;rounded=2;arcSize=15;verticalAlign=text-top;fontColor=black;fontSize=20;fontStyle=1;", type:"BaseCompositionModel", pname:"BaseCompositionModel"};
       const variant= {src:projectPath+"images/models/component/file.png", wd:500, hg:100, style:"shape=rectangle;fillColor=transparent;strokeWidth=3;rounded=2;arcSize=15;verticalAlign=text-top;fontColor=black;fontSize=20;fontStyle=1;", type:"Variant", pname:"Variant"};
       var elements=[];
        elements[0]=messageStart;
        elements[1]=end;
        elements[2]=task;
        elements[3]=message;
        elements[4]=GatewayEvent;
        elements[5]=GateWay;
        elements[6]=GateWayAnd;
        elements[7]=GateWayComplex;
        elements[8]=timer
        elements[9]=UserTask;
        elements[10]=ServiceTask;
        elements[11]=transaction;
        elements[12]=CallActivity;
        elements[13]=loopedsubprocess;
        elements[14]=processtimer;
        elements[15]=receive;
        elements[16]=scriptTask;
        elements[17]=sendTask;
        elements[18]=Terminate;
        elements[19]=Pool;
        elements[20]=Lane;
        elements[21]=input;
        elements[22]=dataObject;
        elements[23]=dataObjectCollection;
        elements[24]=datastore;
        elements[25]=base;
        elements[26]=variant;
        elements[27]=variantTask;
        elements[28]=eventsubprocess;
        elements.forEach(elem => {
          elem.style += textOpts
          if(["Gateway", "GatewayAND", "GatewayEvent", "GatewayCOMPLEX","TimerStart","Message"].includes(elem.pname)){
            elem.style += offsetLabelOpts;
          }
        });
        return elements;
    }
 
    function bpmn_attributes(){
    
                //get graph Root

        let attributes = [];
        attributes.push({
          "types": ["horizontalPool"],
          "custom_attributes": [{
            "name": "name",
            "def_value": ""
          }]
        });
        attributes.push({
          "types": ["UserTask"],
          "custom_attributes": [{
            "name": "Component",
            "def_value": ""
          }
        ,
        {  "name": "Fragment",
        "def_value": ""

       },
       {  "name": "Feature",
        "def_value": ""

       }]
        });
        attributes.push({
          "types": ["Task"],
          "custom_attributes": [{
            "name": "Component",
            "def_value": ""
          }
        ,
        {  "name": "Fragment",
        "def_value": ""

       },
       {  "name": "Feature",
        "def_value": ""

       }]
        });
        attributes.push({
          "types": ["VariantTask"],
          "custom_attributes": [{
            "name": "Component",
            "def_value": "",
           
          }
        ,
          {  "name": "Fragment",
          "def_value": ""

         },
         {  "name": "Feature",
          "def_value": ""

         }
        ]
        });
      
        return attributes;
    }
    function component_properties_styles(){
      let styles={};
      //let att=[];
    let	att=["Environment Component","User Context Component","Feature Component","Service Component"];
      styles={
        "component":[{
          "attribute":"Component_type",
          "input_type":"select",
          //"input_values":["Environment Component","User Context Component","Feature Component","Service Component"],
          "input_values":att,
          "def_value":"Feature Component"}
        
        ]}
        return styles;
    }
  
    function BPMNPropertiesStyles(){
  
      const model = graph.getModel();
     // console.log(model);
                //get graph Root
      const par=model.cells.component.children;
      console.log(par);
      const feat=model.cells.feature.children;
      let compo=[];
      let frag=[];
      let featureSet=[];
if(feat!==null)
{
     // const parent = model.cells.component.children[0].value.attributes.label.value;
      //let bpmnLayer = model.getCell("component"); 
    
      let f=0;
      let i=0;
      let j=0;
      feat.forEach(cell => {
        if(cell.value.attributes.label!==undefined)
        {if(cell.value.localName!=='root')
        {featureSet[f]=cell.value.attributes.label.value;
        f=f+1;}
        
        }}
        );}
        if(par!==null)
        {
          let f=0;
          let i=0;
          let j=0;
      par.forEach(cell => {
if(cell.value.attributes.label!==undefined)
{if(cell.value.localName==='component')
{compo[i]=cell.value.attributes.label.value;
i=i+1;}
else if(cell.value.localName==='fragment')
{frag[j]=cell.value.attributes.label.value;
  j=j+1;}
}}
);
}
      console.log(par);
        let styles = {};
      
        styles={
          "horizontalPool" : [{
          "attribute":"name",
          "input_type":"text",
          "onchange": setDisplayName
        }],
        "VariantTask": [{
          "attribute":"Component",
          "input_type":"select",
          "input_values":compo,
          "def_value":""
        }
        ,
        {
          "attribute":"Fragment",
          "input_type":"select",
          "input_values":frag,
          "def_value":""
        },
        {
          "attribute":"Feature",
          "input_type":"select",
          "input_values":featureSet,
          "def_value":""
        }
      
      
      ],
      "Task": [{
        "attribute":"Component",
        "input_type":"select",
        "input_values":compo,
        "def_value":""
      }
      ,
      {
        "attribute":"Fragment",
        "input_type":"select",
        "input_values":frag,
        "def_value":""
      },
      {
        "attribute":"Feature",
        "input_type":"select",
        "input_values":featureSet,
        "def_value":""
      }
    
    
    ],
    "UserTask": [{
      "attribute":"Component",
      "input_type":"select",
      "input_values":compo,
      "def_value":""
    }
    ,
    {
      "attribute":"Fragment",
      "input_type":"select",
      "input_values":frag,
      "def_value":""
    },
    {
      "attribute":"Feature",
      "input_type":"select",
      "input_values":featureSet,
      "def_value":""
    }
  
  
  ]
    };
        return styles;
      }

      //display name
      function setDisplayName(){
        const currentCell = graph.getModel().getCell(this.name);
        if(currentCell.getAttribute('type') === 'horizontalPool'){
          const nameContainer = currentCell.getChildAt(0);
          graph.getModel().beginUpdate();
            try{
              let edit = new mxCellAttributeChange(
                nameContainer, 'label',
                this.value);
              graph.getModel().execute(edit);
            }
            finally{
              graph.getModel().endUpdate();
            }
        }
      }
      function setDisplayFeature(){
        const currentCell = graph.getModel().getCell(this.name);
        console.log(currentCell);
        if(currentCell.getAttribute('type') === 'VariantTask'){
          const nameContainer = currentCell.getChildAt(0);
          graph.getModel().beginUpdate();
            try{
              let edit = new mxCellAttributeChange(
                nameContainer, 'label',
                this.value);
              graph.getModel().execute(edit);
            }
            finally{
              graph.getModel().endUpdate();
            }
        }
      }
    
}

export default bpmn_main
