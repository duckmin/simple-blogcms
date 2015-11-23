function TabSet( tab_holder, config ){
		this.tab_holder = tab_holder;
		this.config = config || {};
}

TabSet.prototype.switchTab = function( tabname ){		
	var selected_li = null, selected_section = null;		
	this.tab_holder.querySelectorAll('[data-tab]').each(function( element ) {
		if( element.getAttribute( "data-tab" ) === tabname ){
			element.addClass("selected");
			( element.nodeName === "SECTION" )? selected_section = element : false;
			( element.nodeName === "LI" )? selected_li = element : false;		
		}else{
			( element.hasClass("selected") )? element.removeClass("selected") : false;			
		}
	})
	
	if ( selected_section !== null && selected_li !== null ) {
		if( this.config.hasOwnProperty( tabname ) && typeof this.config[ tabname ] === "function" ){
			this.config[ tabname ]( selected_section, selected_li );
		}
	}else{
		console.log('missing elements');	
	}
}

TabSet.prototype.init = function(){ //call on window load event
	var self = this;
	
	this.tab_holder.querySelectorAll('li[data-tab]').each(function( li ) {	
		li.addEvent("click", function( e ) {
			window.location.hash = "#"+li.getAttribute( "data-tab" );
		})
	})
	
	addEvent( window, "hashchange", function(){
		self.switchTab( window.location.hash.substr(1) );
	})
	
	if( window.location.hash === "" ){ 
		var first_item_hashname = this.tab_holder.querySelector('li[data-tab]').getAttribute( "data-tab" );			
		window.location.hash = "#"+first_item_hashname;
	}else{
		this.switchTab( window.location.hash.substr(1) );		
	}
}