<?php
//THIS IS NOT parsedown.org/ version or parsedown
//this class was just named parsedown for convenience and will be renamed eventually 


class Parsedown {
	
	public function normalize( $str ){
		//get rid of any html
		$str = strip_tags( $str );
		//we will remove \r's, trim \n's, and make no more than 2 \n's in a row
		$str = trim( $str );
		$str = str_replace(array("\r"), array(''), $str);
		$str = trim($str, "\n");
		//if more than three \n chars in a row put two in its place 
   		$str = preg_replace( "/(\\n){3,}/", "\n\n", $str );
		return $str;
	}
	
	private function addEmbelishments( $block ){
			$block = trim($block);
			
			//add <b></b>
			$block = preg_replace_callback( "/[*]{2}(.+?)[*]{2}/", function($m){
				return "<b>$m[1]</b>";
			}, $block );
			
			//add <em></em>
			$block = preg_replace_callback( "/[_]{2}(.+?)[_]{2}/", function($m){
				return "<em>$m[1]</em>";
			}, $block );
			
			//add <s></s>
			$block = preg_replace_callback( "/[~]{2}(.+?)[~]{2}/", function($m){
				return "<s>$m[1]</s>";
			}, $block );
			
			//add links @ http://link.com | link text |    <a href="http://link.com">link text</a>
			$block = preg_replace_callback( "#@\s*((http|https)://(www.|)[A-z0-9]+.[A-z\.]{2,5}[%A-z0-9\/+]+(\?{1}[&A-z0-9=%]+|))\s*\|\s*([!?A-z0-9\s]+)\|#", function($m){
				//echo var_dump( $m );
				$link_text = trim($m[5]);
				return "<a href=\"$m[1]\" target=\"_blank\" >$link_text</a>";
			}, $block );
			
			//turn all hashtags into links for hashtag pages
			$block = preg_replace_callback( "/#{1}([A-z0-9]+)/", function($m){
				$lower_case_hash = strtolower($m[1]);
				return "<a href=\"/hashtag/$lower_case_hash\">#$m[1]</a>";
			}, $block );
			
			return $block;
	}
	
	private function makeHeadingBlock( $block ){
		return preg_replace_callback( "/^(!{1,6})\s*(.+)/s", function($m){
			$h_count = strlen( $m[1] );
			return "<h$h_count>$m[2]</h$h_count>";
		}, $block );
	}
	
	private function makeParagraphBlock( $block ){
		return "<p>$block</p>";
	}
	
	private function makeBlockquoteBlock( $block ){
		return preg_replace_callback( "/^\>(.+)/s", function($m){
			$text = trim( $m[1] );
			return "<blockquote>$text</blockquote>";
		}, $block );
		return "<blockquote>$block</blockquote>";
	}
	
	private function makeListBlock( $block ){
		$block = preg_replace_callback( "/^-\s(.+)$/m", function($m){
			$text = trim( $m[1] );
			return "<li>$text</li>";
		}, $block );
		return "<ul>$block</ul>";
	}
	
	public function splitBlocks( $str ){
		return $split = preg_split ( "/(\\n){2}/", $str );
	}
	
	private function makeBlocks( $str ){
		$split = $this->splitBlocks($str);//preg_split ( "/(\\n){2}/", $str );
		$converted_str = "";
		//echo var_dump($split);
		foreach( $split as $block ){
			//identify which method to run to transform each block
			$block = $this->addEmbelishments( $block );
			
			//heading block
			if( preg_match( "/^(!{1,6})/", $block ) ){
				//if block starts with 1-6 !(exclamation points)
				$block = $this->makeHeadingBlock($block);
			}elseif( preg_match( "/^\>/", $block ) ){
				//if block starts with a >
				$block = $this->makeBlockquoteBlock($block);
			}elseif( preg_match( "/^-\s/", $block ) ){
				//if block starts with -
				$block = $this->makeListBlock($block);
			}else{
				//if not special block it is a paragraph
				$block = $this->makeParagraphBlock($block);
			}
			//remove \n's from block
			$converted_str .= str_replace(array("\n"), array(" "), $block);
		}
		return $converted_str;
	}
	
	public function text( $str ) {
		$str = $this->normalize($str);
		$str = $this->makeBlocks($str);
		return $str;	
	}
	  
}

?>