<?php
	include_once dirname(__FILE__)."/../configs.php";
	
	class FileGetter
	{
		
		public static function listFolderContents( $path ){
			$holder = array();
			$folder_path = INDEX_PATH.$path;
			if( is_dir( $folder_path ) ){
				$contents_of_folder = scandir( $folder_path );	
				foreach( $contents_of_folder as $folder_item ){
					if( $folder_item !== '.' && $folder_item !== '..' ){
						if( is_dir( $folder_path."/".$folder_item ) ){
							array_push( $holder, array( 'folder'=>$folder_item ) );
						}else{
							array_push( $holder, array( 'file'=>$folder_item ) );
						}
					}
				}
				return $holder;
			}else{
				return array();
			}
		}
		
		public static function getDirectoryInfo( $dir_path ){
			$path_info = pathinfo( $dir_path );
			return array( 
				"type"=>"folder",
				"data"=>array(
					"file_path"=>$dir_path,
					"base_name"=>$path_info["basename"]
				)
			);
		}
		
		public static function getImageThumbNameByPath( $relative_path ){  //use file name and time modifed to created a unique key for the file to be used as the key for in mongo thumbnail storage
			$file_path = INDEX_PATH.$relative_path;
			$file_info = new SplFileInfo( $file_path );
            $last_modified = $file_info->getMTime (); //this will not change unless file is overwritten
			$path_info = pathinfo($relative_path);
            $extension = $path_info["extension"];
            $file_name = $path_info["filename"];
            $thumb_name = $file_name."-".md5( $last_modified ).".".$extension;
            return $thumb_name;
		}
		
		public static function getResourceInfo( $type, $resource_path, $server_path, $resource_name ){
            $thumb_name = self::getImageThumbNameByPath($server_path);
			return array(
				"type"=>$type,
				"data"=>array(
					"thumbname"=>$thumb_name,
					"server_path"=>$server_path,
					"resource_path"=>$resource_path,
					"resource_name"=>$resource_name
				)
			);
		}
		
	};
	

?>

