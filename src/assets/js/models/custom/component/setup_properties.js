let setup_properties = function setup_properties(graph,properties_styles){
	let componentMap = load_parameters();
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
		{//	console.log("je suis dans if 0");
			mxUtils.writeln(div, global.messages["setup_properties_nothing"]);
		}
		else
		{
			if(cell.getId().includes("clon")){
				//console.log("je suis dans if 1");
				mxUtils.writeln(div, global.messages["setup_properties_clon"]);
			}else{
				//On sait qu'un element a ete choisi
				if(cell.value.attributes){
					//console.log("je suis dans if 2");
					let form = new mxForm("properties-table");
					let attrs = cell.value.attributes;
					for (let i = 0; i < attrs.length; i++)
					{ 
						console.log(attrs[i].nodeName==='label');
						if((attrs[i].nodeName==="label")||(attrs[i].nodeName==="type")||(attrs[i].nodeName==="Component_type"))
					{	if(properties_styles!=null && properties_styles[cell.getAttribute("type")]){
							let type = cell.getAttribute("type");
							let passed = false;
							for (let j = 0; j < properties_styles[type].length; j++)
							{
								if(properties_styles[type][j]["attribute"]==attrs[i].nodeName){
									if(properties_styles[type][j]["input_type"]=="text"){
										createTextField(graph, form, cell, attrs[i], properties_styles[type][j]);
										passed = true;
									}else if(properties_styles[type][j]["input_type"]=="select"){
										createSelectField(graph, form, cell, attrs[i], properties_styles[type][j]);
										passed = true;
									}else if(properties_styles[type][j]["input_type"]=="checkbox"){
										createCheckboxField(graph, form, cell, attrs[i], properties_styles[type][j]);
										passed = true;
									}
								}
							}
							if(!passed){
								createTextField(graph, form, cell, attrs[i], "");
							}
						}else{
							createTextField(graph, form, cell, attrs[i], "");
						}
					}
				}
					div.appendChild(form.getTable());
					mxUtils.br(div);
				

				//ci-dessus il rajouter les form pour le name et les attributs
				//ci-dessous on cree les tabs
                const type = cell.getAttribute('type');
                if(['component'].includes(type)){
					
					let compId = cell.getId();
				
					console.log(compId);
					//let structure = {};
					let idx_cat = 0;
					let idx_subcat = 0;
					//const compId = cell.getId();
					let tabMap = new Map();
				
				tabMap.set('General_information', [
                    {element_id: 'idElement', element_type: 'text', element_value:'id1'},
                    {element_id: 'name', element_type: 'text'},
                    {element_id: 'type', element_type: 'combo', element_items:['Subsystem','Actor Component','Procedure', 'Service Component']},
                    {element_id: 'overview', element_type: 'textarea'},
                    {element_id: 'History:', element_type: 'label'},
                    {element_id: 'Version', element_type: 'text'},
                    {element_id: 'Date', element_type: 'text'},
                    {element_id: 'Developer', element_type: 'text'},
                    {element_id: 'Improvements', element_type: 'text'},
                    {element_id: 'Special_terms_and_rules:', element_type: 'label'},
                    {element_id: 'term', element_type: 'text'},
                    {element_id: 'description', element_type: 'text'},
                    {element_id: 'rule', element_type: 'text'},
                    {element_id: 'description', element_type: 'text'}
				]);
				tabMap.set('Constraint', [
                    {element_id: 'Protocol:', element_type: 'label', element_value:''},
                    {element_id: 'name', element_type: 'text'},
                    {element_id: 'description', element_type: 'text'} ,
                    {element_id: 'standard:', element_type: 'label'},
                    {element_id: 'used-standard:', element_type: 'label'},
                    {element_id: 'component-model', element_type: 'text'},
                    {element_id: 'other-standard', element_type: 'text'},
                    {element_id: 'required-standard', element_type: 'text'} 
				]);
				tabMap.set('Quality_attributs', [
                    {element_id: 'Quality:', element_type: 'label'},
                    {element_id: 'Modifiability', element_type: 'text'},
                    {element_id: 'Expandability', element_type: 'text'},
                    {element_id: 'Performance', element_type: 'label'},
                    {element_id: 'Size', element_type: 'text'},
                    {element_id: 'Prioritization_of_events', element_type: 'text'},
                    {element_id: 'Capacity', element_type: 'text'},
                    {element_id: 'Throughput', element_type: 'text'},
                    {element_id: 'Error-detection', element_type: 'text'},
                    {element_id: 'Allocation-time-of-resources', element_type: 'text'},
                    {element_id: 'Security', element_type: 'text'},
                    {element_id: 'Reliability', element_type: 'text'},
				]);
				tabMap.set('Technical-detail', [
                   {element_id: 'Technical_detail:', element_type: 'label'},
                   {element_id: 'Application_Area', element_type: 'text'},
                   {element_id: 'Developement_Environment', element_type: 'text'},
                   {element_id: 'Platforms:', element_type: 'label'},
                   {element_id: 'Hardware:', element_type: 'label'},
                  
                   {element_id: 'description', element_type: 'text'},
                   {element_id: 'Software:', element_type: 'label'},
                   {element_id: 'named', element_type: 'text'},
                   {element_id: 'description', element_type: 'text'},
                    {element_id: 'Interdependencies', element_type: 'text'},
                    {element_id: 'Prerequistes:', element_type: 'label'},
                    {element_id: 'Class', element_type: 'text'},
                    {element_id: 'name', element_type: 'text'},
                    {element_id: 'description', element_type: 'text'},
                    {element_id: 'namee', element_type: 'text'},
                    {element_id: 'TypeLibrary:', element_type: 'label'},
                    {element_id: 'Name', element_type: 'text'},
                    {element_id: 'Version', element_type: 'text'},
                    {element_id: 'Special-physical-resource-needs', element_type: 'text'}
                ]);
                
                tabMap.set('Acceptance-Criteria',[
                    {element_id: 'test_criteria', element_type: 'text'},
                    {element_id: 'test_overview', element_type: 'text'},
                    {element_id: 'test_environment', element_type: 'text'},
                    {element_id: 'test_cases', element_type: 'text'},
                    {element_id: 'test_summary', element_type: 'text'},
                    {element_id: 'test_support', element_type: 'text'},
                ]);
                tabMap.set('Support-Information',[
                {element_id: 'installation_guide', element_type: 'textarea'},
                {element_id: 'tailoring_support', element_type: 'textarea'},
                {element_id: 'customer_support', element_type: 'textarea'}
				]);
			
				//creer un nouveau div pour les tabs
				const tabdiv = document.createElement('div');
				
				tabdiv.className = 'tab2'
				tabdiv.setAttribute("id","tab1");
                const tabContainer = document.createElement('div');
                let table = document.createElement('table');
                 table.className="cont"
				Array.from(tabMap.keys()).forEach(tab => {
                 console.log(tab);
					const tabBut = document.createElement('button');
					tabBut.className = 'tablinks'
					tabdiv.appendChild(tabBut);
					tabBut.innerText = tab;
				
					tabBut.onclick = function () {
                 
						table.innerHTML = '';
						const tabContent = tabMap.get(tab);
						let comp=0;
						tabContent.forEach(tc => {
							comp=comp+1;
						  let input=null;
						
                            input = document.createElement('label');
                            let tr = document.createElement('tr');
                            let td = document.createElement('td');
                            input.innerHTML=tc.element_id;
							input.setAttribute('align', 'left');
							input.setAttribute("id","input"+comp);
							input.setAttribute("value","null");
							td=input;
							tr.appendChild(td);
							//if(cell.getAttribute(tc.element_id))
							
							//cell.setAttribute(tc.element_id,"");
							//console.log(cell.getAttribute(tc.element_id));
                           // tr.appendChild(td);
                            
                            //tabContainer.appendChild(tabH3);
                            let td2 = document.createElement('td');
                            if(tc.element_type=="text")
                            {
                            let input = document.createElement('input');
                            //tabH3.innerText = tc.element_id;
							td2.appendChild(input);
							const propVal = cell.getAttribute(tc.element_id, '');
							if(propVal !== ''){
								input.value = propVal;
							}
							addHandlerTest(graph, input, cell, tc.element_id, {});
						
						tr.appendChild(td2);}
						else if(tc.element_type=="textarea")
						{
						let textarea = document.createElement('textarea');
						//tabH3.innerText = tc.element_id;
						td2.appendChild(textarea);
					
					tr.appendChild(td2);}
					else if(tc.element_type=="label")
					{
					let label = document.createElement('label');
					//tabH3.innerText = tc.element_id;
					td2.appendChild(label);
				
				tr.appendChild(td2);}
					else if(tc.element_type === 'combo'){
						let	select = document.createElement('select');
							let index = 0;
						 
							tc.element_items.forEach(optionText => {
								const option = document.createElement('option');
								option.value = index++;
								option.text = optionText;
								select.appendChild(option);
							});
							td2.appendChild(select);
							
								//tabContainer.appendChild(input);
								
								tr.appendChild(td2);}   








					
						table.appendChild(tr);
						
                            //tabContainer.appendChild(input);
                            
                         
						});
					};
				});
				//add save button
				
			
			
				div.appendChild(tabdiv);
			
				div.appendChild(table);
			
				/*componentMap.set(compId, tabMap);

				let button1 = document.createElement('button');
				button1. innerHTML="save";
				button1.setAttribute("id","buttonSAVECom");
				div.appendChild(button1);
				console.log("save button");
				
				button1.onclick = function(){save_parameters(cell, tabMap);};*/
				Array.from(tabMap.keys()).forEach(tab => {
				const tabContent = tabMap.get(tab);
						
						tabContent.forEach(tc => {
							if(tc.element_id !== 'type'){
								//cell.setAttribute(tc.element_id,"");
							}
						}
						);}
				);

				if(document.getElementById("input2")!==null)
				{cell.setAttribute("name",document.getElementById("input2").value);
				console.log(document.getElementById("input2").value);
			}
				//console.log(document.getElementById("input2"));
			//	cell.setAttribute("name",document.getElementById("input2").value);
			}
			
				
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

	function addHandlerTest(graph, input, cell, attribute, custom){
		const applyHandlerTest = function(){
			console.log("Apply FocusoutTTT");
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
					let clon = graph.getModel().getCell("clon"+cell.getId());
					if(cell.hasAttribute(attribute)){
						let edit = new mxCellAttributeChange(
								cell, attribute,
								newValue);
						graph.getModel().execute(edit);
						
						//update cloned cell if exists
						if(clon){
							let edit2 = new mxCellAttributeChange(
								clon, attribute,
								newValue);
							graph.getModel().execute(edit2);
						}
					} else {
						cell.setAttribute(attribute, newValue);
						if(clon){
							clon.setAttribute(attribute, newValue);
						}
					}
						
				}
				finally
				{
					graph.getModel().endUpdate();
				}
			}
		}

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
			mxEvent.addListener(input, 'focusout', applyHandlerTest);
		}
		else
		{
			// Note: Known problem is the blurring of fields in
			// Firefox by changing the selection, in which case
			// no event is fired in FF and the change is lost.
			// As a workaround you should use a local variable
			// that stores the focused field and invoke blur
			// explicitely where we do the graph.focus above.
			mxEvent.addListener(input, 'blur', applyHandlerTest);
		}
	}

	function executeApplyHandler(graph, form, cell, attribute, input, custom){

		//apply custom configurations
		applyCustomElements(input, custom, cell);

		let applyHandler = function()
		{
			console.log("Apply Focusout");
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
	//for saving component data
	function load_parameters(){
		const store = JSON.parse(localStorage.getItem('ComponentMap'));
		console.log(localStorage.getItem('ComponentMap'));
        if(store !== null) return new Map(store);
        else return new Map();
    }

    function serialize(map) {
		return JSON.stringify([...map.entries()])
    }
    
    function save_parameters(_cell,_tabMap){
		//cell.setAttribute("id")="xx";
        const main_modal_footer = document.getElementById("main_modal_footer");
		main_modal_footer.style.display = 'none';
		console.log(main_modal_footer);
		const btn_save = document.getElementById('buttonSAVECom');
//  This gives you an HTMLElement object

		btn_save.click();
		var element = document.getElementById('tab1');
//  This gives you a string representing that element and its content
var html = element.outerHTML;       
//  This gives you a JSON object that you can send with jQuery.ajax's `data`
// option, you can rename the property to whatever you want.
var data = { html: html }; 

//  This gives you a string in JSON syntax of the object above that you can 
// send with XMLHttpRequest.
var convert = JSON.stringify(data);
console.log(convert);

		localStorage.setItem('ComponentMap', serialize(componentMap));
		//console.log( serialize(componentMap));
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
	

	//function 
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
}

export default setup_properties