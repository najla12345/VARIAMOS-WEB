let setup_properties = function setup_properties(graph,properties_styles){
	//remove previous listeners
	if(graph.getSelectionModel().eventListeners.length>3){
		graph.getSelectionModel().eventListeners.pop();
		graph.getSelectionModel().eventListeners.pop();
	}

    graph.getSelectionModel().addListener(mxEvent.CHANGE, function(sender, evt)
    {
        selectionChanged(graph,properties_styles);
	});

    selectionChanged(graph,properties_styles);

    function selectionChanged(graph,properties_styles)
	{
		let div = document.getElementById('properties');
		// Forces focusout in IE
		graph.container.focus();
		// Clears the DIV the non-DOM way
		div.innerHTML = '';
		// Gets the selection cell
		let cell = graph.getSelectionCell();
		
		if (cell == null)
		{
			mxUtils.writeln(div, global.messages["setup_properties_nothing"]);
		}
		else
		{
			if(cell.getId().includes("clon")){
				mxUtils.writeln(div, global.messages["setup_properties_clon"]);
			}else{
				//On sait qu'un element a ete choisi
				if(cell.value.attributes){
					let form = new mxForm("properties-table");
					
					let attrs = cell.value.attributes;
					//attrs=attrs.splice(4,1);
					//console.log(attrs.delete('0'));
					
					let att=[];
					let j =0;
					const type = cell.getAttribute('type');
					if((['VariantTask'].includes(type))||(['Task'].includes(type))||(['UserTask'].includes(type)))
					{if(cell.parent.value!==undefined)
						{
							if(cell.parent.value.localName==='baseCompositionModel')
							{	for (let i = 0; i < attrs.length; i++)
								{	
									if((i!==2)&&(i!==3))
									{att[j]=attrs[i];
									
									 j=j+1;
								 }

							}
						}
						else if(cell.parent.value.localName==='Variant')
						{	for (let i = 0; i < attrs.length; i++)
							{	
								if(i!==4)
								{att[j]=attrs[i];
								
								 j=j+1;
							 }
	
						}
					}
					
					}
					else 
					{att=attrs;}
			
				}
				else 
				{att=attrs;}
				
					for (let i = 0; i < att.length; i++)
					{
						if(properties_styles!=null && properties_styles[cell.getAttribute("type")]){
							let type = cell.getAttribute("type");
							let passed = false;
							for (let j = 0; j < properties_styles[type].length; j++)
							{
								if(properties_styles[type][j]["attribute"]==att[i].nodeName){
									if(properties_styles[type][j]["input_type"]=="text"){
										createTextField(graph, form, cell, att[i], properties_styles[type][j]);
										passed = true;
									}else if(properties_styles[type][j]["input_type"]=="select"){
										createSelectField(graph, form, cell, att[i], properties_styles[type][j]);
										passed = true;
									}else if(properties_styles[type][j]["input_type"]=="checkbox"){
										createCheckboxField(graph, form, cell, att[i], properties_styles[type][j]);
										passed = true;
									}
								}
							}
							if(!passed){
								createTextField(graph, form, cell, att[i], "");
							}
						}else{
							createTextField(graph, form, cell, att[i], "");
						}
					}

					div.appendChild(form.getTable());
					mxUtils.br(div);
				}

				//ci-dessus il rajouter les form pour le name et les attributs
				//ci-dessous on cree les tabs
			/*	const type = cell.getAttribute('type');
				if((['VariantTask'].includes(type))||(['Task'].includes(type))||(['UserTask'].includes(type)))
				{ let div = document.getElementById('select-Component');
				let divFragment = document.getElementById('select-Fragment');
				let divFeature = document.getElementById('select-Feature');
				if(cell.parent.value!==undefined)
				{console.log(cell.parent.value);
					if(cell.parent.value.localName==='baseCompositionModel')
					{ console.log(cell);
						div.setAttribute('disabled','disabled');
						divFragment.setAttribute('disabled','disabled');
					}
					else if(cell.parent.value.localName==='Variant')

					{   divFeature.setAttribute('hidden','hidden');
					
					}
				}


				}*/
               /* if(['VariantTask'].includes(type)){
					if(cell.parent.value.localName=='baseCompositionModel'){
					let input=null;
					input = document.createElement('label');
			
                       
                            input.innerHTML='feature';
							input.setAttribute('align', 'left');
							div.appendChild(input);
				}
			}*/
				/*
				const structure = {
					basic_information: {
						general_information: [
							{element_id: 'Identification :', element_type: 'label', element_txt: cell.getAttribute('label')},
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
							{element_id: 'Interfaces :', element_type: 'label'},
							{element_id: 'Exposed Interfaces', element_type: 'textarea', interfaces: interfaces.exposed},
							{element_id: 'Required Interfaces', element_type: 'textarea', interfaces: interfaces.required},
						
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
				*/
			}
		}
	}

	/**
	 * Creates the checkbox field for the given property.
	 */
	function createCheckboxField(graph, form, cell, attribute, custom){

		let def_display = getDisplayValue(cell,custom);
		let input = form.addCheckbox(attribute.nodeName, attribute.nodeValue, def_display);

		executeApplyHandler(graph, form, cell, attribute, input, custom);
	}

	/**
	 * Creates the select field for the given property.
	 */
	function createSelectField(graph, form, cell, attribute, custom){

		let values=custom["input_values"];
		let def_display = getDisplayValue(cell,custom);
		let input = form.addCombo(attribute.nodeName, false, 1, def_display);

		for (let i = 0; i < values.length; i++)
		{
			if(values[i]==attribute.nodeValue){
				form.addOption(input,values[i],values[i],true);
			}else{
				form.addOption(input,values[i],values[i],false);
			}
		}

		executeApplyHandler(graph, form, cell, attribute, input, custom);
	}

	/**
	 * Creates the textfield for the given property.
	 */
	function createTextField(graph, form, cell, attribute, custom)
	{
		let def_display = getDisplayValue(cell,custom);

		let input = form.addText(attribute.nodeName, attribute.nodeValue, "text", def_display);
		
		//attribute type can not be modified
		if(attribute.nodeName=="type"){
			input.disabled="disabled";
		}

		executeApplyHandler(graph, form, cell, attribute, input, custom);

	}

	function executeApplyHandler(graph, form, cell, attribute, input, custom){

		//apply custom configurations
		applyCustomElements(input, custom, cell);

		let applyHandler = function()
		{
			let newValue = "";

			if(input.type=="checkbox"){
				newValue = "false";
				if(input.checked){
					newValue = "true";
				}
			}else{
				newValue = input.value || '';
			}

			let oldValue = cell.getAttribute(attribute.nodeName, '');
			let onchange_allowed = true;

			//check custom changes that are not allowed
			if(custom["onchangerestrictive"]!=null){
				onchange_allowed = custom["onchangerestrictive"]();
				if(!onchange_allowed){
					input.value=oldValue;
				}
			}

			if (newValue != oldValue && onchange_allowed)
			{
				graph.getModel().beginUpdate();
				
				try
				{
					let edit = new mxCellAttributeChange(
							cell, attribute.nodeName,
							newValue);
					graph.getModel().execute(edit);
					
					//update cloned cell if exists
					let clon = graph.getModel().getCell("clon"+cell.getId());
					if(clon){
						let edit2 = new mxCellAttributeChange(
							clon, attribute.nodeName,
							newValue);
						graph.getModel().execute(edit2);
					}
				}
				finally
				{
					graph.getModel().endUpdate();
				}
			}
		}; 

		mxEvent.addListener(input, 'keypress', function (evt)
		{
			// Needs to take shift into account for textareas
			if (evt.keyCode == /*enter*/13 &&
				!mxEvent.isShiftDown(evt))
			{
				input.blur();
			}
		});

		if (mxClient.IS_IE)
		{
			mxEvent.addListener(input, 'focusout', applyHandler);
		}
		else
		{
			// Note: Known problem is the blurring of fields in
			// Firefox by changing the selection, in which case
			// no event is fired in FF and the change is lost.
			// As a workaround you should use a local variable
			// that stores the focused field and invoke blur
			// explicitely where we do the graph.focus above.
			mxEvent.addListener(input, 'blur', applyHandler);
		}
	}

	function getDisplayValue(cell,custom){
		let def_display = "";
 		if(custom!=null && custom["def_display"]!=null){
			def_display=custom["def_display"];
			if(custom["display_check_attribute"]){
				if(custom["display_check_value"]==cell.getAttribute(custom["display_check_attribute"])){
					def_display=custom["display_check"];
				}
			}
		}

		return def_display;
	}

	function applyCustomElements(input, custom, cell){
		if(custom!=null){
			//add onchange listener
			if(custom["onchange"]!=null){
				input.name=cell.getId();
				input.onchange = custom["onchange"];
			}

			//custom input type
			if(custom["input_text_type"]){
				let type=custom["input_text_type"];
				input.setAttribute('type', type);
			}
		}
	}
}

export default setup_properties