<!DOCTYPE html>
<html>
<head>
	<title>Manager</title>
	<meta charset="utf-8"/>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="pragma" content="no-cache" />
	<meta content="General" name="rating"/>
	<meta content="English" name="language"/>
	<meta name="viewport" content="width=device-width; initial-scale=1.0;">
	<link rel='stylesheet' type='text/css' href='style/global_style.css'>
	<link rel='stylesheet' type='text/css' href='style/tab_style.css'>
	<link rel='stylesheet' type='text/css' href='style/manager_style.css'>
	<link rel='stylesheet' type='text/css' href='style/blog_style.css'>
	<link rel='stylesheet' type='text/css' href='style/date_picker.css'>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/1.0.2/Chart.min.js"></script><!-- ChartingJS lib CDN (http://www.chartjs.org) -->	
	<script src="scripts/element_extender.js" ></script>
	<script src="scripts/forms.js" ></script>
	<script src="scripts/globals.js" ></script>	
	<script src="scripts/manager/calendar.js" ></script>
	<script src="scripts/manager/alert_boxes.js" ></script>
	<script src="scripts/manager/picture_manager.js" ></script>
	<script src="scripts/manager/template_manager.js" ></script>
	<script src="scripts/manager/template_controller.js" ></script>
	<script src="scripts/extender_new_tabs.js" ></script>
	<script src="scripts/multiple_select_replace.js" ></script>
	<script src="scripts/manager/main_manager.js" ></script>
	<!--script src="scripts/manager/analytics_graphs.js" ></script-->
</head>

<body>
<div class=wrapper>
	<ul class='login-bar' >
		<li><?php
			echo $_SESSION["user"];
		?></li>
		<li data-loadaction="logout" >logout<form id="logout" method="GET" action="/logout"></form></li>
	</ul>
	<ul class='tab-top' >
		<li data-tab='template' >Template</li>
		<li data-tab='preview' style="display:none" >Preview</li>
		<li data-tab='pictures' >Resources</li>
		<li data-tab='posts' >Posts</li>
	</ul>
	
	<section data-tab='template' >
	    <ul class="button-list" >
			<li data-newtemplateaction="add-new-document-template" >
				<img title="new post" src="style/resources/new-document.png" >			
			</li>
			<!--li class="drop" >
				<img src="style/resources/expand.png" />
				Template Item
				<ul>
					<li data-templateaction="additem" data-action="markdown" >
						<span>
							<img src="style/resources/document-text.png" />
							Markdown
						</span>
					</li>
					<li data-templateaction="additem" data-action="image" >
						<span>
							<img src="style/resources/camera.png" />
							Image
						</span>
					</li>
					<li data-templateaction="additem" data-action="video" >
						<span>
							<img src="style/resources/movie.png" />
							Video
						</span>
					</li>
					<li data-templateaction="additem" data-action="audio" >
						<span>
							<img src="style/resources/audio.png" />
							Audio
						</span>
					</li>
				</ul>
			</li-->
			<li data-templateaction="show-markdown-help" >
				Markdown Help			
			</li>
		</ul>
		
		
		<div class="tmplt-holder" id="documents-panel" >

		</div><!--
		--><aside>
			<ul class="document-tabs" id="document-tabs" >
						
			</ul>
			<?php
				$db = MongoConnection();
				$db_getter = new MongoGetter( $db ); 
	    		$aside_views = new AsideViews();
				$aside_controller = new AsideController( $db_getter, $aside_views );
				$hash_list = $aside_controller->getAllHashtagsCountForManager();
				echo $hash_list;
			?>
		</aside>
	</section>
	
	<section data-tab='preview' >	
		<section class='main' id='preview' >
		
		</section>
		<ul class="button-list" >
			<li data-newtemplateaction="save-post" >
				Save
			</li>
		</ul>		
	</section>
	
	<section data-tab='posts' >
		<ul class="inline-list form-list" >		
			<li>
			    <input type="text" name="search" placeholder="search all posts" data-templateaction="post-search-input" value="" >
			</li>	
			<li title="Reset Search" data-templateaction="reset-search" >X</li>
		</ul>
		<div id='post-space' data-templateaction="post-scroll" class='main'>
		</div>
		<ul class='button-list' >
		
		</ul>
	</section>
		
	<section data-tab='pictures' >
		<form id="img-upload-form" action="/upload_img.php" method="post" enctype="multipart/form-data" target="upload_target" onsubmit="return imageUploadValidator();" >
    		<ul class="inline-list form-list" >
    			<li>
    			    <span>Folder:</span>
                    <input id='upload-path' name="folder_path" readonly  type="text" >   			    
    			</li>
    			<li>
    			    <img data-templateaction="add-upload-file" title="Add File To Upload" src="/style/resources/add-file.png">
    			</li>
    			<li>
        			<ul id="uploads-list" class="folders">
        			    <li class="add-folder-li">
                            <input type="file" name="resources[]" >
                        </li>
                    </ul>
    			</li>
    			<li><input type="submit" name="submitBtn" style="padding:0 5px" value="Upload" /></li>				
    		</ul>
    		<iframe style="display:none" id="upload_target" name="upload_target" src="#" ></iframe>
		</form>
		<div id="resource-folders" ></div><div id="pic-files" ></div>
	</section>
