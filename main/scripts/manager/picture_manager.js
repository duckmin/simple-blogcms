
var resources_templates = {
	"folder":"<li class='dir' data-filepath='{{ file_path }}' >"+
		"<img src='/style/resources/folder.png' title='Show Folder Contents' onclick='resources_action.listFiles(this)' />"+
		"<img src='/style/resources/arrow_top.png' title='Show Sub Directories' onclick='resources_action.listSubDirectories(this)' />"+
		"<img src='/style/resources/folder-add.png' title='New Folder' data-folderpath='{{ file_path }}' onclick='newFolder(this)' />"+
		"<span>{{ base_name }}</span>"+
	"</li>",
	
	"image":"<li class='file' data-thumbkey='{{ thumbname }}' >"+
		"<img src='/style/resources/image.png' title='Add Picture to Template' data-picturepath='{{ server_path }}' onclick='resources_action.pictureClick(this)' onmouseover='imageOver(this)' onmouseout='imageOut(this)' />"+
		"<img src='/style/resources/action_delete.png' title='Delete Resource' data-filepath='{{ server_path }}' onclick='resources_action.deleteResource(this)' />"+		
		"<span>{{ resource_name }}</span>"+
	"</li>",
	
	"audio":"<li class='file' >"+
		"<img src='/style/resources/audio.png' title='Add Audio to Template' data-audiopath='{{ server_path }}' onclick='audioClick(this)' />"+
		"<img src='/style/resources/action_delete.png' title='Delete Resource' data-filepath='{{ server_path }}' onclick='resources_action.deleteResource(this)' />"+			
		"<span>{{ resource_name }}</span>"+
	"</li>"
}

var resources_action = {
    getDirListing:function(path, callback){
        controller.callApi( 'ManagerResourcesGet_directory_contents', {dir_path:path}, function(listing){
            callback( JSON.parse(listing) );
        });
    },
    itemHasTemplate:function(item){
        return ( item.hasOwnProperty("type") && resources_templates.hasOwnProperty(item.type) )?true:false;
    },
    makeLis:function( resp, bind_type ){
        //bind_type is callback using the item.type attr must return boolean
        var lis = "";
        resp.forEach( function( item ){
			if( this.itemHasTemplate(item) ){
				if( bind_type( item.type ) ){
				   lis += bindMustacheString( resources_templates[item.type], item.data );
				}
			}
		}.bind(this));
		return lis;
    }
}

resources_action.listFiles = function(element){
    var base = "/style/resources/";
    if( element.getAttribute("src") === base+"folder-open.png" ){
        //listing in window currently do nothing
        return;
    }  
    var parent_div = element.nearestParent("div"),
    parent_li = element.nearestParent( "li" ),
    path = parent_li.getAttribute( 'data-filepath' );
    //make folder input used for upload the value of folder contents in view
    var input = gEBI( 'upload-path' );
    input.value = path;
    //if there is a img with folder-open.png src change it to folder closed
	var open_img = parent_div.querySelector("li > img[src='"+base+"folder-open.png']");
	( open_img !== null )? open_img.src = base+"folder.png" : false;
	//change current src to folder open, this will also unhide add directory button
	element.src = base+"folder-open.png";
    
    this.getDirListing(path, function( resp ){
        var files = this.makeLis( resp, function(bind_type){ return (bind_type !== "folder")?true:false; } ),
		files_list = createElement("ul", {
			"class":"folders",
			"innerHTML":files
		});
        gEBI("pic-files").innerHTML = files_list.outerHTML;	
    }.bind(this));
}

resources_action.listSubDirectories = function(element){
    var parent_li = element.nearestParent( "li" ),
    ul = parent_li.querySelector("ul.folders"),
    path = parent_li.getAttribute( 'data-filepath' );
    
    if( ul === null && !element.hasAttribute("data-loaded") ){
        this.getDirListing(path, function( resp ){
            var folders = this.makeLis( resp, function(bind_type){ return (bind_type === "folder")?true:false; } ),
    		folders_list = createElement("ul", {
    			"class":"folders",
    			"innerHTML":folders
    		});
            parent_li.appendChild( folders_list );
		    element.setAttribute( 'data-loaded', "" );
		    element.addClass("open");
        }.bind(this));
    }else{
        var current_display = ul.style.display, display;
    	if( current_display === "" || current_display === "block" ){
    		display = "none";
    		element.removeClass("open");
    	}else{
    		display = "block";
    		element.addClass("open");
    	}
    	ul.style.display = display;
    }
}

