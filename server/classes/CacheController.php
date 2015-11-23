<?php
	include_once dirname(__FILE__)."/../configs.php";
	
    class CacheController {
       
        private $cache_dir;
        private $url;
        private $cache_file_path;
       
        public function __construct( $cache_dir, $url ){
            $this->cache_dir = $cache_dir;
            $this->url = urlencode( $url );
            $this->cache_file_path = $this->cache_dir."/".$this->url.".txt";
        }
       
        public function urlInCache(){
            $incache = false; //default
            if( file_exists( $this->cache_file_path ) ){
                $incache = true;
            }
            return $incache;
        }
        /*
         $file = new SplFileInfo( $_SERVER['DOCUMENT_ROOT']."/db_test.php" );
   //$finfo = finfo_open(FILEINFO_MIME_TYPE);
   //$mime_type = info_file($finfo, $file);
   //finfo_close($finfo);
   $extension = $file->getExtension();
   $time_created = $file->getMTime ();
   $now = time();
   echo var_dump( $extension )."<br>";
   echo var_dump( $time_created )."<br>";
   echo var_dump( $now )."<br>";
   $diff =( $now - $time_created );
   $minutes_file_is_old = round( $diff/60 );
   echo $minutes_file_is_old ." Minutes old<br>";
     */   
        
        public function cacheMinutesOverLimit( $max_minutes ){
            $overtime = false; //default
            if( file_exists( $this->cache_file_path ) ){
                $file = new SplFileInfo( $this->cache_file_path );
                $time_created = $file->getMTime ();
                $now = time();
                $diff =( $now - $time_created );
                $minutes_file_is_old = round( $diff/60 );
               // echo "<br>now  ".$now."<br>";
               // echo "<br>".$time_created."<br>";
               // echo "<br>".$minutes_file_is_old."<br>";
                if( $minutes_file_is_old >= $max_minutes ){
                    $overtime = true;
                }
            }
            return $overtime;
        }
       
        public function saveUrlContentToCache( $content ){
            file_put_contents( $this->cache_file_path, $content );
            /* if( !$this->urlInCache() ){
                if( !file_exists( $this->cache_file_path ) ){
                    $cachefile = fopen( $this->cache_file_path, "w" );
                    fwrite( $cachefile, $content  );
                    fclose( $cachefile );
                    return true;
                }
            }else{
                trigger_error("File Is Already In Cache", E_USER_ERROR); //cant save new file if already exists
            }*/
        }
       
        public function pullUrlContentFromCache(){
            if( $this->urlInCache() ){
                if( file_exists( $this->cache_file_path ) ){
                    return file_get_contents( $this->cache_file_path );
                }
            }else{
                trigger_error("File Not In Cache", E_USER_ERROR); //cant get file contents if it dosnt exist
            }
        }
       
        /*private function removeYesterdaysCacheDir(){
            exec( 'rm -rf '.$this->yesterdays_dir);
        }*/
		
		public function clearCache(){
            if( is_dir( $this->cache_dir ) ){
                $scan = scandir( $this->cache_dir );
                for( $i = 0; $i < count( $scan ); $i++ ){
                    $current = $scan[$i];
                    if( $current !== "." &&  $current !== ".." ){
                        $path = $this->cache_dir."/".$current;
                        if( is_dir( $path ) ){
                            exec( 'rm -rf '.$path );
                        }
                    }
                }
            }
        }
   
    }
   
   
    //run this to make to do a check of the cache system
    //will throw fatal error if the file already exists! ( when running for a second time with same url id )
    /*$cache_dir = dirname(__FILE__).'/cache_test';
    $cache_url = "http://www.allthingsrobert.net/index.php?p=5&s=whussup";
    $cachecontroller = new CacheController( $cache_dir, $cache_url );
   
    $in_cache = $cachecontroller->urlInCache();
    echo var_dump( $in_cache )." before save in cache check<br>";
   
    $content = "I am the content of the URL ".$cache_url;
    $saved = $cachecontroller->saveUrlContentToCache( $content );
    echo var_dump( $saved )." was saved<br>";
   
    $in_cache2 = $cachecontroller->urlInCache();
    echo var_dump( $in_cache2 )." after saved in cache check<br>";
   
    $file_content = $cachecontroller->pullUrlContentFromCache();
    echo "content of the file-----<br>".$file_content;*/
	
?>
