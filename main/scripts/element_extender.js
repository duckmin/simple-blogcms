/*
TEST PHASE, COOL FUNCS TO TEST NOT READY FOR PRIME TIME YET
*/
//WHEN ELEMENT WITH SCROLLBAR
function atBottomScroll( element, callback ){   
    var fire=element.clientHeight+60;
    element.onscroll=function(){
        var current=element.scrollHeight-element.scrollTop;
        console.log( current );

          console.log( fire );
        if( current<=fire ){
            callback( element ); 
        }
    }
}

function attributeActions( element, attr, config ){
	var elm_attr;
	element.querySelectorAll( '['+attr+']' ).each( function( elm ){
		elm_attr=elm.getAttribute( attr );
		//console.log(config.hasOwnProperty( attr ))
		if( config.hasOwnProperty( elm_attr ) && typeof config[ elm_attr ] === 'function' ){
			config[ elm_attr ]( elm )
		}
	})
}
//END TEST PHASE

if(!Array.prototype.forEach){
    Array.prototype.forEach = function (fn, scope) {
        'use strict';
        var i, len;
        for (i = 0, len = this.length; i < len; ++i) {
            if (i in this) {
                fn.call(scope, this[i], i, this);
            }
        }
    };
}

if(!Array.prototype.indexOf){
  Array.prototype.indexOf = function(elt /*, from*/)
  {
    var len = this.length >>> 0;

    var from = Number(arguments[1]) || 0;
    from = (from < 0)
         ? Math.ceil(from)
         : Math.floor(from);
    if (from < 0)
      from += len;

    for (; from < len; from++)
    {
      if (from in this &&
          this[from] === elt)
        return from;
    }
    return -1;
  };
}

if( !Array.prototype.remove ){
	Array.prototype.remove=function( value ){
		var index=this.indexOf( value );
		if( index !==-1 ){
			this.splice( index, 1 );
		}
		return this
	}
}

if( !Array.prototype.shuffle ){
	Array.prototype.shuffle=function(){
		var holder=[];
		while( this.length>0 ){
			var ran=this.randomValue();
			holder.push( ran );
			this.remove(ran);
		}
		return holder;
	}
}

if( !Array.prototype.removeAllValues ){
	Array.prototype.removeAllValues=function(){
		var arg;
		for( var i=0, L=arguments.length; i<L; i+=1 ){
			arg=arguments[i];
			while( this.indexOf( arg )!==-1 ){
				this.splice( this.indexOf( arg ), 1 );
			}
		}
		return this
	}
}

if( !Array.prototype.randomValue ){
	Array.prototype.randomValue=function(){
		var ran=Math.floor( Math.random()*this.length );
		return this[ ran ];
	}
}

if( !Array.prototype.hasValue ){
	Array.prototype.hasValue=function( value ){
		var index=this.indexOf( value );
		return ( index !==-1 )? true : false;
	}
}


function gEBI(id)
{
  return document.getElementById(id);
}