resources_action.deleteResource = function( elm ){
	var message = "Are You Sure You Want to Delete This Resource?";
	showConfirm( message, false, elm, function(element){ //calback function fired if yes is selected
		var parent_li = element.nearestParent("li"),
		file_path = element.getAttribute( 'data-filepath' ),//path from file from /main root	
		send={ "file_path":file_path };
		if( parent_li.hasAttribute("data-thumbkey") ){
			//if this is an image we send the thumbname to the service so the thumbnail can get deleted using the name as a key
			var thumbnail_key = parent_li.getAttribute("data-thumbkey");
			send.thumbnail_key = thumbnail_key;
		}

		controller.callApi( 'ManagerResourcesDelete_resource', send, function(d){
			if( d !== "" ){
				var resp = JSON.parse( d );
				if( resp.result ){
					var li = element.nearestParent("li").remove();
				}
				showAlertMessage( resp.message, resp.result );
				
			}else{
				showAlertMessage( "No Data Error", false );
			}
		})
	})	
}

resources_action.pictureClick = function( element ){
	//brings up a popup with the option to either add to template or add as a thumbnail
	var path = element.getAttribute( 'data-picturepath' ),
	parent_li = element.nearestParent('li'),
	thumbkey = parent_li.getAttribute("data-thumbkey"),
	picture_popup = gEBI("picture-popup"),
	popup_form_class = new FormClass( picture_popup ),
	vals = { thumbkey:thumbkey, picture_path:path };
	popup_form_class.bindValues( vals );
	picture_popup.removeClass("hide");
	box_action.centerFixedBox( picture_popup.querySelector("div.fixed-box") );
}

function audioClick( element ){
	var path = element.getAttribute( 'data-audiopath' );
	window.location.hash = "#template";
	template_item = templatetype[ "audio" ]( path );
	gEBI("template").appendChild( template_item );
}

function newFolder( element ){
	var path = element.getAttribute( 'data-folderpath' ),
	parent_li = element.nearestParent('li'),
	folder_list = parent_li.querySelector( "ul.folders" ),
	folder_first_child = folder_list.firstElementChild;

	if( folder_list !== null && ( folder_first_child === null || !folder_first_child.hasClass("add-folder-li") ) ){ //first child of parent li will eiter be null 'empty' or it will not be an add folder element
		var add_folder_li = createElement( "li", {
			"class":"add-folder-li",
			"child":multiFragment({
				"input":createElement( "input",{
					"type":"text",
					"name":"folder_name"
				}),
				"hidden_path_input":createElement( "input",{
					"type":"hidden",
					"name":"folder_path",
					"value":path
				}),
				"save":createElement( "img",{
					"src":constants.base_url+"/style/resources/confirm_check.png",
					"title":"Save New Folder",
					"events":{
						"click":addFolderAction
					}
				}),
				"remove":createElement( "img",{
					"src":constants.base_url+"/style/resources/action_delete.png",
					"title":"Cancel Add New Folder",
					"events":{
						"click":function(){
							this.nearestParent("li").remove();			
						}
					}
				})				
			})
		});
		
		folder_list.prepend( add_folder_li );	
	}
}

function savePopupFolderClickAction( element ){
	var path = element.getAttribute( 'data-folderpath' ),
	form = element.nearestParentClass( "form" ),
	input = form.querySelector( "input[name=folder_path]" );
	input.value = path;
}

