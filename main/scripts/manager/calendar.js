
//REQUIRES ELEMENT EXTENDER.JS
(function(window){
	window.calendar={};
	calendar.months=['January','Febuary','March','April','May','June','July','August','September','October','November','December'];
	calendar.days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	window.mills_in_second=1000;
	window.mills_in_minute=mills_in_second*60;
	window.mills_in_hour=mills_in_minute*60;
	window.mills_in_day=mills_in_hour*24;
	window.mills_in_week=mills_in_day*7;
	
	window.allDateObjectsInMonthYear=function( month, year, prev_day, date_obj, holder ){
    	var curr_month = month-1,
    	date = date_obj || new Date( year, curr_month ),
    	yesterdays_day = prev_day || 0,
    	todays_day = date.getDay()+1,
    	a = holder || [],
    	utc =  date.getTime(),
    	tomorrow;
	    if( date.getMonth() === curr_month ){
	        ( todays_day !== yesterdays_day )? a.push( date ) : false;
	        tomorrow = new Date( utc + mills_in_day )
	        return allDateObjectsInMonthYear( month, year, date.getDay()+1, tomorrow, a );
	    }else{
	        return a
	    }
	}
	
	calendar.isValidMMDDYYYY=function( date ){
		var pat=/^\d{1,2}[\/-]{1}\d{1,2}[\/-]{1}\d{4}$/;
		return pat.test( date );
	}
	
	calendar.formatMMDDYYYY=function( date_obj ){
		var month = date_obj.getMonth()+1,
		date = date_obj.getDate(),		
		year = date_obj.getFullYear(),
		m = ( month < 10 )? "0"+month : month,
		d = ( date < 10 )? "0"+date : date;
		
		return m+"/"+d+"/"+year;
	}
	
	calendar.todaysDateNoTime = function(){
		var d = new Date()
		h = d.getHours()*mills_in_hour,
		m=d.getMinutes()*mills_in_minute,
		s=d.getSeconds()*mills_in_second,
		mill=d.getMilliseconds(),
		total = h+m+s+mills,
		midnight = new Date( ( d.getTime() - total ) );
		return midnight
	}

})(window);


//DEPANCIES IN ELEMENT EXTENDER.JS 
(function( window ){
		
	window.getDaysFrag=function(  month, year, click ){
		var all_days_in_month = window.allDateObjectsInMonthYear( month, year ), 
		day_index=0, 
		L=all_days_in_month.length,
		frag=documentFragment(),
		day_in_view, tr, cell;
		while( day_index< L ){
			tr=createElement( "tr");
			for( var i=0; i<7; i+=1 ){
				day_in_view = all_days_in_month[ day_index ];
				if( typeof day_in_view !== "undefined" && calendar.days[i] === calendar.days[ day_in_view.getDay() ] ){					
					cell=createElement( "td", {
						"class":"cal-date",
						"data-utc":day_in_view.getTime().toString(),
						"data-date":calendar.formatMMDDYYYY( day_in_view ),
						"text":day_in_view.getDate().toString()
					});
					if( typeof click === 'function' ){ click( cell ) }
					tr.appendChild( cell );
					day_index+=1;
				}else{
					tr.appendChild( createElement( "td") );
				}
			}
			frag.appendChild( tr );
		}
		return frag
	}
	
	window.dateBox=function(  month, year, click ){
		return createElement("table",{
			"child":multiFragment({
				"header":createElement("thead",{
					"child":multiFragment({
						/*"month":createElement( "tr", {
							"child":createElement( "th", {
								"colspan":"7",
								"text":calendar.months[month-1]+" "+year
							})
						}),*/
						"days":createElement( "tr", {
							"child":multiFragment((function(){
								var obj={};
								calendar.days.forEach( function(day){
									obj[day]=createElement( "th", { "text":day.substr(0,3) } )
								} );
								return obj
							})() )
						})
					})
				}),
				"body":createElement( "tbody", {
					"child":getDaysFrag(  month, year, click )
				})
			})
		})
	}
	
	function monthOptions( selected_month ){
		var frag=documentFragment(), month;
		calendar.months.forEach( function( month, i ){
			month=createElement( "option", {
				"text":month,
				"value":( i+1 ).toString()
			} );
			( ( i+1 )===selected_month )? month.setAttribute( "selected", "" ) : false;
			frag.appendChild( month );
		} );
		return frag;
	}
	
	function yearOptions( selected_year ){
		var frag=documentFragment(), year, curryear=new Date().getFullYear();
		for( var i=curryear-2; i<=curryear; i+=1 ){
			year=createElement( "option", {
				"text":i.toString(),
				"value":i.toString()
			} );
			( i===selected_year )? year.setAttribute( "selected", "" ) : false;
			frag.appendChild( year );
		}
		return frag;
	}
	
	//click param is a callback so you can add events to the cells
	/*
		var datebox=new DateBox( 5, 2014, function(cell){
			cell.addEvent( "click", function(e){
				var elm=e.target,
				utc=elm.getAttribute("data-utc"),
				date=elm.getAttribute("data-date");
				console.log( utc+' '+date)
			})
		});
	*/
	window.DateBox=function( month, year, click ){
		this.month=month;
		this.year=year;
		this.container=this.dateSelectorBox( click );
	}
	
	DateBox.prototype.loadNewDate=function( click ){
		var table=this.container.getElementsByTagName('table')[0],
		//th=table.getElementsByTagName('thead')[0].getElementsByTagName('th')[0],
		t_body=table.getElementsByTagName('tbody')[0],
		interior=getDaysFrag(  this.month, this.year, click );
		t_body.removeChildren().appendChild( interior );
		//th.innerHTML=calendar.months[this.month-1]+" "+this.year
	}
	
	DateBox.prototype.dateSelectorBox=function( click ){
		var self=this,
		container=createElement("div",{
			"class":"date-box",
			"child":multiFragment({
				"month_selector":createElement("select",{
					"child":monthOptions( this.month ),
					"events":{
						"change":function(){
							var selected=this.options[ this.options.selectedIndex ].value;
							self.month=parseInt( selected );
							self.loadNewDate( click );
						}
					}
				}),
				"year_selector":createElement("select",{
					"child":yearOptions( this.year ),
					"events":{
						"change":function(){
							var selected=this.options[ this.options.selectedIndex ].value;
							self.year=parseInt( selected );
							self.loadNewDate( click );
						}
					}
				}),
				"calendar":dateBox(  this.month, this.year, click )
			})
		})
		
		return container
	}

})( window );