</div>

<div class='dark-shade hide' id="picture-popup" >
	<div class='fixed-box save-preview-popup form' >
		<input type="hidden" name="picture_path" >
		<ul class="button-list" >
			<li data-templateaction="add-pictue-to-template" >
				Add Picture To Template
			</li>
			<li class="red-button" data-templateaction="close-popup" >
				Cancel			
			</li>
		</ul>
	</div>
</div>

<div class='dark-shade hide' id="blogdown-popup" data-templateaction="shade-click" >
	<div class='save-preview-popup' >
		<table class="popup-table" data-templateaction="stop-propagation" >
            <thead>
                <tr>
                    <th>You Type</th>
                    <th>You See</th>                 
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>@ http://link.com link text |</td>
                    <td><a href="http://link.com">link text</a></td>                 
                </tr> 
                
                <tr>
                    <td>#HashTag</td>
                    <td>
                        <p>(use hashtags to categorize posts into #hashtag)</p>
                        <a href="/hashtag/HashTag">#HashTag</a>
                    </td>                 
                </tr> 
                <tr>
                    <td>!! Heading</td>
                    <td>
                        <h2>Heading</h2>
                        <p>( The amount of !'s determine the size )</p>
                        <h1>Less !'s</h1>
                        <h6>More !!!!!!'s</h6>
                    </td>                 
                </tr>
                <tr>
                    <td>&gt; add a quoted block</td>
                    <td><blockquote class="quote-block" >add a quoted block</blockquote></td>                 
                </tr>  
                <tr>
                    <td>- one<br>- two<br>- three</td>
                    <td>
                        <ul style="padding-left:20px" >
                            <li>one</li> 
                            <li>two</li>
                            <li>three</li>                       
                        </ul> 
                    </td>                 
                </tr>
                <tr>
                    <td>**bold**</td>
                    <td><b>bold</b></td>                 
                </tr>  
                <tr>
                    <td>__italics__</td>
                    <td><em>italics</em></td>                 
                </tr>  
                <tr>
                    <td>~~strike~~</td>
                    <td><s>strike</s></td>                 
                </tr> 
                
                <tr>
                    <td colspan="2" >
                        <h4>you type:</h4>
<textarea readonly="" style="height:485px;background-color:white;width:calc(100% - 5px);" >
! Headings must be on their own line with a space underneath

#BlogDown as a simple way to markup blog posts.
@ http://google.com my link | can be created in any block. **bold**,
~~strike ~~ and __italics__ can be used anywhere or **~~__combination__~~**!.

!!!! Blog down is simple yet flexible

> **quotes** must be own their __own line__

A am a __lonely__ paragraph. Whether a paragraph, list, quote, or heading you 
must put a line of space between each seperate block. 

- each list **item** is a - then a space then text
- must be kept on its own line
- @ http://google.com links | **bold** ~~__anything__~~ is #accepted
</textarea>
                    </td>               
                </tr>
                <tr>
                    <td colspan="2" class="main" >
                        <h4>you see:</h4>
                            <article class="post" style="">
                                <h1>Headings must be on their own line with a space underneath</h1>
                                
                                <p><a href="/hashtag/blogdown">#BlogDown</a> as a simple way to markup blog posts.
                                <a href="http://google.com">my link</a> can be created in any block. <b>bold</b>,
                                <s>strike</s> and <em>italics</em> can be used anywhere or <b><s><em>combination</em></s></b>!.</p>
                                
                                <h4>Blog down is simple yet flexible</h4>
                                
                                <blockquote><b>quotes</b> must be own their <em>own line</em></blockquote>
                                
                                <p>A am a <em>lonely</em> paragraph. Whether a paragraph, list, quote, or heading you 
								must put a line of space between each seperate block. </p>
                                
                                <ul>
                                    <li>each list <b>item</b> is a - then a space then text</li>
                                    <li>must be kept on its own line</li>
                                    <li><a href="http://google.com">links</a> <b>bold</b> <s><em>anything</em></s> is <a href="/hashtag/accepted">#accepted</a></li>
                                </ul>
                            </article>
                    </td>               
                </tr>               
            </tbody>		
		</table>
		<ul class="button-list" style="margin-bottom:10px;" >
			<li class="red-button" data-templateaction="close-popup" >
				Close			
			</li>
		</ul>
	</div>
</div>

</body>
</html>