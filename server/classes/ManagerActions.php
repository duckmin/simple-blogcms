<?php
		
	class ManagerActions {
 
		public static function genSalt(){  //salt generator for the BLOWFISH crypt algorithm, 22 base64 characters  
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
 
		public static function isLoggedIn( ){
			if( isset( $_SESSION['user'] ) && isset( $_SESSION['level'] ) ){
				return true;
			}else{
				return false;	
			}
		}
		  
		public static function authenticate(){
			include SERVER_PATH."/pages/html/manager_login.php";
		}
		
		public static function loginSuccess( $user, $pw ){  //not using any kind of dependancy injection here 
			$pw = trim($pw);
			$user = trim($user);
			try{
				$mongo_con = MongoConnection();
				$db_name = MONGO_DB_NAME;
				$collection = $mongo_con->$db_name->users;
			 	$cursor = $collection->findOne(array('username'=>$user));
		 	}catch( MongoException $e ){
				//echo $e->getMessage()."\n";
				return false;
			}
				
		 	if($cursor===NULL){
		 		return false; //could not find uuser with name
		 	}
		 	
		 	$user_digest = $cursor["password"];
		 	if (crypt($pw, $user_digest) == $user_digest){ 
		 		$_SESSION['user'] = $cursor["username"];
				$_SESSION['level'] = $cursor["level"];
				$_SESSION['created'] = time();
				return true; 
		   }else{ 
		 		return false; 
		 	}
			
		}
	}
   
?>
