window.base_url=window.location.protocol+"//"+window.location.host ;
window.constants={
	"base_url":base_url,
	"ajax_url":base_url+"/ajax/",
	"ajax_in_progress":false,
	"resources_directory":"/pics"
}

window.controller={
	"postJson":function( url, reply_obj, callback ){
		var self=this;
		if( !constants.ajax_in_progress ){
		
			constants.ajax_in_progress=true;
			Ajaxer({
				method:'POST',
				url:url,
				send: encodeURIComponent('json')+'='+encodeURIComponent( JSON.stringify( reply_obj ) ),
				success:function( d ){
					constants.ajax_in_progress=false;
					callback(d);
				},
				error:function( e_code, e_message ){
					constants.ajax_in_progress=false;
					alert(  e_code+" "+e_message );
				}
			})
		}
	},
	
	"getText":function( url, callback ){
		var self=this;
		if( !constants.ajax_in_progress ){
		
			constants.ajax_in_progress=true;
			Ajaxer({
				method:'GET',
				url:url,
				success:function( d ){
					constants.ajax_in_progress=false;
					callback(d);
				},
				error:function( e_code, e_message ){
					constants.ajax_in_progress=false;
					alert(  e_code+" "+e_message );
				}
			})
		}
	},
	
	"callApi":function( service, values_obj, callback, wait ){  //if wait is set to false do not check ajax in progress status
		var self=this,
		wait_check = ( wait === false )? false : true;
		
		if( !wait_check || !constants.ajax_in_progress ){
			if( wait_check ){ constants.ajax_in_progress=true };
			Ajaxer({
				method:'POST',
				url:"/api",
				content_type:"application/json",
				headers:{
					"X-Api-Service":service //custom request header to tell api which service to call
				},
				send: JSON.stringify( values_obj ),
				success:function( d ){
					if( wait_check ){ constants.ajax_in_progress=false };
					callback(d);
				},
				error:function( e_code, e_message ){
					if( wait_check ){ constants.ajax_in_progress=false };
					alert(  e_code+" "+e_message );
				}
			})
		}
	},
}

window.box_action = {
	"centerFixedBox":function( element ){
		var elm_width = element.clientWidth,
		height = (element.clientHeight/2)*-1,
		width = (elm_width/2)*-1;
		element.style.marginTop=height+'px';
		element.style.marginLeft=width+'px';
	}
}

function removeInlineStyle( element, property ){
	if ( element.style.removeProperty ) {
		element.style.removeProperty( property );
	}else{
		element.style.removeAttribute( property );
	}
}

function getAlertMessageIcon( bool ){
	var icon;	
	if( bool ){
		icon = "thumbsup.png"
	}else{
		icon = "warning.png"
	}
	return 	constants.base_url+"/style/resources/"+icon;
}

//shared with manager and blog pages
/*
    @elm audio element
*/
makeFlashAudioEmbed = function(elm){
   	var src = elm.src,
   	flash_vars = 'config={"autoPlay":false,"autoBuffering":false,"showFullScreenButton":false,"showMenu":false,"videoFile":"'+src+'","loop":false,"autoRewind":true}',
   	embed = createElement("embed", {
        height:"22",
        flashvars:flash_vars,
        pluginspage:'http://www.adobe.com/go/getflashplayer',
        quality:'high',
        allowscriptaccess:'always', 
        allowfullscreen:'true', 
        bgcolor:'#ffffff', 
        src:'/scripts/FlowPlayerClassic.swf', 
        type:'application/x-shockwave-flash'
   	}),
   	audio = elm.parentElement;
    audio.replaceWith(embed);				
}


