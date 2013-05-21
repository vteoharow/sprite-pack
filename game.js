//Created by V Teoharov. 5/21/2013 
//https://github.com/vteoharow
var canvasBg = document.getElementById("canvasBg");
var canvasOut = document.getElementById("canvasBg");

var ctxBg = canvasBg.getContext('2d');
var ctxOut = canvasOut.getContext('2d');
var gameWidth = canvasBg.width;
var gameHeight = canvasBg.height;
var gameWidthSave = canvasBg.width;
var gameHeightSave = canvasBg.height;
var images = new Array();
var imgSprite = new Image();
var num = 0;
var toPush = 0, pushed = 0;
var overallError=false;
var highId = new Array();
var padding = 3;
var fillColor = "#000000";
var toFill = false;

var vert = false;
var boxLimit = false;
var boxWidth = 256;
var boxHeight = 512;

var grid = false;
var gridX = 10;
var gridY = 10;
var cellX = 32;
var cellY = 32;
var spriteScale = "scale none";
var spritePos = "centered";
var warned = false;

var bgSaveX = 552;
var bgSaveY = 400;

var cX = 0;
	var cY = 0;

canvasBg.addEventListener('click', selectSprite, false);

imgSprite.src = 'img/spriteBg.png';
imgSprite.addEventListener('load', init,false);
document.getElementById('back').addEventListener('click', goBack,false);

outImg();

document.getElementById('DivWithScroll').addEventListener('click', selectSprite,false);


function updateFileName(){

	document.getElementById('standardTextLinkButton8').download = document.getElementById('standardTextLinkBox8').value+".txt";
	
	document.getElementById('standardTextLinkBox8').placeholder = document.getElementById('standardTextLinkBox8').value+".txt";
	
	document.getElementById('standardTextLinkBox8').value = "";
	
	

}

function updateImageName(){

	document.getElementById('standardTextLinkButton9').download = document.getElementById('standardTextLinkBox9').value+".png";
	
	document.getElementById('standardTextLinkBox9').placeholder = document.getElementById('standardTextLinkBox9').value+".png";
	
	document.getElementById('standardTextLinkBox9').value = "";
	
	

}

function updateJSONName(){

	document.getElementById('standardTextLinkButton10').download = document.getElementById('standardTextLinkBox10').value+".json";
	
	document.getElementById('standardTextLinkBox10').placeholder = document.getElementById('standardTextLinkBox10').value+".json";
	
	document.getElementById('standardTextLinkBox10').value = "";
	
	

}



function openLoad(){

	document.getElementById('load').style.display="none";
	document.getElementById('standardTextLinkButton11').style.display="none";
	document.getElementById('loadFile').style.display="inline";
	document.getElementById('closeLoad').style.display="inline";

}

function closeLoad(){

	document.getElementById('load').style.display="inline";
	document.getElementById('standardTextLinkButton11').style.display="inline";
	document.getElementById('loadFile').style.display="none";
	document.getElementById('closeLoad').style.display="none";

}


function loadExample(){
	
	if(!warned){
	
	document.getElementById('warning').innerHTML=" WARNING! </br> Opening the Example project will overwrite all of your current data! ";
	document.getElementById('warning').style.display = "block";
	warned = true;
	return;}
	
	var json = JSON.parse(example);
	//console.log(json);
	
	
	var selectedFolder = "dropbox" + 1;	
	images = new Array();	
	folders = new Array();
	
	var saveArray = json.sf_file_2013;
		//console.log(json);
		
		
		num = 0;
		maxId = 0;
		maxLevel = 0;
		maxNum = 0;
		folderId = 1;
		selectedFolder = "dropbox1";
		
		
		for(i = 1;i<saveArray.length;i++){
			var type = saveArray[i].type;
			//console.log(type);
			
			if(type == "folder"){
				var name =  saveArray[i].name;
				var id =  parseInt(saveArray[i].id);
				var imagesString =  saveArray[i].images.split(",");
				var imagesF = new Array();
				for(var i2 = 0;i2<imagesString.length;i2++){
					imagesF.push(parseInt(imagesString[i2]));
				
				}
				
				
				if(imagesF == "NaN"){imagesF = new Array();}
				//console.log("array " + imagesF);
				
				
				var subfolderId =  parseInt(saveArray[i].subfolderId);
				var parent =  parseInt(saveArray[i].parentId);
				var parentLevel =  parseInt(saveArray[i].level);
				//console.log(id);
				if (id>maxId){maxId = id;}
				
				
				var folder = new Folder(name, parent, parentLevel);
				folder.id = id;
				folder.images = imagesF;
				folder.subfolderId = subfolderId;
				
				folders.push(folder);
			
			}
			if(type == "image"){
				var source = new Image();
				source.src=saveArray[i].source;
				
				var name = saveArray[i].name;
				var num2 = parseInt(saveArray[i].id);
				//console.log(num2);
				if (num2>maxNum){maxNum = num2;}
				images.push(new SpriteImage(source, name, num2));
			
			}
		}
		
		//console.log(maxId);
		
		for(var c = 1;c<maxId;c++){
		
			var hasIt = false;
			for(var c2 = 0;c2<folders.length;c2++){
				if(folders[c2].id == c){hasIt = true;selectedFolder = "dropbox" + c;}
			
			}
		
			if(!hasIt){
					var folder = new Folder("deleted", 0, 2);
					folder.id = c;
					folder.deleted = true;	
					folders.push(folder);
						
					//console.log("un " + c);
				}
			
		
		
		}
		
		
		folderId = maxId+1;
		num = maxNum+1;
		
		//console.log(images);
		buildFolders();
		calcPos();
		displayDrop(selectedFolder, false);
		buildFolders();
		buildData();
		buildDataPlain();
		colorFullFolders();
		
		loop();
		
		document.getElementById('load').style.display="inline";
		document.getElementById('loadFile').style.display="none";
		document.getElementById('closeLoad').style.display="none";
		
}