(function(window){
	
	var element_proto=( typeof HTMLElement !== "undefined" )? HTMLElement.prototype : Element.prototype;
	
	function isHTMLElement( elm ){
		var is_elem=false;
		try{
			is_elem=elm instanceof HTMLElement;
		}catch(e){
			is_elem=elm instanceof Element;
		}
		return is_elem;
	}
	
	function isDocumentFragment( frag ){
		var is_frag=false;
		try{
			is_frag=frag instanceof DocumentFragment;
		}catch(e){
			is_frag=frag instanceof HTMLDocument;
		}
		return is_frag;
	}
	
	window.isAppendable=function( elm ){
		return ( isHTMLElement( elm )  || isDocumentFragment( elm ) || elm instanceof Text )? true : false;
	}
	
	//avoid using "this" keyword when referring to target element due to IE error and use below variable instead
	//var element= e.srcElement||e.currentTarget;
	window.addEvent=function( element, event, func ){
		if( typeof element.addEventListener !== 'undefined' ){
			element.addEventListener( event, func, false );
		}else{ 
			element.attachEvent('on' + event, func );
		}
	}
	
	window.removeEvent=function( element, event, func ){
		if( typeof element.removeEventListener !== 'undefined' ){
			element.removeEventListener( event, func, false );			
		}else{ 
			element.detachEvent( 'on' + event, func );
		}
	}
	
	element_proto.addEvent=function( event, func ){
		addEvent( this, event, func );
		return this
	}
	
	//in ie might have to remove events many time if more than one attached test more???
	element_proto.removeEvent=function( event, func ){
		removeEvent( this, event, func );
		return this
	}
	
	element_proto.hasClass=function( class_name ){
		var element_class=this.className.split(/\s/g);
		var has_index=element_class.indexOf( class_name );
		return ( has_index !== -1 )? true : false;
	}

	element_proto.removeClass=function( old_class ){
	    if( this.hasClass( old_class ) ){
			var element_class=this.className.split(/\s/g),
			index=element_class.indexOf( old_class );
			element_class.splice( index, 1 );
			this.className=element_class.join().replace(/(,)/g,' ');
	    }
	    return this
	}

	element_proto.addClass=function( new_class ){
	    if( !this.hasClass( new_class ) ){
			if( this.className===null || this.className==="" ){
				this.className=new_class;
			}else{
				this.className+=' '+new_class;
			}
	    }
	    return this
	}
	
	element_proto.firstChildOfType=function( type ){
	    var children = this.childNodes, child = null;
	    for( var i = 0, L = children.length; i < L; i+=1 ){
	    	if( children[i].nodeName.toLowerCase() === type.toLowerCase() ){
	    		child = children[i];
	    		break;
	    	}
	    }
	    return child
	}
	
	element_proto.lastChildOfType=function( type ){
	    var children = this.childNodes, child = null;
	    for( var i = children.length-1; i >= 0; i-=1 ){
	    	if( children[i].nodeName.toLowerCase() === type.toLowerCase() ){
	    		child = children[i];
	    		break;
	    	}
	    }
	    return child
	}

	element_proto.remove=function(){
		this.parentElement.removeChild( this );
	}
	
	if( !element_proto.hasAttribute ){
		element_proto.hasAttribute=function( attribute_key ){
			var attr=this.getAttribute( attribute_key );
			return ( attr!==null )? true : false;
		}
	}
	
	element_proto.insideText=function( ){
       var text=this.innerText || this.textContent;
       return text;
    }
	
	element_proto.replaceWith=function( new_element ){
		if( isAppendable( new_element ) ){
			this.parentElement.replaceChild( new_element, this );
			return new_element
		}else{
			var type_e=typeof new_element
			throw new Error( type_e+" is not an appendable element" );
		}

    }
	
	element_proto.removeChildren=function(){
	    while( this.childNodes.length>0 ){
		    this.removeChild( this.firstChild );
	    }
	    return this
	}
	
	element_proto.prepend=function( new_element ){
		if( isAppendable( new_element ) ){
			if( this.childNodes.length>0 ){
				this.insertBefore( new_element, this.firstChild );
				return new_element;
			}else{
				return this.appendChild( new_element );
			}
		}else{
	    	throw new Error( "given node can be be appended before" );
	    }
	}
	
	element_proto.appendBefore=function( node ){
	    if( isAppendable( node ) ){
			this.parentElement.insertBefore( node, this );
			return node
	    }else{
	    	throw new Error( "given node can be be appended before" );
	    }
	    //return this
	}

	element_proto.appendAfter=function( node ){
		if( isAppendable( node ) ){
			var sibling = this.nextElementSibling;
			if( sibling !== null ){
				sibling.appendBefore( node );
			}else{
			    this.parentElement.appendChild( node );
			}
			
			return node
	    }else{
	    	throw new Error( "given node can be be appended after" );
	    }	
	}
	
	//use element.nextElementSibling instead ( IE9 + )
	/*element_proto.nextElement=function(){
		var next_elem=false;
		current=this
		while( next_elem===false ){
			current=current.nextSibling;
			if( isHTMLElement( current ) ){
				return current;
			}else{
				if( current===null ){
					throw new Error( "node has no next sibling element" );
				}
			}
		}
	}*/
	
	//use element.previousElementSibling instead ( IE9 + )		
	/*element_proto.prevElement=function(){
		var prev_elem=false;
		current=this
		while( prev_elem===false ){
			current=current.previousSibling;
			if( isHTMLElement( current ) ){
				return current;
			}else{
				if( current===null ){
					throw new Error( "node has no previous sibling element" );
				}
			}
		}
	}*/
	
	//use element.firstElementCild instead ( IE9 + )	
	/*element_proto.firstChildElement=function(){
        var children=this.childNodes,
        L=children.length;
        if( L>0 ){
            var first_index=0,
            first=children[ first_index ];
            while( !isHTMLElement( first ) ){
                first_index+=1;
                if( first_index<L ){
                    first=children[ first_index ];
                }else{
                    throw new Error( "element has no child HTML Elements" );
                }
            }
            return first
        }else{
            throw new Error( "node has no children can not find first child element" );
        }
    }*/
   
   	//use element.lastElementCild instead ( IE9 + )
    /*element_proto.lastChildElement=function(){
        var children=this.childNodes,
        L=children.length;
        if( L>0 ){
            var last_index=L-1,
            last=children[ last_index ];
            while( !isHTMLElement( last ) ){
                last_index-=1;
                if( last_index>=0 ){
                    last=children[ last_index ];
                }else{
                    throw new Error( "element has no child HTML Elements" );
                }
            }
            return last
        }else{
            throw new Error( "node has no children can not find last child element" );
        }
    }*/
	
	/*element_proto.nearestParent=function( type ){
		var match=false,
	    current_parent=this;
	    while( match===false ){
			var current_parent=current_parent.parentElement;
			if( current_parent.nodeName.toLowerCase()===type.toLowerCase() )
			{
				match=current_parent;
				break;
			}else{
				if( current_parent.nodeName==='BODY' )
				{
					throw new Error( ' no '+type+' was not found to be parent of selected '+this.nodeName.toLowerCase() );
				}
			}
	    }
	    return match
	}*/
	
	element_proto.nearestParent=function( type ){
		var current_parent = this.parentElement;
		if( current_parent === null || current_parent.nodeName.toLowerCase() === type.toLowerCase() ){
			return current_parent;
		}
		
		if( current_parent.nodeName.toLowerCase() !== type.toLowerCase() ){
			return current_parent.nearestParent( type );
		}
		
	}
	
	/*element_proto.nearestParentClass=function( class_name ){
        var match=false,
        current_parent=this;
        while( match===false ){
            var current_parent=current_parent.parentElement;
            if( current_parent.hasClass( class_name ) )
            {
                match=current_parent;
                break;
            }else{
                if( current_parent.nodeName==='BODY' )
                {
                    var e=' no parent element with class '+class_name+' was found for node '+this.nodeName.toLowerCase();
                    throw new Error( e );
                }
            }
        }
        return match
    }*/
    
    element_proto.nearestParentClass=function( class_name ){
		var current_parent = this.parentElement;
		if( current_parent === null || current_parent.hasClass( class_name ) ){
			return current_parent;
		}	
		if( !current_parent.hasClass( class_name ) ){
			return current_parent.nearestParentClass( class_name );
		}       
    }
	
	
})(window);

