#blogcms (simple version)
BlogCms is a high performing, fully responsive, and searchable content management system.
BlogCms is an appication that revolves around an authenticated UI interface that is used to build and manage individual posts. Posts can be grouped by realted #hashtags.  The UI is very easy to use, from the manager you can 
- create postings with any combination of images, embedded videos, audio files, and blogdown
- edit/delete/renew any post at any time after creation
- upload jpg,png,gif images
- upload mp3 audio files
- dynamically add uploaded resoures to a post template
- create a blog post using blogdown (markdown inspired markup), making for many possibilities of content and css styles
- edit/delete/change hashtags of created posts
- view graphs showing views on a per page basis

##Getting Started
- Install apache, php, mongo db
- php must have "Mongo" module
- Clone project into folder
- change your apache conf documentroot to be the "<path_to_blogcms>/main" ( same directory of index.php ) folder of the project 
- this application routes all urls through "index.php" file using apaches mod rewrite rules. Your vhost container should **atleast** have the following rules. 
``` 
<VirtualHost *:80>
    ServerName <host>
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
- Navigate to { host }/manager in your browser and log in with credentials ( the /manager keyword can be changed to a string of your choice in the constants.php file to obfuscate your admin page )
- Start creating posts!  

##Things to note
- create_user.php script inserts an admin UI interface user and password into database,  If you wish to remove a user or modify a user property it must be done manually at the database level, I would suggest deleting user row directly from console and re creating user
- make sure permissions on the /blogcms/main/pics/ folder and sub folders give full permissions to the user server is running as
- #hashtags used in posts are case sensitive, #HashTag is not treated the same as #hashTAG,  mindfulness must be used when using a popular hashtag in your post
- If you wish to change the look and feel of the blog /blogcms/main/style/blog.css is where most of the styles for the main pages are located and can be changed **carefully** 
- most HTML used to construct pages is located in /blogcms/server/templates/ these can be edited with care to add classes or extra content
- **some javascript running on BlogCMS uses query selectors so changing of HTML structure could affect javascript**, make minor changes then check for errors
- On manager console, just click around on every icon and read the messages to find out what they do!