function loadFile(event){

	if(window.FileReader) {   //do this
	} else {
   
		
		document.getElementById('warning').innerHTML=" This browser does not support the FileReader functionality</br> required to load files to the web page.</br> Browsers that do support it are Chrome and Firefox.</br><a href=\"http://caniuse.com/filereader\" target=\"_blank\">List of Supported Browsers</a>";
		document.getElementById('warning').style.display = "block";
		return;
   
	}

	var selectedFile = event.target.files[0];
	var r = new FileReader();
	var selectedFolder = "dropbox" + 1;	
	images = new Array();	
	folders = new Array();
	
	r.onload = function(event) {
		//console.log(event.target.result);
		var json = JSON.parse(event.target.result);
		var saveArray = json.sf_file_2013;
		//console.log(json);
		
		
		num = 0;
		maxId = 0;
		maxLevel = 0;
		maxNum = 0;
		folderId = 1;
		selectedFolder = "dropbox1";
		
		
		for(i = 1;i<saveArray.length;i++){
			var type = saveArray[i].type;
			//console.log(type);
			
			if(type == "folder"){
				var name =  saveArray[i].name;
				var id =  parseInt(saveArray[i].id);
				var imagesString =  saveArray[i].images.split(",");
				var imagesF = new Array();
				for(var i2 = 0;i2<imagesString.length;i2++){
					imagesF.push(parseInt(imagesString[i2]));
				
				}
				
				
				if(imagesF == "NaN"){imagesF = new Array();}
				//console.log("array " + imagesF);
				
				
				var subfolderId =  parseInt(saveArray[i].subfolderId);
				var parent =  parseInt(saveArray[i].parentId);
				var parentLevel =  parseInt(saveArray[i].level);
				//console.log(id);
				if (id>maxId){maxId = id;}
				
				
				var folder = new Folder(name, parent, parentLevel);
				folder.id = id;
				folder.images = imagesF;
				folder.subfolderId = subfolderId;
				
				folders.push(folder);
			
			}
			if(type == "image"){
				var source = new Image();
				source.src=saveArray[i].source;
				
				var name = saveArray[i].name;
				var num2 = parseInt(saveArray[i].id);
				//console.log(num2);
				if (num2>maxNum){maxNum = num2;}
				images.push(new SpriteImage(source, name, num2));
			
			}
		}
		
		//console.log(maxId);
		
		for(var c = 1;c<maxId;c++){
		
			var hasIt = false;
			for(var c2 = 0;c2<folders.length;c2++){
				if(folders[c2].id == c){hasIt = true;selectedFolder = "dropbox" + c;}
			
			}
		
			if(!hasIt){
					var folder = new Folder("deleted", 0, 2);
					folder.id = c;
					folder.deleted = true;	
					folders.push(folder);
						
					//console.log("un " + c);
				}
			
		
		
		}
		
		
		folderId = maxId+1;
		num = maxNum+1;
		
		//console.log(images);
		buildFolders();
		calcPos();
		displayDrop(selectedFolder, false);
		buildFolders();
		buildData();
		buildDataPlain();
		colorFullFolders();
		
		loop();
		
		document.getElementById('load').style.display="inline";
		document.getElementById('loadFile').style.display="none";
		document.getElementById('closeLoad').style.display="none";
		
	};
	
	if(selectedFile.name.split(".")[1]=="txt"){
		r.readAsText(selectedFile);
	}
}

function switchToGrid(){

	if(!grid){

		grid = true;
		boxLimit = false;
		document.getElementById('standardTextBox1').value = "on"
	}else{
	
		grid = false;
		document.getElementById('standardTextBox1').value = "off"
	}
	
	calcPos();
	buildFolders();
	
}	

function changeGridX(){

	gridX = parseInt(document.getElementById('standardTextBox2').value);
	document.getElementById('standardTextBox2').value = "";
	document.getElementById('standardTextBox2').placeholder = gridX;
	grid = true;
	boxLimit = false;
	document.getElementById('standardTextBox1').value = "on"
	calcPos();
	buildFolders();
	
}

function changeGridY(){

	gridY = parseInt(document.getElementById('standardTextUBox3').value);
	document.getElementById('standardTextUBox3').value = "";
	document.getElementById('standardTextUBox3').placeholder = gridY;
	grid = true;
	boxLimit = false;
	document.getElementById('standardTextBox1').value = "on"
	calcPos();
	buildFolders();
	

}

function changeCellX(){

	cellX = parseInt(document.getElementById('standardTextBox4').value);
	cellY = cellX;
	document.getElementById('standardTextBox4').value = "";
	document.getElementById('standardTextBox4').placeholder = cellX;
	grid = true;
	boxLimit = false;
	document.getElementById('standardTextBox1').value = "on"
	calcPos();
	buildFolders();
	

}

function changeCellY(){

	cellY = parseInt(document.getElementById('standardTextUBox5').value);
	document.getElementById('standardTextUBox5').value = "";
	document.getElementById('standardTextUBox5').placeholder = cellY;
	grid = true;
	boxLimit = false;
	document.getElementById('standardTextBox1').value = "on"
	calcPos();
	buildFolders();
	

}

function changeSpriteScale(){
	
	grid = true;
	boxLimit = false;
	document.getElementById('standardTextBox1').value = "on"
	switch(spriteScale){
	
		case "scale none": spriteScale = "scale max"; break;
		case "scale max": spriteScale = "scale asp"; break;
		case "scale asp": spriteScale = "scale none"; break;
		
		
	
	}
	document.getElementById('standardTextBox6').innerHTML = spriteScale;
	calcPos();
	buildFolders();
	
}


function changeSpritePos(){

	grid = true;
	boxLimit = false;
	document.getElementById('standardTextBox1').value = "on"
	switch(spritePos){


		case "centered": spritePos = "top left"; break;
		case "top left": spritePos = "top right"; break;
		case "top right": spritePos = "bottom left"; break;
		case "bottom left": spritePos = "bottom right"; break;
		case "bottom right": spritePos = "centered"; break;
	}
	
	document.getElementById('standardTextBox7').innerHTML = spritePos;
	calcPos();
	buildFolders();
}

function switchBoxLimit(){
	//document.getElementById('warning').style.display = "none";
	if(!boxLimit){
		boxLimit = true;
		grid = false;
		document.getElementById('standardTextBox1').value = "off"
	}
	
	
	
	calcPos();
	buildFolders();
	loop();

}

function changeBoxWidth(){
	//document.getElementById('warning').style.display = "none";
	boxWidth = parseInt(document.getElementById('boxWidth').value);
	document.getElementById('boxWidth').value = "";
	document.getElementById('boxWidth').placeholder = boxWidth;
	boxLimit = true;
	grid = false;
	document.getElementById('standardTextBox1').value = "off"
	calcPos();
	buildFolders();
	loop();
}

function changeBoxHeight(){
	//document.getElementById('warning').style.display = "none";
	boxHeight = parseInt(document.getElementById('boxHeight').value);
	document.getElementById('boxHeight').value = "";
	document.getElementById('boxHeight').placeholder = boxHeight;
	boxLimit = true;
	grid = false;
	document.getElementById('standardTextBox1').value = "off"
	calcPos();
	loop();
	
}

function switchVertical(){

	//document.getElementById('warning').style.display = "none";
	if(vert){
			vert=false;
			document.getElementById('arrangeText').innerHTML="horizontal";
		}else{
			vert = true;
			document.getElementById('arrangeText').innerHTML="vertical";
		}

	boxLimit = false;
	grid = false;
	document.getElementById('standardTextBox1').value = "off"
		
	calcPos();
	
	loop();
	
}

function setFill(){
	//document.getElementById('warning').style.display = "none";
	if(toFill){toFill = false;}else{toFill=true;}
	fillColor = document.getElementById('fillColor').value;
	loop();
}

function changeFillColor(){
	//document.getElementById('warning').style.display = "none";
	fillColor = document.getElementById('fillColor').value;
	loop();
}

function goBack(){
	//document.getElementById('warning').style.display = "none";
	var tempNum = 0;
	var tempImage;
	for (var c = 0;c<images.length;c++){
		if(images[c].num>tempNum){tempNum=images[c].num;tempImage = images[c];}

	}
	images.splice(images.indexOf(tempImage),1);
	calcPos();
	buildList();
	loop();
}


