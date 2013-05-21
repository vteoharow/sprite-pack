//Created by V Teoharov. 5/21/2013 
//https://github.com/vteoharow
var dataText;
var folderPrefix = "\"";
var folderSuffix = "\" : {";
var folderEnding ="}";

var imagePrefix = "\"";
var imageSuffix = "\" : {";
var imageEnding ="}";

var innerDelim = ",";
var endingBracket="}";
var startingBracket="{";



switchInteractive();

function switchInteractive(){

	if(document.getElementById('dataMain').style.display == "block"){
		document.getElementById('dataMain').style.display = "none";
		document.getElementById('dataPlain').style.display = "block";
		document.getElementById('interactive').innerHTML=" Interactive ";
	}else{
		document.getElementById('dataMain').style.display = "block";
		document.getElementById('dataPlain').style.display = "none";
		document.getElementById('interactive').innerHTML=" Plain Text ";
	}
	
	if(document.getElementById('outputView').style.display=="none"){
		document.getElementById('imageView').style.display="none";
		document.getElementById('outputView').style.display="block";
		
	}

}

function buildData(){
	
	document.getElementById('dataMain').innerHTML="<div id=\"data0\"></div>";
	
	var tempImages = new Array();
	var tempImagesTwo = new Array();
	var tempImagesThree = new Array();
	//console.log(images);
	for(var c4 = 0;c4<images.length;c4++){
		tempImagesTwo.push(images[c4]);
		
	}
	
	for(c6 = 0;c6<images.length;c6++){
		var rightMost = 0;
		var rightImage;
		var rightPos = 0;
			for(var c5 = 0;c5<tempImagesTwo.length;c5++){
				if(tempImagesTwo[c5].x+tempImagesTwo[c5].width>=rightMost){
					rightMost = tempImagesTwo[c5].x+tempImagesTwo[c5].width;
					rightImage = tempImagesTwo[c5];
					rightPos = c5;
				}
			
			}
		
		tempImagesThree.push(rightImage);
		//console.log(tempImagesThree);
		tempImagesTwo.splice(rightPos,1);
	}
	
	for(var c7 = tempImagesThree.length-1;c7>=0;c7--){
	
		tempImages.push(tempImagesThree[c7]);
	
	}
	
	//console.log(tempImages);
	
	
	var dataParentId = "data" + 0;
	document.getElementById(dataParentId).innerHTML="";
	for(var c = 0; c<folders.length;c++){
	
		if(folders[c].deleted==true){continue;}
	
		var name = folders[c].name;
		var level = folders[c].level;
		var id = folders[c].id;
		dataParentId = "data" + folders[c].parentId;
		//console.log(dataParentId);
		//console.log("id = " + id)
		
		var inSet="";
		for(var l = 1;l<level;l++){
		
			inSet = inSet +"   "
		}
		
		
		var delim = "";		
		var hasMoreFolders1 = false;
		for(var has1 = 0;has1<folders.length;has1++){
			if(has1 == c){continue;}
			if(folders[has1].parentId == folders[c].parentId&&!folders[has1].deleted){
				if(folders[has1].id<id){
				folders[has1].hasMoreFolders = true;
				delim = ",";
				}		
			}
				
		}
		
		document.getElementById(dataParentId).innerHTML="<div id=\"data"+id+"\"></div>"+inSet+folderEnding+delim+document.getElementById(dataParentId).innerHTML;

		
		//console.log(folders[c].images.length);
		var imageHTML = "<div id=\"dataImagesFolder"+id+"\">";
		
		var imagesCount  = 0;
		
		
		for(var c2 = 0;c2<tempImages.length;c2++){
		
		
			for(var c3 = 0;c3<folders[c].images.length;c3++){
		
			
		
		
			
			
			
				//console.log(folders[c].images[c3] + " " +images[c2].num);
				if(folders[c].images[c3]==tempImages[c2].num){
				imageHTML+="<div>"+inSet+"   "+imagePrefix+"<textarea id=\"histBData"+tempImages[c2].num+"\" readonly=\"true\" onfocus=\'highlightSprite(\""+tempImages[c2].num+"\")\' rows = \"1\" cols =\"" + tempImages[c2].name.length +"\">" + tempImages[c2].name+ "</textarea><textarea id=\"remove"+tempImages[c2].name+"\" readonly=\"true\" onfocus=\'\' rows = \"1\" cols =\"" + "del".length +"\">DEL</textarea>"+imageSuffix;
				
				if(!grid){
					imageHTML = imageHTML+" \"x\" : \""+tempImages[c2].x+"\" , ";
					imageHTML = imageHTML+"\"y\" : \""+tempImages[c2].y+"\" , ";
					imageHTML = imageHTML+"\"height\" : \""+tempImages[c2].height+"\" , ";
					imageHTML = imageHTML+"\"width\" : \""+tempImages[c2].width+"\"";
				}else{
					imageHTML = imageHTML+" \"x\" : \""+tempImages[c2].x+"\" , ";
					imageHTML = imageHTML+"\"y\" : \""+tempImages[c2].y+"\" , ";
					imageHTML = imageHTML+"\"height\" : \""+cellX+"\" , ";
					imageHTML = imageHTML+"\"width\" : \""+cellY+"\"";
				
				}
				imageHTML = imageHTML+imageEnding;
				imagesCount++;
				var hasMoreFolders = false;
				for(var has = 0;has<folders.length;has++){
					if(folders[has].parentId == id&&!folders[has].deleted){
						hasMoreFolders = true;
					}
				
				}
				
				if(imagesCount<folders[c].images.length||hasMoreFolders){
					imageHTML = imageHTML+","
				}
				
				imageHTML = imageHTML+"</div>";
				}
			}
			
			
			
		}
		imageHTML+="</div>"
		document.getElementById(dataParentId).innerHTML=imageHTML+document.getElementById(dataParentId).innerHTML;
		
		
		document.getElementById(dataParentId).innerHTML=inSet+folderPrefix+"<textarea onchange=\"renameFolder("+id+",true)\" id=\"dataFolder"+id+"\" rows=\"1\" onclick=\"displayDrop(\'"+"dropbox"+id+"\','false')\" cols=\""+name.length+"\">"+name+"</textarea>"+folderSuffix+document.getElementById(dataParentId).innerHTML;
		//console.log(level);
		
		for(var c1 = 0;c1<level;c1++){
		
		//document.getElementById(dataParentId).innerHTML="   "+document.getElementById(dataParentId).innerHTML;
		
		}
		
		document.getElementById(dataParentId).innerHTML="<div>"+document.getElementById(dataParentId).innerHTML;
		
		
		
		
			
		
	
	}
	
	document.getElementById('dataMain').innerHTML=startingBracket+document.getElementById('dataMain').innerHTML;
	
	document.getElementById('dataMain').innerHTML=document.getElementById('dataMain').innerHTML+endingBracket;
	
	colorDataFolders();
	displayDrop(selectedFolder, true);

}

