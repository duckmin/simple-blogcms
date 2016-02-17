window.managerExtraActions = {
	"logout":function(){
		var message = "Are you sure you wish to logout, all unsaved changes will be lost";
		showConfirm( message, false, null, function(elm){ 
			gEBI('logout').submit();
		})
	}
}

window.tab_actions = {
	"posts_tab_action":function(e){
	    var panel = e.currentTarget;
	    posts_action.loadTablePage( Date.now() );
		 panel.removeEventListener('tabshow', tab_actions.posts_tab_action );
	},
	"picture_tab_action":function(e){
		//initiate resources folder explorer 
		var panel = e.currentTarget;
		var ul = createElement("ul",{
			"class":"folders"
		});
		var item = {
		    type:"folder",
		    base_name:constants.resources_directory.substr(1), 
		    file_path:constants.resources_directory
		};
		ul.innerHTML = bindMustacheString( resources_templates[item.type], item );
		panel.querySelector("#resource-folders").appendChild(ul);
		panel.removeEventListener('tabshow', tab_actions.picture_tab_action );
	}		
}

//init tabs, code in extender_new_tabs.js
addEvent( window, "load", function(){
	var container = document.body,
	tabset = new TabSet( container );
	//add events to container onclick through "tabshow" event (only fired on section[data-tab])
	document.querySelector("section[data-tab='posts']").addEventListener('tabshow', tab_actions.posts_tab_action );
	document.querySelector("section[data-tab='pictures']").addEventListener('tabshow', tab_actions.picture_tab_action );
	tabset.init();
})

addEvent( window, "load", function(){	
	attributeActions( document.body, "data-loadaction", {	
		"logout":function(elm){
			elm.addEvent( "click", managerExtraActions.logout )
		}
	});
});