function imageUploadValidator(){
	var upload_path_not_empty = (gEBI( 'upload-path' ).value.length > 0 )? true : false,
	file_input_not_empty = ( document.querySelector("input[type='file']").value.length > 0 )? true : false;
	if( upload_path_not_empty && file_input_not_empty ){
		return true;
	}else{
		//if upload_path is not empty then it must be gfile that is
		var message;
		if( !upload_path_not_empty ){
			message = "Folder Form Value is Empty";
		}else{
			message = "Please Select a File To Upload";
		}
		
		showAlertMessage( message, false );
		return false;
	}
}

function uploadResponseAction( obj ){
	if( obj.result === true ){
		//obj param has a data attribute and when the upload is successful there is an object in the data attribute with its own data attribute 
		//to avoid confusion obj.data.data is what is used to bind template
		console.log(obj.data);
		obj.data.forEach(function(d){
    		if( d.hasOwnProperty("type") && resources_templates.hasOwnProperty(d.type) ){
    			var file_li = bindMustacheString( resources_templates[d.type], d.data );
    			gEBI("pic-files").querySelector("ul.folders").innerHTML += file_li;
    		}
	    })

		//clear form 
		document.querySelector("input[type='file']").value = ""; //set default browse input
		document.querySelectorAll("#uploads-list > li:first-child ~ li").each(function(li){
		    //remove all underneath default input
		    li.remove();
		});
	}else{
		showAlertMessage( obj.message, obj.result );
	}
}

function addFolderAction( e ){
	var elm = e.currentTarget,
	parent_li = elm.nearestParent("li"),
	form_class = new FormClass( parent_li ),
	vals = form_class.getValues(),
	message = "Are You Sure You Want to add folder "+vals.folder_path+'/'+vals.folder_name;
	showConfirm( message, false, elm, function(element){ //calback function fired if yes is selected
		//var file_path = element.getAttribute( 'data-filepath' ),//path from file from /main root	
		send=vals;
		controller.callApi( 'ManagerResourcesAdd_new_resource_directory', send, function(d){
			var resp = JSON.parse( d);
			if( resp.result ){
				var item = resp.data;
				if( item.hasOwnProperty("type") && resources_templates.hasOwnProperty(item.type) ){
					var li = bindMustacheString( resources_templates[item.type], item.data ),
					holder_ul = createElement("ul");
					
				    holder_ul.innerHTML = li;
				    elm.nearestParent("li").replaceWith( holder_ul.firstElementChild ); //replace box with DOM friendly li
				}
			}else{
				showAlertMessage( resp.message, false );
			}
		})
	})	
}

function imageOver( element ){
	var src = element.getAttribute( "data-picturepath" ),
	parent_li = element.nearestParent( "li" );
	parent_li.style.position = "relative";
	var left = element.clientWidth+element.offsetLeft,
	top = element.clientHeight+element.offsetTop,
	pic = createElement("img",{
		"data-imgpreview":"",
		"src":src
	});
	pic.style.position = "absolute";
	pic.style.left = left+"px";
	pic.style.top =  top+"px";
	pic.style.height =  100+"px";
	pic.style.border =  "4px solid white";
	parent_li.appendChild( pic );
}

function imageOut( element ){
	var parent_li = element.nearestParent( "li" ),
	img = parent_li.querySelectorAll( "[data-imgpreview]" );
	console.log( img );
	img.each( function( pic ){ pic.remove() });
	removeInlineStyle( parent_li, 'position' );
}

//set up multi upload on page
resources_action.addUploadFile = function(){
    var file_list = document.getElementById("uploads-list"),
    file_li = createElement( "li", {
		"class":"add-folder-li",
		"child":multiFragment({
			"input":createElement( "input",{
				"type":"file",
				"name":"resources[]"
			}),
			"remove":createElement( "img",{
				"src":constants.base_url+"/style/resources/action_delete.png",
				"title":"Remove File",
				"events":{
					"click":function(){
						this.nearestParent("li").remove();			
					}
				}
			})				
		})
	});
	file_list.appendChild( file_li );
}
addEvent( window, "load", function(){
    attributeActions( document.body, "data-templateaction", {
		
		"add-upload-file":function(elm){
			elm.addEvent( "click", resources_action.addUploadFile);
		}
	})
})

