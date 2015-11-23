<?php
	include_once dirname(__FILE__)."/../configs.php";
	
	class PostViews
	{
        public $lazy_load_imgs = false;
        
        public $MAX_PREVIEW_STR_LENGTH = 150;
        
		function __construct( Parsedown $parsedown )
		{
			$this->parsedown = $parsedown;
		}
		
		public function paginator( $last_timestamp, $url_add, $paginator_template ){
			$data = array(
                "base_url"=>BASE_URL.$url_add,
                "after_ts"=>$last_timestamp
			);
			return TemplateBinder::bindTemplate( $paginator_template, $data );
		}
		
		//used in save_mongo.php and get_preview.php 
		public function getPreviewTextFromMarkdown( $post_data_array ){
			$preview = "";
			foreach( $post_data_array as $post_item ){
				
				$post_type = $post_item["data-posttype"];
				if( $post_type === "markdown" ){
					 $text = $post_item["text"];
					 $text = $this->parsedown->normalize($text);
					 $split = $this->parsedown->splitBlocks( $text );
					 
					 foreach( $split as $block ){
					 	if( !preg_match( "/^(!{1,6}|>|-)/", $block ) ){ //only get block that do not begin with special symbol (paragraphs)
					 		$block = preg_replace ( "#\bhttp://[^\s]+\b#", "", $block );  //strip out any hrefs
					 		$block = preg_replace ( "#_{2}#", "", $block );  //take out __ which are <em> in blogdown they are treated as A-z in regex
					 		$word_matches = array();
					 		preg_match_all( "/\b[\w\d\']+\b(\,|\.|\'|!|\?|)/", $block, $word_matches );  //this way only words and punctuation get targeted and no markdown
					 		foreach( $word_matches[0] as $single_word ){
					 			$preview .= " $single_word";
					 			if( strlen( $preview ) >= $this->MAX_PREVIEW_STR_LENGTH ){
					 				$preview .= "...";
					 				break 3;  //reached max length break out of all loops and go to return
					 			}
					 			
					 		}
					 	}
					 }
				}
			}
			return substr( $preview, 1); //trim off extra space
		}
		
		//used in save_mongo.php and get_preview.php 
		public static function extractHashtagsFromPostData( $post_data_array ){
			$hashes = array();
			foreach( $post_data_array as $post_item ){
				$post_type = $post_item["data-posttype"];
				if( $post_type === "markdown" ){
					preg_match_all( "/#{1}([A-z0-9]+)/", $post_item["text"], $hash_matches );
					if( isset($hash_matches[1]) ){ 
						$tmp = array_map("strtolower", $hash_matches[1]);  //lower case al hashes found in block
						foreach( $tmp as $hsh ){  //check each found hash to see if it has already been added if not add it
							if( !in_array($hsh, $hashes) ){
					 	 		array_push( $hashes, $hsh );
					 	 	}
					 	}
					}
				}
			}
			return $hashes;
		}
		
		private function makeItem( $post_data_array ){
			$element = "";
			switch( $post_data_array[ "data-posttype" ] ){
				
				case "markdown":			
					$text = $this->parsedown->text( strip_tags( $post_data_array[ "text" ] ) );
					$element = $text;
					break;
					
				case "image":
					$src = strip_tags( $post_data_array[ "src" ] );
					$alt_val = strip_tags( $post_data_array[ "alt" ] );
					$alt = ( $alt_val !== "" )? $alt_val : "Image Failed to Load";
					if( $this->lazy_load_imgs){ 
					//lazy loading images option is for blog.php when blog_scroll_actions.js is loaded on page to load images when post is in view
					   $element = "<img data-src=\"$src\" src=\"\" alt=\"$alt\" />";
				    }else{
				       $element = "<img src=\"$src\" alt=\"$alt\" />";
				    }
					break;
					
				case "audio":
					$src = strip_tags( $post_data_array[ "src" ] );
					$element = "<audio   controls>
                        <source onerror=\"makeFlashAudioEmbed(this)\"  src=\"$src\" type=\"audio/mpeg\">
                    </audio> ";
					break;
					
				case "video":
					$src = strip_tags( $post_data_array[ "src" ] );
					$element = "<div class=\"iframe-embed\" ><iframe src=\"$src\" ></iframe></div>";
					break;
					
			}
			//echo var_dump( $element );
			return $element;
		}
	
		private function formatSinglePost( $data ){
			$count = count( $data );
			$inner_post = "";
			for( $i = 0; $i < $count; $i++ ){
				$single_item = $this->makeItem( $data[ $i ] );
				$inner_post .= $single_item;
			}
			return $inner_post;
		}
		
		public function convertPostTitleSpacesToHyphens( $title ){
			if( preg_match( "/\s/", $title ) ){
				$title = preg_replace ( "/\s/", "-", $title );
			}
			return $title;
		}	
		
		public function convertPostTitleHyphensToSpaces( $title ){
			if( preg_match( "/-/", $title ) ){
				$title = preg_replace ( "/-/", " ", $title );
			}
			return $title;
		}					
		
		//takes a blog post row from mongo and returns a modifed row with converted values used for URLs
		public function convertRowValues( $row ){
			$id = new MongoId( $row["_id"] );  
			$time_stamp = $row["lastModified"]->sec;//$id->getTimestamp();
			$dt = new DateTime("@$time_stamp");	   	  	    	   	  	    
			$row["created"] = $dt->format('F d, Y g:i');			    	    
			$row["id"] = $id->__toString();
			//parse date modified to use in direct URL to post
			$date_of_post = date_parse( $row["created"] );
			$row["month"] = $date_of_post["month"];
			$row["day"] = $date_of_post["day"];
			$row["year"] = $date_of_post["year"];	
			$row["safe_title"] = $this->convertPostTitleSpacesToHyphens( $row["title"] );
			//post_url logic in pages/html/post.php
			$row["post_url"] = "/".$row["year"]."/".$row["month"]."/".$row["safe_title"];
			return $row;
		}		
		
		
		public function makePostHtmlFromData( $row, $template ){		
			$structure = $this->convertRowValues( $row );
			$structure["time_stamp"] = $structure["lastModified"]->sec * 1000; //for js accurrate UTC conversion
			$structure["inner"] = $this->formatSinglePost( $row["post_data"] );
			$structure["hashtag_options"] = $this->generateHashtagsOptionsForPostForm( $row["hashtags"] );
			$structure["base"] = BASE_URL;
			return TemplateBinder::bindTemplate( $template, $structure );	
		}
		
		public function makePostPreviewHtmlFromData( $row, $template ){		
			$structure = $this->convertRowValues( $row );
			$structure["time_stamp"] = $structure["lastModified"]->sec * 1000; //for js accurrate UTC conversion
			$structure["base"] = BASE_URL;
			$structure["hashtag_links"] = $this->generateHashtagsLinksForPreview( $row["hashtags"] );
			return TemplateBinder::bindTemplate( $template, $structure );	
		}
		
		//when search returns no results show this HTML
		public function emptySearchHtml( $search, $template ){		
			$structure = array();
			$structure["search_term"] = htmlspecialchars($search, ENT_QUOTES);
			return TemplateBinder::bindTemplate( $template, $structure );	
		}
		
		private function generateHashtagsLinksForPreview( $hashtag_array ){
			sort( $hashtag_array );
			$hash_links = "";
			foreach( $hashtag_array as $hashtag ){ 
				$hash_links .= "<span><a href=\"/hashtag/$hashtag\">#$hashtag</a></span>";
			}
			return $hash_links;
		}	
		
		private function generateHashtagsOptionsForPostForm( $hashtag_array ){
			$hash_options = "";
			foreach( $hashtag_array as $hashtag ){ 
				$hash_options .= "<option selected=\"\" value=\"$hashtag\" >$hashtag</option>";
			}
			return $hash_options;
		}		
		
	}
	
?>