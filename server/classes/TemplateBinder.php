<?php
	/*class TemplateBinder {
       
        public $template_name;
       
        public function __construct( $template_name ){
            $this->template_name = $template_name;
			$this->template_file =   dirname(__FILE__)."/../templates/".$this->template_name.".txt";     
            $this->template = ( file_exists( $this->template_file ) )? file_get_contents( $this->template_file ) : "No template ".$template_name." exists";
        }
		
		public function bindTemplate( $data ){
            $tmplt =  $this->template;
			if( $tmplt ){
				$binded = preg_replace_callback( "/{{\s*([A-z_]+)\s*}}/", function( $m ) use( $data ){
					$key = strtolower( $m[1] );
					if( array_key_exists( $key, $data ) ){
						return $data[$key];
					}else{
						return "( '".$key."' NOT_SUPPLIED )";
					}
				}, $tmplt );
			   
				return $binded;
			}else{
				return "Template ".$this->template_name." Not Found";
			}
        }
   
    }*/
    
	
	class TemplateBinder {
       
		private static function sectionRemove( $template, $data ){ //strip out parts of data between ##word & word## tags	
			$pat = "/##([A-z-_]+)(.*?)\\1##\s*/s";
			//echo var_dump( preg_match( $pat, $template ) );
			while( preg_match( $pat, $template ) ){
				$template = preg_replace_callback( $pat, function( $m ) use( $data ){
					//echo var_dump( $m )."<br>";
					$ret = ""; //if nothing is provided for key or key is false is strip out segment 	
					$key = strtolower( $m[1] );
					if( array_key_exists( $key, $data ) ){
						$include_segment = $data[$key];
						if( $include_segment ){
							$ret = $m[2]; 
						}
					}
					return $ret;
				}, $template );
			}
			return $template;
		}	       
       
		public static function bindTemplate( $template, $data ){
			$tmplt =  self::sectionRemove( $template, $data );
			if( $tmplt ){
				$binded = preg_replace_callback( "/{{\s*([A-z0-9_]+)\s*}}/", function( $m ) use( $data ){
				$key = strtolower( $m[1] );
					if( array_key_exists( $key, $data ) ){
						return $data[$key];
					}else{
						return "( '".$key."' NOT_SUPPLIED )";
					}
				}, $tmplt );
		
				return $binded;
			}else{
				return "Template Not Found";
			}
		}
   
	}
	

   
   /* $str = "This is my {{name  }} and I am {{age }} years old and my state is {{ state }} county {{ county  }}";
    $test = array( "name"=>"Robert", "age"=>"22", "state"=>"VA", "county"=>"fairfax" );
    $binder = new TemplateBinder( $str, $test );
    $tmplt = $binder->bindTemplate();
    echo $tmplt;*/
	
	//$binder = new TemplateBinder( "base_page" );
	//$t=$binder->getTemplate();
	//echo $t;
	
?>