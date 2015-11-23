(function(window){

	window.myAxes = {
        Views:{
            keys:["views"],
            position:"right",
            type:"numeric",
            labelFunction: function (val) {
            	var display =val.toFixed(1);
                return display;
            }
        },
        Date:{
            keys:["date"],
            position:"bottom",
            type:"category"
        }
    };


	window.styleDef = {
	    axes:{
	        Views:{
	            label:{
	                color:"#ff0000"
	            }
	        },
	        Date:{
	            label:{
	                rotation:-45,
	                color: "#ff0000"
	            }
	        }
	    },
	    series:[
	        {
	            marker: {
	                fill: {
	                    color: "blue"
	                },
	                border: {
	                    color: "black",
	                    weight: 3
	                },
	                over: {
	                    width: 15,
	                    height: 15
	                },
	                width:12,
	                height:12
	            },
	            line: {
	                color: "orange"
	            }
	        },
	        {
	            marker: {
	                fill: {
	                    color: "yellow"
	                },
	                border: {
	                    color: "green",
	                    weight: 3
	                },
	                over: {
	                    width: 15,
	                    height: 15
	                },
	                width:12,
	                height:12
	            },
	            line: {
	                color: "blue"
	            }
	        }   
	    ]
	};
		 
	// Create a new YUI instance and populate it with the required modules.
		
		YUI().use('charts', function (Y) {
			// Instantiate and render the chart
	
			window.loadChart = function( data ){
				if( typeof mychart === "undefined" ){				
					var chart = gEBI('views-graph');
					window.mychart = new Y.Chart({
					    dataProvider: data,
					    type:"combo",
					    render: chart,
					    styles:styleDef,
					    // interactionType:"planar",
					    axes:myAxes,
					    categoryAxisName:"Date",
					    valueAxisName:"Views",
					    horizontalGridlines:true,
		                verticalGridlines:true
					});
				}else{
					mychart.set( "dataProvider", data );
				}
			}
			
			
		});	
	
	window.getUniqueUrlPage = function ( element ){
		Ajaxer({
			url:constants.ajax_url+'?action=11',
			method:"GET",
			success:function( data ){ 
				element.innerHTML = data
				element.firstChild.addClass('selected-multi');
			},
			error:function( e_code, e_message ){  }
		})
	}
	
	window.getGraphPage = function(){
 		var section = document.querySelector("section[data-tab='analytics']"),
 		form = 	section.querySelector("ul.form-list"),
 		form_class = new FormClass( form ),
 		values = form_class.getValues();	
		//console.log(values);
		
		controller.postJson( constants.ajax_url+'?action=12', values, function(d){
			var resp = JSON.parse( d);
			if( resp.length > 0 ){
				console.log( resp );
				//mychart.set( "dataProvider", resp );
				loadChart( resp );
			}else{
				showAlertMessage( "No Data For Date Range Selected", false );
			}
		})
		
		
	}
	
	window.urlClickAction = function( element ){
		var url = element.getAttribute("data-url"),
		parent_ul = element.nearestParent('ul'),
		section = element.nearestParent("section"),
		hidden = section.querySelector("ul.form-list input[type='hidden']");
		hidden.value = url;
		//console.log(hidden.value);	
		getGraphPage();
		parent_ul.querySelectorAll("li.selected-multi").each( function(li){
			li.removeClass("selected-multi");
		});
		element.addClass("selected-multi");
	}


})(window);