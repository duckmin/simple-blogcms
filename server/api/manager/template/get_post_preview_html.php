<?php	
	$json = $_APIVALS;
	$post_view = new PostViews( new Parsedown );
	$form_data = $json["post_data"];
	$template_data = $json["template_data"];
	$post_template = file_get_contents( TEMPLATE_DIR."/blog_post.txt" );
	
	$single = array();
	$single["_id"] ="5428784f7f8b9afe1a779e93";  //just a dummy ID means nothing 
	$single["lastModified"] = new MongoDate();
	$single["title"] = $form_data["title"];
	$single["post_data"] = $template_data;
	$single["author"] = $_SESSION['user'];
	$single["description"] = $form_data["description"];
	$single["hashtags"] = $post_view->extractHashtagsFromPostData( $template_data );
	
	echo $post_view->makePostHtmlFromData( $single, $post_template );
?>