function refreshExport(){
	if(boxLimit){
		document.getElementById('canvasBg').width = boxWidth;
		document.getElementById('canvasBg').height = boxHeight;
	}
	
	if(grid){
		document.getElementById('canvasBg').width = (gridX*(cellX+padding))+padding;
		document.getElementById('canvasBg').height = (gridY*(cellY+padding))+padding;
	}
	//document.getElementById('warning').style.display = "none";
	clearCanvas(ctxOut, "canvasOut");
	

	for(var c = 0;c<images.length;c++){
		//console.log(images[c]);
		if(!grid){drawSprite(images[c], ctxOut, false);}else{drawGridSprite(images[c], ctxOut, false);}
	}

	
	
	var img = canvasOut.toDataURL("image/png");
	document.getElementById('standardTextLinkButton9').href=img;
	//console.log(img);
	
	document.getElementById('imageView').innerHTML = "<img id=\"exportImage\" src="+img+"></img>";
	
	
	document.getElementById('canvasBg').width = bgSaveX;
	document.getElementById('canvasBg').height = bgSaveY;
}

function outImg(){
	//document.getElementById('warning').style.display = "none";
	refreshExport();
	
	if(document.getElementById('imageView').style.display=="none"){
		document.getElementById('imageView').style.display="block";
		document.getElementById('outputView').style.display="none";
		
	}else{
		document.getElementById('imageView').style.display="none";
		document.getElementById('outputView').style.display="block";
	
	}
	loop();
}

function showExport(){
	//document.getElementById('warning').style.display = "none";
	if(document.getElementById('exportOptions').style.display=="none"){
	document.getElementById('exportOptions').style.display ="block"
	}else{
	document.getElementById('exportOptions').style.display ="none";
	}

}


function onFileSelected(event) {
  
	if(window.FileReader) {   //do this
	} else {
   
		
		document.getElementById('warning').innerHTML=" This browser does not support the FileReader functionality</br> required to load files to the web page.</br> Browsers that do support it are Chrome and Firefox.</br><a href=\"http://caniuse.com/filereader\" target=\"_blank\">List of Supported Browsers</a>";
		document.getElementById('warning').style.display = "block";
		return;
   
	}
  
	var foldersLength=0;
	for(var c2 =0;c2<folders.length;c2++){
		if(!folders[c2].deleted){foldersLength++;}
	}
	//console.log(foldersLength);
	
	if(foldersLength==0){
	document.getElementById('warning').innerHTML=" You need to create at least<br/>one folder in order to add files. ";
	document.getElementById('warning').style.display = "block";
	return;
	}
  
  var selectedFile = event.target.files[0];
  var reader = new FileReader();
  
  reader.onload = function(event) {
	var name1 =document.getElementById('add').value.split('\\')[document.getElementById('add').value.split('\\').length-1];
	var name2 =name1;
	//console.log(name2);
	var imgSpriteTemp = new Image();
    imgSpriteTemp.src = event.target.result;
    pushImg(imgSpriteTemp, name2, true);
	
  };

  reader.readAsDataURL(selectedFile);
}

function selectSprite(ev){
	var left = document.getElementById('DivWithScroll').scrollLeft;
	var top = document.getElementById('DivWithScroll').scrollTop;
	
	var left2 = window.pageXOffset;
	var top2 = window.pageYOffset;
	
	
	
	//console.log(left2 + " " +top2);
	
	var x = ev.clientX -cX+left+left2;
    var y = ev.clientY - cY +top+top2;

	cX =  canvasBg.offsetLeft;
	cY =  canvasBg.offsetTop;
	
	//console.log(canvasBg.offsetLeft +" "+ canvasBg.offsetTop + " " + left + " " + top);
	
	//console.log(x + " " + y);
	highId = new Array();
	
	for(var c4 = 0;c4<images.length;c4++){
		
		document.getElementById('remove' + images[c4].num).style.display = "none";
		document.getElementById('histB' + images[c4].num).style.margin = "6px 6px 6px 6px";
		document.getElementById('histBData' + images[c4].num).style.margin = "6px 6px 6px 6px";
	}
	
	if(!grid){
	
		for(var c = 0;c<images.length;c++){
		
			if(images[c].x<x&&images[c].x+images[c].width>x){
			
				if(images[c].y<y&&images[c].y+images[c].height>y){
			
			
					for(var c2 = 0;c2<folders.length;c2++){
					
						for(var c3 = 0;c3<folders[c2].images.length;c3++){
							if(folders[c2].images[c3]==images[c].num){
							
								if(document.getElementById('dropbox' + folders[c2].id).style.display=="none"){
								displayDrop("dropbox" + folders[c2].id,false);
								}
							}
						
						}
					}
					
					
					
					highlightSprite(images[c].num);
			
				}
			
			}
		
		}
	}else{
	
		for(var c = 0;c<images.length;c++){
		
			if(images[c].x<x&&images[c].x+cellX>x){
			
				if(images[c].y<y&&images[c].y+cellY>y){
			
			
					for(var c2 = 0;c2<folders.length;c2++){
					
						for(var c3 = 0;c3<folders[c2].images.length;c3++){
							if(folders[c2].images[c3]==images[c].num){
							
								if(document.getElementById('dropbox' + folders[c2].id).style.display=="none"){
								displayDrop("dropbox" + folders[c2].id,false);
								}
							}
						
						}
					}
					
					
					
					highlightSprite(images[c].num);
			
				}
			
			}
		
		}
	
	
	}
	loop();
}

function pushImg(source, name, last){
	
	pushed++;
	document.getElementById('add').disabled = true;
	document.getElementById('warning').style.display = "none";
	
	
	for(var c3 = 0;c3<folders.length;c3++){
		if(selectedFolder.split("dropbox")[1]==folders[c3].id){
			//console.log(selectedFolder.split("dropbox")[1]);
			for(var c = 0;c<folders[c3].images.length;c++){
				//console.log(name);
				var oldName;
				for(var c4 = 0;c4<images.length;c4++){
				
					if(folders[c3].images[c] == images[c4].num){
					
						oldName = images[c4].name;
					}
				}
				
				if(name == oldName){
				document.getElementById('warning').innerHTML=" Some files omitted bc. they already exist in this folder.<br/> You can add them to a different folder. ";
				document.getElementById('warning').style.display = "block";
				document.getElementById('add').disabled = false;
				calcPos();
				return;
				}
			}
		}
	}
	images.push(new SpriteImage(source, name, num));
	
	
	for(var c2 = 0;c2<folders.length;c2++){
	
		if(folders[c2].id==selectedFolder.split("dropbox")[1]){
			folders[c2].images.push(num);
			
			//console.log("pushing" + num);
		}
	
	}
	
	
	if(pushed == toPush){
	calcPos();
	buildList();
	buildFolders();}
	num++;
	//console.log(images);
	loop();
	
	
	displayDrop(selectedFolder, true);
	ready = true;
}