//prototype for node lists
(function(window){

	var html_collection_proto=HTMLCollection.prototype;
	var node_list_proto=( typeof StaticNodeList === "undefined" )? NodeList.prototype : StaticNodeList.prototype;
	
	function each( list, callback ){
		for( var i=0, L=list.length; i<L; i+=1 ){
			callback( list[i], i );
		}
	}
	
	html_collection_proto.each=function( callback ){
		each( this, callback );
	}
	
	node_list_proto.each=function( callback ){
		each( this, callback );
	}

})(window);


//tag functions
(function(window){
	
	window.textNode=function( text )
    {
		return document.createTextNode( text )
    }
	
	window.documentFragment=function()
	{
		return document.createDocumentFragment();
	}

	window.multiFragment=function( obj )//pass object full of elements return fragment
	{
		var frag=document.createDocumentFragment();
		for( prop in obj ){
			if( isAppendable( obj[prop] ) ){
				frag.appendChild( obj[prop] )
			}
		}
		return frag
	}
	
	function addTagEvents( tag, obj )
	{
        if( typeof obj==='object' ){
			for(prop in obj){
				if( typeof obj[prop]==='function' ){
					tag.addEvent( prop, obj[prop] );
				}
			}
		}
    }
	
	//events uses add event be sure to not use 'this' keyword if supporting ie8 
	window.createElement=function( tag_name, obj )
    {
		var tag=document.createElement( tag_name );
		
		if( typeof obj==='object' ){
			
			for( prop in obj ){
				
				switch( prop ){
					case 'text':
						( typeof obj[prop]==='string' )? tag.appendChild( document.createTextNode( obj[prop] ) ) : false;
					    break;
					case 'innerHTML':
						( typeof obj[prop]==='string' )? tag.innerHTML=obj[prop] :false; 
					    break;
					case 'child':
					    ( isAppendable( obj[prop] ) )? tag.appendChild( obj[prop] ) : false;
					    break;
					case 'events':
						addTagEvents( tag, obj[prop] );
					    break;
					default:
					    ( typeof obj[prop]==='string' )? tag.setAttribute( prop, obj[prop] ): false;
				}
			}
		}
		return tag;
	}

})(window);


(function(window){

    function mouseMove(e){
        var element= e.srcElement||e.currentTarget,
        top=e.clientY-( element.clientHeight/2 ),
        left=e.clientX-( element.clientWidth/2 );
        console.log( top+' '+left );
        element.style.top=top+'px';
        element.style.left=left+'px';
    }

    function mouseDown(e){
        var element= e.srcElement||e.currentTarget;
        element.style.position="absolute";
        element.setCapture();
        element.addEvent( 'mousemove', mouseMove  )
    }

    function mouseUp(e){
        var element= e.srcElement||e.currentTarget;
        element.releaseCapture();
        element.removeEvent( 'mousemove', mouseMove  )
    }

    window.makeDraggable=function( element ){
        element.addEvent('mousedown', mouseDown );
        element.addEvent('mouseup', mouseUp );   
    }


})(window);



