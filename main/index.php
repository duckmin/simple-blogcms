<?php
	$root_dir = dirname(__FILE__)."/../";
	include_once $root_dir."/server/configs.php";
	$url_parts = $GLOBALS['url_parts'];	
	$part_count = count( $url_parts );
	$first_url_part = $url_parts[0];
	
	if( $first_url_part === "" ){
        //if base url show all posts ?after date
		$file = '/server/pages/html/date_blog.php';
	}elseif( preg_match("/^(2|3)[0-9]{3}$/", $first_url_part ) ){
		//first is a YYYY date bring to post page
		$file = '/server/pages/html/post.php';
	}else{	
		switch ( $first_url_part ) {
			
			case "search":
				$file = '/server/pages/html/search_page.php';
				break;
				
			case "hashtag":
				$file = '/server/pages/html/hashtag.php';
				break;
				
			case "ajax":
				$file = '/server/pages/ajax.php';
				break;
				
			case "api":
				$file = '/server/pages/api_router.php';
				break;
				
			case "submit-search":
				$file = '/server/pages/search.php';
				break;
				
			case MANAGER_KEYWORD:
				$file = '/server/pages/manager.php';
				break;
				
			case "logout":
				$file = '/server/pages/logout.php';
				break;
				
			case "thumb":
				$file = '/server/pages/thumbnail_view.php';
				break;
						
			default:
				$file = "";
				break;

		}
		
	}
	
	if( $file !== "" ){
		include_once( $root_dir.$file ); 
	}else{
		goTo404();
		die();
	} 
?>