function removeSprite(id, rebuild){
	
	for(var c = 0;c<images.length;c++){
		if(id == images[c].num){
		
		images.splice(c,1);
		
		}
	}
	for(var c2 = 0;c2<folders.length;c2++){
		for(var c3 = 0;c3<folders[c2].images.length;c3++){
			if(id == folders[c2].images[c3]){folders[c2].images.splice(c3,1);}
		}
	}
	if(rebuild){calcPos();}
	buildList();
	buildFolders();

}
function highlightSprite(id){

		for(var c = 0;c<images.length;c++){
		
			document.getElementById('remove' + images[c].num).style.display = "none";
			document.getElementById('histB' + images[c].num).style.margin = "6px 6px 6px 6px";
			document.getElementById('histBData' + images[c].num).style.margin = "6px 6px 6px 6px";
		}

		document.getElementById('remove' + id).style.display = "inline";
		document.getElementById('histB' + id).style.margin = "6px 6px 6px 13px";
		document.getElementById('histBData' + id).style.margin = "6px 6px 6px 13px";
		
		highId = new Array();
		highId.push(id);
		loop();
}

function buildList(){
	var textHTML = "";
	buildFolders();
	document.getElementById('add').disabled = false;
	loop();
}

function init(){

	if(window.FileReader) {   //do this
	} else {
   
		document.getElementById('warning').innerHTML=" This browser does not support the FileReader functionality</br> required to load files to the web page.</br> Browsers that do support it are Chrome and Firefox.</br><a href=\"http://caniuse.com/filereader\" target=\"_blank\">List of Supported Browsers</a>";
		document.getElementById('warning').style.display = "block";
		return;
   
	}

    folders.push(new Folder("animations", 0,2));
    folders.push(new Folder("images", 0,2));
	
	
	buildFolders();
	displayDrop(selectedFolder, true);
	document.getElementById('add').disabled = false;
	//window.setInterval(loop(),1000, false);
	loop();
}

function loop(){

	refreshExport();

	gameWidth = canvasBg.width;
	gameHeight = canvasBg.height;

	
	clearCanvas(ctxBg, "canvasBg");
	//drawBg();
	drawImages();
		
	
	
}

function checkWorking(){

	if(readers.length>0){
		document.getElementById('droplabel').innerHTML = "Working...";
	}else{
		document.getElementById('droplabel').innerHTML = "Drop files here...";
	}

}

function drawImages(){
	for(var c = 0;c<images.length;c++){
		//console.log("bla" + c);
		if(!grid){drawSprite(images[c], ctxBg, true);}else{drawGridSprite(images[c], ctxBg, true);}
		
	}
	
	
}



function drawBg(){
	var hor = gameWidth/imgSprite.width;
	var vert = gameHeight/imgSprite.height;
		for(var c1 = 0;c1<hor;c1++){
			for(var c2 = 0; c2<vert;c2++){
					drawBgCell(c1,c2);
			}
		}
}

function drawBgCell(x,y){
	
	var srcX = 0;
	var srcY = 0;
	var spriteWidth = imgSprite.width;
	var spriteHeight = imgSprite.height;
	
	var drawX = 0+(x*spriteWidth);
	var drawY = 0+(y*spriteHeight);
	
	ctxBg.drawImage(imgSprite,srcX,srcY,spriteWidth,spriteHeight,drawX,drawY,spriteWidth,spriteHeight);
	
}

function drawSprite(spriteImage, context, color){
	
	var image = spriteImage.source;
	
	var srcX = 0;
	var srcY = 0;
	var spriteWidth = image.width;
	var spriteHeight = image.height;
	
	var drawX = spriteImage.x;
	var drawY = spriteImage.y;
	
	context.drawImage(image,srcX,srcY,spriteWidth,spriteHeight,drawX,drawY,spriteWidth,spriteHeight);

	if(toFill){
			var borderWidth = padding;
						  
			context.fillStyle=fillColor;
			context.fillRect(drawX-borderWidth, drawY, borderWidth, spriteHeight+borderWidth);
						  
			context.fillRect(drawX-borderWidth, drawY-borderWidth, spriteWidth+borderWidth+borderWidth, borderWidth);
						  
			context.fillRect(drawX+spriteWidth, drawY, borderWidth, spriteHeight+borderWidth);
						  
			context.fillRect(drawX, drawY+spriteHeight, spriteWidth, borderWidth);
	}
	
			for(var c3 = 0;c3<highId.length;c3++){
				if(spriteImage.num == highId[c3]&&color){
					  //console.log("drawing");
					  
					  
					  if(padding>2){
						  var borderWidth = 1;
						  
						  ctxBg.fillStyle="rgba(200, 0, 0, 1.0)";
						  ctxBg.fillRect(spriteImage.x-borderWidth, spriteImage.y, borderWidth, spriteImage.height+borderWidth);
						  
						  ctxBg.fillRect(spriteImage.x-borderWidth, spriteImage.y-borderWidth, spriteImage.width+borderWidth+borderWidth, borderWidth);
						  
						  ctxBg.fillRect(spriteImage.x+spriteImage.width, spriteImage.y, borderWidth, spriteImage.height+borderWidth);
						  
						  ctxBg.fillRect(spriteImage.x, spriteImage.y+spriteImage.height, spriteImage.width, borderWidth);
					  }
					  ctxBg.fillStyle="rgba(200, 0, 0, 0.2)";
					  ctxBg.fillRect(spriteImage.x, spriteImage.y, spriteImage.width, spriteImage.height);
					  
				
				}
			}
			
			if(spriteImage.outOfBounds){
			
					  ctxBg.fillStyle="rgba(200, 0, 0, 0.8)";
					  ctxBg.fillRect(spriteImage.x, spriteImage.y, spriteImage.width, spriteImage.height);
			
			}
	
}