function buildDataPlain(){


	
	document.getElementById('dataPlain').innerHTML="<div id=\"plain0\"></div>";

	var tempImages = new Array();
	var tempImagesTwo = new Array();
	var tempImagesThree = new Array();
	//console.log(images);
	for(var c4 = 0;c4<images.length;c4++){
		tempImagesTwo.push(images[c4]);
		
	}
	
	for(c6 = 0;c6<images.length;c6++){
		var rightMost = 0;
		var rightImage;
		var rightPos = 0;
			for(var c5 = 0;c5<tempImagesTwo.length;c5++){
				if(tempImagesTwo[c5].x+tempImagesTwo[c5].width>=rightMost){
					rightMost = tempImagesTwo[c5].x+tempImagesTwo[c5].width;
					rightImage = tempImagesTwo[c5];
					rightPos = c5;
				}
			
			}
		
		tempImagesThree.push(rightImage);
		//console.log(tempImagesThree);
		tempImagesTwo.splice(rightPos,1);
	}
	
	for(var c7 = tempImagesThree.length-1;c7>=0;c7--){
		
		tempImages.push(tempImagesThree[c7]);
	
	}
	
	//console.log(tempImages);


	var plainParentId = "plain" + 0;
	document.getElementById(plainParentId).innerHTML="";
	for(var c = 0; c<folders.length;c++){
		
		if(folders[c].deleted){continue;}
		
		
		var name = folders[c].name;
		var level = folders[c].level;
		var id = folders[c].id;
		plainParentId = "plain" + folders[c].parentId;
		//console.log(plainParentId);
		//console.log("id = " + id)
		
		var inSet="";
		for(var l = 1;l<level;l++){
		
			inSet = inSet +""
		}
		
		
		var delim = "";		
		var hasMoreFolders1 = false;
		for(var has1 = 0;has1<folders.length;has1++){
			if(has1 == c){continue;}
			if(folders[has1].parentId == folders[c].parentId&&!folders[has1].deleted){
				if(folders[has1].id<id){
				folders[has1].hasMoreFolders = true;
				delim = ",";
				}		
			}
				
		}
		
		document.getElementById(plainParentId).innerHTML="<div id=\"plain"+id+"\"></div>"+inSet+folderEnding+delim+document.getElementById(plainParentId).innerHTML;
		
		
		//console.log(folders[c].images.length);
		var imageHTML = "<div id=\"plainImagesFolder"+id+"\">";
		
		
		var imagesCount = 0;
		
		for(var c2 = 0;c2<tempImages.length;c2++){
			if(tempImages[c2] == "undefined"){continue;}
		
			for(var c3 = 0;c3<folders[c].images.length;c3++){
		
			
		
		
			
				
				
				//console.log(folders[c].images[c3] + " " +images[c2].num);
				if(folders[c].images[c3]==tempImages[c2].num){
				imageHTML+="<div>"+inSet+""+imagePrefix+tempImages[c2].name+imageSuffix;
				
				
				if(!grid){
					imageHTML = imageHTML+" \"x\" : \""+tempImages[c2].x+"\" , ";
					imageHTML = imageHTML+"\"y\" : \""+tempImages[c2].y+"\" , ";
					imageHTML = imageHTML+"\"height\" : \""+tempImages[c2].height+"\" , ";
					imageHTML = imageHTML+"\"width\" : \""+tempImages[c2].width+"\"";
					
					
					
				}else{
					imageHTML = imageHTML+" \"x\" : \""+tempImages[c2].x+"\" , ";
					imageHTML = imageHTML+"\"y\" : \""+tempImages[c2].y+"\" , ";
					imageHTML = imageHTML+"\"height\" : \""+cellX+"\" , ";
					imageHTML = imageHTML+"\"width\" : \""+cellY+"\"";
					
					
				}
				
				imageHTML = imageHTML+imageEnding;
				
				imagesCount++;
				var hasMoreFolders = false;
				for(var has = 0;has<folders.length;has++){
					if(folders[has].parentId == id&&!folders[has].deleted){
						hasMoreFolders = true;
					}
				
				}
				
				if(imagesCount<folders[c].images.length||hasMoreFolders){
					imageHTML = imageHTML+",";
					
				}
				
				imageHTML = imageHTML+"</div>";
				}
			}
			
			
			
		}
		imageHTML+="</div>"
		
		
		document.getElementById(plainParentId).innerHTML=imageHTML+document.getElementById(plainParentId).innerHTML;
		
		
		document.getElementById(plainParentId).innerHTML=inSet+folderPrefix+name+folderSuffix+document.getElementById(plainParentId).innerHTML;
		
		
		
		//console.log(level);
		
		for(var c1 = 0;c1<level;c1++){
		
		//document.getElementById(plainParentId).innerHTML=""+document.getElementById(plainParentId).innerHTML;
		
		}
		
		document.getElementById(plainParentId).innerHTML="<div>"+document.getElementById(plainParentId).innerHTML;
		
		
		
		
		
	
	}
	
	document.getElementById('dataPlain').innerHTML=startingBracket+document.getElementById('dataPlain').innerHTML;
	
	document.getElementById('dataPlain').innerHTML=document.getElementById('dataPlain').innerHTML+"<br/>"+endingBracket;
	
	var outputString = window.btoa(document.getElementById('dataPlain').innerHTML.replace(/<[^>]*>/g, ""));
	
	document.getElementById('standardTextLinkButton10').href="data:text/txt;charset=utf-8;base64,"+outputString;
	
	
	
	

	var allString = "";
	
	
	for(var c3 = 0;c3<folders.length;c3++){
		
		if(folders[c3].deleted){continue;}
		if(folders[c3] == "undefined"){continue;}
		
		var folderString = ",{\"type\" : \"folder\", \"name\" : \""+folders[c3].name+"\",  \"level\" : \""+folders[c3].level+"\", \"parentId\" : \""+folders[c3].parentId+"\", \"subfolderId\" : \""+folders[c3].subfolderId+"\", \"id\" : \""+folders[c3].id+"\", \"images\" : \""+folders[c3].images+"\"}";
		
		allString = allString + folderString;
	}
	
	for(var c4 = 0;c4<images.length;c4++){
		var deleted = false;
		var id = images[c4].num;
		for(var c5 = 0;c5<folders.length;c5++){
		
			for(var c6 = 0;c6<folders[c5].images.length;c6++){
				if(id == folders[c5].images[c6]){
					if(folders[c5].deleted){
						deleted = true;
						}
				}
			}
		
		}
		
		if(deleted){continue;}
		
		var imageString = ",{\"type\" : \"image\", \"name\" : \""+images[c4].name+"\", \"id\" : \""+images[c4].num+"\", \"source\" : \""+images[c4].source.src+"\"}";
		
		allString = allString + imageString;
	
	}
	
	
	
	
	
	
	
	
	var saveString = window.btoa(unescape(encodeURIComponent(
	"{\"sf_file_2013\":[{}" + allString + "]}"
	
	)));
	
	document.getElementById('standardTextLinkButton8').href="data:text/txt;charset=utf-8;base64,"+saveString;

}


function colorDataFolders(){
	
	for(var c = 0; c<folders.length;c++){
		if(folders[c].deleted){continue;}
	
		if(folders[c].images.length>0){
		
			document.getElementById('dataFolder'+folders[c].id).style.color = "#090909";
		
		}else{
		document.getElementById('dataFolder'+folders[c].id).style.color = "#AAA";
		}
	
	}

}

