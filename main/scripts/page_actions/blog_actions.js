
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

addEvent( window, "load", function(){
	//attributeActions( document.body, "data-blogaction", {
		
	//});
	
	//take the data-ts (UTC) attribute of every artical and convert to local time
	convertTimeStamps( document.querySelector(".main") );
})
