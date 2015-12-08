<?php
	//included in index.php which has configs.php included already
	$base = BASE_URL;
	$bad_url = htmlspecialchars($_SERVER["REQUEST_URI"], ENT_QUOTES);				
	$template = file_get_contents( TEMPLATE_DIR."/base_page.txt" );
	$title = "Page Not Found - ".$_SERVER['HTTP_HOST'];		
	$desc	= 	"404 ".$_SERVER['HTTP_HOST'];
	$entry_template_404 = file_get_contents( TEMPLATE_DIR."/404_entry.txt" );
	$entry_data_404 = array(
		"bad_url" => "$base$bad_url"	
	);
	$article = TemplateBinder::bindTemplate( $entry_template_404, $entry_data_404 );
	
	if( !isset($GLOBALS['db_aside_content']) ){  //it is possible that this query was already made and then this page was included on an error, check to see if $db_aside_content has been generated
		try{
		   $db = MongoConnection();
			$db_getter = new MongoGetter( $db ); 			
	    	$aside_views = new AsideViews();
			$aside_controller = new AsideController( $db_getter, $aside_views );
			
			$hashtags_of_past_year_list = $aside_controller->getPastYearsHashtagsLinksBox();
			$popular_hashtags_list = $aside_controller->getMostPopularHashtagsLinksBox();
			$db_aside_content = $popular_hashtags_list.$hashtags_of_past_year_list;
		}catch( MongoException $e ){
			//echo $e->getMessage();
			$db_aside_content = "";
		}	
	}else{
		$db_aside_content = $GLOBALS['db_aside_content'];
	}
	
	$tmplt_data = array();
	$tmplt_data["title"] = $title;
	$tmplt_data["description"] = $desc;
	$tmplt_data["styles"] = "";
	$tmplt_data["scripts"] = "";
	$tmplt_data["base"] = $base;
	$tmplt_data["search_value"] = "";		
	$tmplt_data["header"] = "";
	$tmplt_data["body"] = $article;
	$tmplt_data["aside_content"] = $db_aside_content;
	
	$full_page = TemplateBinder::bindTemplate( $template, $tmplt_data );
	echo $full_page;
		

?>
