#!/usr/bin/php

<?php
	/* this script is a cron job that should be ran monthly to remove old anytic data
	the timing can be adjusted if you wish to keep more than 1 months analytic data at a time */
	
	date_default_timezone_set('America/New_York');
	$mongo_con = new MongoClient("mongodb:///tmp/mongodb-27017.sock");
	$today = date( "Y-m-d" );
	$ts = strtotime( $today."-30 days" );
	
	$mongo_date = new MongoDate( $ts );
	$collection = $mongo_con->blog->analytics;	
	$cursor = $collection->remove( array( "date"=>array( '$lt'=>$mongo_date ) ) );
	$amount_removed = $cursor["n"];
	
	//you can log amount removed and current date however you wish
?>