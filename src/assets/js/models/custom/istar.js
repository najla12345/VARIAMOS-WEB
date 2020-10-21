let istarMain = function istarMain (graph)
{
  istarCustomMarkers();
  istarCustomEvents();
  istarCustomGraphOverrides();
  istarConstraints();
	var data={};
	data["m_type"]="normal"; //custom type
	data["m_elements"]=istarElements(); //custom elements
  data["m_attributes"]=istarAttributes(); //custom attributes
  data["m_relations"]=istarRelations(); //custom relations
  data["m_properties_styles"]=istarPropertiesStyles(); //custom properties styles
  data["m_labels"]=null; //custom labels
  data["m_constraints_ic"]=istarConstraintsInCreation();
  data["m_clon_cells"]=null; //custom clon cells
  data["m_relation_styles"]=istarRelationStyles();
	return data;
	
	function istarConstraints(){
    graph.multiplicities=[]; //reset multiplicities
    /*
		graph.multiplicities.push(new mxMultiplicity(
			true, "component", null, null, 0, 0, null,
			"Invalid connection",
			"Only shape targets allowed"));
		graph.multiplicities.push(new mxMultiplicity(
			true, "file", null, null, 0, 1, ["component"],
			"Only 1 target allowed",
      "Only shape targets allowed"));
    */
   //Only allow one outgoing connection out of a dependum
   graph.multiplicities.push(new mxMultiplicity(true,"goal","dependum","true",0,null,
      ["secconstraint"],
      "Only 1 outgoing connection allowed","Only shape targets allowed1"));
    graph.multiplicities.push(new mxMultiplicity(true,"goal","dependum","true",0,1,
      ["actor","agent","role","goal","quality","task","resource"],
      "Only 1 outgoing connection allowed","Only shape targets allowed2"));
    graph.multiplicities.push(new mxMultiplicity(true,"quality","dependum","true",0,1,
      ["actor","agent","role","goal","quality","task","resource","secconstraint"],
      "Only 1 outgoing connection allowed","Only shape targets allowed"));
    graph.multiplicities.push(new mxMultiplicity(true,"task","dependum","true",0,1,
      ["actor","agent","role","goal","quality","task","resource","secconstraint"],
      "Only 1 outgoing connection allowed","Only shape targets allowed"));
    graph.multiplicities.push(new mxMultiplicity(true,"resource","dependum","true",0,1,
      ["actor","agent","role","goal","quality","task","resource","secconstraint"],
      "Only 1 outgoing connection allowed","Only shape targets allowed"));
    //Well formed relationships should, for instance, disallow direct/indirect connections between
    //Goal-D, Resource-D, Task-D, Quality-D
    //Only allow one incoming connection into a dependum
    graph.multiplicities.push(new mxMultiplicity(false,"goal","dependum","true",0,1,
      ["actor","agent","role","goal","quality","task","resource","secconstraint"],
      "Only 1 incoming connection allowed","Only shape targets allowed"));
    graph.multiplicities.push(new mxMultiplicity(false,"quality","dependum","true",0,1,
      ["actor","agent","role","goal","quality","task","resource","secconstraint"],
      "Only 1 incoming connection allowed","Only shape targets allowed"));
    graph.multiplicities.push(new mxMultiplicity(false,"task","dependum","true",0,1,
      ["actor","agent","role","goal","quality","task","resource","secconstraint"],
      "Only 1 incoming connection allowed","Only shape targets allowed"));
    graph.multiplicities.push(new mxMultiplicity(false,"resource","dependum","true",0,1,
      ["actor","agent","role","goal","quality","task","resource","secconstraint"],
      "Only 1 incoming connection allowed","Only shape targets allowed"));
    /* //Enforce Relationship Orientation
    graph.multiplicities.push(new mxMultiplicity(true,"goal","dependum","false",0,0,
      ["secconstraint"],
      "Restrictions must originate from Constraints","Only shape targets allowed", true)); */
    
  }
  
  function istarCustomMarkers(){
    //It seems pe is the location where the "arrow" should begin.
    //unitX and unitY seems to be the x,y value associated with the angle that would 
    //be made on a unit circle if the edge were the hypothenuse of a triangle on a unit circle.
    //Though still somewhat mysterious, this has been adapted from https://jgraph.github.io/mxgraph/javascript/examples/markers.html
    //so that it creates a straight line through the arrow.
    mxMarker.addMarker('dash', function(canvas, shape, type, pe, unitX, unitY, size, source, sw, filled){
      let nx = unitX * (size + sw + 10);
      let ny = unitY * (size + sw + 10);

      return function() {
        canvas.begin();
        let x1 = pe.x - nx / 2 - ny / 2;
        let y1 = pe.y - ny / 2 + nx / 2;
        canvas.moveTo(x1, y1);
        let x2 = pe.x + ny / 2 -  nx / 2;
        let y2 = pe.y - ny / 2 - nx / 2;
        canvas.lineTo(x2, y2);
        canvas.stroke();
      }
    })

    mxMarker.addMarker('capitald1', function(canvas, shape, type, pe, unitX, unitY, size, source, sw, filled){
      let nx = unitX * (size + sw + 10);
      let ny = unitY * (size + sw + 10);
      let init = {x:shape.bounds.x, y:shape.bounds.y};
      let midX = (init.x + pe.x)/2;
      let midY = (init.y + pe.y)/2;
      let count = 0;

      return function() {
        console.log("---CALLSTART----")
        console.log('nx :', nx);
        console.log('ny :', ny);
        console.log('size :', size);
        console.log('sw :', sw);
        console.log('unitX :', unitX);
        console.log('unitY :', unitY);
        console.log('(size + sw + 10) :', (size + sw + 10));
        console.log('init :', init);
        console.log('pe :', pe);
        console.log('midX :', midX);
        console.log('midY :', midY);
        console.log('shape :', shape.bounds);
        console.log('++count :', ++count);
        console.log("---CALLEND----")
        canvas.begin();
        let x1 = (pe.x - nx / 2 - ny / 2);
        let y1 = (pe.y - ny / 2 + nx / 2);
        canvas.moveTo(x1, y1);
        let x2 = (pe.x + ny / 2 - nx / 2);
        let y2 = (pe.y - ny / 2 - nx / 2);
        canvas.lineTo(x2,y2);
        canvas.moveTo(x2,y2);
        canvas.lineTo(midX,midY);
        canvas.stroke();
        canvas.close();
      }
    })
  };

  //Temporary Workaround to the setup Events change...
  function istarCustomEvents(){
    //This function fires when a cell is moved and makes sure that the dependum custom icon is correctly oriented.
    graph.addListener(mxEvent.MOVE_CELLS, reorientElement);
  };

  function istarCustomGraphOverrides(){
    let cellLabelChanged = graph.cellLabelChanged;
    graph.cellLabelChanged = function(cell, newValue, autoSize)
    {
      if (mxUtils.isNode(cell.value))
      {
        // Clones the value for correct undo/redo
        var elt = cell.value.cloneNode(true);
        elt.setAttribute('label', newValue);
        newValue = elt;
      }

      cellLabelChanged.apply(this, arguments);
    };

    graph.isHtmlLabel = function(cell){
      return mxUtils.isNode(cell.value);
    }

    graph.isCellSelectable = function(cell)
    {
      let state = this.view.getState(cell);
      let style = (state != null) ? state.style : this.getCellStyle(cell);

      return this.isCellsSelectable() && !this.isCellLocked(cell) && style['selectable'] != 0;
    };

    graph.getEdgeValidationError = function(edge, source, target)
    {
      if (edge != null && !this.isAllowDanglingEdges() && (source == null || target == null))
      {
        return '';  
      }

      if (edge != null && this.model.getTerminal(edge, true) == null &&
      this.model.getTerminal(edge, false) == null)	
      {
        return null;
      }

      // Checks if we're dealing with a loop
      if (!this.allowLoops && source == target && source != null)
      {
        return '';
      }

      // Checks if the connection is generally allowed
      if (!this.isValidConnection(source, target))
      {
        return '';
      }

      if (source != null && target != null)
      {
        var error = '';

        // Checks if the cells are already connected
        // and adds an error message if required			
        if (!this.multigraph)
        {
          var tmp = this.model.getEdgesBetween(source, target, true);
          
          // Checks if the source and target are not connected by another edge
          if (tmp.length > 1 || (tmp.length == 1 && tmp[0] != edge))
          {
            error += (mxResources.get(this.alreadyConnectedResource) ||
              this.alreadyConnectedResource)+'\n';
          }
        }

        // Gets the number of outgoing edges from the source
        // and the number of incoming edges from the target
        // without counting the edge being currently changed.
        var sourceOut = this.model.getDirectedEdgeCount(source, true, edge);
        var targetIn = this.model.getDirectedEdgeCount(target, false, edge);

        let prevErr = error;
        // Checks the change against each multiplicity rule
        if (this.multiplicities != null)
        {
          for (var i = 0; i < this.multiplicities.length; i++)
          {
            var err = this.multiplicities[i].check(this, edge, source,
              target, sourceOut, targetIn);
            
            if (err != null)
            {
              error += err;
            }
          }
          if(error.includes('valid')){
            error = prevErr;
          }
        }

        // Validates the source and target terminals independently
        var err = this.validateEdge(edge, source, target);

        if (err != null)
        {
          error += err;
        }
            
        return (error.length > 0) ? error : null;
      }

      return (this.allowDanglingEdges) ? null : '';
    };

    //We must override the prototype
    mxMultiplicity.prototype.check = function(graph, edge, source, target, sourceOut, targetIn)
    {
      var error = '';

      if ((this.source && this.checkTerminal(graph, source, edge)) ||
        (!this.source && this.checkTerminal(graph, target, edge)))
      {
        if (this.countError != null && 
          ((this.source && (this.max == 0 || (sourceOut >= this.max))) ||
          (!this.source && (this.max == 0 || (targetIn >= this.max)))))
        {
          error += this.countError + '\n';
        }

        if (this.validNeighbors != null && this.typeError != null && this.validNeighbors.length > 0)
        {
          var isValid = this.checkNeighbors(graph, edge, source, target);

          if (!isValid)
          {
            error += this.typeError + '\n';
          }
          else if(error === '')
          {
            error = 'valid';
          }
        }
      }
      
      return (error.length > 0) ? error : null;
    };
  }

	function istarElements(){
    let actor = 
      {src:projectPath+"images/models/istar/Actor.png", wd:100, hg:100, 
        style:"shape=actor;perimeter=ellipsePerimeter;html=1;whiteSpace=wrap;overflow=visible;fontColor=black;", 
        type:"actor", pname:"Actor"};
    let agent = 
      {src:projectPath+"images/models/istar/Agent.png", wd:100, hg:100, 
        style:"shape=agent;perimeter=ellipsePerimeter;html=1;whiteSpace=wrap;overflow=visible;fontColor=black;", 
        type:"agent", pname:"Agent"};
    let role = 
      {src:projectPath+"images/models/istar/Role.png", wd:100, hg:100, 
        style:"shape=role;perimeter=ellipsePerimeter;html=1;whiteSpace=wrap;overflow=visible;fontColor=black;", 
        type:"role", pname:"Role"};
    let goal = 
      {src:projectPath+"images/models/istar/Goal.png", wd:125, hg:50, 
        style:"shape=goal;html=1;whiteSpace=wrap;overflow=visible;fontColor=black;", 
        type:"goal", pname:"Goal"};
    let quality = 
      {src:projectPath+"images/models/istar/Quality.png", wd:125, hg:50, 
        style:"shape=quality;html=1;whiteSpace=wrap;overflow=visible;fontColor=black;", 
        type:"quality", pname:"Quality"};
    let task = 
      {src:projectPath+"images/models/istar/Task.png", wd:125, hg:50, 
        style:"shape=task;html=1;whiteSpace=wrap;;overflow=visible;fontColor=black;", 
        type:"task", pname:"Task"};
    let resource = 
      {src:projectPath+"images/models/istar/Resource.png", wd:125, hg:50, 
      style:"shape=resource;html=1;whiteSpace=wrap;overflow=visible;fontColor=black;", 
      type:"resource", pname:"Resource"};
    
    //tests
    const securityConstraint = 
      {src:projectPath+"images/models/istar/sconstraint.png", wd:100, hg:100, 
        style:"shape=secconstraint;html=1;whiteSpace=wrap;overflow=visible;fontColor=black;", 
        type:"secconstraint", pname:"Security Constraint"};
    const securityObjective = 
      {src:projectPath+"images/models/istar/sobjective.png", wd:100, hg:100, 
        style:"shape=secobjective;html=1;whiteSpace=wrap;overflow=visible;fontColor=black;", 
        type:"secobjective", pname:"Security Objective"};
    const securityMechanism = 
      {src:projectPath+"images/models/istar/smechanism.png", wd:125, hg:50, 
        style:"shape=secmechanism;html=1;whiteSpace=wrap;overflow=visible;fontColor=black;", 
        type:"secmechanism", pname:"Security Mechanism"};
    const threat = 
      {src:projectPath+"images/models/istar/threat.png", wd:100, hg:100, 
        style:"shape=threat;html=1;whiteSpace=wrap;overflow=visible;fontColor=black;", 
        type:"threat", pname:"Threat"};
    const attack = 
      {src:projectPath+"images/models/istar/attack.png", wd:100, hg:100, 
        style:"shape=attack;html=1;whiteSpace=wrap;overflow=visible;fontColor=black;", 
        type:"attack", pname:"Attack"};
    const vulnerability = 
      {src:projectPath+"images/models/istar/vulnerability.png", wd:125, hg:50, 
        style:"shape=vulnerability;html=1;whiteSpace=wrap;overflow=visible;fontColor=black;", 
        type:"vulnerability", pname:"Vulnerability"};
    
    const organization = 
      {src:projectPath+"images/models/component/file.png", wd:250, hg:250, 
        style:"shape=rectangle;fillColor=none;dashed=1;dashPattern=10 10;rounded=1;arcSize=15;verticalAlign=top;fontColor=black;fontSize=20;fontStyle=1;", 
        type:"organization", pname:"Organization"};

    let elements=[];
    //IStar
		elements.push(actor);
    elements.push(agent);
    elements.push(role);
    elements.push(goal);
    elements.push(quality);
    elements.push(task);
    elements.push(resource);
    //SecureTropos
    elements.push(securityConstraint);
    elements.push(securityObjective);
    elements.push(securityMechanism);
    elements.push(threat);
    elements.push(attack);
    elements.push(vulnerability);
    //Higher-Level Secure Tropos
    elements.push(organization);
   
		return elements;
	}

	function istarAttributes(){
    let attributes=[];
		attributes.push({
			"types":["actor","role","agent"],
			"custom_attributes":[{
				"name":"boundary",
				"def_value":"false"
			}]
    });
    /* attributes.push({
      "types":["goal","quality","task","resource"],
      "custom_attributes":[{
        "name":"dependum",
        "def_value":"true"
      }]
    }); */
		return attributes;
  }

  function istarRelations(){
    let relations=[];
    //Actor relations
    relations.push({
      "source":["actor","agent","role"],
      "rel_source_target":"and",
      "target":["actor","agent","role"],
      "attributes":[{
        "name":"relType",
        "def_value":"participates-in"
      }]
    });
    //Contribution
    relations.push({
      "source":["goal","quality","task","resource"],
      "rel_source_target":"and",
      "target":["quality"],
      "attributes":[{
        "name":"relType",
        "def_value":"help"
      }]
    });
    //Refinement
    relations.push({
      "source":["goal","task"],
      "rel_source_target":"and",
      "target":["goal","task"],
      "attributes":[{
        "name":"refinement",
        "def_value":"and"
      }]
    });
    //Restriction
    relations.push({
      "source":["secconstraint"],
      "rel_source_target":"and",
      "target":["goal"],
      "attributes":[{
        "name":"relType",
        "def_value":"restricts"
      }]
    });
    //Security Objective -> Security Constraint "Satisfies"
    relations.push({
      "source":["secobjective"],
      "rel_source_target":"and",
      "target":["secconstraint"],
      "attributes":[{
        "name":"relType",
        "def_value":"satisfies"
      }]
    });
    //Security Mechanism -> Security Objective "Implements"
    relations.push({
      "source":["secmechanism"],
      "rel_source_target":"and",
      "target":["secobjective"],
      "attributes":[{
        "name":"relType",
        "def_value":"implements"
      }]
    });
    //Security Mechanism -> Vulnerability "Protects"
    relations.push({
      "source":["secmechanism"],
      "rel_source_target":"and",
      "target":["vulnerability"],
      "attributes":[{
        "name":"relType",
        "def_value":"protects"
      }]
    });
    //Threat -> Goal "Impacts"
    relations.push({
      "source":["threat"],
      "rel_source_target":"and",
      "target":["goal","quality","task","resource"],
      "attributes":[{
        "name":"relType",
        "def_value":"impacts"
      }]
    });
    //Vulnerability -> Goal "Affects"
    relations.push({
      "source":["vulnerability"],
      "rel_source_target":"and",
      "target":["goal","quality","task","resource"],
      "attributes":[{
        "name":"relType",
        "def_value":"affects"
      }]
    });
    //Attack -> Vulnerability "Attacks"
    relations.push({
      "source":["attack"],
      "rel_source_target":"and",
      "target":["vulnerability"],
      "attributes":[{
        "name":"relType",
        "def_value":"attacks"
      }]
    });
    return relations
  }

  function istarRelationStyles(){
    let relations=[];
    relations.push({
      "source":["actor","agent","role"],
      "rel_source_target":"and",
      "target":["actor","agent","role"],
      "style":"endArrow=open;"
    });
    relations.push({
      "source":["actor","agent","role","goal","quality","task","resource"],
      "rel_source_target":"and",
      "target":[
        "goal-dependum","quality-dependum","task-dependum","resource-dependum"
      ],
      "style":"endArrow=none;"
      /* "style":"endArrow=capitald;" */
    });
    relations.push({
      "source":[
        "goal-dependum","quality-dependum","task-dependum","resource-dependum"
      ],
      "rel_source_target":"and",
      "target":["actor","agent","role","goal","quality","task","resource"],
      "style":"endArrow=none;"
      /* "style":"endArrow=capitald;" */
    });
    //Contribution  
    relations.push({
      "source":["goal","quality","task","resource"],
      "rel_source_target":"and",
      "target":["quality"],
      "style":"endArrow=open;"
    });
    //Refinement
    relations.push({
      "source":["goal","task"],
      "rel_source_target":"and",
      "target":["goal","task"],
      "style":"endArrow=dash;"
    });
    //Qualification
    relations.push({
      "source":["quality"],
      "rel_source_target":"and",
      "target":["goal","task","resource"],
      "style":"dashed=1;endArrow=none;"
    });
    //NeededBy
    relations.push({
      "source":["resource"],
      "rel_source_target":"and",
      "target":["task"],
      "style":"endArrow=oval;endFill=1;"
    });
    //Security Constraint -> Goal "Restricts"
    relations.push({
      "source":["secconstraint"],
      "rel_source_target":"and",
      "target":["goal"],
      "style":"endArrow=none;"
    })
    //Security Objective -> Security Constraint "satisfies"
    relations.push({
      "source":["secobjective"],
      "rel_source_target":"and",
      "target":["secconstraint"],
      "style":"endArrow=none;"
    })
    //Security Mechanism -> Security Objective "Implements"
    relations.push({
      "source":["secmechanism"],
      "rel_source_target":"and",
      "target":["secobjective"],
      "style":"endArrow=none;"
    });
    //Security Mechanism -> Vulnerability "Protects"
    relations.push({
      "source":["secmechanism"],
      "rel_source_target":"and",
      "target":["vulnerability"],
      "style":"endArrow=none;"
    });
    //Threat -> Goal "Impacts"
    relations.push({
      "source":["threat"],
      "rel_source_target":"and",
      "target":["goal","task","resource","quality"],
      "style":"dashed=1;endArrow=open;"
    });
    //Vulnerability -> Goal "Affects"
    relations.push({
      "source":["vulnerability"],
      "rel_source_target":"and",
      "target":["goal","quality","task","resource"],
      "style":"endArrow=none;"
    });
    //Attack -> Vulnerability "Attacks"
    relations.push({
      "source":["attack"],
      "rel_source_target":"and",
      "target":["vulnerability"],
      "style":"dashed=1;endArrow=none;"
    });
    //Threat -> Attack
    relations.push({
      "source":["threat"],
      "rel_source_target":"and",
      "target":["attack"],
      "style":"endArrow=block;"
    });
    //Goal-D, Resource-D, Task-D, Quality-D -> Security Constraint
    relations.push({
      "source":[
        "goal-dependum","quality-dependum","task-dependum", "resource-dependum",
        "goal","quality","task","resource","actor","agent","role"
      ],
      "rel_source_target":"and",
      "target":["secconstraint-dependum"],
      "style":"endArrow=none;"
    });
    //Security Constraint -> Goal, Resource, Task, Quality, Actor, Resource, Role
    relations.push({
      "source":["secconstraint-dependum"],
      "rel_source_target":"and",
      "target":[
        "goal","quality","task","resource","goal-dependum", "quality-dependum",
        "task-dependum", "resource-dependum", "actor", "agent", "role"
      ],
      "style":"endArrow=none;"
    });
    return relations;
  }
  
  function istarPropertiesStyles(){
    return {
      //Actor
      "actor":[{
        "attribute":"boundary",
        "input_type":"checkbox",
        "onchange":actorboundary
      }],
      //Actor as source for a relation
      "rel_actor_actor":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["participates-in","is-a"],
      }],
      "rel_actor_agent":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["participates-in"]
      }],
      "rel_actor_role":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["participates-in"]
      }],
      //Agent
      "agent":[{
        "attribute":"boundary",
        "input_type":"checkbox",
        "onchange":actorboundary
      }],
      //Agent as source for a relation
      "rel_agent_actor":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["participates-in"]
      }],
      "rel_agent_agent":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["participates-in"]
      }],
      "rel_agent_role":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["participates-in"]
      }],
      //Role
      "role":[{
        "attribute":"boundary",
        "input_type":"checkbox",
        "onchange":actorboundary
      }],
      //Role as source for a relation
      "rel_role_actor":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["participates-in"]
      }],
      "rel_role_agent":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["participates-in"]
      }],
      "rel_role_role":[{
        "attribute": "relType",
        "input_type": "select",
        "input_values":["participates-in","is-a"]
      }],
      //Contribution relations
      "rel_goal_quality":[{
        "attribute":"relType",
        "input_type":"select",
        "input_values":["help","make","hurt","break"]
      }],
      "rel_quality_quality":[{
        "attribute":"relType",
        "input_type":"select",
        "input_values":["help","make","hurt","break"]
      }],
      "rel_task_quality":[{
        "attribute":"relType",
        "input_type":"select",
        "input_values":["help","make","hurt","break"]
      }],
      "rel_resource_quality":[{
        "attribute":"relType",
        "input_type":"select",
        "input_values":["help","make","hurt","break"]
      }],
      //Refinement
      "rel_goal_task":[{
        "attribute":"refinement",
        "input_type":"select",
        "input_values":["and","or"],
        "onchange":refinementStyle
      }],
      "rel_goal_goal":[{
        "attribute":"refinement",
        "input_type":"select",
        "input_values":["and","or"],
        "onchange":refinementStyle
      }],
      "rel_task_task":[{
        "attribute":"refinement",
        "input_type":"select",
        "input_values":["and","or"],
        "onchange":refinementStyle
      }],
      "rel_task_goal":[{
        "attribute":"refinement",
        "input_type":"select",
        "input_values":["and","or"],
        "onchange":refinementStyle
      }], 
      //Security Constraint -> Goal
      "rel_secconstraint_goal":[{
        "attribute":"relType",
        "input_type":"select",
        "input_values":["restricts"]
      }],
      //Security Objective -> Security Constraint
      "rel_secobjective_secconstraint":[{
        "attribute":"relType",
        "input_type":"select",
        "input_values":["satisfies"]
      }],
      //Security Mechanism -> Security Objective "Implements"
      "rel_secmechanism_secobjective":[{
        "attribute":"relType",
        "input_type":"select",
        "input_values":["implements"]
      }],
      //Security Mechanism -> Vulnerability "Protects"
      "rel_secmechanism_vulnerability":[{
        "attribute":"relType",
        "input_type":"select",
        "input_values":["protects"]
      }],
      //Threat -> Goal "Impacts"
      "rel_threat_goal":[{
        "attribute":"relType",
        "input_type":"select",
        "input_values":["impacts"]
      }],
      //Vulnerability -> Goal "Affects"
      "rel_vulnerability_goal":[{
        "attribute":"relType",
        "input_type":"select",
        "input_values":["affects"]
      }],
      //Attack -> Vulnerability "Attacks"
      "rel_attack_vulnerability":[{
        "attribute":"relType",
        "input_type":"select",
        "input_values":["attacks"]
      }],
    }
  }

  function istarCustomMethods(pos){
		let methods=[]
		methods.push(function(_prototype, cell){
      if(cell !== null && cell.getAttribute('type') !== "organization"){
        alert("you may not add actor within another\'s boundary")
        return false;
      }
      //console.log(JSON.stringify(prototype, null, 2));
      //console.log(JSON.stringify(cell !== null ? cell.getValue()['type'] : null,null, 2));
      return true;
    });
		return methods[pos];
	}

  function istarConstraintsInCreation(){
		let constraints_ic={};
		constraints_ic={
      "actor":istarCustomMethods(0),
      "agent":istarCustomMethods(0),
      "role":istarCustomMethods(0)
		};
		return constraints_ic;
	}

  function actorboundary(){
    const uuidv1 = require('uuid/v1');
    //this.name points to the id of the cell that contains the element.  
    const currentCell = graph.getModel().getCell(this.name);
    const parent = currentCell.getParent();

    let checked = currentCell.getAttribute('boundary');
    checked = checked === 'true' ? 'false' : 'true';

    currentCell.setAttribute('boundary', checked);
    //graph.stopEditing(false);
    graph.getModel().beginUpdate();
    try {
      if (checked === 'true') {
        const boundaryCell = 
          graph.insertVertex(parent, uuidv1(), '', currentCell.getGeometry().x, 
            currentCell.getGeometry().y, 100, 100, 'shape=rectangle;fillColor=none;dashed=1;dashPattern=10 10;rounded=1;arcSize=15;'
          );
        boundaryCell.setConnectable(false);
        boundaryCell.setValue({'type':'boundary'});
        graph.groupCells(boundaryCell, 0, [currentCell]);
        const geo = currentCell.getGeometry();
        geo.x = 0;
        geo.y = 0;
        graph.setCellStyles(mxConstants.STYLE_MOVABLE, '0', [currentCell])
        //Set the size of the boundary.
        let boundaryH = 300;
        let boundaryW = 300;
        //If the boundary was already set before, set it to the old limits.
        if(currentCell.boundarySize !== undefined){
          boundaryH = currentCell.boundarySize.height;
          boundaryW = currentCell.boundarySize.width;
          delete currentCell.boundarySize;
        }
        //Apply the changes. The bounds indicate the absolute shape of the cell.
        const bounds = 
          new mxRectangle(boundaryCell.getGeometry().x, 
            boundaryCell.getGeometry().y, boundaryW, boundaryH);
        graph.resizeCell(boundaryCell, bounds);
        //Find any edges that were promoted and remove them.
        const edgeCount = currentCell.getEdgeCount();
        const promotedEdges = [];
        if (edgeCount > 0){
          for(let i = 0; i < edgeCount; i++){
            const edge = currentCell.getEdgeAt(i);
            if(edge.promotedEdge !== undefined && edge.promotedEdge){
              promotedEdges.push(edge);
            }
          }
        }
        //Remove the edges that were promoted.
        graph.removeCells(promotedEdges);
        //If there were elements that existed previously, reconstruct them.
        const newCells = new Map;
        if(currentCell.elements !== undefined){
          //key is the id of the old cell
          //value contains the cell.
          for(let [key, value] of currentCell.elements){
            const cells = graph.importCells([value], 0,0, boundaryCell);
            //This ties the old cell's id to the new one's so that the relations can be reconstructed.
            newCells.set(key, cells[0].getId());
            //graph.insertVertex(boundaryCell, null, child.getValue(), childGeo.x, childGeo.y, childGeo.width, childGeo.height, child.getStyle());
          }
          delete currentCell.elements;
        }
        const done = [];
        const boundaryGeo = boundaryCell.getGeometry();
        if(currentCell.relations !== undefined){
          for(let [key, value] of currentCell.relations){
            console.log('key :', key);
            console.log('value :', value);
            //Within value is every edge coming or going from the <<old>> cell given by key.
            value.forEach(edge => {
              //For both the terminals, check if the reference is one of the cells that are destroyed, otherwise it is the normal one.
              const sourceCell = 
                graph.getModel().getCell(
                  newCells.has(edge.source) ? 
                    newCells.get(edge.source) : edge.source
                );
              const srcId = sourceCell.getId();
              const targetCell = 
                graph.getModel().getCell(
                  newCells.has(edge.target) ? 
                    newCells.get(edge.target) : edge.target
                );
              const tgtId = targetCell.getId();
              //If the relation was already added, skip all of the code to add it.
              if(!done.some(pair => {
                return (pair.t1 === srcId && pair.t2 === tgtId) || 
                  (pair.t1 === tgtId && pair.t2 === tgtId);
              })){
                console.log('sourceCell :', sourceCell);
                console.log('targetCell :', targetCell);
                const newEdge = 
                  graph.insertEdge(
                    boundaryCell, uuidv1(), edge.value, sourceCell, targetCell, 
                    edge.style
                  );
                if(newEdge.getAttribute('type').includes('dependum') || 
                  edge.children !== null){
                  //Gather the state information of both the source and target elements.
                  const sourceState = graph.view.getState(sourceCell);
                  const sourceGeo = sourceCell.getGeometry();
                  const targetState = graph.view.getState(targetCell);
                  const targetGeo = targetCell.getGeometry();
                  //Obtain the coordinates and offset to the center of the bounding rectangle.
                  //If the state is undefined, it is because it has just been created.
                  const initX = 
                    sourceState !== undefined ? 
                      (sourceState.origin.x + (sourceGeo.width/2)) : 
                      (boundaryGeo.x + sourceGeo.getCenterX());
                  const initY = 
                    sourceState !== undefined ? 
                      (sourceState.origin.y + (sourceGeo.height/2)) : 
                      (boundaryGeo.y + sourceGeo.getCenterY());
                  const destX = 
                    targetState !== undefined ? 
                      (targetState.origin.x + (targetGeo.width/2)) : 
                      (boundaryGeo.x + targetGeo.getCenterX());
                  const destY = 
                    targetState !== undefined ? 
                      (targetState.origin.y + (targetGeo.height/2)) : 
                      (boundaryGeo.y + targetGeo.getCenterY());
                  //Calculate the angle given by the edge in its current orientation.
                  const angle = 
                    (Math.atan2(destY-initY,destX-initX) * 
                      (180/Math.PI)).toFixed(0);
                  //Insert a new element onto the the edge with the calculated angle.
                  const childPresent = (edge.children !== null);
                  const style = 
                    childPresent ? 
                      edge.children[0].getStyle() : 
                      'shape=capitald;fillColor=#FFFFFF;rotation='
                        +angle+';selectable=0;';
                  const {height: edgeChildGeoX, width: edgeChildGeoY} = 
                    childPresent ? 
                      edge.children[0].getGeometry() : {height: 20, width: 20};
                  const capitald = 
                    graph.insertVertex(
                      newEdge, uuidv1(), null, 0, 0, edgeChildGeoX, 
                      edgeChildGeoY, style
                    );
                  //Set the offset of the element so that it is centered. 
                  capitald.geometry.offset = 
                    childPresent ? 
                      edge.children[0].getGeometry().offset : 
                      new mxPoint(-10, -10);
                  capitald.geometry.relative = true;
                  //Set the element as unconnectable.
                  capitald.connectable = false;
                }
                newEdge.setGeometry(edge.geo);
                done.push({t1:sourceCell.getId(),t2:targetCell.getId()});
              }
            })
          }
        }
      } else {
        //get the references to the boundary cell and the main graph.
        const boundaryCell = parent;
        const mainparent = boundaryCell.getParent();
        const innerElementCount = boundaryCell.getChildCount();
        const innerElements = new Map;
        const relations = new Map;
        //get the position information from the parent (and its references)
        const parentGeo = boundaryCell.getGeometry();
        const currentGeo = currentCell.getGeometry();
        //There are other elements inside
        //get their references.
        if(innerElementCount > 1){
          for(let i = 0; i < innerElementCount; i++){
            const child = boundaryCell.getChildAt(i);
            if(child !== currentCell && !child.isEdge()){
              //With this logic, we obtain the important values of these edges,
              //then we store the information in an array.
              const edgeCount = child.getEdgeCount();
              const innerEdges = [];
              if (edgeCount > 0){
                for(let i = 0; i < edgeCount; i++){
                  const edge = child.getEdgeAt(i);
                  const value = edge.getValue();
                  const source = edge.getTerminal(true).getId();
                  const isSource = source === child.getId();
                  const target = edge.getTerminal(false).getId();
                  const style = edge.getStyle();
                  const type = edge.getAttribute('type');
                  const children = 
                    edge.getChildCount() > 0 ? [...edge.children] : null;
                  const geo = edge.getGeometry();
                  innerEdges.push(
                    {value, isSource, source, target, style, type, children, geo}
                  );
                }
              }
              //Now we map every id to its corresponding cell and edges so that we can reconstruct it later.
              innerElements.set(child.getId(), child.clone());
              relations.set(child.getId(),innerEdges);
              //innerElements.push({child: child.clone(), id: child.getId(), edges: innerEdges});
            }
          }
          //We will now do edge promotion based on what was calculated before.
          for(let [_key, value] of relations){
            //We will now iterate over the inner edges of every inner element.
            //If they contain external connections we will now add them to the actor cell.
            value.forEach(edge => {
              const terminal = edge.isSource ? edge.target : edge.source;
              //The only allowed external connections are done with dependums.
              if(!innerElements.has(terminal)){
                const sourceCell = 
                  edge.isSource ? 
                    currentCell : 
                    graph.getModel().getCell(edge.source);
                const targetCell = 
                  edge.isSource ? 
                    graph.getModel().getCell(edge.target) : 
                    currentCell;
                const newEdge = 
                  graph.insertEdge(
                    mainparent, uuidv1(), edge.value, sourceCell, targetCell, 
                    edge.style
                  );
                newEdge.promotedEdge = true;
                //Gather the state information of both the source and target elements.
                const sourceState = graph.view.getState(sourceCell);
                const targetState = graph.view.getState(targetCell);
                //Obtain the coordinates and offset to the center of the bounding rectangle.
                const initX = sourceState.x + (sourceState.width/2);
                const initY = sourceState.y + (sourceState.height/2);
                const destX = targetState.x + (targetState.width/2);
                const destY = targetState.y + (targetState.height/2);
                //Calculate the angle given by the edge in its current orientation.
                const angle = 
                  (Math.atan2(destY-initY,destX-initX) * 
                    (180/Math.PI)).toFixed(0);
                //Determine the element that will be added over the edge.
                const affects = 
                  ['rel_attack_vulnerability'].includes(edge.type);
                //Insert a new element onto the the edge with the calculated angle.
                const capitald = 
                  graph.insertVertex(
                    newEdge, uuidv1(), null, 0, 0, 20, 20,
                    'shape='+(affects ? 'affects':'capitald')+
                      ';fillColor=#FFFFFF;rotation='+angle+';selectable=0;'
                  );
                //Set the offset of the element so that it is centered. 
                capitald.geometry.offset = new mxPoint(-10, -10);
                capitald.geometry.relative = true;
                //Set the element as unconnectable.
                capitald.connectable = false;
                //Set edge geometry to get text label out of the way
                newEdge.setGeometry(edge.geo);
              }
            })
          }
        }

        //We modify the actor cell to have the information of both its boundary cell and that of the inner elements.
        currentCell.elements = innerElements;
        currentCell.relations = relations;
        currentCell.boundarySize = 
          {height: parentGeo.height, width: parentGeo.width};

        //These cells are fundamentally different to those that are returned by ungroupCells.
        //They retain their properties though. I suspect they are cloned from the first ones.
        const innerCells = graph.ungroupCells([boundaryCell]);
        //Remove the superfluous cells from the graph.
        innerCells.forEach(cell => {
          if(cell !== currentCell){
            graph.removeCells([cell]);
          }
        })

        //set the postion to the parent's old position
        currentGeo.x = parentGeo.x + 100;
        currentGeo.y = parentGeo.y + 100;
        //remove the cell from the hierarchy and then add it back to the model.
        //graph.ungroupCells([currentCell]);
        /* const innerCells = graph.ungroupCells([boundaryCell]); */
        //graph.removeCells([boundaryCell]);
        //graph.getModel().add(mainparent, currentCell);
        //Change the cell's properties so that it can move again.
        graph.setCellStyles(mxConstants.STYLE_MOVABLE, '1', [currentCell]);
        //Make it so the edges, and promoted edges, are all correctly aligned.
        reorientElement(null, {
          getProperty: function(_type){
            return [currentCell];
          }
        })
      }
    } finally {
      //console.log(currentCell.getAttribute('boundary'))
      graph.getModel().endUpdate();
    }
  }

  /**
   * This function updates all edges that link to a particular goal, thus setting the refinement style.
   */
  function refinementStyle(){
    const admittedTypes = ['goal', 'task'];
    //Get the reference to the edge and find its target
    const currentCell = graph.getModel().getCell(this.name);
    const target = currentCell.getTerminal(false);
    //this.value should carry the value that has been changed to
    graph.getModel().beginUpdate();
    try {
      if (target.edges.length > 0){
        target.edges.forEach(edge => {
          const source = edge.getTerminal(true);
          const sourceType = source.getAttribute('type');
          const destination = edge.getTerminal(false);
          const destType = destination.getAttribute('type');
          if(source !== target && admittedTypes.includes(sourceType) && 
            admittedTypes.includes(destType)){
            //Set the arrow style based on the incoming value of the select
            graph.setCellStyles(
              mxConstants.STYLE_ENDARROW, 
              this.value === 'and' ? 'dash' : 'block', [edge]
            );
            if(edge !== currentCell){
              const edit = 
                new mxCellAttributeChange(edge, "refinement", this.value);
              graph.getModel().execute(edit);
            }
          }
        })
      }
    } finally {
      graph.getModel().endUpdate();
    }
  }

  /**
   * This function reorients elements that exist as children of edges.
   * It calculates the rotation of the elements in the same way that 
   * it is done in /istar/setup_relations.js 
   * @param {Object} _sender This is the graph that generated the event.
   * @param {Object} evt This is the event itself, it contains all the parameters of the associated MOVED_CELLS event.
   */
  function reorientElement(_sender, evt) {
    //Obtain the moved cells.
    const cells = evt.getProperty('cells');
    const dx = evt.getProperty('dx');
    const dy = evt.getProperty('dy');
    //For each and every moved cell we must reorient the dependum edges leading into, out of them.
    cells.forEach(cell => {
      //If the cell we moved turns out to be bounday cell
      //we must treat it differently and extract the elements within,
      //since the boundary itself is of no interest as it cannot be
      //connected to.
      const childCount = cell.getChildCount();
      //The elements array will either only contain the moved cell
      //or the inner elements of the boundary cell.
      let elements = [];
      if(childCount > 0){
        for(let i = 0; i < childCount; i++){
          const child = cell.getChildAt(i);
          const childChildren = child.getChildCount();
          if(childChildren > 0){
            for(let j = 0; j < childChildren; j++){
              elements.push(child.getChildAt(j));
            }
          } else {
            elements.push(child);
          }
        }
      } else {
        elements.push(cell);
      }
      
      elements.forEach(element => {
        //Check if the cell has any connections, otherwise ignore it.
        if(element.getEdgeCount() > 0){
          element.edges.forEach(edge => {
            //Check if the edge is a connection to a dependum element, otherwise ignore it.
            if(/*edge.getAttribute('type').includes('dependum') && edge.getChildCount() > 0*/ edge.getChildCount() > 0){
              
              //Get the reference to the dependum marker, it is always the only child of the edge.
              let capitald = edge.getChildAt(0);
              //Get all the information for the source cell and its parent.
              const source = edge.getTerminal(true);
              const target = edge.getTerminal(false);
              const ss = graph.view.getState(source);
              const ts = graph.view.getState(target);
              //Check which side corresponds to the moved element.
              const isSource = source === element;

              //These are the coordinates that will be used to calculate the angle to which
              //the marker will be rotated to. init for the source, dest for the target.
              //The absolute position is correct, but is has to be offset by the move.
              const initX = ss.origin.x + (ss.width / 2) + (isSource ? dx : 0);
              const initY = ss.origin.y + (ss.height / 2) + (isSource ? dy : 0);
              const destX = ts.origin.x + (ts.width / 2) + (!isSource ? dx : 0);
              const destY = ts.origin.y + (ts.height / 2) + (!isSource ? dy : 0);

              //Calculate the angle given by the line connecting the two points.
              const angle = 
                (Math.atan2(destY-initY,destX-initX) * 
                  (180/Math.PI)).toFixed(0);
              /* console.log('angle :', angle); */
              //Set the style of the element within the edge to the calculated rotation.
              graph.setCellStyles(mxConstants.STYLE_ROTATION, angle, [capitald])
            }
          })
        }
      })
    })
  }
	
}

export default istarMain 