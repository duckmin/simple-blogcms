<?php
	include_once dirname(__FILE__)."/../configs.php";
	
	class AsideViews
	{
		public function formatHashtagList( $label, $hashtag_array ){
			$list = "<li>$label</li>";
			foreach( $hashtag_array as $hashtag ){
				$lower_hashtag = strtolower( $hashtag );
				$list .= "<li><a href=\"/hashtag/$lower_hashtag\"><span>#</span>$hashtag</a></li>";
			}
			return "<ul>$list</ul>";
		}
		
		public function formatHashtagCountList( $label, $hashtag_array ){
			$list = "<li>$label</li>";
			foreach( $hashtag_array as $hashtag=>$count ){
				$list .= "<li><span>#</span>$hashtag&nbsp;<span>$count</span></li>";
			}
			return "<ul class=\"most-used-hashtags\" >$list</ul>";
		}
	}
	
?>