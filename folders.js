//Created by V Teoharov. 5/21/2013 
//https://github.com/vteoharow
var folders = new Array();
var folderId = 1;
var selectedFolder = "dropbox2";
var maxLevel=0;

function buildFolders(){

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
			
				if(!vert){
					if(tempImagesTwo[c5].x+tempImagesTwo[c5].width>=rightMost){
						
								rightMost = tempImagesTwo[c5].x+tempImagesTwo[c5].width;

						rightImage = tempImagesTwo[c5];
						rightPos = c5;
					}
				}else{
					if(tempImagesTwo[c5].y+tempImagesTwo[c5].height>=rightMost){
						
								rightMost = tempImagesTwo[c5].y+tempImagesTwo[c5].height;

						rightImage = tempImagesTwo[c5];
						rightPos = c5;
					}
				
				
				
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
	var parentId = "innerfolder" + 0;
	document.getElementById(parentId).innerHTML="";
	for(var c = 0; c<folders.length;c++){
	
		var name = folders[c].name;
		var level = folders[c].level;
		var id = folders[c].id;
		parentId = "innerfolder" + folders[c].parentId;
		//console.log(parentId);
		//console.log("id = " + id)
		
		document.getElementById(parentId).innerHTML="<div id=\"innerfolder"+id+"\"></div>"+document.getElementById(parentId).innerHTML;

		
		//console.log(folders[c].images.length);
		var imageHTML = "<div id=\"imagesFolder"+id+"\">";
		
		
		for(var c2 = 0;c2<tempImages.length;c2++){
		
			for(var c3 = 0;c3<folders[c].images.length;c3++){
		
			
		
		
				
				//console.log(folders[c].tempImages[c3] + " " +tempImages[c2].num);
				if(folders[c].images[c3]==tempImages[c2].num){
				imageHTML+="<div><textarea id=\"histB"+tempImages[c2].num+"\" readonly=\"true\" onfocus=\'highlightSprite(\""+tempImages[c2].num+"\")\' rows = \"1\" cols =\"" + tempImages[c2].name.length +"\">" + tempImages[c2].name+ "</textarea><textarea id=\"remove"+tempImages[c2].num+"\" readonly=\"true\" onfocus=\'removeSprite(\""+tempImages[c2].num+"\",\"true\")\' rows = \"1\" cols =\"" + "del".length +"\">DEL</textarea></div>";
				
				
				}
			}
			
			
			
		}
		imageHTML+="</div>"
		document.getElementById(parentId).innerHTML=imageHTML+document.getElementById(parentId).innerHTML;
		
		
		document.getElementById(parentId).innerHTML="<div id=\"dropbox"+id+"\"><span id=\"droplabel"+id+"\">Drop images here...</span></div>"+document.getElementById(parentId).innerHTML;
		
		document.getElementById(parentId).innerHTML=
		
		"<textarea id=\"play"+id+"\" readonly=\"true\" onclick=\"playFolder("+id+")\" rows = \"1\" cols =\"2\">&#9658</textarea>"+
		
		"<textarea id=\"plus"+id+"\" readonly=\"true\" onclick=\"displayTextBox('textBox"+id+"','confirm"+id+"')\" rows = \"1\" cols =\"2\">+</textarea>"+
		
		"<textarea id=\"remfolder"+id+"\" readonly=\"true\" onclick=\"confRem("+id+")\" rows = \"1\" cols =\"" + "del".length +"\">del</textarea>"+
		
		"<textarea id=\"confDel"+id+"\" readonly=\"true\" onclick=\"removeFolder("+id+")\" rows = \"1\" cols =\"" + "confirm".length +"\">Confirm</textarea>"+
		
		"<div style=\"display:inline\"><textarea id=\"textBox"+id+"\" rows = \"1\" cols =\"14\" placeholder=\"subfolder name\"></textarea>"+	
		
		"<textarea id=\"confirm"+id+"\" onclick=\"addFolder('textBox"+id+"','"+id+"',"+level+")\" rows = \"1\" cols =\"7\" readonly=\"true\">Confirm</textarea></div>"+
		
		document.getElementById(parentId).innerHTML;
		
		var additional = 6-name.length;
		if(additional<0){additional = 0;}
		
		document.getElementById(parentId).innerHTML="<textarea onchange=\"renameFolder("+id+",false)\" id=\"folder"+id+"\" rows=\"1\" onclick=\"displayDrop(\'"+"dropbox"+id+"\','false')\" cols=\""+(additional+name.length)+"\">"+name+"</textarea>"+document.getElementById(parentId).innerHTML;
		//console.log(level);
		
		for(var c1 = 0;c1<level;c1++){
		
		//document.getElementById(parentId).innerHTML="   "+document.getElementById(parentId).innerHTML;
		
		}
		
		document.getElementById(parentId).innerHTML="<div>"+document.getElementById(parentId).innerHTML;
		
		
		if(folders[c].deleted==true){
			document.getElementById('folder'+id).style.display="none";
			document.getElementById('plus'+id).style.display="none";
			document.getElementById('dropbox'+id).style.display="none";
		}else{
			document.getElementById('folder'+id).style.display="inline";
			document.getElementById('plus'+id).style.display="inline";
			document.getElementById('dropbox'+id).style.display="block";
		}
		
		
		
	
	}
	colorFullFolders();
	displayDrop(selectedFolder, true);
	buildData();
	buildDataPlain();
}

function confRem(id){

	if(document.getElementById('textBox'+id).style.display != "none"){
	document.getElementById('textBox'+id).style.display = "none";
	document.getElementById('confirm'+id).style.display = "none";}
	
	
	var idConf = "confDel"+id;

	if(document.getElementById(idConf).style.display == "none"){
		document.getElementById(idConf).style.display = "inline";
	}else{
		document.getElementById(idConf).style.display = "none";
	}
	
}

function renameFolder(id, JSONfolder){

	var prefix = "";
	
	if(JSONfolder){
		prefix = 'dataFolder';
	}else{
	
		prefix = 'folder';
	}
	
	var parentId;
	
	var saveName;
	
	for(var c3 = 0;c3<folders.length;c3++){
	
		if(folders[c3].id ==id){
			parentId = folders[c3].parentId;
			saveName = folders[c3].name;
		}
	
	}
	
	
	
	for(var c2 = 0;c2<folders.length;c2++){
		if(folders[c2].deleted){continue;}
		if(folders[c2].parentId == parentId){
		
			if(folders[c2].name == document.getElementById(prefix + id).value){
				document.getElementById(prefix + id).value = saveName;
				document.getElementById('warning').innerHTML="This SubFolder name already exists in this Folder. Choose another name.";
				document.getElementById('warning').style.display = "block";
				//display error
			}
		}
	
	}

	for(var c = 0;c<folders.length;c++){
		if(id == folders[c].id){
			folders[c].name = document.getElementById(prefix + id).value;
			//console.log(document.getElementById(prefix + id).value);
		}
	}
	buildFolders();

}

function removeFolder(id){



	for(var c = 0;c<folders.length;c++){
	
		if(folders[c].id ==id||folders[c].parentId ==id){
			
			for(var c2 = 0;c2<folders[c].images.length;c2++){
				for(var c3 = 0;c3<images.length;c3++){
					if(folders[c].images[c2]==images[c3].num){
						images.splice(c3,1);
						
					}
					
				}
			
			}
			folders[c].images = new Array();
			folders[c].deleted = true;
			
			
		}else{selectedFolder = "dropbox" + folders[c].id;}
		
		if(folders[c].deleted==true){
			document.getElementById('folder'+folders[c].id).style.display="none";
			document.getElementById('plus'+folders[c].id).style.display="none";
			document.getElementById('dropbox'+folders[c].id).style.display="none";
			document.getElementById('play'+folders[c].id).style.display="none";
			
		}else{
			document.getElementById('folder'+folders[c].id).style.display="inline";
			document.getElementById('plus'+folders[c].id).style.display="inline";
			document.getElementById('play'+folders[c].id).style.display="inline";
			document.getElementById('dropbox'+folders[c].id).style.display="block";
			
		}
	}
	
	for(var level = 0;level<maxLevel;level++){
	
		for(var c4 = 0;c4<folders.length;c4++){
			for(var c5 = 0;c5<folders.length;c5++){
				if(folders[c5].deleted){
				
					if(folders[c4].parentId == folders[c5].id){
					
						
							for(var c7 = 0;c7<folders[c4].images.length;c7++){
								for(var c6 = 0;c6<images.length;c6++){
									if(folders[c4].images[c7]==images[c6].num){
										images.splice(c6,1);
							
									}
						
								}
				
							}
						folders[c4].images = new Array();
						folders[c4].deleted = true;
					
					}
				}
			
			
			}
		
		}
	
	}
	
	buildFolders;
	calcPos();
	buildList();
	buildData();
	buildDataPlain();
	colorFullFolders();

}

function playFolder(){

}

function colorFullFolders(){

	

	for(var c = 0; c<folders.length;c++){
	
	
		if(folders[c].images.length>0){
		
			document.getElementById('folder'+folders[c].id).style.color = "#090909";
		
		}else{
		document.getElementById('folder'+folders[c].id).style.color = "#AAA";
		}
	
	}

}

function addFolder(textBoxId, parentId, parentLevel){

	var name = document.getElementById(textBoxId).value;
	if(name == ""){name = "new folder 0";}
	
	
	
	for(var c = 0;c<folders.length;c++){
		if(folders[c].parentId == parentId){
		
			if(folders[c].name == name){
			
				name = name.split(" 0")[0]+" "+folders[c].subfolderId;
				folders[c].subfolderId = folders[c].subfolderId+1;
				present = true;
			}
		}
	
	}
	
	
	
	folders.push(new Folder(name, parentId, (parentLevel+1)));
	buildFolders();
	
	var foldersLength=0;
	var firstId;
	for(var c2 =0;c2<folders.length;c2++){
		if(!folders[c2].deleted){
		foldersLength++;
		firstId = folders[c2].id;
		}
	}
	
	if(foldersLength == 1){
		selectedFolder = "dropbox" + firstId;
		displayDrop(selectedFolder, true);
	}
	
}

function Folder(name, parent, parentLevel){


	if(parentLevel>maxLevel){maxLevel=parentLevel;}
	this.level = parentLevel;
	this.name = name;
	this.id = folderId;
	folderId++;
	this.parentId = parent;
	this.images = new Array();
	this.deleted = false;
	this.subfolderId = 1;
	

}

function displayTextBox(id, id2){
	
	var idNum = id.split("textBox")[1];
	document.getElementById("confDel" + idNum).style.display = "none";
	
	if(document.getElementById(id).style.display == "none"){
		document.getElementById(id).style.display = "inline";
	}else{
		document.getElementById(id).style.display = "none";
	}
	
	if(document.getElementById(id2).style.display == "none"){
		document.getElementById(id2).style.display = "inline";
	}else{
		document.getElementById(id2).style.display = "none";
	}
}