<!DOCTYPE html>
<html>
<head>
	<title>api test</title>
	<meta charset="utf-8"/>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta content="General" name="rating"/>
	<meta content="English" name="language"/>
	<meta name="description" content="" >
	<script src='/scripts/element_extender.js' ></script>
	<script src='/scripts/globals.js' ></script>
	<script>
		function cb(resp){
			console.log(resp);
		}
		
		window.onload = function(){
			controller.callApi( 'ManagerTemplateUpsert_post_info', {hello:"hello"}, cb);
		}	
	</script>
</head>

<body>
	<main class='wrapper' >
		
	</main>
</body>
</html>