function drawGridSprite(spriteImage, context, color){


	
	var image = spriteImage.source;
	
	var srcX = 0;
	var srcY = 0;
	
	var drawX = spriteImage.x;
	var drawY = spriteImage.y;
	
	var spriteWidth = image.width;
	var spriteHeight = image.height;
	
	var drawWidth;
	var drawHeight;
	
	if(spriteWidth<=cellX){
				
				switch(spriteScale){
				
				case "scale none": drawWidth = spriteWidth;break;
				case "scale max": drawWidth = cellX; break;
				case "scale asp": if(spriteWidth>spriteHeight){drawWidth=cellX;drawHeight=spriteHeight*(cellX/spriteWidth);}else{drawHeight=cellY;drawWidth=spriteWidth*(cellY/spriteHeight);}; break;
				
				
				}
				
				switch(spritePos){
			
				case "centered": drawX = drawX+Math.floor((cellX-drawWidth)/2); break;
				case "top left": break;
				case "top right": drawX = drawX+(cellX-drawWidth); break;
				case "bottom left": break;
				case "bottom right": drawX = drawX+(cellX-drawWidth); break;
			
				}
				
				
	
	}else{
	
	if(spriteWidth>spriteHeight){drawWidth=cellX;drawHeight=spriteHeight*(cellX/spriteWidth);}else{drawHeight=cellY;drawWidth=spriteWidth*(cellY/spriteHeight);}
	
				switch(spritePos){
			
				case "centered": drawX = drawX+Math.floor((cellX-drawWidth)/2); break;
				case "top left": break;
				case "top right": drawX = drawX+(cellX-drawWidth); break;
				case "bottom left": break;
				case "bottom right": drawX = drawX+(cellX-drawWidth); break;
			
				}
	
	}
	if(spriteHeight<=cellY){
			
			switch(spriteScale){
			
			case "scale none": drawHeight = spriteHeight;break;
			case "scale max": drawHeight = cellY; break;
			case "scale asp": if(spriteWidth>spriteHeight){drawWidth=cellX;drawHeight=spriteHeight*(cellX/spriteWidth);}else{drawHeight=cellY;drawWidth=spriteWidth*(cellY/spriteHeight);}; break;
			
			}
			
			switch(spritePos){
	
			case "centered": drawY = drawY+Math.floor((cellY-drawHeight)/2); break;
			case "top left":  break;
			case "top right":  break;
			case "bottom left": drawY = drawY+(cellY-drawHeight); break;
			case "bottom right": drawY = drawY+(cellY-drawHeight); break;
		
			}
			
			
		
	}else{
	
	if(spriteWidth>spriteHeight){drawWidth=cellX;drawHeight=spriteHeight*(cellX/spriteWidth);}else{drawHeight=cellY;drawWidth=spriteWidth*(cellY/spriteHeight);}
	
			switch(spritePos){
	
			case "centered": drawY = drawY+Math.floor((cellY-drawHeight)/2); break;
			case "top left":  break;
			case "top right":  break;
			case "bottom left": drawY = drawY+(cellY-drawHeight); break;
			case "bottom right": drawY = drawY+(cellY-drawHeight); break;
		
			}
	
	}
	
	context.drawImage(image,srcX,srcY,spriteWidth,spriteHeight,drawX,drawY,drawWidth,drawHeight);

	if(toFill){
			var borderWidth = padding;
						  
			context.fillStyle=fillColor;
			context.fillRect(spriteImage.x-borderWidth, spriteImage.y, borderWidth, cellY+borderWidth);
						  
			context.fillRect(spriteImage.x-borderWidth, spriteImage.y-borderWidth, cellX+borderWidth+borderWidth, borderWidth);
						  
			context.fillRect(spriteImage.x+cellX, spriteImage.y, borderWidth, cellY+borderWidth);
						  
			context.fillRect(spriteImage.x, spriteImage.y+cellY, cellX, borderWidth);
	}
	
	
			for(var c3 = 0;c3<highId.length;c3++){
				if(spriteImage.num == highId[c3]&&color){
					  //console.log("drawing");
					  
					  
					  if(padding>2){
						  var borderWidth = 1;
						  
						  ctxBg.fillStyle="rgba(200, 0, 0, 1.0)";
						  ctxBg.fillRect(spriteImage.x-borderWidth, spriteImage.y, borderWidth, cellY+borderWidth);
						  
						  ctxBg.fillRect(spriteImage.x-borderWidth, spriteImage.y-borderWidth, cellX+borderWidth+borderWidth, borderWidth);
						  
						  ctxBg.fillRect(spriteImage.x+cellX, spriteImage.y, borderWidth, cellY+borderWidth);
						  
						  ctxBg.fillRect(spriteImage.x, spriteImage.y+cellY, cellX, borderWidth);
					  }
					  ctxBg.fillStyle="rgba(200, 0, 0, 0.2)";
					  ctxBg.fillRect(spriteImage.x, spriteImage.y, cellX, cellY);
					  
				
				}
			}
			
			if(spriteImage.outOfBounds){
			
					  ctxBg.fillStyle="rgba(200, 0, 0, 0.8)";
					  ctxBg.fillRect(spriteImage.x, spriteImage.y, cellX, cellY);
			
			}

}

function clearCanvas(context, canvas){

	var gW = document.getElementById(canvas).width;
	var gH = document.getElementById(canvas).height;


	context.clearRect(0,0,gW,gH);
}

function SpriteImage (source, name, num){

	

	this.name = name;
	this.source = source;
	this.height = source.height;
	//console.log(this.height);
	this.width = source.width;
	//console.log(this.width);
	this.x = 0;
	this.y = 0;
	this.num = num;
	imagesErrorTemp.push(this.num);
	this.xSave = this.x;
	this.ySave = this.y;
	this.outOfBounds = false;
	this.cellX = 0;
	this.cellY = 0;
}

//calculate position

function changePadding(){

	padding = parseInt(document.getElementById('padding').value);
	document.getElementById('padding').placeholder=document.getElementById('padding').value +"";
	document.getElementById('padding').value ="";
	for(var c = 0;c<images.length;c++){
		images[c].x = 0;
		images[c].y = 0;
		images[c].xSave = 0;
		images[c].ySave = 0;
	
	}
	if(padding<0){
	padding = 0;
	document.getElementById('padding').placeholder=0;
	document.getElementById('padding').value ="";
	}
	
	calcPos();
	loop();
	buildData();
	buildDataPlain();
	
}


function calcPos(){
	
	for(var c2 =0;c2<folders.length;c2++){
		
		document.getElementById('droplabel'+folders[c2].id).innerHTML = "Please wait..."
	}
	
	if(grid){
	
		calcGrid();
	
	}else{
	
		if(!boxLimit){
			if(vert){calcPosVert();}else{calcPosHorizontal();}
			}else{
			calcPosBoxLimit();
		}
	}
	buildData();
	buildFolders();
	buildDataPlain();
	
}

