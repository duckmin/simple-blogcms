<!DOCTYPE html>
<html>
<head>
	<title>Manager Login</title>
	<meta charset="utf-8"/>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="pragma" content="no-cache" />
	<meta content="General" name="rating"/>
	<meta content="English" name="language"/>
	<meta name="viewport" content="width=device-width; initial-scale=1.0;">
	<link rel='stylesheet' type='text/css' href='/style/pretty_forms.css'>
	<style>
		form{ 
			width:20vw;
			margin:10vw auto;
			background-color:lightgray;
			box-shadow:-5px 5px 5px rgba(0, 0, 0, 0.5 );
			border-radius:5px;
		}	
	</style>
</head>

<body>
	<form method="POST" action="/<?php echo MANAGER_KEYWORD; ?>" >
		<fieldset>
			<legend>Manager</legend>		
			<div>
				<label>Username</label>			
				<input type="text" name="username">
			</div>
		</fieldset>
		<fieldset>		
			<div>
				<label>Password</label>			
				<input type="password" name="pw">
			</div>
		</fieldset>
		<fieldset>		
			<div>		
				<input type="submit" value="login">
			</div>
		</fieldset>
	</form>
</body>
</html>