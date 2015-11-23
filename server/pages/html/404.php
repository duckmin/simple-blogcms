<?php
	//included in index.php which has configs.php included already
	$base = BASE_URL;
	$url = $_SERVER["REQUEST_URI"];				
	$parsedown = new Parsedown();				
	$post_views = new PostViews( $parsedown );		
	$template = file_get_contents( TEMPLATE_DIR."/base_page.txt" );
	$title = "Page Not Found - ".$_SERVER['HTTP_HOST'];		
	$desc	= 	"";
	$entry_template_404 = file_get_contents( TEMPLATE_DIR."/404_entry.txt" );
	$entry_data_404 = array(
		"bad_url" => "$base$url"	
	);
	$article = TemplateBinder::bindTemplate( $entry_template_404, $entry_data_404 );
	
	//need to special chars anything using $search param that gets inserted into HTML
	$tmplt_data = array();
	$tmplt_data["title"] = htmlspecialchars($title, ENT_QUOTES);
	$tmplt_data["description"] = htmlspecialchars($desc, ENT_QUOTES);
	$tmplt_data["styles"] = "";
	$tmplt_data["scripts"] = "";
	$tmplt_data["base"] = $base;
	$tmplt_data["search_value"] = "";		
	$tmplt_data["header"] = "";
	$tmplt_data["body"] = $article;
	
	$full_page = TemplateBinder::bindTemplate( $template, $tmplt_data );
	echo $full_page;
		

?>
