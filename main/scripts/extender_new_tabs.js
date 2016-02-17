
function TabSet( container ){
		this.container = container;		
}

TabSet.prototype.switchtab = function(){
	var hash = window.location.hash.substr(1),
	selected_li = document.querySelector("li[data-tab].selected"),
	selected_section = document.querySelector("section[data-tab].selected"),
	li = document.querySelector("li[data-tab='"+hash+"']"),
	section = document.querySelector("section[data-tab='"+hash+"']");
	if( selected_li !== null ){ selected_li.className = ""; }
	if( selected_section !== null ){ selected_section.className = ""; }
	if( li !== null && section !== null ){
		li.className = "selected";
		section.className = "selected";
		//fire tabshow event on tab
		section.dispatchEvent( tabshow_event );
	}else{
		var message = "missing a matching element with the attribute data-tab='"+hash+"'";
		throw new Error(message);
	}
}

TabSet.prototype.init = function(){
	var tabs = this.container.querySelectorAll("li[data-tab]");
	for( var i = 0, L = tabs.length; i < L; i+=1 ){
		tabs[i].addEventListener('click', function(e){  
			var hash = this.getAttribute("data-tab");
			window.location.hash = hash;
		}, false);
	}
	
	//register the tabshow event
	window.tabshow_event = new Event('tabshow');
	window.addEventListener('hashchange', this.switchtab, false);
	//switch to first tab
	
	if( window.location.hash.length > 0 ){
		this.switchtab();
	}else{
		var first_tab_hash = tabs[0].getAttribute("data-tab");
		window.location.hash = first_tab_hash;
	}
}