//code for date picker
(function(window){

	window.datePickClick=function( e ){
		var element=e.currentTarget,
		parent=element.parentElement;
		
		if( parent.querySelector('div.date-box') === null ){
			parent.style.position="relative";
			var width=element.clientWidth,
			height=element.clientHeight,
			rects = element.getBoundingClientRect(),
			distance_from_bottom = (window.innerHeight - rects.bottom ),
			value=element.value,
			current_date, month, year, currentMMDDYYYY;
			if( calendar.isValidMMDDYYYY( value ) ){
				current_date=new Date( Date.parse( value ) );
				currentMMDDYYYY = value;
				month=current_date.getMonth()+1;
				year=current_date.getFullYear();
			}else{
				current_date=new Date();
				currentMMDDYYYY = calendar.formatMMDDYYYY( current_date );
				month=current_date.getMonth()+1;
				year=current_date.getFullYear();
			}
			
			var datebox=new DateBox( month, year, function(cell){
				var cell_date = cell.getAttribute("data-date");
				( cell_date === currentMMDDYYYY )? cell.addClass('today') : false;
				
				cell.addEvent( "click", function(e){
					var elm=e.currentTarget,
					utc=elm.getAttribute("data-utc"),
					date=elm.getAttribute("data-date");
					element.value=date;
					cell.nearestParentClass("date-box").remove();
					parent.style.removeProperty('position');
				})
			});
			
			datebox.container.style.position="absolute";
			datebox.container.style.zIndex="9999";
			datebox.container.style.visibility="hidden";
			var date_container = parent.appendChild( datebox.container ),
			date_container_height = date_container.clientHeight,
			room_below_input = ( distance_from_bottom > date_container_height ),
			left = element.offsetLeft - width,
			top = ( room_below_input )? element.offsetTop + height : ( element.offsetTop ) - ( height + date_container_height );
			
			date_container.style.top=top+"px";
			date_container.style.left=( left+width )+"px";
			date_container.style.removeProperty('visibility');
			
		}
		
	}
	
	window.datePickBlur=function( e ){
		var element=e.currentTarget,
		parent=element.parentElement;
		parent.getElementsByClassName("date-box")[0].remove();
		parent.style.removeProperty('position');
	}
	
	window.setDatePickers=function( element ){
		var elm = element || document;
		elm.querySelectorAll("input[data-datepick]").each( function( input ){
			input.addEvent( "click", datePickClick );
			//input.addEvent( "blur", datePickBlur );
		})
	}

})( window );
