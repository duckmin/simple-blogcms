(function(window){
   
	function loadImgs( article ){
        var imgs = article.querySelectorAll("img[data-src]");
        for( var i = 0, L = imgs.length; i < L; i+=1 ){
            var src = imgs[i].getAttribute("data-src");
            imgs[i].src = src;
		}    
	}
    
	function isPostInViewLoadImgs( item ){
		var space_above_post = item.offsetTop,
		win_height = window.innerHeight,
		bottom_of_window_to_top = (  win_height +  window.pageYOffset  ),
		amt_post_visable = ( bottom_of_window_to_top - space_above_post ); 
		if( amt_post_visable >= 0 ){
			item.setAttribute("data-loaded", "");
            loadImgs( item );
		}
	}    
    
    function scrollerMotion(e){
        var item = document.querySelector(".main > article:not([data-loaded])"); //get article not loaded yet
        if( item !== null ){
            isPostInViewLoadImgs( item )
        }else{
           removeEvent( window, "scroll", scrollerMotion ); 
        }
    }
    
    function initialImageLoad(){
	    var articles_on_page = document.querySelectorAll(".main > article"); 
        for( var i = 0, L = articles_on_page.length; i < L; i++ ){
           isPostInViewLoadImgs( articles_on_page[i] ); 
        }
        var img_in_view; 
    }
    
    addEvent( window, "load", function(){
		  initialImageLoad(); //run once to load any posts images that are visable
        addEvent( window, "scroll", scrollerMotion );
    });
    
})(window);
