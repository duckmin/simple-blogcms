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
	
	function addLink( e ){
		var element = e.srcElement||e.currentTarget;
		var container = element.nearestParent('div'),
		textarea = container.querySelectorAll('textarea[name=text]')[0],
		value = textarea.value;
		textarea.value = value + " [](http://)";
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
				}),
				"button":createElement('ul',{
					"class":"button-list",
					"child":multiFragment({
						"preview":createElement('li',{
							"text":"Add Link",
							"events":{
								"click":addLink
							}
						})
					})
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
	
	//controls save button after previewing template
	window.edit_mode = {
		"edit_mode":false,
		"id_in_edit":"",
		"getEditForm":function(){
			var form = gEBI("edit-mode-form");		
			return {
				"form":form,
				"form_class":new FormClass( form )	
			};
		},		
		"enable":function( id ){
			var edit_form = this.getEditForm(),
			edit_mode = true,
			id_in_edit = id
			this.edit_mode = edit_mode,
			this.id_in_edit = id_in_edit;			
			edit_form.form_class.bindValues( { "edit_mode":edit_mode, "id_in_edit":id_in_edit} );	
			edit_form.form.removeClass("hide");		
		},
		"disable":function(){
			var edit_form = this.getEditForm();
			edit_form.form_class.clearForm();
			edit_form.form.addClass("hide");	
			this.edit_mode = false;
			this.id_in_edit = ""; 
		},
		"active":function(){		
			return ( this.edit_mode === false && this.id_in_edit === "" )?
			false : true;
		}
	}
	
	window.getPostDataFromTemplate = function(){
		var posttypes = gEBI("template").querySelectorAll("li[data-posttype]"),
		holder = [];
		
		if( posttypes.length > 0 ){
			posttypes.each( function( template_item ){
				var form_class = new FormClass( template_item ),
				values = form_class.getValues();
				holder.push( values );
			});
		}
		return holder
	}
	
	var templateaction = {};
	
	templateaction.previewPost = function(){
		var template_data = getPostDataFromTemplate(),
		save_form = gEBI("save-preview-popup"),
		form_class = new FormClass( save_form ),
		form_data = form_class.getValues(),
		post_data = { template_data:template_data, post_data:form_data };
		
		if( template_data.length > 0 ){
			controller.callApi( 'ManagerTemplateGet_post_preview_html', post_data, function(d){
				if( d.length > 0 ){
					gEBI("preview").innerHTML = d;
					window.location.hash = "#preview";
				}
			});
		}else{
			showAlertMessage("Template is Empty", false );
		}
	}
	
	function savePost( save_form ){
		var post_data = getPostDataFromTemplate(),
		form_class = new FormClass( save_form ),
		values = form_class.getValues();
		console.log( values );
		
		if( post_data.length > 0/*safety check*/ ){
			values.post_data = post_data;
			values.procedure = 1;
			controller.callApi( "ManagerTemplateUpsert_post_info", values, function(d){
				var resp = JSON.parse( d);
				if( resp.result ){
					templateaction.clearTemplateForm();
					gEBI('template').removeChildren(); //clear preview from template
					window.location.hash = "#template";	
				}
				showAlertMessage( resp.message, resp.result );
			})
		}else{
			showAlertMessage("Template is Empty", false );
		}
	}
	
	templateaction.clearTemplateForm = function(){
		var save_form = gEBI("save-preview-popup"),
		form_class = new FormClass( save_form );
		form_class.clearForm();
		//save_form.querySelectorAll("ul.multi-replace > li.selected-multi" ).each( function(li){
		//	li.removeClass("selected-multi");
		//} );
		gEBI('template').removeChildren();
	}
	
	templateaction.selectAndCreateThumbnail = function(){
		//take the info from the popup and bind to the template form 
		var picture_popup = gEBI("picture-popup"),
		popup_form_class = new FormClass( picture_popup ),
		vals = popup_form_class.getValues();
		
		//take the filename and path of image and create a thumbnail and store in mongo (if it does not exist)
		var picture_path = vals.picture_path,
		thumbnail_key = vals.thumbkey,
		send = {
			path:picture_path,
			thumbname:thumbnail_key
		};
		
		controller.callApi( 'ManagerResourcesMake_thumbnail_if_not_exist', send, function(data){
			var resp = JSON.parse(data),
			thumbnail_space = gEBI("thumbnail-space"),
    		thumbnail_form_class = new FormClass( thumbnail_space );
    		thumbnail_form_class.bindValues({thumbnail:vals.thumbkey});
    		picture_popup.addClass("hide");
    		window.location.hash = "#template";
    		popup_form_class.clearForm();
		})
	}
	
	addEvent( window, "load", function(){
		attributeActions( document.body, "data-templateaction", {
			
			"additem":function(elm){
				elm.addEvent( "click", function(e){
					var action = elm.getAttribute("data-action"),
					template_item = templatetype[ action ]();
					gEBI("template").appendChild( template_item );
				})
			},
			"preview-post":function(elm){
				elm.addEvent( "click", function(e){
					templateaction.previewPost();
				})
			},
			"cancel-template":function(elm){
				elm.addEvent( "click", function(e){
					var edited = edit_mode.active(),
					message = ( !edited )? "Are you sure you want to clear the template?" : //not in edit
					"Post is currently being edited and all changes will be lost if canceled are you sure you want to clear the template?";
					showConfirm( message, false, gEBI("template"), function(elm){ 
						( edited )? edit_mode.disable() : false;						
						templateaction.clearTemplateForm();	
					} )			
				})
			},
			"add-pictue-to-template":function(elm){
				elm.addEvent( "click", function(e){
					picture_popup = gEBI("picture-popup"),
					popup_form_class = new FormClass( picture_popup ),
					vals = popup_form_class.getValues(),
					path = vals.picture_path,
					template_item = templatetype[ "image" ]( path );
					gEBI("template").appendChild( template_item );
					picture_popup.addClass("hide");
					window.location.hash = "#template";
					popup_form_class.clearForm();
				})
			},
			"make-image-thumbnail":function(elm){
				elm.addEvent( "click", templateaction.selectAndCreateThumbnail )
			},
			"close-popup":function(elm){
				elm.addEvent( "click", function(e){
					var parent_shade = elm.nearestParentClass("dark-shade");
					parent_shade.addClass('hide');
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
			"select-post-filter":function(elm){
				elm.addEvent( "click", function(e){
					POSTS_TABLE_PAGENUM = 1;
					this.parentElement.querySelector("input[type='radio']").checked = true;
					this.nearestParent("ul").querySelector("input[name='search']").value = ""; //blank out seach so its not used in loadTablePage
					loadTablePage();
				})
			},
			"post-search-input":function(elm){
				elm.addEvent( "focus", function(e){
					POSTS_TABLE_PAGENUM = 1;
					this.parentElement.querySelector("input[type='radio']").checked = true;
				});
				
				elm.addEvent( "keyup", function(e){
					if( this.value.length > 0 ){
                        searcher.searchAction();
				    }
				});
			},
			"date-picker":function(elm){
				//initialize date picks in calendar.js
				setDatePickers(elm)
			},
			"show-markdown-help":function(elm){
				elm.addEvent( "click", function(e){
					var md_popup = gEBI("blogdown-popup");
					if( md_popup.hasClass("hide") ){
						md_popup.removeClass("hide")
					}
				})
			},
			"thumbnail-input":function(elm){
				elm.addEvent( "change", function(e){
					var next = this.nextElementSibling,
					has_img = ( next !== null && next.nodeName === "IMG" )? true : false;
					if( has_img ){
						if( this.value !== "" ){
							//when value has been changed change existing src 
							next.src = "/thumb/"+this.value;
						}else{
							//if input set to "" use default no thumbail 
							next.src = "/style/resources/no-thumbnail.png";
						}
					}
				})
			//end last method
			}
		})
	})

//POSTS TAB EDIT FUNCS -----------------------------------------------------------------------------------------------------

	window.POSTS_TABLE_PAGENUM = 1;
	var edit_table_template="<div><img src='/thumb/{{ thumbnail }}' alt='no thumb' >"+
	"<table class='manage-table' >"+
	"<thead>"+
    	"<tr>"+
    	    "<th>Hashtags</th>"+
    		"<th>Created</th>"+
    		"<th>Actions</th>"+
    	"</tr>"+
	"</thead>"+
	"<tbody>"+
    "<tr data-postid='{{ id }}' >"+	
    	"<td class='categories' ><ul></ul></td>"+
    	"<td class='date' >{{ created }}<br> By: <b>{{ author }}</b></td>"+
    	"<td>"+
    		"<input type='hidden' name='id' value='{{ id }}' />"+
    		"<img src='/style/resources/pencil.png' title='Edit Post' onclick='editPostAction(this)' />"+
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
                var self = this;	           
	            loadTablePage(function(json){
	               self.frozen = true;
	               setTimeout(function(){
                        self.frozen = false;	               
	               },250)
	            });
	        }
	    }
	       
	};
	
	window.loadTablePage = function( callback ){
		var cb = callback || function(){},
		section = document.querySelector('section[data-tab=posts]'),
		post_space = section.querySelector('#post-space'),
		category_selection = section.querySelector('ul.inline-list'),
		nav_body = documentFragment(),
		cat_form_class = new FormClass( category_selection ),
		//get value of the radio filter and add to URL so mongo can sort					
		cat_form_values = cat_form_class.getValues();
		cat_value = cat_form_values.blog_grid_sort;	
		//if search is set append this to the URL and cat will be "",  the get_post_info service knows when search isset to bring back search results
		//and the cat must be blank to use categories from the post_info and not the URL
		//var search_str = ( cat_form_values.search.length > 0 )? "&search="+cat_form_values.search : "";	
		var send = {p:POSTS_TABLE_PAGENUM};
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
					post_space.innerHTML = inside_main;
					
					if( json.data.prev===true ){
						var prev = createElement('nav',{
                            text:"Page "+( POSTS_TABLE_PAGENUM - 1 ),
                            events:{
								"click":function(){
									POSTS_TABLE_PAGENUM -= 1;
									loadTablePage();
								}
							}						
						});
						post_space.appendChild(prev);
					}
					
					//append current page marker
					var current = createElement('nav',{
					    "class":"current",
					    text:"Current Page "+POSTS_TABLE_PAGENUM
					});
					post_space.appendChild(current);
					
					if( json.data.next===true ){
						var next = createElement('nav',{
                            text:"Page "+( POSTS_TABLE_PAGENUM + 1 ),
                            events:{
								"click":function(){
									POSTS_TABLE_PAGENUM += 1;
									loadTablePage();
								}
							}						
						});
						post_space.appendChild(next);
					}
					
					window.scroll(0, document.querySelector("ul.tab-top").offsetTop );
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
			send={ "id":form_values.id };
			//make sure we are not deleting post being edited
			if( edit_mode.id_in_edit !== form_values.id ){
    			
    			controller.callApi( "ManagerPostsDelete_article_by_id", send, function(d){
    				var resp = JSON.parse( d);
    				if( resp.result ){
    					loadTablePage();
    				}
    				showAlertMessage( resp.message, resp.result );
    			})
		    }else{
		        showAlertMessage( "This post is currently being edited can not delete, please disable edit mode before removing this post", false );
		    }
		})	
	}
	
	window.editPostAction = function( element ){
		var form_values=table_actions.getTrValues( element );
		if( edit_mode.active() && edit_mode.id_in_edit === form_values.id ){
		    //this post is currently being edited switch to manager
		    window.location.hash = "#template";
		}else{
    		var send = { id:form_values.id };
    		controller.callApi( "ManagerPostsGet_article_data_by_id", send, function(d){
    			//var resp = JSON.parse( d);
    			if( d !== "" ){
    				if( edit_mode.active() ){
    					//previously in edit mode clear old data 
    					edit_mode.disable();
    				}
    				templateaction.clearTemplateForm();
    				var resp = JSON.parse( d ),
    				post_data = resp.post_data,
    				post_data_box = gEBI("save-preview-popup"),
    				post_data_formclass = new FormClass( post_data_box ),
    				frag = documentFragment();
    				edit_mode.enable( form_values.id );
    				post_data.forEach(function( post ){
    					var post_type = post["data-posttype"],
    					li = templatetype[ post_type ](),
    					form_class = new FormClass( li );
    					form_class.bindValues( post );
    					frag.appendChild( li );
    				});
    				
    				gEBI("template").removeChildren().appendChild(frag);
    				post_data_formclass.bindValues(resp);
    				window.location.hash = "#template";
    			}else{
    				showAlertMessage( "No Data For Post", false );
    			}
    		})
        }
	
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
	
	window.saveEditedPostAction = function(){
		var post_data = getPostDataFromTemplate(),
		save_form = gEBI("save-preview-popup"),
		form_class = new FormClass( save_form ),
		values = form_class.getValues();
		values.id = edit_mode.id_in_edit;
		if( post_data.length > 0 ){
			values.post_data = post_data;
			values.procedure = 2;
			controller.callApi( "ManagerTemplateUpsert_post_info", values, function(d){
				var resp = JSON.parse( d);
				if( resp.result ){
					//if post being edited is in view on posts tab ajax back the id_in_edit
                    //to get post HTML then relace HTML of post on posts tab with edited version
                    //the tab_actions posts function must be overwritten so it will scroll to edited post
                    //before edit mode is disabled,  then we overwrite tab_actions.posts back to original function
					var post_on_post_tab_being_edited = gEBI(edit_mode.id_in_edit);

					if( post_on_post_tab_being_edited !== null ){
					   table_actions.getPostHtml( edit_mode.id_in_edit, function(post_html){
    					   if( post_html.length > 0 ){
        					   var edited_post = createElement("div", {
        					      innerHTML:post_html 
        					   }).firstElementChild;
        					   post_on_post_tab_being_edited.replaceWith(edited_post);
        					   tab_actions.posts = function( tab, panel ){
        					       managerExtraActions.posts_tab_action( tab, panel );
        					       edit_mode.disable();
        					       tab_actions.posts = managerExtraActions.posts_tab_action;
        					   }
        					   window.location.hash = "#posts" ;
    				       }else{
    				           window.location.hash = "#template";
					           edit_mode.disable();  
    				       }
					   });
					   
					}else{
					   window.location.hash = "#template";
					   edit_mode.disable();    
					}
					templateaction.clearTemplateForm();
					
				}
				showAlertMessage( resp.message, resp.result );
			})
		}else{
			showAlertMessage("Template is Empty", false );
		}
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