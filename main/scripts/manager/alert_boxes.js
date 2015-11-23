/* requires element extender */

function centerFixedElement( ele ){
	var append_width = ( ele.clientWidth/2 ) * -1,
	append_height = ( ele.clientHeight/2 ) * -1;
	ele.style.marginLeft = append_width+"px";	
	ele.style.marginTop = append_height+"px";
}    

function messageFixedBox( message, icon_bool, buttons ){
	var shade = createElement("div",{ "class":"backshade" } );
	var inner = createElement("div",{
		child:multiFragment({
			"icon":createElement("img",{
				 "src":getAlertMessageIcon( icon_bool )
			}),			
			"p":createElement("p",{ "text":message }),
			"ul":createElement("ul",{ 
				"class":"button-list",				
				"child":buttons
			})			
		})
	})
	var message_box = shade.appendChild( inner );
	var append = document.body.appendChild(shade);    
	centerFixedElement( message_box );
}    

function showConfirm( message, icon_bool, element, callback ){
	var buttons = multiFragment({
		"yes":createElement("li",{ 
			"text":"YES",
			"events":{
				click:function(){
					callback( element );
					this.nearestParentClass("backshade").remove();
				}
			}
		}),
		"no":createElement("li",{ 
			"text":"NO",
			"class":"red-button",
			"events":{
				click:function(){
					this.nearestParentClass("backshade").remove();
				}
			}
		}),			
	})
	messageFixedBox( message, icon_bool, buttons );
} 

function showAlertMessage( message, icon_bool ){
	var buttons = multiFragment({
		"yes":createElement("li",{ 
			"text":"OK",
			"events":{
				click:function(){
					this.nearestParentClass("backshade").remove();
				}
			}
		})	
	})
	messageFixedBox( message, icon_bool, buttons );
}       