function calcPosHorizontal(){


	

	//find the largest image
	var tempSprites = new Array();
	var tempS = new Array();
	
	for(var c4 = 0;c4<images.length;c4++){
		images[c4].x = 0;
		images[c4].y = 0;
	    tempS.push(images[c4]);
	}
	
	for(var c2 = 0; c2<images.length; c2++){
	
		var height = 0;
		var highestSpr;
		var pos = 0;
		for(var c = 0; c<tempS.length; c++){
			if(tempS[c].height>=height){
				height = tempS[c].height;
				highestSpr = tempS[c];
				pos = c;
			}
		
		}
		if(highestSpr!=undefined){
			highestSpr.x = highestSpr.xSave + padding;
			highestSpr.y = highestSpr.ySave + padding;
			tempSprites.push(highestSpr);
			tempS.splice(pos,1);
		}
		
	}
	
	images = new Array();
	
	var widthT = 0;
	var heightT = 0;
	
	
	
	for(var c6 = 0;c6<tempSprites.length;c6++){
		
		widthT = tempSprites[0].width;
		heightT = tempSprites[0].height;
		
				for(var c7 = 0;c7<images.length;c7++){
					if(images[c7].width+images[c7].x>widthT){
						widthT = (images[c7].width+images[c7].x+padding);
					}
					if(images[c7].height+images[c7].y>heightT){
						heightT = (images[c7].height+images[c7].y+padding);
					}	
				}
		
		
		
		if(c6>0){
			//compare this with all the prev
			//if it fits place it there
			
			var thisW = tempSprites[c6].width+padding;
			var thisH = tempSprites[c6].height+padding;
			var tempX = 0;
			var tempY = 0;
			
			
				
				
			
				//moveVert
				//moveHoriz
				
				var placeX = widthT, placeY = heightT;
				
				
				//console.log("dimensions" + widthT + " " + heightT);
				
				var placed = false;
				
				
				for(tempX;tempX+thisW<=widthT;tempX++){
						//console.log(tempX);
					
						
						for(var tempY2 = tempY;tempY2+thisH<=heightT;tempY2++){
							
							//check collision 
							//if collided move down
							var collided = false;
							
							for(var c8 = 0;c8<tempSprites.length;c8++){
								if(c8==c6){continue;}
								var thisW2 = tempSprites[c8].width+padding;
								var thisH2 = tempSprites[c8].height+padding;
								//console.log(padding);
								var tempX2 = tempSprites[c8].x-padding;
								var tempY22 = tempSprites[c8].y-padding;
								if(!checkCol(tempX,tempY2,thisW,thisH,tempX2,tempY22,thisW2,thisH2)){
								
								if(checkInset(tempX,tempY2,thisW,thisH,tempX2,tempY22,thisW2,thisH2)){tempY2=tempY22+thisH2;}
								
								
								
								}else{collided = true;
								
								
								}
							}
							
							if(!collided){
							
							if(placeX+placeY>=tempX+tempY2){placeX = tempX;placeY = tempY2;}
							placed = true;
							}
							
						}
				    
				}
				
				if(!placed){
				tempSprites[c6].x = widthT;
				tempSprites[c6].y = 0+padding;
				tempSprites[c6].outOfBounds = false;
				images.push(tempSprites[c6]);
	
				}else{
				
				tempSprites[c6].x = placeX+padding;
				tempSprites[c6].y = placeY+padding;
				tempSprites[c6].outOfBounds = false;
				images.push(tempSprites[c6]);
				}
			
				
		}else{
			tempSprites[c6].outOfBounds = false;
			images.push(tempSprites[c6]);
		}
		
		
		
	}
	
	widthT = 0;
	heightT = 0;
		
	for(var c9 = 0;c9<images.length;c9++){
		if(images[c9].width+padding+images[c9].x>widthT){
			widthT = (images[c9].width+images[c9].x+padding);
		}
		if(images[c9].height+padding+images[c9].y>heightT){
			heightT = (images[c9].height+images[c9].y+padding);
		}	
	}
	
	if(widthT!=gameWidth){
		document.getElementById('canvasBg').width = widthT;
		bgSaveX = widthT;
		
	}
	if(heightT!=gameHeight){
		document.getElementById('canvasBg').height = heightT;
		bgSaveY = heightT;
		
	}
	
	if(widthT==0){
		document.getElementById('canvasBg').width = 552;
		
		
	}
	if(heightT==0){
		document.getElementById('canvasBg').height = 400;
		
		
	}
	
	if(widthT!=document.getElementById('canvasOut').width){
		
		document.getElementById('canvasOut').width = widthT;
		
		//console.log(document.getElementById('canvasOut').width);
	}
	if(heightT!=document.getElementById('canvasOut').height){
		
		document.getElementById('canvasOut').height = heightT;
		
		//console.log(document.getElementById('canvasOut').height);
	
	}
	
	
	refreshExport();
	if(pushed >=toPush){calcPosAgain();}
}

function calcPosVert(){



	//find the largest image
	var tempSprites = new Array();
	var tempS = new Array();
	
	for(var c4 = 0;c4<images.length;c4++){
		images[c4].x = 0;
		images[c4].y = 0;
	    tempS.push(images[c4]);
	}
	
	for(var c2 = 0; c2<images.length; c2++){
	
		var height = 0;
		var highestSpr;
		var pos = 0;
		for(var c = 0; c<tempS.length; c++){
			if(tempS[c].height>=height){
				height = tempS[c].width;
				highestSpr = tempS[c];
				pos = c;
			}
		
		}
		if(highestSpr!=undefined){
			highestSpr.x = highestSpr.xSave + padding;
			highestSpr.y = highestSpr.ySave + padding;
			tempSprites.push(highestSpr);
			tempS.splice(pos,1);
		}
		
	}
	
	images = new Array();
	
	var widthT = 0;
	var heightT = 0;
	
	
	
	for(var c6 = 0;c6<tempSprites.length;c6++){
		
		widthT = tempSprites[0].width;
		heightT = tempSprites[0].height;
		
				for(var c7 = 0;c7<images.length;c7++){
					if(images[c7].width+images[c7].x>widthT){
						widthT = (images[c7].width+images[c7].x+padding);
					}
					if(images[c7].height+images[c7].y>heightT){
						heightT = (images[c7].height+images[c7].y+padding);
					}	
				}
		
		
		
		if(c6>0){
			//compare this with all the prev
			//if it fits place it there
			
			var thisW = tempSprites[c6].width+padding;
			var thisH = tempSprites[c6].height+padding;
			var tempX = 0;
			var tempY = 0;
			
			
				
				
			
				//moveVert
				//moveHoriz
				
				var placeX = widthT, placeY = heightT;
				
				
				//console.log("dimensions" + widthT + " " + heightT);
				
				var placed = false;
				
				
				
				
					for(tempX;tempX+thisW<=widthT;tempX++){
						//console.log(tempX);
					
						
						for(var tempY2 = tempY;tempY2+thisH<=heightT;tempY2++){
							
							//check collision 
							//if collided move down
							var collided = false;
							
							for(var c8 = 0;c8<tempSprites.length;c8++){
								if(c8==c6){continue;}
								var thisW2 = tempSprites[c8].width+padding;
								var thisH2 = tempSprites[c8].height+padding;
								//console.log(padding);
								var tempX2 = tempSprites[c8].x-padding;
								var tempY22 = tempSprites[c8].y-padding;
								if(!checkCol(tempX,tempY2,thisW,thisH,tempX2,tempY22,thisW2,thisH2)){
								
								//if(checkInset(tempX,tempY2,thisW,thisH,tempX2,tempY22,thisW2,thisH2)){tempX=tempX2+thisW2;}
								
								
								
								}else{collided = true;
								
								
								}
							}
							
							if(!collided){
							
							if(placeX+placeY>=tempX+tempY2){placeX = tempX;placeY = tempY2;}
							placed = true;
							}
							
						}
				    
				}
				
				if(!placed){
				tempSprites[c6].x = 0+padding;
				tempSprites[c6].y = heightT;
				tempSprites[c6].outOfBounds = false;
				images.push(tempSprites[c6]);
	
				}else{
				
				tempSprites[c6].x = placeX+padding;
				tempSprites[c6].y = placeY+padding;
				tempSprites[c6].outOfBounds = false;
				images.push(tempSprites[c6]);
				}
			
				
		}else{
			tempSprites[c6].outOfBounds = false;
			images.push(tempSprites[c6]);
		}
		
		
		
	}
	
	widthT = 0;
	heightT = 0;
		
	for(var c9 = 0;c9<images.length;c9++){
		if(images[c9].width+padding+images[c9].x>widthT){
			widthT = (images[c9].width+images[c9].x+padding);
		}
		if(images[c9].height+padding+images[c9].y>heightT){
			heightT = (images[c9].height+images[c9].y+padding);
		}	
	}
	
	if(widthT!=gameWidth){
		document.getElementById('canvasBg').width = widthT;
		bgSaveX = widthT;
		
		
	}
	if(heightT!=gameHeight){
		document.getElementById('canvasBg').height = heightT;
		bgSaveY = heightT;
		
	}
	
	if(widthT==0){
		document.getElementById('canvasBg').width = 552;
		
		
		
	}
	if(heightT==0){
		document.getElementById('canvasBg').height = 400;
		
		
		
	}
	
	if(widthT!=document.getElementById('canvasOut').width){
		
		document.getElementById('canvasOut').width = widthT;
		
		//console.log(document.getElementById('canvasOut').width);
	}
	if(heightT!=document.getElementById('canvasOut').height){
		
		document.getElementById('canvasOut').height = heightT;
		
		//console.log(document.getElementById('canvasOut').height);
	
	}
	
	
	refreshExport();
	if(pushed >=toPush){calcPosAgain();}
}

