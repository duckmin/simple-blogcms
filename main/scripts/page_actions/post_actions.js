


(function(window){

function articleAtBottom(){
	var article = document.querySelector(".main > article:last-of-type"),
	article_height = article.clientHeight,
	offset_top = article.offsetTop,
	win_height = window.innerHeight,
	bottom_of_window_to_top = (  win_height +  window.pageYOffset  ),
    amt_post_visable = ( bottom_of_window_to_top - offset_top ),
	distance_from_bottom = ( amt_post_visable - article_height );
	
	if( distance_from_bottom >= 0 ){
		loadNextPostPreview();
		loadRelatedHashtagsPreview();
		removeEvent( window, "scroll", articleAtBottom );
	}
}

function loadNextPostPreview(){
	var ts = document.querySelector("section.main > article > p:first-of-type > time[data-ts]").getAttribute("data-ts"),
	html_area = gEBI("next-posts"),
	send = {ts:ts};
	
	controller.callApi( 'PagesGet_next_posts_by_timestamp', send, function( data ){ 
		if(data.length > 0){
			html_area.innerHTML+=data;
		}else{
			html_area.style.display = "none";
		}
	}, false)
}

function loadRelatedHashtagsPreview(){
	var form = document.querySelector("section.main > article > form"),
	form_class = new FormClass( form ),
	vals = form_class.getValues(),
	html_area = gEBI("related-hashtags");
	delete vals.created; //do not send timestamp back 
	
	controller.callApi( 'PagesGet_posts_related_hashtags', vals, function(data){
		if(data.length > 0){
			html_area.innerHTML+=data;
		}else{
			html_area.style.display = "none";
		}
	}, false)
}

addEvent(window, "load", function(e){
	addEvent( window, "scroll", articleAtBottom );
	articleAtBottom();
})






})(window);
