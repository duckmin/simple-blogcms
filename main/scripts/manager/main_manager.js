window.managerExtraActions = {
	"logout":function(){
		var message = "Are you sure you wish to logout, all unsaved changes will be lost";
		showConfirm( message, false, null, function(elm){ 
			gEBI('logout').submit();
		})
	},
	"posts_tab_action":function( tab, panel ){
	    if( edit_mode.active() ){
	        var posts_tab_being_edited = gEBI(edit_mode.id_in_edit);
	        if( posts_tab_being_edited !== null ){
	            window.scroll(0, posts_tab_being_edited.offsetTop - 5);
	            posts_tab_being_edited.addClass("highlight-edit");
                //animation ends in 1.5secs remove class after	            
	            setTimeout(function(){ posts_tab_being_edited.removeClass("highlight-edit"); },1500)
	        }   
	    }  
	}	
}

//init tabs, code in extender_new_tabs.js
addEvent( window, "load", function(){
	window.tab_actions = {
		"template":function( tab, panel ){
			//scroll to top
			window.scroll(0, document.querySelector("ul.tab-top").offsetTop );
		},
		"pictures":function( panel, tab ){
			//initiate resources folder explorer 
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
			delete this.pictures;
		},	
		"posts":function( tab, panel ){
			//load table page once then overwrite this funtion and check for a post being edited and scroll to it 
			loadTablePage(); //tab_manager.js
			this.posts = managerExtraActions.posts_tab_action;
		},
		"analytics":function( panel, tab ){
			var unique_url_ul = panel.querySelector("div.left > ul");			
			getUniqueUrlPage( unique_url_ul ); //manager/analytics_graphs.js
			getGraphPage();
			delete this.analytics;	
		}	
	}		
	window.tabset = new TabSet( document.body, tab_actions );
	tabset.init();
})

addEvent( window, "load", function(){	
	attributeActions( document.body, "data-loadaction", {	
		"logout":function(elm){
			elm.addEvent( "click", managerExtraActions.logout )
		}
	});
});

