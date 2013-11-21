var MENU = new MENU_CLASS();

function MENU_CLASS(){
	this.last_menu = '';
	
	var PASTE_DATA = false;
	
	this.do_menu = function(name){
		MENU.last_menu = name;

		//===== File ===========================================================
		
		//new
		if(name == 'file_new'){
			ZOOM = 100;
			MAIN.init();
			}
		//open
		else if(name == 'file_open'){
			MENU.open();
			}
		//save
		else if(name == 'file_save'){
			POP.add({name: "name",		title: "File name:",	value: ["example"],	});
			POP.add({name: "type",		title: "Save as type:",	values: SAVE_TYPES,	});	
			POP.add({name: "quality",	title: "Quality (1-100) (optional):",	value: 92, range: [1, 100],	});
			POP.show('Save as ...', MENU.save);
			}
		//print
		else if(name == 'file_print'){
			window.print();
			}
			
		//===== Edit ===========================================================
		
		//undo
		else if(name == 'edit_undo'){
			MAIN.undo();
			}
		//redo
		else if(name == 'edit_redo'){
			MAIN.redo();
			}	
		//cut
		else if(name == 'edit_cut'){
			MAIN.save_state();
			if(TOOLS.select_data != false){
				this.copy_to_clipboard();
				canvas_active().clearRect(TOOLS.select_data.x, TOOLS.select_data.y, TOOLS.select_data.w, TOOLS.select_data.h);
				TOOLS.select_data = false;
				canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
				}
			}
		//copy
		else if(name == 'edit_copy'){
			if(TOOLS.select_data != false)
				this.copy_to_clipboard();
			}
		//paste
		else if(name == 'edit_paste'){
			MAIN.save_state();
			this.paste('menu');
			}

		//select all
		else if(name == 'edit_select'){
			TOOLS.select_data = {
				x: 	0,
				y: 	0,
				w: 	WIDTH,
				h: 	HEIGHT,
				};
			canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
			HELPER.dashedRect(canvas_front, 0, 0, WIDTH, HEIGHT);
			}
		//clear selection
		else if(name == 'edit_clear'){
			TOOLS.select_data = false;
			canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
			}
		
		//===== Image ==========================================================
		
		//size
		else if(name == 'image_size'){
			POP.add({name: "width",		title: "Enter width:",	value: WIDTH,	});
			POP.add({name: "height",	title: "Enter height:",	value: HEIGHT,	});	
			POP.add({name: "transparency",	title: "Transparent:",	values: ['Yes', 'No'],});
			POP.show('Attributes', this.resize_custom);
			}
		//trim
		else if(name == 'image_trim'){
			MAIN.save_state();
			DRAW.trim();
			}
		//crop
		else if(name == 'image_crop'){
			MAIN.save_state();
			if(TOOLS.select_data == false){
				POP.add({title: "Error:",	value: 'Select are first',	});
				POP.show('Error', '');
				}
			else{
				for(var i in LAYERS){
					var layer = document.getElementById(LAYERS[i].name).getContext("2d");
					
					var tmp = layer.getImageData(TOOLS.select_data.x, TOOLS.select_data.y, TOOLS.select_data.w, TOOLS.select_data.h);
					layer.clearRect(0, 0, WIDTH, HEIGHT);
					layer.putImageData(tmp, 0, 0);
					}
				//resize
				MAIN.save_state();
				WIDTH = TOOLS.select_data.w;
				HEIGHT = TOOLS.select_data.h;
				RATIO = WIDTH/HEIGHT;
				LAYER.set_canvas_size();
				}
			}	
		//resize
		else if(name == 'image_resize'){
			POP.add({name: "width",	title: "Enter new width:",	value: WIDTH,});
			POP.add({name: "height",title: "Enter new height:",	value: HEIGHT});
			POP.add({name: "mode",	title: "Mode:",	values: ["Resample - Lanczos", "Resize"],});
			POP.show('Resize', this.resize_layer);
			}
		//rotate left
		else if(name == 'image_rotate_left'){
			MAIN.save_state();
			MENU.rotate_resize_doc(270, WIDTH, HEIGHT); 
			for(var i in LAYERS){
				var layer = document.getElementById(LAYERS[i].name).getContext("2d");
				MENU.rotate_layer({angle: 270}, layer, WIDTH, HEIGHT);
				}
			}
		//rotate right
		else if(name == 'image_rotate_right'){
			MAIN.save_state();
			MENU.rotate_resize_doc(90, WIDTH, HEIGHT); 
			for(var i in LAYERS){
				var layer = document.getElementById(LAYERS[i].name).getContext("2d");
				MENU.rotate_layer({angle: 90}, layer, WIDTH, HEIGHT);
				}
			}
		//rotate
		else if(name == 'image_rotate'){
			POP.add({name: "angle", 	title: "Enter angle (0-360):",	value: 0, range: [0, 360],	});
			POP.show('Rotate', function(response){
					MAIN.save_state();
					MENU.rotate_resize_doc(response.angle, WIDTH, HEIGHT); 
					for(var i in LAYERS){
						var layer = document.getElementById(LAYERS[i].name).getContext("2d");
						MENU.rotate_layer(response, layer, WIDTH, HEIGHT); 
						}
					},
				function(response, canvas_preview, w, h){
					MENU.rotate_layer(response, canvas_preview, w, h); 
					});
			}
		//vertical flip
		else if(name == 'image_vflip'){
			MAIN.save_state();
			for(var i in LAYERS){
				var layer = document.getElementById(LAYERS[i].name).getContext("2d");
				
				var tempCanvas = document.createElement("canvas");
				var tempCtx = tempCanvas.getContext("2d");
				tempCanvas.width = WIDTH;
				tempCanvas.height = HEIGHT;
				tempCtx.drawImage(document.getElementById(LAYERS[i].name), 0, 0, WIDTH, HEIGHT);
				//flip
				layer.clearRect(0, 0, WIDTH, HEIGHT);
				layer.save();
				layer.scale(-1, 1);
				layer.drawImage(tempCanvas, -WIDTH, 0);
				layer.restore();
				}
			}
		//horizontal flip
		else if(name == 'image_hflip'){
			MAIN.save_state();
			for(var i in LAYERS){
				var layer = document.getElementById(LAYERS[i].name).getContext("2d");
				
				var tempCanvas = document.createElement("canvas");
				var tempCtx = tempCanvas.getContext("2d");
				tempCanvas.width = WIDTH;
				tempCanvas.height = HEIGHT;
				tempCtx.drawImage(document.getElementById(LAYERS[i].name), 0, 0, WIDTH, HEIGHT);
				//flip
				layer.clearRect(0, 0, WIDTH, HEIGHT);
				layer.save();
				layer.scale(1, -1);
				layer.drawImage(tempCanvas, 0, -HEIGHT);
				layer.restore();
				}
			}
		//color corrections
		else if(name == 'image_colors'){
			POP.add({name: "param1",	title: "Brightness:",	value: "0",	range: [-100, 100], });
			POP.add({name: "param2",	title: "Contrast:",	value: "0",	range: [-100, 100], });
			POP.add({name: "param_red",	title: "Red offset:",	value: "0",	range: [-255, 255], });
			POP.add({name: "param_green",	title: "Green offset:",	value: "0",	range: [-255, 255], });
			POP.add({name: "param_blue",	title: "Blue offset:",	value: "0",	range: [-255, 255], });
			POP.add({name: "param_h",	title: "Hue:",		value: "0",	range: [-180, 180], });
			POP.add({name: "param_s",	title: "Saturation:",	value: "0",	range: [-100, 100], });
			POP.add({name: "param_l",	title: "Luminance:",	value: "0",	range: [-100, 100], });
			
			POP.show('Brightness Contrast', function(user_response){
					MAIN.save_state();
					for(var i in LAYERS){
						var layer = document.getElementById(LAYERS[i].name).getContext("2d");
						var param1 = parseInt(user_response.param1);
						var param2 = parseInt(user_response.param2);
						var param_red = parseInt(user_response.param_red);
						var param_green = parseInt(user_response.param_green);
						var param_blue = parseInt(user_response.param_blue);
						var param_h = parseInt(user_response.param_h);
						var param_s = parseInt(user_response.param_s);
						var param_l = parseInt(user_response.param_l);
						
						var imageData = layer.getImageData(0, 0, WIDTH, HEIGHT);
						//Brightness/Contrast
						var filtered = ImageFilters.BrightnessContrastPhotoshop(imageData, param1, param2);
						//RGB corrections
						var filtered = ImageFilters.ColorTransformFilter(filtered, 1, 1, 1, 1, param_red, param_green, param_blue, 1);
						//hue/saturation/luminance
						var filtered = ImageFilters.HSLAdjustment(filtered, param_h, param_s, param_l);
						layer.putImageData(filtered, 0, 0);
						DRAW.zoom();
						}
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseInt(user_response.param1);
					var param2 = parseInt(user_response.param2);
					var param_red = parseInt(user_response.param_red);
					var param_green = parseInt(user_response.param_green);
					var param_blue = parseInt(user_response.param_blue);
					var param_h = parseInt(user_response.param_h);
					var param_s = parseInt(user_response.param_s);
					var param_l = parseInt(user_response.param_l);
					
					var imageData = canvas_preview.getImageData(0, 0, w, h);
					//Brightness/Contrast
					var filtered = ImageFilters.BrightnessContrastPhotoshop(imageData, param1, param2);	//add effect
					//RGB corrections
					var filtered = ImageFilters.ColorTransformFilter(filtered, 1, 1, 1, 1, param_red, param_green, param_blue, 1);
					//hue/saturation/luminance
					var filtered = ImageFilters.HSLAdjustment(filtered, param_h, param_s, param_l);
					canvas_preview.putImageData(filtered, 0, 0);
					});
			}
		//negative
		else if(name == 'image_negative'){
			MAIN.save_state();
			for(var i in LAYERS){
				var layer = document.getElementById(LAYERS[i].name).getContext("2d");
				
				if(TOOLS.select_data == false)
					var imageData = layer.getImageData(0, 0, WIDTH, HEIGHT);
				else
					var imageData = layer.getImageData(TOOLS.select_data.x, TOOLS.select_data.y, TOOLS.select_data.w, TOOLS.select_data.h);
				var pixels = imageData.data;
				for (var i = 0; i < pixels.length; i += 4){
					pixels[i]   = 255 - pixels[i];   // red
					pixels[i+1] = 255 - pixels[i+1]; // green
					pixels[i+2] = 255 - pixels[i+2]; // blue
					}
				//save
				if(TOOLS.select_data == false)
					layer.putImageData(imageData, 0, 0);
				else
					layer.putImageData(imageData, TOOLS.select_data.x, TOOLS.select_data.y);
				}
			}
		//grid
		else if(name == 'image_grid'){
			if(MAIN.grid == false){
				POP.add({name: "gap_x",		title: "Horizontal gap:",	value: "50",	});
				POP.add({name: "gap_y",		title: "Vertical gap:",	value: "50",	});	
				POP.show('Grid', function(response){
					gap_x = response.gap_x;
					gap_y = response.gap_y;
					MAIN.grid = true;
					DRAW.draw_grid(canvas_back, gap_x, gap_y);
					DRAW.zoom();
					});
				}
			else{
				MAIN.grid = false;
				canvas_back.clearRect(0, 0, WIDTH, HEIGHT);
				DRAW.draw_background(canvas_back);
				}
			}
			
		//===== Layer ==========================================================
		
		//new layer
		else if(name == 'layer_new'){
			MAIN.save_state();
			LAYER.layer_add();
			}
		//dublicate
		else if(name == 'layer_dublicate'){
			MAIN.save_state();
			//copy
			tmp_data = document.createElement("canvas");
			tmp_data.width = WIDTH;
			tmp_data.height = HEIGHT;
			tmp_data.getContext("2d").drawImage(canvas_active(true), 0, 0);
			
			//create
			var new_name = 'Layer #'+(LAYERS.length+1);
			LAYER.create_canvas(new_name);
			LAYERS.push({name: new_name, visible: true});
			LAYER.layer_active = LAYERS.length-1;
			canvas_active().drawImage(tmp_data, 0, 0);
			LAYER.layer_renew();
			}
		//show / hide
		else if(name == 'layer_show_hide'){
			LAYER.layer_visibility(LAYER.layer_active);
			}
		//delete
		else if(name == 'layer_delete'){
			MAIN.save_state();
			LAYER.layer_remove(LAYER.layer_active);
			}
		//move up
		else if(name == 'layer_move_up'){
			MAIN.save_state();
			LAYER.move_layer('up');
			}
		//move down
		else if(name == 'layer_move_down'){
			MAIN.save_state();
			LAYER.move_layer('down');
			}
		//opacity
		else if(name == 'layer_opacity'){
			LAYER.set_alpha();
			}
		//color corrections
		else if(name == 'layer_colors'){
			POP.add({name: "param1",	title: "Brightness:",	value: "0",	range: [-100, 100], });
			POP.add({name: "param2",	title: "Contrast:",	value: "0",	range: [-100, 100], });
			POP.add({name: "param_red",	title: "Red offset:",	value: "0",	range: [-255, 255], });
			POP.add({name: "param_green",	title: "Green offset:",	value: "0",	range: [-255, 255], });
			POP.add({name: "param_blue",	title: "Blue offset:",	value: "0",	range: [-255, 255], });
			POP.add({name: "param_h",	title: "Hue:",		value: "0",	range: [-180, 180], });
			POP.add({name: "param_s",	title: "Saturation:",	value: "0",	range: [-100, 100], });
			POP.add({name: "param_l",	title: "Luminance:",	value: "0",	range: [-100, 100], });
			
			POP.show('Brightness Contrast', function(user_response){
					MAIN.save_state();
					var param1 = parseInt(user_response.param1);
					var param2 = parseInt(user_response.param2);
					var param_red = parseInt(user_response.param_red);
					var param_green = parseInt(user_response.param_green);
					var param_blue = parseInt(user_response.param_blue);
					var param_h = parseInt(user_response.param_h);
					var param_s = parseInt(user_response.param_s);
					var param_l = parseInt(user_response.param_l);
					
					var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
					//Brightness/Contrast
					var filtered = ImageFilters.BrightnessContrastPhotoshop(imageData, param1, param2);
					//RGB corrections
					var filtered = ImageFilters.ColorTransformFilter(filtered, 1, 1, 1, 1, param_red, param_green, param_blue, 1);
					//hue/saturation/luminance
					var filtered = ImageFilters.HSLAdjustment(filtered, param_h, param_s, param_l);
					canvas_active().putImageData(filtered, 0, 0);
					DRAW.zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseInt(user_response.param1);
					var param2 = parseInt(user_response.param2);
					var param_red = parseInt(user_response.param_red);
					var param_green = parseInt(user_response.param_green);
					var param_blue = parseInt(user_response.param_blue);
					var param_h = parseInt(user_response.param_h);
					var param_s = parseInt(user_response.param_s);
					var param_l = parseInt(user_response.param_l);
					
					var imageData = canvas_preview.getImageData(0, 0, w, h);
					//Brightness/Contrast
					var filtered = ImageFilters.BrightnessContrastPhotoshop(imageData, param1, param2);	//add effect
					//RGB corrections
					var filtered = ImageFilters.ColorTransformFilter(filtered, 1, 1, 1, 1, param_red, param_green, param_blue, 1);
					//hue/saturation/luminance
					var filtered = ImageFilters.HSLAdjustment(filtered, param_h, param_s, param_l);
					canvas_preview.putImageData(filtered, 0, 0);
					});
			}	
		//rotate left
		else if(name == 'layer_rotate_left'){
			MAIN.save_state();
			MENU.rotate_layer({angle: 270}, canvas_active(), WIDTH, HEIGHT);
			}
		//rotate right
		else if(name == 'layer_rotate_right'){
			MAIN.save_state();
			MENU.rotate_layer({angle: 90}, canvas_active(), WIDTH, HEIGHT);
			}
		//rotate
		else if(name == 'layer_rotate'){
			POP.add({name: "angle",	title: "Enter angle (0-360):",	value: 90, range: [0, 360],	});
			POP.show('Rotate', function(response){
					MAIN.save_state();
					MENU.rotate_layer(response, canvas_active(), WIDTH, HEIGHT); 
					},
				function(response, canvas_preview, w, h){
					MENU.rotate_layer(response, canvas_preview, w, h); 
					});
			}
		//vertical flip
		else if(name == 'layer_vflip'){
			MAIN.save_state();
			var tempCanvas = document.createElement("canvas");
			var tempCtx = tempCanvas.getContext("2d");
			tempCanvas.width = WIDTH;
			tempCanvas.height = HEIGHT;
			tempCtx.drawImage(canvas_active(true), 0, 0, WIDTH, HEIGHT);
			//flip
			canvas_active().clearRect(0, 0, WIDTH, HEIGHT);
			canvas_active().save();
			canvas_active().scale(-1, 1);
			canvas_active().drawImage(tempCanvas, -WIDTH, 0);
			canvas_active().restore();
			}
		//horizontal flip
		else if(name == 'layer_hflip'){
			MAIN.save_state();
			var tempCanvas = document.createElement("canvas");
			var tempCtx = tempCanvas.getContext("2d");
			tempCanvas.width = WIDTH;
			tempCanvas.height = HEIGHT;
			tempCtx.drawImage(canvas_active(true), 0, 0, WIDTH, HEIGHT);
			//flip
			canvas_active().clearRect(0, 0, WIDTH, HEIGHT);
			canvas_active().save();
			canvas_active().scale(1, -1);
			canvas_active().drawImage(tempCanvas, 0, -HEIGHT);
			canvas_active().restore();
			}
		//trim
		else if(name == 'layer_trim'){
			MAIN.save_state();
			DRAW.trim(LAYERS[LAYER.layer_active].name, true);
			}
		//resize
		else if(name == 'layer_resize'){
			POP.add({name: "width",	title: "Enter new width:",	value: WIDTH,});
			POP.add({name: "height",title: "Enter new height:",	value: HEIGHT});
			POP.add({name: "mode",	title: "Mode:",	values: ["Resample - Lanczos", "Resize"],});
			POP.show('Resize', this.resize_layer);
			}
		//negative
		else if(name == 'layer_negative'){
			MAIN.save_state();
			if(TOOLS.select_data == false)
				var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
			else
				var imageData = canvas_active().getImageData(TOOLS.select_data.x, TOOLS.select_data.y, TOOLS.select_data.w, TOOLS.select_data.h);
			var pixels = imageData.data;
			for (var i = 0; i < pixels.length; i += 4){
				pixels[i]   = 255 - pixels[i];   // red
				pixels[i+1] = 255 - pixels[i+1]; // green
				pixels[i+2] = 255 - pixels[i+2]; // blue
				}
			//save
			if(TOOLS.select_data == false)
				canvas_active().putImageData(imageData, 0, 0);
			else
				canvas_active().putImageData(imageData, TOOLS.select_data.x, TOOLS.select_data.y)
			}
		//clear
		else if(name == 'layer_clear'){
			MAIN.save_state();
			canvas_active().clearRect(0, 0, WIDTH, HEIGHT);
			}
		//merge
		else if(name == 'layer_merge_down'){
			MAIN.save_state();
			vlayer_active = parseInt(layer_active);
			if(LAYER.layer_active + 1 > LAYERS.length){
				POP.add({title: "Error:",	value: 'This is last layer',	});
				POP.show('Error', '');
				return false;
				}
			//copy
			LAYER.layer_active++;
			tmp_data = document.createElement("canvas");
			tmp_data.width = WIDTH;
			tmp_data.height = HEIGHT;
			tmp_data.getContext("2d").drawImage(canvas_active(true), 0, 0);
			
			//paste
			LAYER.layer_active--;
			canvas_active().drawImage(tmp_data, 0, 0);
			
			//remove next layer
			LAYER.layer_remove(LAYER.layer_active+1);
			LAYER.layer_renew();
			}
		//exif
		else if(name == 'image_exif'){
			if(TOOLS.EXIF === false){
				POP.add({title: "Error:",	value: 'EXIF info not found.',	});
				POP.show('EXIF info', '');
				}
			else{
				for(var i in TOOLS.EXIF)
					POP.add({title: i+":",	value: TOOLS.EXIF[i],	});
				POP.show('EXIF info', '');
				}
			}
		//flatten all
		else if(name == 'layer_flatten'){
			MAIN.save_state();
			if(LAYERS.length == 1) return false;
			tmp_data = document.createElement("canvas");
			tmp_data.width = WIDTH;
			tmp_data.height = HEIGHT;
			for(var i=LAYERS.length - 1; i > 0; i--){
				//copy
				LAYER.layer_active = i;
				tmp_data.getContext("2d").clearRect(0, 0, WIDTH, HEIGHT);
				tmp_data.getContext("2d").drawImage(canvas_active(true), 0, 0);
				
				//paste
				LAYER.layer_active = 0;
				canvas_active().drawImage(tmp_data, 0, 0);
				
				//delete layer
				LAYER.layer_active = i;
				LAYER.layer_remove(LAYER.layer_active);
				}
			LAYER.layer_renew();
			}
			
		//===== Effects ========================================================
		
		else if(name == 'effects_bw'){
			MAIN.save_state();
			DRAW.effect_bw(canvas_active(), WIDTH, HEIGHT);
			}
		else if(name == 'effects_BoxBlur'){
			POP.add({name: "param1",	title: "H Radius:",	value: "3",	range: [1, 20], });
			POP.add({name: "param2",	title: "V Radius:",	value: "3",	range: [1, 20], });
			POP.add({name: "param3",	title: "Quality:",	value: "2",	range: [1, 10], });
			POP.show('Blur-Box', function(user_response){
					MAIN.save_state();
					var param1 = parseInt(user_response.param1);
					var param2 = parseInt(user_response.param2);
					var param3 = parseInt(user_response.param3);
					
					var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
					var filtered = ImageFilters.BoxBlur(imageData, param1, param2, param3);	//add effect
					canvas_active().putImageData(filtered, 0, 0);
					DRAW.zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseInt(user_response.param1);
					var param2 = parseInt(user_response.param2);
					var param3 = parseInt(user_response.param3);
					var imageData = canvas_preview.getImageData(0, 0, w, h);
					var filtered = ImageFilters.BoxBlur(imageData, param1, param2, param3);	//add effect
					canvas_preview.putImageData(filtered, 0, 0);
					});
			}
		else if(name == 'effects_GaussianBlur'){
			POP.add({name: "param1",	title: "Strength:",	value: "2",	range: [1, 4], step: 0.1 });
			POP.show('Blur-Gaussian', function(user_response){
					MAIN.save_state();
					var param1 = parseInt(user_response.param1);
					
					var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
					var filtered = ImageFilters.GaussianBlur(imageData, param1);	//add effect
					canvas_active().putImageData(filtered, 0, 0);
					DRAW.zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseInt(user_response.param1);
					var imageData = canvas_preview.getImageData(0, 0, w, h);
					var filtered = ImageFilters.GaussianBlur(imageData, param1);	//add effect
					canvas_preview.putImageData(filtered, 0, 0);
					});
			}
		else if(name == 'effects_StackBlur'){
			POP.add({name: "param1",	title: "Radius:",	value: "6",	range: [1, 40], });
			POP.show('Blur-Stack', function(user_response){
					MAIN.save_state();
					var param1 = parseInt(user_response.param1);
					
					var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
					var filtered = ImageFilters.StackBlur(imageData, param1);	//add effect
					canvas_active().putImageData(filtered, 0, 0);
					DRAW.zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseInt(user_response.param1);
					var imageData = canvas_preview.getImageData(0, 0, w, h);
					var filtered = ImageFilters.StackBlur(imageData, param1);	//add effect
					canvas_preview.putImageData(filtered, 0, 0);
					});
			}
		else if(name == 'effects_BrightnessContrast'){
			POP.add({name: "param1",	title: "Brightness:",	value: "0",	range: [-100, 100], });
			POP.add({name: "param2",	title: "Contrast:",	value: "0",	range: [-100, 100], });
			POP.show('Brightness Contrast', function(user_response){
					MAIN.save_state();
					var param1 = parseInt(user_response.param1);
					var param2 = parseInt(user_response.param2);
					
					var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
					var filtered = ImageFilters.BrightnessContrastPhotoshop(imageData, param1, param2);	//add effect
					canvas_active().putImageData(filtered, 0, 0);
					DRAW.zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseInt(user_response.param1);
					var param2 = parseInt(user_response.param2);
					var imageData = canvas_preview.getImageData(0, 0, w, h);
					var filtered = ImageFilters.BrightnessContrastPhotoshop(imageData, param1, param2);	//add effect

					canvas_preview.putImageData(filtered, 0, 0);
					});
			}
		else if(name == 'effects_bulge_pinch'){
			POP.add({name: "param1",	title: "Strength:",	value: 1,	range: [-1, 1],  step: 0.1, });
			var default_value = Math.min(WIDTH, HEIGHT);
			default_value = round(default_value/2);
			POP.add({name: "param2",	title: "Radius:",	value: default_value,	range: [0, 600], });
			POP.show('Bulge/Pinch', function(user_response){
					MAIN.save_state();
					var param1 = parseFloat(user_response.param1);
					var param2 = parseInt(user_response.param2);
					
					var filter = fx.canvas();
					var texture = filter.texture(canvas_active(true));
					filter.draw(texture).bulgePinch(round(WIDTH/2), round(HEIGHT/2), param2, param1).update();	//effect
					canvas_active().clearRect(0, 0, WIDTH, HEIGHT);
					canvas_active().drawImage(filter, 0, 0);
					DRAW.zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseFloat(user_response.param1);
					var param2 = parseInt(user_response.param2);
					
					//recalc param by size
					param2 = param2 / Math.min(WIDTH, HEIGHT) * Math.min(w, h);
					
					var filter = fx.canvas();
					var texture = filter.texture(canvas_preview.getImageData(0, 0, w, h));
					filter.draw(texture).bulgePinch(round(w/2), round(h/2), param2, param1).update();	//effect
					canvas_preview.drawImage(filter, 0, 0);
					});
			}
		else if(name == 'effects_Channels'){
			POP.add({name: "param1",	title: "Red:",	value: "1",	range: [0, 1], });
			POP.add({name: "param2",	title: "Green:",	value: "0",	range: [0, 1], });
			POP.add({name: "param3",	title: "Blue:",	value: "0",	range: [0, 1], });
			POP.show('Channels', function(user_response){
					MAIN.save_state();
					var param1 = parseInt(user_response.param1);
					var param2 = parseInt(user_response.param2);
					var param3 = parseInt(user_response.param3);
					var channel = 1;
					if(param2 == 1) channel = 2;
					if(param3 == 1) channel = 3;	
		
					var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
					var filtered = ImageFilters.Channels(imageData, channel);	//add effect
					canvas_active().putImageData(filtered, 0, 0);
					DRAW.zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseInt(user_response.param1);
					var param2 = parseInt(user_response.param2);
					var param3 = parseInt(user_response.param3);
					var channel = 1;
					if(param2 == 1) channel = 2;
					if(param3 == 1) channel = 3;
					var imageData = canvas_preview.getImageData(0, 0, w, h);
					var filtered = ImageFilters.Channels(imageData, channel);	//add effect
					canvas_preview.putImageData(filtered, 0, 0);
					});
			}
		else if(name == 'effects_ColorTransformFilter'){
			/*POP.add({name: "param1",	title: "Red multiplier:",	value: "1",	range: [0, 5], });
			POP.add({name: "param2",	title: "Green multiplier:",	value: "1",	range: [0, 5], });
			POP.add({name: "param3",	title: "Blue multiplier:",	value: "1",	range: [0, 5], });
			POP.add({name: "param4",	title: "Alpha multiplier:",	value: "1",	range: [0, 5], });*/
			POP.add({name: "param5",	title: "Red offset:",	value: "0",	range: [-255, 255], });
			POP.add({name: "param6",	title: "Green offset:",	value: "0",	range: [-255, 255], });
			POP.add({name: "param7",	title: "Blue offset:",	value: "0",	range: [-255, 255], });
			POP.add({name: "param8",	title: "Alpha offset:",	value: "0",	range: [-255, 255], });
			POP.show('Color Transform', function(user_response){
					MAIN.save_state();
					var param5 = parseInt(user_response.param5);
					var param6 = parseInt(user_response.param6);
					var param7 = parseInt(user_response.param7);
					var param8 = parseInt(user_response.param8);
		
					var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
					var filtered = ImageFilters.ColorTransformFilter(imageData, 1, 1, 1, 1, param5, param6, param7, param8);	//add effect
					canvas_active().putImageData(filtered, 0, 0);
					DRAW.zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param5 = parseInt(user_response.param5);
					var param6 = parseInt(user_response.param6);
					var param7 = parseInt(user_response.param7);
					var param8 = parseInt(user_response.param8);
					var imageData = canvas_preview.getImageData(0, 0, w, h);
					var filtered = ImageFilters.ColorTransformFilter(imageData, 1, 1, 1, 1, param5, param6, param7, param8);	//add effect
					canvas_preview.putImageData(filtered, 0, 0);
					});
			}
		else if(name == 'effects_Desaturate'){
			MAIN.save_state();
			var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
			var filtered = ImageFilters.Desaturate(imageData);	//add effect
			canvas_active().putImageData(filtered, 0, 0);
			}
		else if(name == 'effects_Dither'){
			POP.add({name: "param1",	title: "Levels:",	value: "8",	range: [2, 32], });
			POP.show('Dither', function(user_response){
					MAIN.save_state();
					var param1 = parseInt(user_response.param1);
					
					var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
					var filtered = ImageFilters.Dither(imageData, param1);	//add effect
					canvas_active().putImageData(filtered, 0, 0);
					DRAW.zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseInt(user_response.param1);
					var imageData = canvas_preview.getImageData(0, 0, w, h);
					var filtered = ImageFilters.Dither(imageData, param1);	//add effect
					canvas_preview.putImageData(filtered, 0, 0);
					});
			}
		else if(name == 'effects_dot_screen'){
			POP.add({name: "param1",	title: "Angle:",	value: "1.1",	range: [0, 1.5], });
			POP.add({name: "param2",	title: "Size:",	value: "3",	range: [1, 20], });
			POP.show('Dot Screen', function(user_response){
					MAIN.save_state();
					var param1 = parseInt(user_response.param1);
					var param2 = parseInt(user_response.param2);
					
					var filter = fx.canvas();
					var texture = filter.texture(canvas_active(true));
					filter.draw(texture).dotScreen(round(WIDTH/2), round(HEIGHT/2), param1, param2).update();	//effect
					canvas_active().clearRect(0, 0, WIDTH, HEIGHT);
					canvas_active().drawImage(filter, 0, 0);
					DRAW.zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseInt(user_response.param1);
					var param2 = parseInt(user_response.param2);
					
					var filter = fx.canvas();
					var texture = filter.texture(canvas_preview.getImageData(0, 0, w, h));
					filter.draw(texture).dotScreen(round(w/2), round(h/2), param1, param2).update();	//effect
					canvas_preview.drawImage(filter, 0, 0);
					});
			}
		else if(name == 'effects_Edge'){
			MAIN.save_state();
			var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
			var filtered = ImageFilters.Edge(imageData);	//add effect
			canvas_active().putImageData(filtered, 0, 0);
			}
		else if(name == 'effects_Emboss'){
			MAIN.save_state();
			var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
			var filtered = ImageFilters.Emboss(imageData);	//add effect
			canvas_active().putImageData(filtered, 0, 0);
			}
		else if(name == 'effects_Enrich'){
			MAIN.save_state();
			var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
			var filtered = ImageFilters.Enrich(imageData);	//add effect
			canvas_active().putImageData(filtered, 0, 0);
			}
		else if(name == 'effects_Gamma'){
			POP.add({name: "param1",	title: "Gamma:",	value: "1",	range: [0, 3], step: 0.1, });
			POP.show('Gamma', function(user_response){
					MAIN.save_state();
					var param1 = parseFloat(user_response.param1);
					
					var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
					var filtered = ImageFilters.Gamma(imageData, param1);	//add effect
					canvas_active().putImageData(filtered, 0, 0);
					DRAW.zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseFloat(user_response.param1);
					
					var imageData = canvas_preview.getImageData(0, 0, w, h);
					var filtered = ImageFilters.Gamma(imageData, param1);	//add effect
					canvas_preview.putImageData(filtered, 0, 0);
					});
			}
		else if(name == 'effects_GrayScale'){
			MAIN.save_state();
			var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
			var filtered = ImageFilters.GrayScale(imageData);	//add effect
			canvas_active().putImageData(filtered, 0, 0);
			}
		else if(name == 'effects_HSLAdjustment'){
			POP.add({name: "param1",	title: "Hue:",	value: "0",	range: [-180, 180], });
			POP.add({name: "param2",	title: "Saturation:",	value: "0",	range: [-100, 100], });
			POP.add({name: "param3",	title: "Luminance:",	value: "0",	range: [-100, 100], });
			POP.show('HSL Adjustment', function(user_response){
					MAIN.save_state();
					var param1 = parseInt(user_response.param1);
					var param2 = parseInt(user_response.param2);
					var param3 = parseInt(user_response.param3);
					
					var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
					var filtered = ImageFilters.HSLAdjustment(imageData, param1, param2, param3);	//add effect
					canvas_active().putImageData(filtered, 0, 0);
					DRAW.zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseInt(user_response.param1);
					var param2 = parseInt(user_response.param2);
					var param3 = parseInt(user_response.param3);
					var imageData = canvas_preview.getImageData(0, 0, w, h);
					var filtered = ImageFilters.HSLAdjustment(imageData, param1, param2, param3);	//add effect
					canvas_preview.putImageData(filtered, 0, 0);
					});
			}
		else if(name == 'effects_Mosaic'){
			POP.add({name: "param1",	title: "Size:",	value: "10",	range: [1, 100], });
			POP.show('Mosaic', function(user_response){
					MAIN.save_state();
					var param1 = parseInt(user_response.param1);
					
					var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
					var filtered = ImageFilters.Mosaic(imageData, param1);	//add effect
					canvas_active().putImageData(filtered, 0, 0);
					DRAW.zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseInt(user_response.param1);
					var imageData = canvas_preview.getImageData(0, 0, w, h);
					var filtered = ImageFilters.Mosaic(imageData, param1);	//add effect
					canvas_preview.putImageData(filtered, 0, 0);
					});
			}
		else if(name == 'effects_Oil'){
			POP.add({name: "param1",	title: "Range:",	value: "2",	range: [1, 5], });
			POP.add({name: "param2",	title: "Levels:",	value: "32",	range: [1, 256], });
			POP.show('Oil', function(user_response){
					MAIN.save_state();
					var param1 = parseInt(user_response.param1);
					var param2 = parseInt(user_response.param2);
					
					var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
					var filtered = ImageFilters.Oil(imageData, param1, param2);	//add effect
					canvas_active().putImageData(filtered, 0, 0);
					DRAW.zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseInt(user_response.param1);
					var param2 = parseInt(user_response.param2);
					var imageData = canvas_preview.getImageData(0, 0, w, h);
					var filtered = ImageFilters.Oil(imageData, param1, param2);	//add effect
					canvas_preview.putImageData(filtered, 0, 0);
					});
			}
		else if(name == 'effects_Posterize'){
			POP.add({name: "param1",	title: "Levels:",	value: "8",	range: [2, 32], });
			POP.show('Posterize', function(user_response){
					MAIN.save_state();
					var param1 = parseInt(user_response.param1);
					
					var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
					var filtered = ImageFilters.Posterize(imageData, param1);	//add effect
					canvas_active().putImageData(filtered, 0, 0);
					DRAW.zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseInt(user_response.param1);
					var imageData = canvas_preview.getImageData(0, 0, w, h);
					var filtered = ImageFilters.Posterize(imageData, param1);	//add effect
					canvas_preview.putImageData(filtered, 0, 0);
					});
			}
		else if(name == 'effects_Sepia'){
			MAIN.save_state();
			var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
			var filtered = ImageFilters.Sepia(imageData);	//add effect
			canvas_active().putImageData(filtered, 0, 0);
			}
		else if(name == 'effects_Sharpen'){
			POP.add({name: "param1",	title: "Factor:",	value: "3",	range: [1, 10], step: 0.1 });
			POP.show('Sharpen', function(user_response){
					MAIN.save_state();
					var param1 = parseFloat(user_response.param1);
					var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
					var filtered = ImageFilters.Sharpen(imageData, param1);	//add effect
					canvas_active().putImageData(filtered, 0, 0);
					DRAW.zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseFloat(user_response.param1);
					var imageData = canvas_preview.getImageData(0, 0, w, h);
					var filtered = ImageFilters.Sharpen(imageData, param1);	//add effect
					canvas_preview.putImageData(filtered, 0, 0);
					});
			}
		else if(name == 'effects_Solarize'){
			MAIN.save_state();
			var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
			var filtered = ImageFilters.Solarize(imageData);	//add effect
			canvas_active().putImageData(filtered, 0, 0);
			}
		else if(name == 'effects_tilt_shift'){
			//extra
			POP.add({name: "param7",	title: "Saturation:",	value: "30",	range: [0, 100], });
			POP.add({name: "param8",	title: "Sharpen:",	value: "3",	range: [1, 10], });		
			//main
			POP.add({name: "param1",	title: "Blur Radius:",	value: "15",	range: [0, 50], });
			POP.add({name: "param2",	title: "Gradient Radius:",	value: "200",	range: [0, 400], });
			//startX, startY, endX, endY
			POP.add({name: "param3",	title: "X start:",	value: "0",	range: [0, WIDTH], });
			POP.add({name: "param4",	title: "Y start:",	value: round(HEIGHT/2),	range: [0, HEIGHT], });
			POP.add({name: "param5",	title: "X end:",	value: WIDTH,	range: [0, WIDTH], });
			POP.add({name: "param6",	title: "Y end:",	value: round(HEIGHT/2),	range: [0, HEIGHT], });
			
			POP.show('Tilt Shift', function(user_response){
					MAIN.save_state();
					var param1 = parseInt(user_response.param1);
					var param2 = parseInt(user_response.param2);
					var param3 = parseInt(user_response.param3);
					var param4 = parseInt(user_response.param4);
					var param5 = parseInt(user_response.param5);
					var param6 = parseInt(user_response.param6);
					var param7 = parseInt(user_response.param7);
					var param8 = parseInt(user_response.param8);
					
					//main effect
					var filter = fx.canvas();
					var texture = filter.texture(canvas_active(true));
					filter.draw(texture).tiltShift(param3, param4, param5, param6, param1, param2).update();	//effect
					canvas_active().clearRect(0, 0, WIDTH, HEIGHT);
					canvas_active().drawImage(filter, 0, 0);
					
					//saturation
					var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
					var filtered = ImageFilters.HSLAdjustment(imageData, 0, param7, 0);
					canvas_active().putImageData(filtered, 0, 0);
					
					//sharpen
					var imageData = canvas_active().getImageData(0, 0, WIDTH, HEIGHT);
					var filtered = ImageFilters.Sharpen(imageData, param8);
					canvas_active().putImageData(filtered, 0, 0);
					
					DRAW.zoom();
					},
				function(user_response, canvas_preview, w, h){
					var param1 = parseInt(user_response.param1);
					var param2 = parseInt(user_response.param2);
					var param3 = parseInt(user_response.param3);
					var param4 = parseInt(user_response.param4);
					var param5 = parseInt(user_response.param5);
					var param6 = parseInt(user_response.param6);
					var param7 = parseInt(user_response.param7);
					var param8 = parseInt(user_response.param8);
					
					//recalc param by size
					var param3 = param3 / WIDTH * w;
					var param4 = param4 / HEIGHT * h;
					var param5 = param5 / WIDTH * w;
					var param6 = param6 / HEIGHT * h;
					
					//main effect
					var filter = fx.canvas();
					var texture = filter.texture(canvas_preview.getImageData(0, 0, w, h));
					filter.draw(texture).tiltShift(param3, param4, param5, param6, param1, param2).update();	//effect
					canvas_preview.drawImage(filter, 0, 0);
					
					//draw line
					canvas_preview.beginPath();
					canvas_preview.strokeStyle = "#ff0000";
					canvas_preview.lineWidth = 1;
					canvas_preview.moveTo(param3 + 0.5, param4 + 0.5);
					canvas_preview.lineTo(param5 + 0.5, param6 + 0.5);
					canvas_preview.stroke();
					});
			}
		
		//===== Help ===========================================================
		
		//shortcuts
		else if(name == 'help_shortcuts'){
			POP.add({title: "Del:",		value: 'Delete selection',	});
			POP.add({title: "G:",		value: 'Grid on/off',	});
			POP.add({title: "L:",		value: 'Rotate left',	});
			POP.add({title: "O:",		value: 'Open file(s)',	});
			POP.add({title: "R:",		value: 'Rotate right',	});
			POP.add({title: "S:",		value: 'Save',	});
			POP.add({title: "T:",		value: 'Trim',	});
			POP.add({title: "CTRL + Z:",	value: 'Undo',	});
			POP.add({title: "CTRL + A:",	value: 'Select all',	});
			POP.add({title: "CTRL + X:",	value: 'Cut',	});
			POP.add({title: "CTRL + C:",	value: 'Copy',	});
			POP.add({title: "CTRL + V:",	value: 'Paste',	});
			POP.add({title: "Arrow keys:",	value: 'Move active layer by 10px',	});
			POP.add({title: "CTRL + Arrow keys:",	value: 'Move active layer by 50px',	});
			POP.add({title: "SHIFT + Arrow keys:",value: 'Move active layer by 1px',	});
			POP.add({title: "Drag & Drop:",	value: 'Imports images/xml data',	});
			POP.show('Keyboard Shortcuts', '');
			}
		//about	
		else if(name == 'help_about'){
			POP.add({title: "Name:",	value: "miniPaint "+VERSION,	});
			POP.add({title: "Description:",	value: 'online image editor',	});
			POP.add({title: "Author:",	value: AUTHOR+" - "+EMAIL,	});
			POP.show('About', '');
			}
		
		//======================================================================
		
		//close menu
		$('.menu').find('.active').removeClass('active');
		DRAW.zoom();
		}
	this.resize_custom = function(user_response){
		MAIN.save_state();
		CON.autosize = false;
		if(user_response.width != WIDTH || user_response.height != HEIGHT){
			WIDTH = user_response.width;
			HEIGHT = user_response.height;
			RATIO = WIDTH/HEIGHT;
			LAYER.set_canvas_size();
			}
		else{
			if(user_response.transparency == 'Yes')
				MAIN.TRANSPARENCY = true;
			else
				MAIN.TRANSPARENCY = false;
			DRAW.draw_background(canvas_back);
			}
		}
	//prepare rotation - increase doc dimensions if needed
	this.rotate_resize_doc = function(angle, w, h){
		var o = angle*Math.PI/180;
		var new_x = w * Math.abs(Math.cos(o)) + h * Math.abs(Math.sin(o));
		var new_y = w * Math.abs(Math.sin(o)) + h * Math.abs(Math.cos(o));
		new_x = Math.ceil(round(new_x*1000)/1000);
		new_y = Math.ceil(round(new_y*1000)/1000);
		
		if(WIDTH != new_x || HEIGHT != new_y){
			MAIN.save_state();
			var dx = 0;
			var dy = 0;
			if(new_x > WIDTH){
				dx = Math.ceil(new_x - WIDTH)/2;
				WIDTH = new_x;
				}
			if(new_y > HEIGHT){
				dy = Math.ceil(new_y - HEIGHT)/2;
				HEIGHT = new_y;
				}
			RATIO = WIDTH/HEIGHT;
			LAYER.set_canvas_size();
			
			for(var i in LAYERS){
				var layer = document.getElementById(LAYERS[i].name).getContext("2d");
				
				var tmp = layer.getImageData(0, 0, WIDTH, HEIGHT);
				layer.clearRect(0, 0, WIDTH, HEIGHT);
				layer.putImageData(tmp, dx, dy);
				}			
			}
		};
	//rotate layer
	this.rotate_layer = function(user_response, canvas, w, h){
		var TO_RADIANS = Math.PI/180;
		angle = user_response.angle;
		var tempCanvas = document.createElement("canvas");
		var tempCtx = tempCanvas.getContext("2d");
		tempCanvas.width = w;
		tempCanvas.height = h;
		var imageData = canvas.getImageData(0, 0, w, h);
		tempCtx.putImageData(imageData, 0, 0);
		
		//rotate
		canvas.clearRect(0, 0, w, h);
		canvas.save();
		canvas.translate(round(w/2), round(h/2));	
		canvas.rotate(angle * TO_RADIANS);
		canvas.drawImage(tempCanvas, -round(w/2), -round(h/2));
		canvas.restore();
		if(w == WIDTH)	//if main canvas
			DRAW.zoom();
		}
	this.copy_to_clipboard = function(){
		PASTE_DATA = false;
		PASTE_DATA = document.createElement("canvas");
		PASTE_DATA.width = TOOLS.select_data.w;
		PASTE_DATA.height = TOOLS.select_data.h;
		PASTE_DATA.getContext("2d").drawImage(canvas_active(true), TOOLS.select_data.x, TOOLS.select_data.y, TOOLS.select_data.w, TOOLS.select_data.h, 0, 0, TOOLS.select_data.w, TOOLS.select_data.h);
		}
	this.paste = function(type){
		if(PASTE_DATA == false){
			if(type == 'menu'){
				POP.add({title: "Error:",	value: 'Empty data',	});
				POP.add({title: "Notice:",	value: 'To paste from clipboard, use Ctrl-V.',	});
				POP.show('Notice', '');
				}
			return false;
			}
		
		tmp = new Array();
		var new_name = 'Layer #'+(LAYERS.length+1);
		LAYER.create_canvas(new_name);
		LAYERS.push({name: new_name, visible: true});
		LAYER.layer_active = LAYERS.length-1;
		canvas_active().drawImage(PASTE_DATA, 0, 0);
		LAYER.layer_renew();
		}
	this.resize_layer = function(user_response){
		MAIN.save_state();
		var width = parseInt(user_response.width);
		var height = parseInt(user_response.height);
		if(isNaN(width) || width<1) return false;
		if(isNaN(height) || height<1) return false;
		
		if(user_response.mode == "Resample - Lanczos"){
			var trim_details = DRAW.trim(LAYERS[LAYER.layer_active].name);	//trim
		
			var new_w = WIDTH - trim_details.left - trim_details.right;
			var new_h = HEIGHT - trim_details.top - trim_details.bottom;
			var ratio_new = new_w/new_h;
			if(width / height > RATIO)
				width = round(height * ratio_new);
			else
				height = round(width / ratio_new);
			if(width >= new_w){
				LAYER.resize_canvas(LAYERS[LAYER.layer_active].name, true);
				DRAW.zoom();
				return false;
				}
			
			POP.hide();
			POP.add({title: "Status:",	value: 'Resizing...',	});
			POP.show('Status', '');
			
			//resample using lanczos-2
			DRAW.thumbnailer(canvas_active(true), width, 3);
			}
		else{
			//simple resize - FAST
			if(width / height > RATIO)
				width = height * RATIO;
			else
				height = width / RATIO;			
			
			tmp_data = document.createElement("canvas");
			tmp_data.width = WIDTH;
			tmp_data.height = HEIGHT;
			tmp_data.getContext("2d").drawImage(canvas_active(true), 0, 0);
		
			canvas_active().clearRect(0, 0, WIDTH, HEIGHT);
			if(width <= WIDTH){
				canvas_active().drawImage(tmp_data, 0, 0, width, height);
				}
			else{
				WIDTH = round(width);
				HEIGHT = round(height);	
				RATIO = WIDTH/HEIGHT;
				LAYER.set_canvas_size();
				canvas_active().drawImage(tmp_data, 0, 0, width, height);
				}
			if(MENU.last_menu == 'image_resize')
				DRAW.trim();
			DRAW.zoom();
			}
		}
	this.save = function(user_response){
		fname = user_response.name;
		var tempCanvas = document.createElement("canvas");
		var tempCtx = tempCanvas.getContext("2d");
		tempCanvas.width = WIDTH;
		tempCanvas.height = HEIGHT;
		if(MAIN.TRANSPARENCY == false){
			tempCtx.beginPath();
			tempCtx.rect(0, 0, WIDTH, HEIGHT);
			tempCtx.fillStyle = "#ffffff";
			tempCtx.fill();
			}
		for(var i in LAYERS){
			if(LAYERS[i].visible == false) continue;
			tempCtx.drawImage(document.getElementById(LAYERS[i].name), 0, 0, WIDTH, HEIGHT);
			}
		
		//detect type
		var parts = user_response.type.split(" ");
		user_response.type = parts[0];
		
		//auto detect?
		if(HELPER.strpos(fname, '.png')==true)		user_response.type = 'PNG';
		else if(HELPER.strpos(fname, '.jpg')==true)	user_response.type = 'JPG';
		else if(HELPER.strpos(fname, '.xml')==true)	user_response.type = 'XML';
		else if(HELPER.strpos(fname, '.bmp')==true)	user_response.type = 'BMP';
		else if(HELPER.strpos(fname, '.webp')==true)	user_response.type = 'WEBP';
		
		//prepare data
		if(user_response.type == 'PNG'){
			//png - default format
			var data = tempCanvas.toDataURL("image/png");
			var data_header = "image/png";
			if(HELPER.strpos(fname, '.png')==false)
				fname = fname+".png";
			}
		else if(user_response.type == 'JPG'){
			//jpg
			var quality = parseInt(user_response.quality);
			if(quality>100 || quality < 1 || isNaN(quality)==true)
				quality = 92;
			quality = quality/100;
			var data = tempCanvas.toDataURL('image/jpeg', quality);
			var data_header = "image/jpeg";
			if(HELPER.strpos(fname, '.jpg')==false)
				fname = fname+".jpg";
			}
		else if(user_response.type == 'BMP'){
			//bmp - lets hope user really needs this - disabled - chrome dod not supprot it
			var data = tempCanvas.toDataURL("image/bmp");
			var data_header = "image/bmp";
			if(HELPER.strpos(fname, '.bmp')==false)
				fname = fname+".bmp";
			}
		else if(user_response.type == 'WEBP'){
			//WEBP - new format for chrome only
			if(HELPER.strpos(fname, '.webp')==false)
				fname = fname+".webp";
			var data_header = "image/webp";
			var data = tempCanvas.toDataURL("image/webp");
			}
		else if(user_response.type == 'XML'){
			//xml - full data with layers
			if(HELPER.strpos(fname, '.xml')==false)
				fname = fname+".xml";
			var data_header = "text/plain";
			
			var XML = '';
			//basic info
			XML += "<xml>\n";
			XML += "	<info>\n";
			XML += "		<width>"+WIDTH+"</width>\n";
			XML += "		<height>"+HEIGHT+"</height>\n";
			XML += "	</info>\n";
			//add layers info
			XML += "	<layers>\n";
			for(var i in LAYERS){			
				XML += "		<layer>\n";
				XML += "			<name>"+LAYERS[i].name+"</name>\n";
				if(LAYERS[i].visible == true)
					XML += "			<visible>1</visible>\n";
				else
					XML += "			<visible>0</visible>\n";
				XML += "			<opacity>"+LAYERS[i].opacity+"</opacity>\n";
				XML += "		</layer>\n";
				}
			XML += "	</layers>\n";
			//add data ???
			XML += "	<image_data>\n";
			for(var i in LAYERS){
				var data_tmp = document.getElementById(LAYERS[i].name).toDataURL("image/png");	
				XML += "		<data>\n";
				XML += "			<name>"+LAYERS[i].name+"</name>\n";
				XML += "			<data>"+data_tmp+"</data>\n";
				XML += "		</data>\n";
				}
			XML += "	</image_data>\n";
			XML += "</xml>\n";
				
			var bb = new Blob([XML], {type: data_header});
			var data = window.URL.createObjectURL(bb);
			}
		else
			return false;
		
		//check support
		var actualType = data.replace(/^data:([^;]*).*/, '$1');
		if(data_header != actualType && data_header != "text/plain"){
			//error - no support
			POP.add({title: "Error:",	value: "Your browser do not support "+user_response.type,	});
			POP.show('Sorry', '');
			return false;
			}
			
		//push data to user
		window.URL = window.webkitURL || window.URL;
		var a = document.createElement('a');
		if (typeof a.download != "undefined"){
			//a.download is supported
			a.setAttribute("id", "save_data");
			a.download = fname;
			a.href = data;
			a.textContent = 'Downloading...';
			document.getElementById("tmp").appendChild(a);
			
			//release memory
			a.onclick = function(e){
				MENU.save_cleanup(this);
				};
			//force click
			document.querySelector('#save_data').click();
			}
		else{
			//poor browser or poor user - not sure here. No support
			if(user_response.type == 'PNG')
				window.open(data);
			else if(user_response.type == 'JPG')
				window.open(data, quality);
			}
		};
	this.save_cleanup = function(a){
		a.textContent = 'Downloaded';
		setTimeout(function(){
			a.href = '';
			var element = document.getElementById("save_data");
			element.parentNode.removeChild(element);
			}, 1500);
		};
	this.open = function(){
		document.getElementById("tmp").innerHTML = '';
		var a = document.createElement('input');
		a.setAttribute("id", "file_open");
		a.type = 'file';
		a.multiple = 'multiple ';
		document.getElementById("tmp").appendChild(a);
		document.getElementById('file_open').addEventListener('change', MENU.open_handler, false);
		
		//force click
		document.querySelector('#file_open').click();
		}
	this.open_handler = function(e){
		var files = e.target.files; 
		for (var i = 0, f; f = files[i]; i++){
			if(!f.type.match('image.*') && f.type != 'text/xml') continue;
			
			var FR = new FileReader();
			FR.file = e.target.files[i];
			
			FR.onload = function(event){
				if(this.file.type != 'text/xml'){
					//image
					LAYER.layer_add(this.file.name, event.target.result, this.file.type);
					EXIF.getData(this.file, TOOLS.save_EXIF);
					}
				else{
					//xml
					var responce = MAIN.load_xml(event.target.result);
					if(responce === true)
						return false;
					}
				
				//finish progress
				var progress = document.getElementById('uploadprogress');
				progress.value = progress.innerHTML = 100;
				progress.style.display='none';
				};		
			FR.onprogress = (function(e){
				return function(e){
				 	var complete = (e.loaded / e.total * 100 | 0);
				 	var progress = document.getElementById('uploadprogress');
					progress.value = progress.innerHTML = complete;
					};
				})(f);
			if(f.type == "text/plain")
				FR.readAsText(f);
			else if(f.type == "text/xml")
				FR.readAsText(f);	
			else
				FR.readAsDataURL(f);
			}
		};	
	}