function calcPosBoxLimit(){


	

	//find the largest image
	var tempSprites = new Array();
	var tempS = new Array();
	
	for(var c4 = 0;c4<images.length;c4++){
		images[c4].x = 0;
		images[c4].y = 0;
	    tempS.push(images[c4]);
	}
	
	for(var c2 = 0; c2<images.length; c2++){
	
		var height = 0;
		var highestSpr;
		var pos = 0;
		for(var c = 0; c<tempS.length; c++){
			if(tempS[c].height>=height){
				height = tempS[c].height;
				highestSpr = tempS[c];
				pos = c;
			}
		
		}
		if(highestSpr!=undefined){
			highestSpr.x = highestSpr.xSave + padding;
			highestSpr.y = highestSpr.ySave + padding;
			tempSprites.push(highestSpr);
			tempS.splice(pos,1);
		}
		
	}
	
	images = new Array();
	
	var widthT = 0;
	var heightT = 0;
	
	
	
	for(var c6 = 0;c6<tempSprites.length;c6++){
		
		widthT = tempSprites[0].width;
		heightT = tempSprites[0].height;
		
				for(var c7 = 0;c7<images.length;c7++){
					if(images[c7].width+images[c7].x>widthT){
						widthT = (images[c7].width+images[c7].x+padding);
					}
					if(images[c7].height+images[c7].y>heightT){
						heightT = (images[c7].height+images[c7].y+padding);
					}	
				}
		
		
		
		if(c6>0){
			//compare this with all the prev
			//if it fits place it there
			
			var thisW = tempSprites[c6].width+padding+padding;
			var thisH = tempSprites[c6].height+padding+padding;
			var tempX = 0;
			var tempY = 0;
			
			
				
				
			
				//moveVert
				//moveHoriz
				
				var placeX = widthT, placeY = heightT;
				
				
				//console.log("dimensions" + widthT + " " + heightT);
				
				var placed = false;
				
				
				for(tempX;tempX+thisW<=widthT;tempX++){
						//console.log(tempX);
					
						
						for(var tempY2 = tempY;tempY2+thisH<=heightT;tempY2++){
							
							//check collision 
							//if collided move down
							var collided = false;
							
							for(var c8 = 0;c8<tempSprites.length;c8++){
								if(c8==c6){continue;}
								var thisW2 = tempSprites[c8].width+padding+padding;
								var thisH2 = tempSprites[c8].height+padding+padding;
								//console.log(padding);
								var tempX2 = tempSprites[c8].x-padding;
								var tempY22 = tempSprites[c8].y-padding;
								if(!checkCol(tempX,tempY2,thisW,thisH,tempX2,tempY22,thisW2,thisH2)){
								
								if(checkInset(tempX,tempY2,thisW,thisH,tempX2,tempY22,thisW2,thisH2)){tempY2=tempY22+thisH2;}
								
								
								
								}else{collided = true;
								
								
								}
							}
							
							if(!collided){
							
							if(placeX+placeY>=tempX+tempY2){placeX = tempX;placeY = tempY2;}
							placed = true;
							}
							
						}
				    
				}
				
				if(!placed){
				
					if(widthT<boxWidth-tempSprites[c6].width+padding){
				
						tempSprites[c6].x = widthT;
						tempSprites[c6].y = 0+padding;
						tempSprites[c6].outOfBounds = false;
						images.push(tempSprites[c6]);
						
						
					}else{
					
						if(heightT<boxHeight-tempSprites[c6].height+padding){
							tempSprites[c6].x = 0+padding;
							tempSprites[c6].y = heightT;
							tempSprites[c6].outOfBounds = false;
							images.push(tempSprites[c6]);
						}else{
							tempSprites[c6].x = 0+padding;
							tempSprites[c6].y = heightT;
							tempSprites[c6].outOfBounds = false;
							images.push(tempSprites[c6]);
							
							
						
						}
					
					}	
	
				}else{
				
				tempSprites[c6].x = placeX+padding;
				tempSprites[c6].y = placeY+padding;
				images.push(tempSprites[c6]);
				}
			
				
		}else{
		tempSprites[c6].outOfBounds = false;
		images.push(tempSprites[c6]);
		}
		
		
		
	}
	
	
	
	widthT = 0;
	heightT = 0;
		
	var toosmall =false;		
		
	for(var c9 = 0;c9<images.length;c9++){
	
		if(images[c9].y+images[c9].height+padding>boxHeight||images[c9].x+images[c9].width+padding>boxWidth){
			images[c9].outOfBounds=true;
			toosmall = true;
		
		}else{
			images[c9].outOfBounds=false;
		}
	
		if(images[c9].width+padding+images[c9].x>widthT){
			widthT = (images[c9].width+images[c9].x+padding);
		}
		if(images[c9].height+padding+images[c9].y>heightT){
			heightT = (images[c9].height+images[c9].y+padding);
		}	
	}
	
	if(toosmall){
	
		document.getElementById('warning').innerHTML="The drawing area is too small. <br/>Sprites placed outside of it have been marked in red.";
		document.getElementById('warning').style.display = "block";
	
	}else{
	
		document.getElementById('warning').style.display = "none";
	}
	
	if(widthT!=gameWidth){
		document.getElementById('canvasBg').width = widthT;
		bgSaveX = widthT;
		
	}
	if(heightT!=gameHeight){
		document.getElementById('canvasBg').height = heightT;
		bgSaveY = heightT;
		
	}
	
	if(widthT==0){
		document.getElementById('canvasBg').width = 552;
		
		
	}
	if(heightT==0){
		document.getElementById('canvasBg').height = 400;
		
		
	}
	
	
		document.getElementById('canvasOut').width = boxWidth;
		
		document.getElementById('canvasOut').height = boxHeight;
		
		
	
	
	refreshExport();
	if(pushed >=toPush){calcPosAgain();}
}

