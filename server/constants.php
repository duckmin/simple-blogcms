<?php

//in this file are listed all the easily changed configuration settings for Duckmins BlogCMS 
//these are avail to every script that passing through the framework routing system 
/*DO NOT CHANGE*/
define("SERVER_PATH", dirname(__FILE__));
define("INDEX_PATH", SERVER_PATH."/../main");
/* END DO NOT CHANGE */

//these values can be changed according to your environment, and to affect some page behaviors 

//mongo DB name project uses
define("MONGO_DB_NAME", "simple_blog");

//string used to connect to mongo instance, example: "mongodb:///tmp/mongodb-27017.sock"
define("MONGO_CONNECTION_STRING", "");

//keyword used to access manager page (no spaces!),  this should be changed to something random to make your manager page not obvious
define("MANAGER_KEYWORD", "manager");

//where page cache saves txt files 
define("CACHE_DIR", "/tmp");

//folder where mustache {{ prop }} templates are stored  
define("TEMPLATE_DIR", SERVER_PATH."/templates");

//folder where temp image thumbnail files are created and then copied into mongo file store
define("TMP_FILE_DIRECTORY", "/tmp");

//audio and video files allowed to be uploaded through the manager
//if adding new type add a new permitted extension (image or audio) & mime type
$GLOBALS["upload_vars"] = array(
	"allowed_image_extensions"=>array("gif", "jpeg", "jpg", "png", "JPG"),
	"allowed_audio_extensions"=>array("mp3"),
	"allowed_mimetypes"=>array("image/jpeg", "image/gif", "image/jpg", "image/png", "audio/mpeg"),
	"max_kb_img_upload"=>200,
	"max_mb_audio_upload"=>40
);
$GLOBALS["upload_vars"]["allowed_extensions"] = array_merge ( $GLOBALS["upload_vars"]["allowed_image_extensions"], $GLOBALS["upload_vars"]["allowed_audio_extensions"] );

//# of posts that show up per page
define("AMOUNT_ON_MAIN_PAGE", 2);

//# of post previews that show up underneath post when viewing post url 
define("AMOUNT_OF_NEXT_POSTS", 4);

//# of posts that show up on the "posts" tab in the manager
define("AMOUNT_ON_MANAGER_TAB", 1);

//minutes until cache file expires
//caching is only used in file ./server/pages/html/date_blog.php,  removing the caching logic and keeping the mongo/display logic in this file can remove this feature
define("MAX_PAGE_CACHE_MINS", -5);//turned off for dev turn on for prod to reasonable amount of mins

//minutes until cache file expires (long version)
//3 days this is used for costly DB operations that do not need to be constantly updated
define("LONG_PAGE_CACHE_MINS", (3*24*60) );

//max # of characters in post title 
define("MAX_TITLE_LENGTH", 500);

//max # of characters in post description
define("MAX_DESC_LENGTH", 500);

//max # of characters in post description
define("MAX_POPULAR_HASHTAG_LIMIT", 1000);  //limits list size of most popular hashtags *1000 is for debug set to sane limit*

//autoload any class in /server/classes naming scheme with this function
spl_autoload_register('myAutoloader');

function myAutoloader( $className ){
    $path = SERVER_PATH.'/classes/';
    include $path.$className.'.php';
}

function MongoConnection(){
	return new MongoClient(MONGO_CONNECTION_STRING);
}

?>