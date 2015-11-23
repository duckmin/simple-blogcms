<?php
	include_once dirname(__FILE__)."/../configs.php";
	
	class MongoGetter
	{
		private $mongo_conn;
		
		//these are the mongo fields needed to generate a thumbnail preview div 
		private $preview_fields = array( 
		"_id"=>true, 
		"title"=>true, 
		"description"=>true, 
		"lastModified"=>true, 
		"author"=>true, 
		"hashtags"=>true, 
		"thumbnail"=>true, 
		"preview_text"=>true
		);				
		
		public function __construct( $mongo_conn )
		{
			$db_name = MONGO_DB_NAME;
			$this->mongo_conn = $mongo_conn;
			$this->db = $this->mongo_conn->$db_name;
		}
		
		public function getHomePagePreviewsFromDbAfterDate( $after ){ //only select info for previews
			$start_d = new MongoDate( $after );
			$count = AMOUNT_ON_MAIN_PAGE+1; //get one extra so we can tell if there is a next page
			$collection = $this->db->posts;	
		    $fields = $this->preview_fields;				
			$cursor = $collection->find( array( "lastModified"=>array( '$lt'=>$start_d ) ), $fields )
			->limit($count)
			->sort( array( 'lastModified' => -1 ) );
			return $cursor;
		}
		
		public function getHashtagPreviewsAfterDate( $after, $hashtag ){ //only select info for previews
			$start_d = new MongoDate( $after );
			$count = AMOUNT_ON_MAIN_PAGE+1; //get one extra so we can tell if there is a next page
			$collection = $this->db->posts;	
		    $fields = $this->preview_fields;				
			$cursor = $collection->find( array( "hashtags"=>$hashtag, "lastModified"=>array( '$lt'=>$start_d ) ), $fields )
			->limit($count)
			->sort( array( 'lastModified' => -1 ) );
			return $cursor;
		}
		
		public function getHomePagePostsFromSearchAfterDate( $after, $search ){		
			$start_d = new MongoDate( $after );
			$count = AMOUNT_ON_MAIN_PAGE+1; //get one extra so we can tell if there is a next page
			$collection = $this->db->posts;	
			$fields = $this->preview_fields;
			$q = array( '$text'=>array( '$search'=>$search ), "lastModified"=>array( '$lt'=>$start_d ) );
			$cursor = $collection->find( $q, $fields )
			->limit($count)
			->sort( array( 'lastModified' => -1 ) );
			return $cursor;
		}
		
		//used for manager tab search query - get_post_info.php
		public function getPostsFromDbBySearch( $page_num, $search ){
			$count = ( $page_num-1 )*AMOUNT_ON_MANAGER_TAB;
			$skip = AMOUNT_ON_MANAGER_TAB+1;
			$collection = $this->db->posts;			
			$cursor = $collection->find( array( '$text'=>array( '$search'=>$search ) ) )->limit($skip)->skip($count)->sort( array( 'lastModified' => -1 ) );
			return $cursor;
		}
		
		//for manager posts page - get_post_info.php
		public function getBlogManagePosts( $page_num ){  
		
			$count = ( $page_num-1 )*AMOUNT_ON_MANAGER_TAB;
			$skip = AMOUNT_ON_MANAGER_TAB+1;
			$filter = array();
			$collection = $this->db->posts;	
			$cursor = $collection->find( $filter )->limit($skip)->skip($count)->sort( array( 'lastModified' => -1 ) );
			return $cursor;
		}
		
		//not used currently
		public function getSinglePostDataById( $id ){ 
			$mongo_id = new MongoId( $id );
			$collection = $this->db->posts;	
			$fields = array( "post_data"=>true );
			$cursor = $collection->findOne( array( "_id"=>$mongo_id ), $fields );
			return $cursor;
		}
		
		//not used currently
		public function updateSinglePostDataById( $id, $post_data ){ 
			$mongo_id = new MongoId( $id );
			$collection = $this->db->posts;				
			$fields = array( '$set'=> array( "post_data"=>$post_data ) );
			$cursor = $collection->update( array( "_id"=>$mongo_id ), $fields );
			return $cursor;
		}
		
		public function renewPostDate( $id ){ 
			$mongo_id = new MongoId( $id );
			$collection = $this->db->posts;				
			//updates lastModified to current date
			$fields = array( '$set'=>array( "lastModified"=> new MongoDate() ) );			
			$cursor = $collection->update( array( "_id"=>$mongo_id ), $fields );
			return $cursor;
		}
		
		public function getSingleRowById( $id ){
			$mongo_id = new MongoId( $id );
			$collection = $this->db->posts;	
			$cursor = $collection->findOne( array( "_id"=>$mongo_id ) );
			return $cursor;
		}
		
		public function getSingleRowFromDate( $title, $start, $end ){
			$title_uncode = urldecode( $title );			
			$start_d = new MongoDate( $start );
			$end_d = new MongoDate( $end );
			$collection = $this->db->posts;	
			$cursor = $collection->findOne( array( "title"=>$title_uncode, "lastModified"=>array( '$gte'=>$start_d, '$lte'=>$end_d ) ) );
			return $cursor;
		}
		
		//query used on post page to get the next post by timestamp and create a link to it at the bottom
		public function getPreviousPostsFromTimestamp( $time_stamp ){
			$mongo_date = new MongoDate( $time_stamp );
			$collection = $this->db->posts;
			$fields = $this->preview_fields;
			$cursor = $collection->find( array( "lastModified"=>array( '$lt'=>$mongo_date ) ), $fields )
			->limit( AMOUNT_OF_NEXT_POSTS )
			->sort( array( 'lastModified' => -1 ) );
			return $cursor;
		}
		
		//query used on post page to get posts with hashtags in common with post in view 
		public function getRecentRelatedHashTags( $id, $hashtags ){
			$mongo_id = new MongoId( $id );
			$collection = $this->db->posts;
			$fields = $this->preview_fields;
			$find = array( '_id'=>array( '$ne'=>$mongo_id ), 'hashtags'=>array( '$in'=>$hashtags ) );
			$cursor = $collection->find( $find, $fields )
			->limit( AMOUNT_OF_NEXT_POSTS )
			->sort( array( 'lastModified' => -1 ) );
			return $cursor;
		}
		
		public function removeSingleRowById( $id ){
			$mongo_id = new MongoId( $id );
			$collection = $this->db->posts;	
			$cursor = $collection->remove( array( "_id"=>$mongo_id ) );
			return $cursor;
		}
		
		public function getUniqueAnalyticUrlPage(){
			$collection = $this->db->analytics;			
			$cursor = $collection->distinct('url');		
			return $cursor;
		}
		
		public function getPageCountsByUrlAndDateRange( $url, $start, $end ){
			$start_date = new MongoDate( $start );
			$end_date = new MongoDate( $end );
			$date_array = array( '$gte'=>$start_date, '$lte'=>$end_date );
			$collection = $this->db->analytics;			
			$cursor = $collection->find( array( 'url'=>$url, 'date'=>$date_array ) )->sort( array( 'date'=>1 ) );	
			return $cursor;
		}
			
	};
	
?>