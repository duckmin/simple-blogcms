
var doc_form_template = "<div class='doc-box'>"+	
	"<ul class='template' data-location='template' ></ul><!-- template items will be appended to this box -->"+	
	"<div class='tmplt-forum-container' data-location='meta-form' >"+
		"<input type='hidden' name='id' value='{{ id }}' >"+
		"<h5>Title:</h5>"+
		"<input type='text' name='title' value='{{ title }}' >"+
		"<h5>Description:</h5>"+
		"<textarea name='description' >{{ description }}</textarea>"+
		"<ul class='button-list' >"+
			"<li data-templateaction='preview-post' >Preview Post</li>"+
			"<li data-templateaction='cancel-template' class='red-button' >Cancel</li>"+
		"</ul>"+
	"</div>"+
"</div>";

var template_panel_action = {};

template_panel_action.getActiveTemplate = function(){
	var first_doc_box = gEBI("documents-panel").firstElementChild;
	if( first_doc_box !== null ){
		return first_doc_box.querySelector("ul[data-location='template']");
	}else{
		return false;
	}
}

template_panel_action.isPostBeingEdited = function( post_id ){  //look for button with this id as data-postid attr if one exists post is being edited 
	var switcher_panel = document.getElementById("document-tabs"),
	switcher = switcher_panel.querySelector("li[data-postid='"+post_id+"']");
	return ( switcher !== null )? true : false;
}

template_panel_action.getPostDataFromTemplate = function(){
	var template = this.getActiveTemplate(),
	holder = [];
	
	if( template !== false ){
		var posttypes = template.querySelectorAll("li[data-posttype]");
		posttypes.each( function( template_item ){
			var form_class = new FormClass( template_item ),
			values = form_class.getValues();
			holder.push( values );
		});
	}
	return holder
}
	
template_panel_action.switchDocument = function(e){
	var li = e.currentTarget,
	tab_id = li.getAttribute("data-documentid"),
	document_panel = document.getElementById("documents-panel"),
	document_tab = document_panel.querySelector("div.doc-box[data-documentid='"+tab_id+"']");
	document_panel.prepend( document_tab );
	document.getElementById("document-tabs").prepend( li )
}

template_panel_action.removeDocument = function(panel){
	var tab_id = panel.getAttribute("data-documentid"),
	switcher_panel = document.getElementById("document-tabs");
	switcher = switcher_panel.querySelector("li[data-documentid='"+tab_id+"']");
	panel.remove();
	switcher.remove();
}

template_panel_action.addNewDocumentForm = function(form_response, title, new_document){
	var form_holder = document.createElement("div"),
	li = document.createElement("li"),
	now = Date.now(); //so tab can be uniquely identified 
	form_holder.innerHTML = form_response;
	var form = form_holder.firstElementChild;
	form.setAttribute("data-documentid", now);
	var panel = document.getElementById("documents-panel").prepend(form);
	template_bind_action.bindFormEvents(panel); //set all events
	li.innerHTML = title;
	li.setAttribute("data-documentid", now);
	if( new_document === true ){
		li.setAttribute("data-new", "");
	}
	li.addEvent( "click", this.switchDocument.bind(this) );
	var tab = document.getElementById("document-tabs").prepend(li);
	return {
		panel:panel,
		tab:tab
	};
}

template_panel_action.addNewDocument = function(e){
	var new_docs = document.getElementById("document-tabs").querySelectorAll("[data-new]").length + 1,
	label = "New Document "+new_docs,
	bind = {
		id:"",
		title:"",
		description:""
	},
	form = bindMustacheString( doc_form_template, bind );
	this.addNewDocumentForm(form, label, true);
}

var preview_panel_action = {};

preview_panel_action.savePost = function(){
	var post_data = template_panel_action.getPostDataFromTemplate();
	
	if( post_data.length > 0 ){
		var form_panel = gEBI("documents-panel").firstElementChild,
		save_form = form_panel.querySelector("div[data-location='meta-form']"),
		form_class = new FormClass( save_form ),
		values = form_class.getValues(),
		is_edited_post = template_panel_action.isPostBeingEdited( values.id );
		values.post_data = post_data;
		console.log( values );
		
		controller.callApi( "ManagerTemplateUpsert_post_info", values, function(d){
			var resp = JSON.parse( d);
			if( resp.result ){
				if( !is_edited_post ){
					//new post saved, show template 
					window.location.hash = "#template";	
				}else{
					//old post edited, replace current HTML in posts tab with new version
					var old_post_in_posts_tab = gEBI( values.id );
					if( old_post_in_posts_tab !== null ){
						var new_post_in_preview_tab = document.querySelector("#preview > article.post:first-of-type");//post in preview tab has the edited HTML we need
						old_post_in_posts_tab.innerHTML = new_post_in_preview_tab.innerHTML; 
						window.location.hash = "#posts";	
					}else{
					    window.location.hash = "#template";	
					}
				}
				template_panel_action.removeDocument(form_panel);
			}
			showAlertMessage( resp.message, resp.result );
		})
	}else{
		showAlertMessage("Template is Empty", false );
	}
}

addEvent( window, "load", function(){
	attributeActions( document.body, "data-newtemplateaction", {
		
		"add-new-document-template":function(elm){
			elm.addEvent( "click", template_panel_action.addNewDocument.bind(template_panel_action) );
		},
		"save-post":function(elm){
			elm.addEvent( "click", preview_panel_action.savePost )
		},
		"hashtag":function(elm){
			elm.addEvent( "mousedown", function(e){
                e.preventDefault(); //prevent focus	
			});
			
			elm.addEvent( "click", function(e){
                var target = e.currentTarget,
                tag = target.getAttribute("data-hashtag"),
                active = document.activeElement;
                if( active.nodeName === "TEXTAREA" && active.hasAttribute("name") && active.getAttribute("name") === "text" ){
                    console.log(active);
                    tag = "#"+tag;
                    active.insertAtCaret(tag)
                }	
			});
		}
		
	})//end attr action func
});//end window load func 


//events that need to be binded to template once retrieved 
var template_bind_action = {};

template_bind_action.previewPost = function(e){
	var target = e.currentTarget,
	template_data = template_panel_action.getPostDataFromTemplate(),
	save_form = target.nearestParent("div"),  //box this button is in is the save form 
	form_class = new FormClass( save_form ),
	form_data = form_class.getValues(),
	post_data = { template_data:template_data, post_data:form_data };
	
	if( template_data.length > 0 ){
		controller.callApi( 'ManagerTemplateGet_post_preview_html', post_data, function(d){
			if( d.length > 0 ){
				gEBI("preview").innerHTML = d;
				window.location.hash = "#preview";
			}
		});
	}else{
		showAlertMessage("Template is Empty", false );
	}
}

template_bind_action.removePost = function(e){
	var target = e.currentTarget,
	form_panel = target.nearestParentClass("doc-box"),
	message = "All unsaved changes will be lost are you sure you wish to remove post from template?";
	
	showConfirm( message, false, form_panel, function(elm){ 
		template_panel_action.removeDocument(form_panel)
	});	
}

//template_panel_action.removeDocument(panel)
template_bind_action.bindFormEvents = function( form_panel ){
	attributeActions( form_panel, "data-templateaction", {
			
		"preview-post":function(elm){
			elm.addEvent( "click", template_bind_action.previewPost );
		},
		"cancel-template":function(elm){
			elm.addEvent( "click", template_bind_action.removePost );
		}
		
	})
}