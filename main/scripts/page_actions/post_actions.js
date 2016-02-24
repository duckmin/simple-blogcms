


(function(window){

function getElementDistanceFromBottomOfPage( element ){
	var element_height = element.clientHeight,
	offset_top = element.offsetTop,
	win_height = window.innerHeight,
	bottom_of_window_to_top = (  win_height +  window.pageYOffset  ),
   amt_post_visable = ( bottom_of_window_to_top - offset_top ),
	distance_from_bottom = ( amt_post_visable - element_height );
	return distance_from_bottom;
}

function articleAtBottom(){
	var article = document.querySelector(".main > article:last-of-type"),
	distance_from_bottom = getElementDistanceFromBottomOfPage( article );
	
	if( distance_from_bottom >= 0 ){
		removeEvent( window, "scroll", articleAtBottom ); //remove current scroll event
		loadNextPostPreview();  //when the main post post reaches the bottom load next posts 
	}
}

function nextPostsAtBottom(){
	var next_posts_box = document.querySelector("#next-posts"),
	distance_from_bottom = getElementDistanceFromBottomOfPage( next_posts_box );
	
	if( distance_from_bottom >= 0 ){
		removeEvent( window, "scroll", nextPostsAtBottom );  //all posts loaded remove scroll event
		loadRelatedHashtagsPreview();
	}
}

function loadNextPostPreview(){
	var ts = document.querySelector("section.main > article > header > p:first-of-type > time[data-ts]").getAttribute("data-ts"),
	html_area = gEBI("next-posts"),
	send = {ts:ts};
	
	controller.callApi( 'PagesGet_next_posts_by_timestamp', send, function( data ){ 
		if(data.length > 0){
			html_area.innerHTML+=data;
		}else{
			html_area.style.display = "none";
		}
		addEvent( window, "scroll", nextPostsAtBottom ); //attach new scroll event to see when next posts reaches bottom of screen 
	}, false)
}

function getAllNextPostIds(){
	var next_posts = document.querySelectorAll("#next-posts > article.preview"),
	ids = [],
	post;
	for( var i=0,L=next_posts.length; i<L; i++){
		post = next_posts[i];
		ids.push(post.id);
	}
	return ids;
}

function loadRelatedHashtagsPreview(){
	var form = document.querySelector("section.main > article > form"),
	form_class = new FormClass( form ),
	vals = form_class.getValues(),
	html_area = gEBI("related-hashtags"),
	next_post_ids = getAllNextPostIds();
	console.log(next_post_ids);
	delete vals.created; //do not send timestamp back 
	next_post_ids.push(vals.id); //pass back all ids on page so far so no posts are repeated 
	vals.page_ids = next_post_ids; //turn vals into array so we can collect all ids so we get no repeat posts in related hashtags 
	console.log(vals);
	
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
