<?php
	$server = dirname(__FILE__)."/../server";
	
	include_once $server."/configs.php";
	/*$db = MongoConnection();
	$id = new MongoId( "56056409ce95181c26aa05db" );  //long post with plenty of text
	$collection = $db->blog->posts;					
	$item = $collection->findOne(array('_id'=>$id));
	//echo var_dump( $item );
	$post_data = $item["post_data"];
	//echo var_dump( $post_data )."<br><br>";
	
	$blogdown = new Parsedown();
	$post_views = new PostViews( $blogdown );
	echo $post_views->getPreviewTextFromMarkdown( $post_data )."<br><br>";
	echo var_dump( $post_views->extractHashtagsFromPostData( $post_data ) );*/
	
	function genSalt(){  //salt generator for the BLOWFISH crypt algorithm, 22 base64 characters  
		$chars = array('a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','0','1','2','3','4','5','6','7','8','9');
		$salt_str = "";
		for( $i = 0; $i < 22; $i++ ){
			$ran_index = rand(0,count($chars)-1);
			$ran_item = $chars[$ran_index];
			if( !is_numeric($ran_item) ){
				//0 false, > 0 true 
				$uppcase = rand(0,1);
				if( $uppcase ){
					$ran_item = strtoupper($ran_item);
				}
			}
			$salt_str .= $ran_item;
		}
		return "$2a$07$".$salt_str;
	}
	$pw = 'rasmuslerdorf';
	$salt = genSalt();
	$digest = crypt($pw, $salt);	
	//echo var_dump($digest);
	
	if (crypt($pw, $digest) == $digest){ echo "MATCH"; }else{ echo "NNONONO"; }
	
	
	//TEST TO GET TIMESTAMP OF ONE POST AND GET THE NEXT POST BACK IN TIME
	//$time = 1427140819000/1000;	
	//$d = new MongoDate(time());
	//echo time();
	//var_dump($d);
	
	//echo var_dump( isset($_COOKIE["sort"]) );
	//echo var_dump((int)$_COOKIE["sort"]);
	
	
	
	/*try{
	    $grid = $db->blog->getGridFS();
	    $path ="/var/www/html/blogcms/main/pics/222/";
	    $filename="crang.JPG";
	    //$storedfile = $grid->storeFile($path . $filename, array("metadata" => array("filename" => $filename), 
	    //"filename" => $filename));
	    $grid->remove( array("filename" => $filename) );
	}catch( MongoGridFSException $e ){
		echo "XXXX";
		echo $e->getMessage();
	}	
	
	$stock_thumb = INDEX_PATH."/style/resources/no-thumbnail.png";
			//$fp = fopen($stock_thumb, 'rb');
			header('Content-Type: img/png');
			$img = imagecreatefrompng($stock_thumb);
			imagepng($img);*/
?>