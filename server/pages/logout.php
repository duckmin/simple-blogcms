<?php
	// Unset all of the session variables.
	$_SESSION = array();
	
	// If it's desired to kill the session, also delete the session cookie.
	// Note: This will destroy the session, and not just the session data!
	echo var_dump( ini_get("session.use_cookies") );
	if (ini_get("session.use_cookies")) {
	    $params = session_get_cookie_params();
	    print_r( session_name());
	    setcookie(session_name(), '', time() - 42000,
	        $params["path"], $params["domain"],
	        $params["secure"], isset($params['httponly'])
	    );
	}
	
	// Finally, destroy the session.
	session_destroy();
	header("Location: ".BASE_URL."/".MANAGER_KEYWORD);
?>