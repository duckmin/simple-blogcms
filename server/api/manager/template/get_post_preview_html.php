<?php	
	$json = $_APIVALS;
	$post_view = new PostViews( new Parsedown );
	$form_data = $json["post_data"];
	$template_data = $json["template_data"];
	$post_template = file_get_contents( TEMPLATE_DIR."/blog_post.txt" );
	$post_preview = file_get_contents( TEMPLATE_DIR."/post_preview.txt" );		
	
	$single = array();
	$single["_id"] ="5428784f7f8b9afe1a779e93";  //just a dummy ID means nothing 
	$single["lastModified"] = new MongoDate();
	$single["title"] = $form_data["title"];
	$single["post_data"] = $template_data;
	$single["author"] = $_SESSION['user'];
	$single["description"] = $form_data["description"];
	$single["display_hashtags"] = $post_view->extractHashtagsFromPostData( $template_data );
	$single["hashtags"] = array_unique( array_map("strtolower", $single["display_hashtags"]) );
	$single["preview_text"] = $post_view->getPreviewTextFromMarkdown( $template_data );
	
	echo $post_view->makePostHtmlFromData( $single, $post_template );
	
	//for preview only want post_data array populated with one 'data-posttype':'image' item
	$single["post_data"] = array();
	//return the first one in an array
	foreach( $template_data as $item ){
	    if( $item["data-posttype"] === "image" ){
	        $single["post_data"] = array($item);
	        break;
	    }
	}

	//if image not found unset and preview method logic kicks in
	if( count($single["post_data"]) !== 1 ){
	    unset($single["post_data"]);
	} 
	
	echo $post_view->makePostPreviewHtmlFromData( $single, $post_preview );
?>