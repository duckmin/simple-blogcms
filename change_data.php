#!/usr/bin/php

<?php
	/* this script is to clean data in mongo blog collection to clean up dev data */
	@include dirname(__FILE__)."/server/configs.php";
	
	function generateTitleKey( $title ){
		$title = strtolower( $title );
		//strip out all non word chars
		$title =  preg_replace ( "/[^\w\d\s]/", "", $title );
		//replace spaces with hyphens
		$title = preg_replace ( "/\s/", "-", $title );
		return $title;
	}	
	
	$amt_posts = 10;
	$next = true;
	$db_name = MONGO_DB_NAME;
	$mongo_conn = MongoConnection();
	$db = $mongo_conn->$db_name;
	$page_num = 1;
	$skip = $amt_posts+1;
	$filter = array();
	$collection = $db->posts;	
	
	$change = true;
	$change = false;
	
	while( $next ){
		$count = ( $page_num-1 )*$amt_posts;
		$cursor = $collection->find( $filter )->limit($skip)->skip($count)->sort( array( 'lastModified' => -1 ) );
		$cursor = iterator_to_array( $cursor, false );
		$next = ( count($cursor) > $amt_posts )? true : false;
		for($i = 0; $i < $amt_posts; $i++ ){
			if( isset($cursor[$i]) ){
				$item = $cursor[$i];
				$id = $item["_id"];
				$title = $item["title"];
				
				if( !$change ){
					//print_r($item);
					echo $item["title_key"]."\n";
					//echo "$id\n";
				}else{
					$title_key = generateTitleKey( $title );
					$mongo_id = new MongoId( $id );
					$fields = array( '$set'=>array( "title_key"=> $title_key ) );			
					$cursor2 = $collection->update( array( "_id"=>$mongo_id ), $fields );
					print_r($cursor2);
				}
			}
		}
		$page_num++;
	}
?>