(function(window){

	window.getUrlValue=function( val ){
		function compare( segment, val ){
			var comparison = segment.split('=');
			return ( comparison[0] === val )? comparison[1] : false;
		}
		
		var url_vars = window.location.search.substr(1), match=false, segment_compare;
		if( url_vars.indexOf('&')===-1 ){
			match=compare( url_vars, val );
		}else{
			var split_segments = url_vars.split('&');
			for( var i=0, L=split_segments.length; i<L; i+=1 ){
				segment_compare = compare( split_segments[i], val );
				if( segment_compare !== false ){ 
					match=segment_compare;
					break;
				}
			}
		}
		return match
	}
	
	window.loadScripts=function( script_srcs, callback ){
		var loaded=0,
		finished=false,
		head=document.getElementsByTagName('head')[0],
		frag = document.createDocumentFragment(),
		L=script_srcs.length,
		tag;
		
		for( var i=0; i<L; i+=1 ){
			tag=document.createElement('script');
			tag.src=script_srcs[i]
			tag.onload=function(){ 
				loaded+=1; 
				if( loaded===L ){
					callback();
					finished=true;
				}
			}
			frag.appendChild( tag );
		}
		head.appendChild(frag);
	}
	
	window.minMaxRandomNumber = function( min, max ){
   		return Math.floor( Math.random() * ( max - min + 1 ) + min );
	}

	//put in obj and a string path to get value or false if undefined
	window.getObjValueFromString=function(obj,name_path){
		var path=name_path.split(/\./g),path_part
		obj_val=false;
		temp=obj;
		for( var i=0, L=path.length; i<L; i+=1 ){
			 path_part=path[i];
			 if( typeof temp[path_part] !=='undefined' ){
				if( i===path.length-1 ){   
					obj_val=temp[path_part];
				}else{
					temp=temp[path_part];
				}  
			}else{
				break;
			}
		}
		return obj_val
	}

	window.bindMustacheString=function( str, obj ){
		var pattern=/({{\s*)+(\w+|\d+|\.+)+(\s*}})/g;
		return str.replace( pattern, function(s){
			var prop=s.replace( /{{\s*|\s*}}/g,'' ),
			obj_val=getObjValueFromString( obj, prop );
			if( obj_val!== false ){
				return obj_val
			}else{
				var e='could not bind a property to location of {{ '+prop+' }} '+prop+' is not a property of supplied object';
				throw new Error( e );
			}	
		})
	}

})(window);


(function( window ){//ajax module no dependencies 

	function getXMLHttp(){
		var xmlHttp
		try{
			xmlHttp = new XMLHttpRequest();
		}catch(e){
			try{
				xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
			}catch(e){
				try{
					xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
				}catch(e){
					alert("Your browser does not support AJAX!")
					return false;
				}
			}
		}
		return xmlHttp;
	}
	
	/*	EXAMPLE AJAX INIT OBJ
		{
			url:"http://myajaxurl.com",
			method:"POST",
			send:JSON.stringify( { test:"test", test2:"test2" } ),
			content_type:"text/html",
			async:true,
			success:function( data ){  //data function },
			error:function( e_code, e_message ){ //handle error }
		}
	*/
	window.Ajaxer=function( obj ){
		var xmlHttp = getXMLHttp(),
		send_info=( obj.hasOwnProperty('send') && obj.method === 'POST')? obj.send : null,
		headers=( obj.hasOwnProperty('content_type') )? obj.content_type : "application/x-www-form-urlencoded",
		async = ( obj.hasOwnProperty('async') )? obj.async : true;
		xmlHttp.open( obj.method, obj.url, async );
		if( obj.hasOwnProperty('headers') ){
			var additional_headers = obj.headers;
			for( prop in additional_headers ){
				xmlHttp.setRequestHeader( prop, additional_headers[prop] );
			}
		}
		xmlHttp.setRequestHeader( "Content-type", headers );
		xmlHttp.send( send_info );

		xmlHttp.onreadystatechange=function(){
			//console.log( "rdy stat="+xmlHttp.readyState+" status="+xmlHttp.status )
			if(xmlHttp.readyState===4 && xmlHttp.status===200){
				obj.success( xmlHttp.responseText );
			}
			else if( xmlHttp.status>200 ){
				if(obj.hasOwnProperty('error') ){
					if( typeof obj.error==='function' ){
						obj.error( xmlHttp.status, statusText  )
					}
				}
			}  
		}
	}

})( window );
