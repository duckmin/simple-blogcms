<?php
	include_once dirname(__FILE__)."/../configs.php";
	
	class AsideViews
	{
		public function formatHashtagList( $label, $hashtag_array ){
			$list = "<li>$label</li>";
			foreach( $hashtag_array as $hashtag ){
				$list .= "<li><a href=\"/hashtag/$hashtag\">#$hashtag</a></li>";
			}
			return "<ul>$list</ul>";
		}
	}
	
?>