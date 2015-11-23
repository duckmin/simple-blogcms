//this requires element_extender lib to be loaded before this will work
(function(window){	
	
	function selectValue( select, value, selected ){
		var opts = select.getElementsByTagName( "option" );
		for( var i=0, L=opts.length; i<L; i+=1 ){
			if( opts[i].value === value ){
				opts[i].selected = selected;
				break;
			}
		}
	}
	
	function ulClick( li, multi_sel ){
		var val = li.getAttribute("data-val");		
		if( li.hasClass("selected-multi") ){
			selectValue(  multi_sel, val, false );
			li.removeClass("selected-multi");
		}else{
			selectValue(  multi_sel, val, true );
			li.addClass("selected-multi");
		}
	}
	
	function replacementList( multi_select ){
		multi_select.setAttribute("disabled","");		
		var ul = createElement("ul", {"class":"multi-replace"}), li, li_class;
		multi_select.getElementsByTagName( "option" ).each( function(opt){
			li_class = ( opt.selected === true )? "selected-multi" : "";			
			li = createElement("li",{
				"text":opt.innerHTML,
				"data-val":opt.value,
				"class":li_class,
				"events":{
					"click":function(){
						ulClick( this, multi_select )
					}
				}
			})
			ul.appendChild(li);
		})
		multi_select.appendAfter( ul )
	}
	
	window.setMultiSelects = function( element ){
		element.querySelectorAll("select[multiple]").each(function(select){
			replacementList( select );
		})
	}
	
})(window);