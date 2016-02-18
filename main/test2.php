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
	
	/*$initial_date = "2015-4-02";
	$s1 = strtotime($initial_date);
	$md = new MongoDate( $s1 );
	echo var_dump($md);
	echo "<br>";
	$it2 = 1425346156;
	$md2 = new MongoDate( $it2 );
	echo var_dump($md2);*/
	
	//tsst
	
	
?>