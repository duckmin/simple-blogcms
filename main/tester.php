<?php
	$server = dirname(__FILE__)."/../server";

	include_once $server."/configs.php";
	
	$db = MongoConnection();
	$db_getter = new MongoGetter( $db ); 
	/*$most_recent = $db_getter->getMostRecentPostTimestamp();
	//echo print_r($most_recent);
	$start = $most_recent["lastModified"]->sec;
	$start_date = date("Y-m-d", $start );
	$end = strtotime("$start_date -12 months");
	//echo date("Y-m-d H:i:s", $end )."<br>"; 
	
	$s1 = strtotime("2015-11-27 +23 hours 59 minutes 59 seconds");
	$e1 = strtotime("2015-11-27");
	
	echo date("Y-m-d H:i:s", $s1 )."<br>";
	echo date("Y-m-d H:i:s", $e1 )."<br>";
	
	$distinct_hashtags = $db_getter->getDistinctHashtagsForDateRange( $start, $end );
	echo print_r( $distinct_hashtags );

	//test query for distinct hashtag range
	//db.posts.distinct('hashtags',{lastModified:{$lt:ISODate("2015-11-24T23:59:59.999Z"),$gt:ISODate("2015-11-24T00:00:00.000Z")}})
	*/
	
	$aside_views = new AsideViews();
	$aside_controller = new AsideController( $db_getter, $aside_views );
	//$aside_controller->getPastYearsHashtagsLinksBox();
	
	
	//start hashtag count operation test
	/*
	$max = 2;
	
	$count_holder = $aside_controller->getPopularHashtagFullCountArray();
	echo print_r($count_holder );
	arsort($count_holder);
	$slice = ( count($count_holder) > $max )? array_slice($count_holder, 0, $max) : $count_holder;
	echo print_r($slice);
	*/
	$aside_controller->getMostPopularHashtagsLinksBox();
	
?>