<?php
$server = dirname(__FILE__)."/../server";
	
include_once $server."/configs.php";
	//try{
	//$db = MongoConnection();
	//}catch( MongoCursorException $e ) {	
		//	echo $e->getMessage()."\n";
	//}
	
	//phpinfo();
	//$dt = date('Y-m-d'); //todays date with no time
	
	//$ts = new MongoDate( strtotime( $dt." 00:00:00" ) ); //time of 00:00:00 because we only want 1 record per page per day
	//$url = "http://localhost:8080/video";	
		//echo "sdsad";
	//$write_result = $db->blog->analytics->update( array("url"=>$url,'date'=>$ts), array('$inc'=>array('views'=>1)), array('upsert'=>true) );
	//$written = ( $write_result['n'] === 1 )? true : false;				
	
	
	/*$cursor = $db->blog->analytics->find();
	
	foreach( $cursor as $post ){
		echo $post["views"]."<br>";
	}*/
	////echo  var_dump( filter_var($_SERVER['REMOTE_ADDR'], FILTER_VALIDATE_IP) );
	
	
	//FOR USE WITH THE GD PHP LIB
	/*$src = INDEX_PATH."/pics/amazon/dove.jpg";
	$img_info = getimagesize($src);
	echo var_dump($img_info);
	$width = $img_info[0];
	$height = $img_info[1];
	$aspect_width = 50;
	$aspect_height = round( $height / $width * $aspect_width );
	//imagescale ( $img , $aspect_width, $aspect_height );
	$img_p = imagecreatetruecolor( $aspect_width, $aspect_height ); //frame for img to be copied into
	$img = imagecreatefromjpeg( $src );
	imagecopyresampled($img_p, $img, 0, 0, 0, 0, $aspect_width, $aspect_height, $width, $height);
	imagejpeg($img_p, INDEX_PATH."/pics/amazon/dove-thumb.jpg", 100); //save resized img canvas to new src
	*/
	
	/*$initial_date = "2015-4-02";
	$s1 = strtotime($initial_date);
	$md = new MongoDate( $s1 );
	echo var_dump($md);
	echo "<br>";
	$it2 = 1425346156;
	$md2 = new MongoDate( $it2 );
	echo var_dump($md2);*/
	
	//tsst
	
	class Constants {
		const URL = "HTTP";
		//public static $url = dirname(__FILE__);
	}		

	define( "SERVER_PATHo", dirname(__FILE__) );
define( "INDEX_PATHo", SERVER_PATHo."/../main" );
	
	echo INDEX_PATHo;
?>