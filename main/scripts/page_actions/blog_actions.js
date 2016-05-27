
function timeFormatter( h, m ){
	var ext = ( h>=12 )? "PM" : "AM";
	( h > 12 )? h = h-12 : false;
	( h === 0 )? h = 12 :false;
	var mins=( m<=9 )? "0"+m : m;
	return h+':'+mins+' '+ext;
}

function convertTimeStamps( element ){
	
	var months=['January','Febuary','March','April','May','June','July','August','September','October','November','December'],
	days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];	
	element.querySelectorAll("time[data-ts]").each(function(li){
		var ts = li.getAttribute("data-ts"),
		d = new Date();
		d.setTime( parseInt(ts) );
		var month = months[ d.getMonth() ],
		date = d.getDate(),
		year = d.getFullYear(),
		hours = d.getHours(),
		mins = d.getMinutes(),
		time = timeFormatter( hours, mins );
		li.innerHTML = month+" "+date+", "+year+"  "+time;
	})
}

var sort_control = {
    getCookie:function(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2){ 
            return parts.pop().split(";").shift();
        }else{
            return null;    
        }
    },
    isSortActive:function(){
        return ( this.getCookie("sort") !== null )? true : false;
    },
    activateSortOldestToNewest:function(){
        document.cookie = "sort=1; path=/";
    },
    disableSortOldestToNewest:function(){
        //remove cookie so sorting will go back to normal
        document.cookie = "sort=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"; 
    }
}

var page_action = {};

page_action.searchToggle = function(e){
	var parent = this.parentElement; //parent li
	if( parent.hasClass("show") ){
		parent.removeClass("show");
	}else{
		parent.addClass("show");
	}
}

page_action.navBarToggleInactive = function(e){
	var nav = document.querySelector("body > nav"),
	offset_top = nav.offsetTop,
	page_y = e.pageY;
	if( page_y >= offset_top ){
		nav.addClass("fixed");
		nav.setAttribute("data-scroll", offset_top );
		var nav_height = nav.clientHeight;
		nav.nextElementSibling.style.paddingTop = nav_height+"px";
		window.removeEventListener( "scroll", page_action.navBarToggleInactive );
		window.addEventListener( "scroll", page_action.navBarToggleActive );
	}
}

page_action.navBarToggleActive = function(e){
	var nav = document.querySelector("body > nav"),
	offset_top = nav.offsetTop,
	page_y = e.pageY,
	nav_scroll_num = nav.getAttribute("data-scroll");
	if( page_y <= nav_scroll_num ){
		nav.removeClass("fixed");
		nav.nextElementSibling.style.paddingTop = "0px";
		nav.removeAttribute("data-scroll");
		window.removeEventListener( "scroll", page_action.navBarToggleActive );
		window.addEventListener( "scroll", page_action.navBarToggleInactive );
	}
}

page_action.searchBarToggle = function(e){
	var uls = document.querySelectorAll("body > nav > ul"),
	menu_bar = uls[0],
	search_bar = uls[1];
	
	if( menu_bar.hasClass("hide") ){
		menu_bar.removeClass("hide");
		search_bar.addClass("hide");
	}else if( search_bar.addClass("hide") ){
		menu_bar.addClass("hide");
		search_bar.removeClass("hide");
	}
}

page_action.menuToggle = function(e){
	var menu = document.querySelector("body > aside");
	
	if( menu.hasClass("hide") ){
		menu.removeClass("hide");
	}else{
		menu.addClass("hide");
	}
}

addEvent( window, "load", function(){
	
	attributeActions( document.body, "data-everyaction", {
		"search":function(elm){
			elm.addEventListener("click", page_action.searchToggle);
		},
		"search-toggle":function(elm){
			elm.addEventListener("click", page_action.searchBarToggle);
		},
		"menu-toggle":function(elm){
			elm.addEventListener("click", page_action.menuToggle);
		},
		"menu":function(elm){
			elm.addEventListener("click", function(e){
				e.stopPropagation();
			});
		}
	});
	
	
   window.addEventListener("scroll", page_action.navBarToggleInactive );

	//take the data-ts (UTC) attribute of every artical and convert to local time
	convertTimeStamps( document.querySelector(".main") );
})
