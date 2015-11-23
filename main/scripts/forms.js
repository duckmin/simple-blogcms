//PUT 'LOADSCRIPTS' 'GETOBJVALFROMSTRING' AND 'MUSTACHE' IN WORKER FRIENDLY LIB IF USING AF
//LIB THEN TAKE THOSE FUNCTIONS OUT AND LOAD AF BEFORE THIS ONE

//so onchange event can be fired programatically
window.onchangeevent = new MouseEvent('change', {
	'view': window,
    'bubbles': true,
    'cancelable': true
});

//put in obj and a string path to get value or false if undefined
function getObjValueFromString(obj,name_path){
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

function bindMustacheString( str, obj ){
	var pattern=/({{\s*)+(\w+|\d+|\.+)+(\s*}})/g;
	var mustaches=str.match( pattern );
	if( mustaches.length>0 )
	{
		mustaches.forEach( function(prop){
			var obj_prop=prop.replace( /{{\s*|\s*}}/g,'' );
			var obj_val=getObjValueFromString( obj, obj_prop );
			if( obj_val!==false ){
				str=str.replace( prop, obj_val );
			}
			else{
				throw 'could not bind a property to location of {{'+obj_prop+'}}'+obj_prop+' is not a property of supplied object';
			}
		} )
	}
	return str
}

//end element extender includes

function bindPathToObject( obj, name, value ){
    var name_path=name.split( '.' ),selected=obj,temp;
  
    for( var i=0,L=name_path.length; i<L; i+=1 ){
        if( i===name_path.length-1 ){
            selected[ name_path[i] ]=value;
        }else{
            temp=selected[ name_path[i] ];
            if( typeof temp==='undefined'  )
            { 
               selected[ name_path[i] ]={};
            }
			selected=selected[ name_path[i] ];
        }
    }
}

function nodeListCycler( node_list, config ){
	var node, node_type;
	for( var i=0, L=node_list.length; i<L; i+=1 ){
        node=node_list[i];
		node_type=node.nodeName.toLowerCase();
		//console.log( node.name );
		if( config.hasOwnProperty( node_type ) ){
			if( typeof config[ node_type ]==='function' ){
				config[ node_type ]( node )
			}
		}
    }
}

function bindSelectValue( node, obj_val ){
	var options=node.getElementsByTagName('option');
	for( var i=0, L=options.length; i<L; i+=1 ){
		console.log(  options[i].value.toLowerCase() === obj_val.toLowerCase() )
		if( options[i].value.toLowerCase() === obj_val.toLowerCase() ){
			options[i].selected=true;
			break;
		}
	}
}

function bindMultiSelectValue( node, obj_vals_array ){ //takes an array and selects all values in muti select with array
	var options=node.getElementsByTagName('option');
	for( var i=0, L=options.length; i<L; i+=1 ){
		if(  obj_vals_array.indexOf( options[i].value ) !== -1 ){
			options[i].selected=true;
		}
	}
}


function FormClass( form_element ){
	this.form_element=form_element;
	
	this.getFormElements=function( callback ){
		var nodes=this.form_element.querySelectorAll( 'input[name], textarea[name], select[name]' );
		callback( nodes );
	}
}

FormClass.prototype.bindValues=function( obj ){
	function ifObjHasValueCallback( node, callback ){
		var obj_val=getObjValueFromString( obj, node.name );
		if( obj_val!==false ){
			callback ( node, obj_val );
		}
	}
	
	this.getFormElements( function( nodes ){
		nodeListCycler( nodes, {
			"textarea":function( textarea ){
				ifObjHasValueCallback( textarea, function( node, obj_val ){
					node.value=obj_val
				})
			},
			"select":function( select ){
				ifObjHasValueCallback( select, function( node, obj_val ){
					if( !select.hasAttribute("multiple") ){					
						bindSelectValue( node, obj_val );
					}else{
						if( obj_val instanceof Array ){
							bindMultiSelectValue( node, obj_val );
						}
					}
				})
			},
			"input":function( input ){
				ifObjHasValueCallback( input, function( node, obj_val ){
					if( node.type==='text' || node.type==='hidden' ){
						node.value=obj_val;
						node.dispatchEvent(onchangeevent);
					}
					if( node.type==='checkbox' ){
						if( obj_val===true || obj_val===false ){
							node.checked=obj_val
						}
					}
					if( node.type==='radio' ){
						if( node.value.toLowerCase()===obj_val.toLowerCase() ){
							node.checked=true;
						}
					}
					if( node.type==='range' ){
						if( typeof obj_val==='number' && obj_val>=node.min && obj_val<=node.max ){
							node.value=obj_val;
						}
					}
				})
			}
		} )
	})
}

function getMultipleSelectValues( node ){
	var options=node.getElementsByTagName('option'),
	vals = [];
	for( var i=0, L=options.length; i<L; i+=1 ){
		if( options[i].selected === true ){
			vals.push( options[i].value );
		}
	}
	return vals
}

FormClass.prototype.getValues=function(){
	var obj={};
	this.getFormElements( function( nodes ){
		nodeListCycler( nodes, {
			"textarea":function( textarea ){
				 bindPathToObject( obj, textarea.name, textarea.value );
			},
			"select":function( select ){
				if( !select.hasAttribute("multiple") ){					
					bindPathToObject( obj, select.name, select.options[select.selectedIndex].value );
				}else{
					bindPathToObject( obj, select.name, getMultipleSelectValues( select ) );
				}
			},
			"input":function( input ){
				if( input.type==='text' || input.type==='hidden' || input.type==='password' ){
					bindPathToObject( obj, input.name, input.value );
				}
				if( input.type==='checkbox' ){
					bindPathToObject( obj, input.name, input.checked );
				}
				if( input.type==='radio' ){
					if( input.checked===true ){
						bindPathToObject( obj, input.name, input.value );
					}
				}
				if( input.type==='range' ){
					bindPathToObject( obj, input.name, parseInt(input.value) );
				}
			}
		} )
	} )
	return obj
}

function clearSelect( node ){
	var options=node.getElementsByTagName('option');
	for( var i=0, L=options.length; i<L; i+=1 ){
		if( options[i].selected === true ){
			options[i].selected=false;
		}
	}
}

FormClass.prototype.clearForm=function(){
	var obj={};
	this.getFormElements( function( nodes ){
		nodeListCycler( nodes, {
			"textarea":function( textarea ){
				 textarea.value="";
			},
			"select":function( select ){
				clearSelect(select )
			},
			"input":function( input ){
				if( input.type==='text' || input.type==='hidden' || input.type==='password' ){
					input.value="";
					input.dispatchEvent(onchangeevent);
				}
				if( input.type==='checkbox' || input.type==='radio' ){
					input.checked=false;
				}
				if( input.type==='range' ){
					input.value=input.min;
				}
			}
		} )
	} )
	return obj
}

//if not including element extender take these functions out

FormClass.prototype.setStrLen=function(){
	function setLen(e){
		var elm=e.srcElement||e.currentTarget;
		var max_length=parseInt( elm.getAttribute('str-len') );
		var text_len=elm.value.length;
		
		if( !isNaN(max_length) && text_len>max_length ){
			var limit_val=elm.value.substr( 0, max_length );
			elm.value=limit_val;
		}
	}
	
	var inputs=this.form_element.querySelectorAll('input[type=text][str-len], textarea[str-len]');
	inputs.each( function( field ){
		field.addEvent( 'keyup' , setLen );
	})
}

FormClass.prototype.setInputRestrictions=function(){
	function setRestriction(e){
		var elm=e.srcElement||e.currentTarget;
		var restriction=elm.getAttribute('input-restriction');
		var pat=false;
		switch( restriction ){
			case 'integer':
				pat=/\d+/g;
				break;
			case 'float':
				pat=/\d+\.?\d*/g;
				break;
			case 'char':
				pat=/[A-z\s]+/;
				break;
		}
		
		if( pat!==false ){
			var matches=elm.value.match( pat );
			var val=( matches!==null )? matches.join() : "";
			elm.value=val;
		}
	}
	
	var inputs=this.form_element.querySelectorAll('input[type=text][input-restriction], textarea[input-restriction]');
	inputs.each( function( field ){
		console.log(field);
		field.addEvent( 'keyup' , setRestriction );
	})
}

function onreturn( element, callback ){
    element.addEvent('keydown', function(e){
        var keycode=e.charCode || e.keyCode,
        target = e.srcElement||e.currentTarget;
        
        if( keycode===13 ){
            callback( element );
        }
    })
}

//end remove functions


/* test ground

var a={
    'name':'robert',
    'stats':{
        'birthday':'08/24/1988',
        'age':24,
        'more':{
            'more2':{
            
                'more3':{
                    'more6':{
                        'sup':'found me!'
                    }
                }
            }
        }
    }
}

var prop="stats.more.more2.more3.more6";
var d=getObjValueFromString(a,prop);
console.log(d);
*/