function calcGrid(){

	for(var c = 0;c<images.length;c++){
		images[c].x = 0;
		images[c].y = 0;
		images[c].outOfBounds = false;
	
	}

	var gridXPlace = 0;
	var gridYPlace = 0;

	for(var c2 = 0;c2<images.length;c2++){
	
		if(gridXPlace<gridX){
			images[c2].x = (gridXPlace*cellX)+(gridXPlace*padding)+padding;
			images[c2].y = (gridYPlace*cellY)+(gridYPlace*padding)+padding;
			images[c2].cellX = gridXPlace;
			images[c2].cellY = gridYPlace;
			//console.log(images[c2].x +" "+ images[c2].y);
			gridXPlace= gridXPlace+1;
		}else{
			gridXPlace = 0;
			gridYPlace = gridYPlace+1;
			images[c2].x = (gridXPlace*cellX)+(gridXPlace*padding)+padding;
			images[c2].y = (gridYPlace*cellY)+(gridYPlace*padding)+padding;
			images[c2].cellX = gridXPlace;
			images[c2].cellY = gridYPlace;
			gridXPlace= gridXPlace+1;
		}
	
	}
	
	loop();
	
	//stuff
	
	widthT = 0;
	heightT = 0;
		
	var toosmall =false;		
		
	for(var c9 = 0;c9<images.length;c9++){
	
		if(images[c9].cellX>=gridX||images[c9].cellY>=gridY){
			images[c9].outOfBounds=true;
			toosmall = true;
		
		}else{
			images[c9].outOfBounds=false;
		}
	
		if(images[c9].width+padding+images[c9].x>widthT){
			widthT = (gridX*(cellX+padding))+padding;
		}
		if(images[c9].height+padding+images[c9].y>heightT){
			heightT = images[c9].y+padding+padding+cellY;
		}	
	}
	
	if(toosmall){
	
		document.getElementById('warning').innerHTML="The drawing area is too small. <br/>Sprites placed outside of it have been marked in red.";
		document.getElementById('warning').style.display = "block";
	
	}else{
	
		document.getElementById('warning').style.display = "none";
	}
	
	if(widthT!=gameWidth){
		document.getElementById('canvasBg').width = widthT;
		bgSaveX = widthT;
		
	}
	if(heightT!=gameHeight){
		document.getElementById('canvasBg').height = heightT;
		bgSaveY = heightT;
		
	}
	
	if(widthT==0){
		document.getElementById('canvasBg').width = 552;
		
		
	}
	if(heightT==0){
		document.getElementById('canvasBg').height = 400;
		
		
	}
	
	
		document.getElementById('canvasOut').width = (gridX*(cellX+padding))+padding;
		
		document.getElementById('canvasOut').height = (gridY*(cellY+padding))+padding;
		
	if(pushed >=toPush){calcGridAgain();}	
	refreshExport();	
	loop();
	
	
}


function calcGridAgain(){

var haveError = false;
var numZeroes = 0;

	for(var c = 0;c<images.length;c++){
		
		var thisW = cellX+padding;
		var thisH = cellY+padding;
		var tempX = images[c].x-padding;
		var tempY = images[c].y-padding;
		
		
		if(images[c].width==0||images[c].height==0){haveError = true;}
		if(tempX == 0&&tempY==0){numZeroes++;}
		if(numZeroes>1){haveError=true;}

		for(var c2 = 0;c2<images.length;c2++){
			if(c == c2){continue;}
			
			
			var thisW2 = cellX+padding;
			var thisH2 = cellY+padding;
			var tempX2 = images[c2].x-padding;
			var tempY2 = images[c2].y-padding;
			//console.log(tempX+" "+tempY+" "+thisW+" "+thisH+" "+tempX2+" "+tempY2+" "+thisW2+" "+thisH2);						
			//console.log(checkCol(tempX,tempY,thisW,thisH,tempX2,tempY2,thisW2,thisH2));
			if(checkCol(tempX,tempY,thisW,thisH,tempX2,tempY2,thisW2,thisH2)){haveError = true;}
									
		}

	}
	
	if(haveError){console.log("error");
	
		for(var c3 = 0;c3<imagesErrorTemp.length;c3++){
			removeSprite(imagesErrorTemp[c3], false);
		
		}
		
		document.getElementById('warning').innerHTML="Something went wrong. <br/> Please try that action again.";
		document.getElementById('warning').style.display = "block";
		calcPos();
		buildList();
	}
	
	for(var c3 =0;c3<folders.length;c3++){
		
		document.getElementById('droplabel'+folders[c3].id).innerHTML = "Drop files here..."
	}
	
}


function calcPosAgain(){

var haveError = false;
var numZeroes = 0;

	for(var c = 0;c<images.length;c++){
		
		var thisW = images[c].width+padding;
		var thisH = images[c].height+padding;
		var tempX = images[c].x-padding;
		var tempY = images[c].y-padding;
		
		
		if(images[c].width==0||images[c].height==0){haveError = true;}
		if(tempX == 0&&tempY==0){numZeroes++;}
		if(numZeroes>1){haveError=true;}

		for(var c2 = 0;c2<images.length;c2++){
			if(c == c2){continue;}
			
			
			var thisW2 = images[c2].width+padding;
			var thisH2 = images[c2].height+padding;
			var tempX2 = images[c2].x-padding;
			var tempY2 = images[c2].y-padding;
			//console.log(tempX+" "+tempY+" "+thisW+" "+thisH+" "+tempX2+" "+tempY2+" "+thisW2+" "+thisH2);						
			//console.log(checkCol(tempX,tempY,thisW,thisH,tempX2,tempY2,thisW2,thisH2));
			if(checkCol(tempX,tempY,thisW,thisH,tempX2,tempY2,thisW2,thisH2)){haveError = true;}
									
		}

	}
	
	if(haveError){console.log("error");
	
		for(var c3 = 0;c3<imagesErrorTemp.length;c3++){
			removeSprite(imagesErrorTemp[c3], false);
		
		}
		
		document.getElementById('warning').innerHTML="Something went wrong. <br/> Please try that action again.";
		document.getElementById('warning').style.display = "block";
		calcPos();
		buildList();
	}
	
	for(var c3 =0;c3<folders.length;c3++){
		
		document.getElementById('droplabel'+folders[c3].id).innerHTML = "Drop files here..."
	}
	
}

function hideMessage(id){
	document.getElementById(id).style.display = "none";

}

function checkCol(x,y,width,height,x2,y2,width2,height2){
	
	//console.log(height + " " + height2);
	
	var absX = Math.abs((x+(width/2))-(x2+(width2/2)));
	var absY = Math.abs((y+(height/2))-(y2+(height2/2)));
	
	rAx = width/2;
	rAy = height/2;
	
	rBx = width2/2;
	rBy = height2/2;
	
	if(absX<rAx+rBx&&absY<rAy+rBy){return(true);}else{return(false);}

}

function checkInset(x,y,width,height,x2,y2,width2,height2){
	
	//console.log(height + " " + height2);
	
	
	if(x>x2&&x<x2+width2||x+width>x2&&x+width<x2+width2){
		if(y>y2&&y+height<y2+height2){
				return(true);
			}else{
				return(false);}
	}

}