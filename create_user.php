#!/usr/bin/php

<?php
	/* this script is used to add a user into the mongo users collection to login to the manager page with */
	include dirname(__FILE__)."/server/constants.php";
	
	$options = getopt( "u:p:l:" );
	
	if( array_key_exists("u", $options) ){
		$username = strtolower($options["u"]);
	}else{
		echo "must include the option -u <username>\n";
		exit;
	}
	
	if( array_key_exists("p", $options) ){
		$password = $options["p"];
	}else{
		echo "must include the option -p <password>\n";
		exit;
	}
	
	if( array_key_exists("l", $options) ){
		$level = intval( $options["l"] );
	}else{
		echo "must include the option -l <level>\n";
		exit;
	}
	
	if( preg_match( "/[^A-z0-9\-$]/", $username ) ){
		echo "username can only contain characters A-z 0-9 _ -\n";
		exit;
	}
	
	if( preg_match( "/[\s]/", $password ) || strlen($password) < 5  ){
		echo "password can not contain any spaces, and must be atleast 5 characters long\n";
		exit;
	}
	
	if( !is_int($level) || $level < 1 || $level > 3 ){
		echo "level must be an integer, and must be between 1-3\n";
		echo "1 is basic user, 2 is priviledged user, 3 is admin user\n";
		exit;
	}
	
	$salt = ManagerActions::genSalt();
	$digest = crypt($password, $salt);		
	
	try{
	   $mongo_con = MongoConnection();
		$db_name = MONGO_DB_NAME;
		$collection = $mongo_con->$db_name->users;
		$mongo_id = new MongoId();			
		$document = array( 
			"_id"=>$mongo_id,
			"username"=>$username,
			"password"=>$digest,
			"level"=>$level						    	
		);
		$write_result = $collection->insert($document);				
		$written = ( $write_result['ok'] >= 1 )? true : false;			 
		$message = ( $written )? "User $username added" : "Failed to add user to database";
		echo $message."\n";
	}catch( MongoException $e ){
		//echo $e->getMessage()."\n";
		echo "User $username already exists\n";
	}		

?>