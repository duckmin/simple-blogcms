<?php
	include_once dirname(__FILE__)."/../configs.php";
	
	class AsideViews
	{
		public function formatHashtagList( $label, $hashtag_array ){
			$list = "<h2>$label</h2><ul>";
			foreach( $hashtag_array as $hashtag ){
				$lower_hashtag = strtolower( $hashtag );
				$list .= "<li><a href=\"/hashtag/$lower_hashtag\"><span>#</span>$hashtag</a></li>";
			}
			return "$list</ul>";
		}
		
		public function formatHashtagCountList( $label, $hashtag_array ){
			$list = "<li>$label</li>";
			foreach( $hashtag_array as $hashtag=>$count ){
				$list .= "<li data-hashtag=\"$hashtag\" data-newtemplateaction=\"hashtag\" ><span>#</span>$hashtag&nbsp;<span>$count</span></li>";
			}
			return "<ul title=\"Click Hashtag to Add to Currently Selected Markdown\" class=\"most-used-hashtags\" >$list</ul>";
		}
	}
	
?>