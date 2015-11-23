<?php
	echo "search";
	//get the vars and rediect to pretty url
	$s = $_GET["search"];
	$search = ( strlen( $s ) > 0 )? urlencode( $s ) : "";
	$redirect_url = BASE_URL."/search/".$search."/";
	header("location:".$redirect_url );
?>