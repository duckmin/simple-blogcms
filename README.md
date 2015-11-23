#blogcms-Fast
BlogCms is fully responsive, and searchable, and **FAST**.
BlogCms is an appication that revolves around an authenticated UI interface that is used to build individual postings under. Posts can be grouped by realted #hashtags.  The UI is very easy to use, from the manager you can 
- create postings with any combination of images, embedded videos, audio files, and blogdown
- edit/delete/renew any post at any time after creation
- upload jpg,png,gif images
- upload mp3 audio files
- dynamically add uploaded resoures to a post template
- create a blog post using blogdown (markdown inspired markup), making for unlimited possibilities of content and css styles
- edit/delete/change hashtags of created posts
- view analytic data graphs of your sites traffic (graphs not finalized atm!!)

##Getting Started
- Install apache, php, mongo db, GD image library
- php must have "Mongo" module,  and "GD" module ( for thumbnail creation )
- Clone project into folder
- change your apache conf documentroot to be the "<path_to_blogcms>/main" ( same directory of index.php ) folder of the project 
- this application routes all urls through "index.php" file using apaches mod rewrite rules. Your vhost container should **atleast** have the following rules. 
``` 
<VirtualHost *:80>
    ServerName www.blog.local
    DocumentRoot <path_to_blogcms>/main
		
    <Directory "<path_to_blogcms>/main">
        RewriteEngine On
	RewriteBase /
	RewriteCond %{REQUEST_FILENAME} !-f
	RewriteCond %{REQUEST_FILENAME} !-d
	RewriteRule ^(.*)$ index.php
			   
	Options -Indexes +FollowSymLinks
	AllowOverride None
	Order allow,deny
	Allow from all
    </Directory>
</VirtualHost>
```
- to add a user to log into the admin interface you must run the command line script /blogcms/create_user.php -u username -p password -l user_level
- **ATM -l (level) is not used for any validations in code,  but may be in the future** 
- in blogcms/server/constants.php you will find many configuration settings most are obvious as to what they are and can be changed easily (db connection string, posts shown per page, manager URL, max lengths, etc)
- run all index creating commands in the /blogcms/mongo_instructions.txt
- Navigate to { host }/manager in your browser and log in with credentials
- Start creating posts!  

##Things to note
- create_user.php script inserts an admin UI interface user and password into database,  If you wish to remove a user or modify a user property it must be done manually at the database level, I would suggest deleting user row directly from console and re creating user
- make sure permissions on the /blogcms/main/pics/ folder and sub folders give full permissions to the user server is running as
- if you "edit" a post form the "Posts" tab on the manager page, and wish to cancel an edit.  You must click cancel from the "Template" tab, this will exit edit mode, and allow you to start creating new posts again ( editing a post and then saving the edit will also make you exit edit mode ).  
- If you wish to change the look and feel of the blog /blogcms/main/style/blog.css is where most of the styles for the main pages are located and can be changed **carefully** 
- most HTML used to construct pages is located in /blogcms/server/templates/ these can be edited with care to add classes or extra content
- **some javascript running on BlogCMS uses query selectors so changing of HTML structure could affect javascript**, make minor changes then check for errors
- On manager console, just click around on every icon and read the messages to find out what they do!
