<?php
	//included in index.php which has configs.php included already
	$base = BASE_URL;
	$url = $_SERVER["REQUEST_URI"];
	$cache = new CacheController( CACHE_DIR, $url );
	
	if( $cache->urlInCache() && !$cache->cacheMinutesOverLimit( MAX_PAGE_CACHE_MINS ) ){   
	    echo $cache->pullUrlContentFromCache();
	    //echo "cached";
        exit;	
    }
    
    if( $part_count > 1 ){
	    goTo404();
	    exit;
	}	

	//part-count defined in index.php    
	$time = ( isset($_GET['after']) )? $_GET['after'] : time();
	
	try{
	    $db = MongoConnection();
		$db_getter = new MongoGetter( $db ); 
		$parsedown = new Parsedown();				
    	$post_views = new PostViews( $parsedown );	
    	$post_controller = new PostController( $db_getter, $post_views );
		$mongo_results = $post_controller->getHomePagePostsByTime( $time ); //false if no result set
	}catch( MongoException $e ){
		//echo $e->getMessage();
		//Mongo error, go to 404 page		
		goTo404();
		exit;
	}			

	if( $mongo_results ){
    	$template = file_get_contents( TEMPLATE_DIR."/base_page.txt" );
    	$title = "Main page - ".$_SERVER['HTTP_HOST'];		
    	$desc= $_SERVER['HTTP_HOST']." - browse ";
        $scripts = "";
		
		$tmplt_data = array();
		$tmplt_data["title"] = $title;
		$tmplt_data["description"] = $desc;
		$tmplt_data["styles"] = "";
		$tmplt_data["scripts"] = $scripts;
		$tmplt_data["base"] = $base;
		$tmplt_data["search_value"] = "";		
		$tmplt_data["header"] = "";
		$tmplt_data["body"] = $mongo_results;
		
		$full_page = TemplateBinder::bindTemplate( $template, $tmplt_data );	
		$cache->saveUrlContentToCache( $full_page ); //save page to cache
		echo $full_page;
	}else{
		//if mongo results are false go to 404,	logic in getHomePagePosts Funtion			
		goTo404();
	}
	
?>