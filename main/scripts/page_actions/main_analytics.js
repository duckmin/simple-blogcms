(function(window){

addEvent(window, "beforeunload", function(e){
	var analytics_key = document.querySelector("article.post").id,
	send = {
		url:analytics_key
	};
	
	Ajaxer({
		url:"/api",
		method:"POST",
		headers:{
			"X-Api-Service":"PagesCount_page_view"
		},
		send:JSON.stringify( send ),
		async:false,
		success:function( data ){ alert(data) },
		error:function( e_code, e_message ){  }
	})
})



})(window);

