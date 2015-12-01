<?php
	include_once dirname(__FILE__)."/../configs.php";
	
	class AsideController
	{
		const RECENT_HASHTAG_CACHE_KEY = 'recent-hashtags';	
		const POPULAR_HASHTAG_CACHE_KEY = 'popular-hashtags';	
		const MANAGER_HASHTAG_CACHE_KEY = "all-hashtag-count-list";
		const RECENT_HASHTAG_LIST_LABEL = "Recent Tags";
		const POPULAR_HASHTAG_LIST_LABEL = "Popular Tags";
		const MANAGER_HASHTAG_LIST_LABEL = "All Hashtags";
		
		function __construct( MongoGetter $db_getter, AsideViews $aside_views )
		{
			$this->mongo_getter = $db_getter;
			$this->aside_views = $aside_views;
		}
		
		public function getPopularHashtagFullCountArray(){
			$all_hashtags = $this->mongo_getter->getAllDistinctHashtags();
			
			$count_holder = array();
			foreach( $all_hashtags as $hashtag ){
			    $lower_hashtag = strtolower( $hashtag );
				$count = $this->mongo_getter->getPostsWithHashtagCount( $lower_hashtag );
				$count_holder[$hashtag] = $count;
			}
			arsort($count_holder);
			return $count_holder;
		}
		
		public function getPastYearsHashtagsLinksBox(){
			$cache_key = self::RECENT_HASHTAG_CACHE_KEY;
			$cache = new CacheController( CACHE_DIR, $cache_key );
			if( $cache->urlInCache() && !$cache->cacheMinutesOverLimit( /*LONG_PAGE_CACHE_MINS*/ -5 ) ){ //-5 so list is generated everytime for testing  
				echo "recent hashtags cached<br>";  //debug remove later 	
				return $cache->pullUrlContentFromCache();
		   }else{
				$most_recent = $this->mongo_getter->getMostRecentPostTimestamp();
				$recent_ts = $most_recent["lastModified"]->sec;  //timestamp of most recent post
				$start_date = date("Y-m-d", $recent_ts );  
				$start = strtotime("$start_date +1 days"); //add a day to newest TS to ensure we get all recent hashtags
				$end = strtotime("$start_date -12 months"); //timestamp of most recent post -1 year
				$distinct_hashtags = $this->mongo_getter->getDistinctHashtagsForDateRange( $start, $end );
				//sort($distinct_hashtags);
				$list = $this->aside_views->formatHashtagList( self::RECENT_HASHTAG_LIST_LABEL, $distinct_hashtags );
				$cache->saveUrlContentToCache( $list );
				echo 'recent hashtags generated<br>';  //debug remove later
				return $list;
			}
				
		}
		
		public function getMostPopularHashtagsLinksBox(){
			$cache_key = self::POPULAR_HASHTAG_CACHE_KEY;
			$cache = new CacheController( CACHE_DIR, $cache_key );
			if( $cache->urlInCache() && !$cache->cacheMinutesOverLimit( /*LONG_PAGE_CACHE_MINS*/ -5 ) ){ //-5 so list is generated everytime for testing  
				echo "popular hashtags cached<br>";  //debug remove later 	
				return $cache->pullUrlContentFromCache();
		   }else{
				$all_popular_hashtags = $this->getPopularHashtagFullCountArray();
				$max = MAX_POPULAR_HASHTAG_LIMIT;
				//shorten array to limit
				$slice = ( count($all_popular_hashtags) > $max )? array_slice($all_popular_hashtags, 0, $max) : $all_popular_hashtags;
				$hashes = array_keys($slice);
				$list = $this->aside_views->formatHashtagList( self::POPULAR_HASHTAG_LIST_LABEL, $hashes );
				$cache->saveUrlContentToCache( $list );
				echo 'popular hashtags generated<br>';  //debug remove later
				return $list;
			}
				
		}
		
		public function getAllHashtagsCountForManager(){
			$cache_key = self::MANAGER_HASHTAG_CACHE_KEY;
			$cache = new CacheController( CACHE_DIR, $cache_key );
			if( $cache->urlInCache() && !$cache->cacheMinutesOverLimit( /*LONG_PAGE_CACHE_MINS*/ -5 ) ){ //-5 so list is generated everytime for testing  
				//echo self::MANAGER_HASHTAG_CACHE_KEY." cached<br>";  //debug remove later 	
				return $cache->pullUrlContentFromCache();
		   }else{
				$all_popular_hashtags = $this->getPopularHashtagFullCountArray();
				$list = $this->aside_views->formatHashtagCountList( self::MANAGER_HASHTAG_LIST_LABEL, $all_popular_hashtags );
				$cache->saveUrlContentToCache( $list );
				//echo self::MANAGER_HASHTAG_CACHE_KEY." generated<br>";  //debug remove later
				return $list;
			}
				
		}
		
	}
	
?>