<?php
	//included in index.php which has configs.php included already
	$base = BASE_URL;
	$url = $_SERVER["REQUEST_URI"];
	
	if( $part_count !== 2 ){
		//wrong amount of URL params
		goTo404();
		exit;
	}
	
	$_GET['search'] = urldecode( $url_parts[1] );	
	$search = $_GET['search'];
	$time = ( isset($_GET['after']) )? $_GET['after'] : time();
	
	try{
	    $db = MongoConnection();
		$db_getter = new MongoGetter( $db ); 
		$parsedown = new Parsedown();				
    	$post_views = new PostViews( $parsedown );
    	$post_controller = new PostController( $db_getter, $post_views );	
		$aside_views = new AsideViews();
		$aside_controller = new AsideController( $db_getter, $aside_views );
		
		$mongo_results = $post_controller->getSearchPagePostsAfterTime( $time, $search ); //false if no result set
		$hashtags_of_past_year_list = $aside_controller->getPastYearsHashtagsLinksBox();
		$popular_hashtags_list = $aside_controller->getMostPopularHashtagsLinksBox();
		$GLOBALS['db_aside_content'] = $db_aside_content = $popular_hashtags_list.$hashtags_of_past_year_list;
	}catch( MongoException $e ){
		//echo $e->getMessage();
		//Mongo error, go to 404 page		
		goTo404();
		exit;
	}		
			
	if( $mongo_results ){
		$safe_search = htmlspecialchars($search, ENT_QUOTES);
		$template = file_get_contents( TEMPLATE_DIR."/base_page.txt" );
		$title = $_SERVER['HTTP_HOST']." | search '$safe_search'";		
		$desc = $_SERVER['HTTP_HOST']." - browse search '".$safe_search;
		//need to special chars anything using $search param that gets inserted into HTML
		$tmplt_data = array();
		$tmplt_data["title"] = $title;
		$tmplt_data["description"] = $desc;
		$tmplt_data["styles"] = "";
		$tmplt_data["scripts"] = "";
		$tmplt_data["base"] = $base;
		$tmplt_data["search_value"] = $safe_search;		
		$tmplt_data["header"] = "<li class=\"current-cat\" ><a href=\"/search/$safe_search/\">&quot;$safe_search&quot;</a></li>";
		$tmplt_data["body"] = $mongo_results;
		$tmplt_data["aside_content"] = $db_aside_content;
		
		$full_page = TemplateBinder::bindTemplate( $template, $tmplt_data );
		echo $full_page;
	}else{
		//if mongo results are false go to 404,	logic in getHomePagePosts Funtion			
		goTo404();
	}
	
	
?>
