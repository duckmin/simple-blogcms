(function(window){
	
	function removeInlineStyle( element, property ){
		if ( element.style.removeProperty ) {
			element.style.removeProperty( property );
		}else{
			element.style.removeAttribute( property );
		}
	}
	
	function setTip(e){
		var element= e.srcElement||e.currentTarget;
		if( element.hasAttribute("title") ){
			if( element.title.length>0 ){
				//element.setCapture();
				var parent=element.parentElement;
				parent.style.position='relative';
				var tip=createElement('h5',{
					"class":"tool-tip",
					"text":element.title
				});
				tip.style.margin='0';
				tip.style.padding='3px 7px';
				tip.style.position='absolute';
				tip.style.whiteSpace='nowrap';
				var element_width_half=element.clientWidth/2,
				tip_elm=parent.appendChild(tip),
				tip_height=tip_elm.clientHeight,
				tip_width_half=tip_elm.clientWidth/2;
				tip.style.top=( ( element.offsetTop-tip_height )-3 )+'px';
				tip.style.left=( ( element.offsetLeft+element_width_half )-tip_width_half )+'px';
				element.title="";
			}
		}
	}
	
	function removeTip(e){
		var element= e.srcElement||e.currentTarget,
		parent=element.parentElement;;
		removeInlineStyle( parent, 'position' );
		var tip=parent.querySelectorAll( '.tool-tip' )[0];
		element.title=tip.innerHTML;
		tip.remove();
		//element.releaseCapture();
	}
	
	window.setTips=function( container ){
		var holder=container||document;
		holder.querySelectorAll( '[data-tooltip]' ).each( function( tip_element ){
			tip_element.addEvent( 'mouseover', setTip );
			tip_element.addEvent( 'mouseout', removeTip );
		})
	}
	
	addEvent( window, 'load', function(){
		setTips();
	})
	
})(window);