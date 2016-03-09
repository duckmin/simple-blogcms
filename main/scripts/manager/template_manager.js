(function(window){
	
	function removeBox( e ){
		var element= e.srcElement||e.currentTarget;
		var container=element.nearestParent('li');
		container.remove();
	} 

	function moveUp( e ){
		var element= e.srcElement||e.currentTarget;
		var container=element.nearestParent('li'),
		prev_li = container.previousElementSibling;
		if( prev_li !== null ){
			prev_li.appendBefore( container );
		}else{
			container.nearestParent('ul').appendChild( container );
		}
	}

	function moveDown( e ){
		var element= e.srcElement||e.currentTarget;
		var container=element.nearestParent('li'),
		next_li = container.nextElementSibling;
		if( next_li !== null ){
			next_li.appendAfter( container );
		}else{
			container.nearestParent('ul').prepend( container );
		}
	}

	function post( posttype, child ){
		return createElement('li',{
			"data-posttype":posttype,
			"child":multiFragment({
				"buttons":createElement('ul',{
					
					"child":multiFragment({
						"moveup":createElement('li',{
							"class":"up-arrow",
							"title":"Move Up",
							"events":{
								"click":moveUp
							}
						}),
						"movedown":createElement('li',{
							"class":"down-arrow",
							"title":"Move Down",
							"events":{
								"click":moveDown
							}
						}),
						"remove":createElement('li',{
							"class":"remove-item",
							"title":"Remove",
							"events":{
								"click":removeBox
							}
						})
					})
				}),
				"container":createElement('div',{
					"class":"tmplt-forum-container",
					"child":multiFragment({
						"input":createElement('input',{
							"type":"hidden",
							"name":"data-posttype",
							"value":posttype
						}),
						"selections":child
					})
				})
				
			})
		})
	}
	
	function previewImage( e ){
		var element= e.srcElement||e.currentTarget;
		var container=element.nearestParent('div'),
		input=container.querySelectorAll('input[name=src]')[0],
		frame=container.getElementsByTagName('img')[0];
		if( typeof frame === "undefined" ){
			frame = container.appendChild( createElement('img' , {"src":"#"} ) );
		}
		frame.src=input.value; 
	}
	
	function previewAudio( e ){
		var element= e.srcElement||e.currentTarget;
		var container=element.nearestParent('div'),
		input=container.querySelectorAll('input[name=src]')[0],
		val = input.value,
		source = createElement("source", {
		  "type":"audio/mpeg",
		  "src":val
		});
		source.onerror = function(){
		    makeFlashAudioEmbed(this);  
		};
		var audio = createElement("audio", {
		  "controls":"",
		  "child":source   
		}),
		last_element = container.lastElementChild,
		last_type = last_element.nodeName.toLowerCase();
		
		if( last_type === "audio" || last_type === "embed" ){
		   last_element.replaceWith( audio );
		}else{
		   container.appendChild( audio ); 
		}
		
		
	}	
	
	function previewVideo( e ){
		var element= e.srcElement||e.currentTarget;
		var container=element.nearestParent('div'),
		youtube_pat=/^(http|https):\/\/www.youtube.com\/watch\?v=(.+)$/,
		input=container.querySelectorAll('input[name=src]')[0],
		src=input.value,
		frame=container.getElementsByTagName('iframe')[0];
		if( typeof frame === "undefined" ){
			container.appendChild( createElement('iframe') );
			frame=container.getElementsByTagName('iframe')[0];
			console.log( frame );
		}
		
		if( youtube_pat.test( src ) ){
			src=src.replace( youtube_pat, "http://www.youtube.com/embed/$2" );
			input.value=src;
		}
		frame.src=src; 
	}
	
	window.templatetype = {
		"markdown":function( text ){
			return post( "markdown", multiFragment({
				"heading":createElement('h5',{
					"text":"Markdown"
				}),
				"input":createElement('textarea',{
					"name":"text"
				})
			}))
		},
		"image":function( src ){
			return post( "image", multiFragment({
					"heading":createElement('h5',{
						"text":"Image Embed"
					}),
					"input":createElement('input',{
						"name":"src",
						"type":"text",
						"value":src||""
					}),
					"subheading":createElement('h6',{
						"text":"Alt ( text that appears if image does not load )"
					}),
					"alt_input":createElement('input',{
						"name":"alt",
						"type":"text",
						"value":""
					}),
					"button":createElement('ul',{
						"class":"button-list",
						"child":multiFragment({
							"preview":createElement('li',{
								"text":"Preview Img",
								"events":{
									"click":previewImage
								}
							})
						})
					})
				})
			)
		},
		"audio":function( src ){
			return post( "audio", multiFragment({
					"heading":createElement('h5',{
						"text":"Audio Embed"
					}),
					"input":createElement('input',{
						"name":"src",
						"type":"text",
						"value":src||""
					}),
					"button":createElement('ul',{
						"class":"button-list",
						"child":multiFragment({
							"preview":createElement('li',{
								"text":"Preview Audio",
								"events":{
									"click":previewAudio
								}
							})
						})
					})
				})
			)
		},
		"video":function(){
			return post("video", multiFragment({
					"heading":createElement('h5',{
						"text":"Video Embed"
					}),
					"input":createElement('input',{
						"name":"src",
						"type":"text"
					}),
					"button":createElement('ul',{
						"class":"button-list",
						"child":multiFragment({
							"preview":createElement('li',{
								"text":"Preview",
								"events":{
									"click":previewVideo
								}
							})
						})
					})
				})
			)
		}
	}
	
	var templateaction = {};
	
	addEvent( window, "load", function(){
		attributeActions( document.body, "data-templateaction", {
			
			"add-pictue-to-template":function(elm){
				elm.addEvent( "click", function(e){
					picture_popup = gEBI("picture-popup"),
					popup_form_class = new FormClass( picture_popup ),
					vals = popup_form_class.getValues(),
					path = vals.picture_path,
					template_item = templatetype[ "image" ]( path );
					
					var template = template_panel_action.getActiveTemplate();  //defined in template_controller.js
					picture_popup.addClass("hide");
					if( template !== false ){
						template.appendChild( template_item );
						window.location.hash = "#template";
						popup_form_class.clearForm();
					}else{
						showAlertMessage("No Active Template", false );
					}
				})
			},
			"close-popup":function(elm){
				elm.addEvent( "click", function(e){
					var parent_shade = elm.nearestParentClass("dark-shade");
					parent_shade.addClass('hide');
				})
			},
			"shade-click":function(elm){
				elm.addEvent( "click", function(e){
					e.stopPropagation();
					e.currentTarget.addClass('hide');
					//var parent_shade = elm.nearestParentClass("dark-shade");
					//parent_shade.addClass('hide');
				})
			},
			"stop-propagation":function(elm){
				elm.addEvent( "click", function(e){
					e.stopPropagation();					
				})
			},
			"save-new-post":function(elm){
				elm.addEvent( "click", function(e){
					if( !edit_mode.active() ){
						var save_form = gEBI("save-preview-popup");
						savePost( save_form );
					}else{
						saveEditedPostAction();
					}
				})
			},
			"post-search-input":function(elm){
				elm.addEvent( "keyup", function(e){
               searcher.searchAction();
				});
			},
			"reset-search":function(elm){
				elm.addEvent( "click", function(e){
               var target = e.currentTarget,
               parent_ul = target.nearestParent("ul"),
               input = parent_ul.querySelector("input[name='search']");
               input.value = "";
               posts_action.clearPosts();
               posts_action.loadTablePage( Date.now() );
				});
			},
			"date-picker":function(elm){
				//initialize date picks in calendar.js
				setDatePickers(elm)
			},
			"post-scroll":function(elm){
				elm.addEvent( "mouseover", function(e){
					
				});	
			},
			"show-markdown-help":function(elm){
				elm.addEvent( "click", function(e){
					var md_popup = gEBI("blogdown-popup");
					if( md_popup.hasClass("hide") ){
						md_popup.removeClass("hide")
					}
				})
			} //end last method
		})
	})

//POSTS TAB EDIT FUNCS -----------------------------------------------------------------------------------------------------

	window.POSTS_TABLE_PAGENUM = 1;
	var edit_table_template="<div><table class='manage-table' >"+
	"<thead>"+
    	"<tr>"+
    		"<th>Created</th>"+
    		"<th>Actions</th>"+
    	"</tr>"+
	"</thead>"+
	"<tbody>"+
    "<tr data-postid='{{ id }}' >"+	
    	"<td class='date' >{{ created }}<br> By: <b>{{ author }}</b></td>"+
    	"<td>"+
    		"<input type='hidden' name='id' value='{{ id }}' />"+
    		"<img src='/style/resources/pencil.png' title='Edit Post' onclick='posts_action.editPostAction(this)' />"+
    		"<img src='/style/resources/chart.gif' title='View Analytics' onclick='getAnalyticsGraph(this)' >"+
    		"<img src='/style/resources/clock.png' title='Make most recent post (move to top of the)' onclick='postMoveToTop(this)' />"+
    		"<img src='/style/resources/action_delete.png' title='Delete Post' onclick='deletePostAction(this)' />"+
    	"</td>"+
    "</tr>"+
	"</tbody>"+
	"</table></div>";
	
	window.searcher = {
	    "frozen":false,
	    "searchAction":function(){
	        if( !this.frozen ){           
	            posts_action.clearPosts();
	            posts_action.loadTablePage( Date.now(), function(json){
	               this.frozen = true;
	               setTimeout(function(){
                        this.frozen = false;	               
	               }.bind(this),250);
	            }.bind(this));
	        }
	    }
	       
	};
	
	window.posts_action = {
		"clearPosts":function(){
			document.querySelector("section[data-tab='posts'] #post-space").removeChildren();
	   },
		"getLastShownPostTimeStamp":function(){
			var last_post = document.querySelector("section[data-tab='posts'] #post-space > article:last-of-type");
			if( last_post !== null ){
				var form_class = new FormClass( last_post ),
				vals = form_class.getValues();
				return vals.created;
			}
		},
		"getMorePosts":function(e){
		    var target = e.currentTarget,
			last_post_timestamp = posts_action.getLastShownPostTimeStamp();
			
			posts_action.loadTablePage( last_post_timestamp, function(){
	          target.style.display = "none";
	          target.removeEventListener("click", posts_action.getMorePosts );
			});
		 }
	};
	
	posts_action.loadTablePage = function( timestamp, callback ){
		var cb = callback || function(){},
		section = document.querySelector('section[data-tab=posts]'),
		post_space = section.querySelector('#post-space'),
		category_selection = section.querySelector('ul.inline-list'),
		nav_body = documentFragment(),
		cat_form_class = new FormClass( category_selection ),				
		cat_form_values = cat_form_class.getValues();
		//if search is set append this to the URL and cat will be "",  the get_post_info service knows when search isset to bring back search results
		var send = {ts:timestamp};
		if(cat_form_values.search.length > 0){ send.search = cat_form_values.search }
		
		controller.callApi( 'ManagerPostsGet_posts_page_info', send, function(d){
			if( d.length > 0 ){
				var json = JSON.parse( d );
				cb(json); //run callback (only used for search)
				if( json.result === true ){
					var post_data = json.data.posts,
					inside_main = "";
					post_data.forEach( function( single_row ){
						inside_main += single_row.post_html;
						inside_main += bindMustacheString( edit_table_template, single_row.post_data );
					})
					post_space.innerHTML += inside_main;
					
					if( json.data.next===true ){
						var next = createElement('nav',{
                     text:"More Posts",
                     events:{
								"click":posts_action.getMorePosts
							}						
						});
						post_space.appendChild(next);
					}
				}else{
					showAlertMessage( json.message, json.result );
				}
			}
		})
	}
	
	var table_actions = {
		getTrValues:function( element ){
			var tr=element.nearestParent("tr"),
			form_obj=new FormClass( tr ),
			form_values=form_obj.getValues();
			return form_values;
		},
		getPostHtml:function( id, callback ){
		    var send = { id:id };
		    controller.callApi( "ManagerPostsGet_article_html_by_id", send, callback);
		}
	}
	
	window.deletePostAction = function( element ){
		var message = "Are you sure you want to delete this post?";
		showConfirm( message, false, element, function(elm){ //calback function fired if yes is selected
			var form_values=table_actions.getTrValues( element ),
			post_id = form_values.id,
			is_in_edit_view = template_panel_action.isPostBeingEdited( post_id ),
			send={ "id":post_id };
			//make sure we are not deleting post being edited
			if( !is_in_edit_view ){
			
    			controller.callApi( "ManagerPostsDelete_article_by_id", send, function(d){
    				var resp = JSON.parse( d);
    				if( resp.result ){
    					var table_container = element.nearestParent("div"),
    					deleted_article = table_container.previousElementSibling;
    					table_container.remove();
    					deleted_article.remove();
    				}
    				showAlertMessage( resp.message, resp.result );
    			})
		    }else{
		        showAlertMessage( "This post is currently being edited can not delete, remove from editing template before removing this post", false );
		    }
		})	
	}
	
	posts_action.editPostAction = function(element){
		var form_values = table_actions.getTrValues( element ),
		post_id = form_values.id,
		send = { id:post_id },
		is_in_edit_view = template_panel_action.isPostBeingEdited( post_id );  //if this exists then no need to ajax 

		if( is_in_edit_view ){
			showAlertMessage( "Post Already being Edited", false );
			return;
		}		
		
    	controller.callApi( "ManagerPostsGet_article_data_by_id", send, function(d){
    		if( d !== "" ){
	    		var resp = JSON.parse( d );
	    		bind = {
					id:form_values.id,
					title:resp.title,
					description:resp.description
				},
				form = bindMustacheString( doc_form_template, bind );  //defined in template_controller.js
				var panels = template_panel_action.addNewDocumentForm(form, resp.title, false), //template_controller.js
				post_data = resp.post_data,
				frag = documentFragment();
				panels.tab.setAttribute("data-postid", form_values.id );  //so we can identify if post is being edited to prevent double clicking edit button 
	 			post_data.forEach(function( post ){
	 				var post_type = post["data-posttype"],
	 				li = templatetype[ post_type ](),
	 				form_class = new FormClass( li );
	 				form_class.bindValues( post );
	 				frag.appendChild( li );
	 			});
	 			template_panel_action.getActiveTemplate().appendChild(frag); //template_controller.js
	 			window.location.hash = "#template";
 			}else{
 				showAlertMessage( "No Data For Post", false );
 			}
    	});
	}
	
	window.postMoveToTop = function( element ){
		var message = "Are you sure you wish to renew the date on this post,  renewing date will move this post to the top of all categories it is a part of and can not be reversed";		
		showConfirm( message, false, element, function(elm){ //calback function fired if yes is selected
			var form_values=table_actions.getTrValues( element ),
			send={ "id":form_values.id };
			controller.callApi( "ManagerPostsUpdate_article_date_by_id", send, function(d){
				if( d !== "" ){
					var resp = JSON.parse( d );
					showAlertMessage( resp.message, resp.result );
				}else{
					showAlertMessage( "No Data Error", false );
				}
			})	
		})	
	}
	
	//ANALYTICS RELATED CODE ISOLATED BELOW
	Chart.defaults.global.animation = false; //turn off chartjs animation of charts 
	
	function massageAnalyticData( data ){  //take json returned from api call and put each propery into own array for graphing function
		var totals = {
			date:[],
			unique:[],
			views:[]
		};
		
		data.forEach(function(obj){
			for( prop in obj ){
				totals[prop].push( obj[prop] );
			}
		});
		
		return totals;
	}
	
	window.getAnalyticsGraph = function( element ){
		var form_values=table_actions.getTrValues( element ),
		send = { url:form_values.id },
		table_div = element.nearestParent("div"); //send id to get all view for posting
		
		controller.callApi( "ManagerPostsGet_article_view_counts_by_daterange", send, function(d){
			var resp = JSON.parse( d);
			if( resp.length > 0 ){
				
				canvas = document.createElement("canvas");
				canvas.height = "300";
				canvas.width = "500";
				var ctx = table_div.appendChild(canvas).getContext("2d"),
				massaged_data = massageAnalyticData( resp ),				
				data = {
					labels: massaged_data.date,
					datasets: [
						{
							label: "Views",
							fillColor: "lightblue",
							strokeColor: "black",
							highlightFill: "lightblue",
							highlightStroke: "orange",
							data: massaged_data.views
						},
						{
							label: "Unique",
							fillColor: "lightgray",
							strokeColor: "black",
							highlightFill: "lightgray",
							highlightStroke: "orange",
							data: massaged_data.unique
						}
					]
				},
				options = {
					scaleGridLineColor : "rgba(0,0,0,0.2)",
					scaleShowVerticalLines: false,
					barShowStroke : true,
					barStrokeWidth : 1,
					barDatasetSpacing : -1
				
				};
				new Chart(ctx).Bar(data, options);
				element.removeAttribute("onclick");  //remove onclick after show graph 

			}else{
				showAlertMessage( "No Relevant Analytics Data", false );
			}
		})
	}
	
})(window);