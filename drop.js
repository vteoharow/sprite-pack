//Created by V Teoharov. 5/21/2013 
//https://github.com/vteoharow
jQuery('body').bind('dragover drop', function(event){
    event.preventDefault();
    return false;
});

var readers = new Array();
var imagesErrorTemp = new Array();
var ready = true;

$(document).ready(function() {
	var dropbox = document.body;
	
	dropbox.addEventListener("dragenter", dragEnter, false);
	dropbox.addEventListener("dragexit", dragExit, false);
	dropbox.addEventListener("dragover", dragOver, false);
	dropbox.addEventListener("drop", drop, false);

	
});

function displayDrop(id, special){
	
	
	
	for(var c = 1;c<folderId;c++){
	
		if(c == id.split("dropbox")[1]){continue;}
		var idTemp = "dropbox"+c;
		var plusTemp = "plus"+c;
		var textBoxTemp ="textBox"+c;
		var confirmTemp="confirm"+c;
		var imagesFolderTemp="imagesFolder"+c;
		var remFolderTemp="remfolder"+c;
		var confRemTemp="confDel"+c;
		var playTemp ="play"+c;
		
		
		document.getElementById(idTemp).style.display = "none";
		document.getElementById(plusTemp).style.display = "none";
		document.getElementById(textBoxTemp).style.display = "none";
		document.getElementById(confirmTemp).style.display = "none";
		document.getElementById(imagesFolderTemp).style.display = "none";
		document.getElementById(remFolderTemp).style.display = "none";
		document.getElementById(confRemTemp).style.display = "none";
		document.getElementById(playTemp).style.display="none";
		
	}
	
	
	
	for(var c2 = 0;c2<folders.length;c2++){
		if(folders[c2].id == id.split("dropbox")[1]){
			if(folders[c2].deleted){return;}
		
		}
	
	}
	
	highId = new Array();
		
	
	for(var c3 = 0;c3<folders.length;c3++){
	
		if(folders[c3].id == id.split("dropbox")[1]){
			
			for(var c4 = 0;c4<folders[c3].images.length;c4++){
			
				highId.push(folders[c3].images[c4]);
			
			}
		
		}
	
	}
	loop();
	
	
	
	var plusID = "plus" + id.split("dropbox")[1];
	var imagesFID = "imagesFolder" + id.split("dropbox")[1];
	var remFolderID = "remfolder" + id.split("dropbox")[1];
	var playID = 'play' + id.split("dropbox")[1];
	
	if(document.getElementById(plusID).style.display == "none"){
		document.getElementById(plusID).style.display = "inline";
	}else{
		document.getElementById(plusID).style.display = "none";
	}
	
	if(document.getElementById(playID).style.display == "none"){
		document.getElementById(playID).style.display = "inline";
	}else{
		document.getElementById(playID).style.display = "none";
	}

	if(document.getElementById(id).style.display == "none"){
		document.getElementById(id).style.display = "block";
	}else{
		document.getElementById(id).style.display = "none";
	}
	
	if(document.getElementById(imagesFID).style.display == "none"){
		document.getElementById(imagesFID).style.display = "block";
	}else{
		document.getElementById(imagesFID).style.display = "none";
	}
	
	if(document.getElementById(remFolderID).style.display == "none"){
		document.getElementById(remFolderID).style.display = "inline";
	}else{
		document.getElementById(remFolderID).style.display = "none";
	}
	
	selectedFolder = id;
	
	
	if(special){
	document.getElementById(plusID).style.display = "inline";
	document.getElementById(id).style.display = "block";
	document.getElementById(imagesFID).style.display = "block";
	}
	

}



function dragEnter(evt) {
	evt.stopPropagation();
	evt.preventDefault();
}

function dragExit(evt) {
	evt.stopPropagation();
	evt.preventDefault();
}

function dragOver(evt) {
	evt.stopPropagation();
	evt.preventDefault();
}

function drop(evt) {
	
	evt.stopPropagation();
	evt.preventDefault();

	var files = evt.dataTransfer.files;
	var count = files.length;

	if (count > 0)
		handleFiles(files);
}


function handleFiles(files) {
	
	if(window.FileReader) {   
	} else {
   
		
		document.getElementById('warning').innerHTML=" This browser does not support the FileReader functionality</br> required to load files to the web page.</br> Browsers that do support it are Chrome and Firefox.</br><a href=\"http://caniuse.com/filereader\" target=\"_blank\">List of Supported Browsers</a>";
		document.getElementById('warning').style.display = "block";
		return;
   
	}
	
	imagesErrorTemp = new Array();
	var filesT = files;
	var foldersLength=0;
	
	for(var c2 =0;c2<folders.length;c2++){
		if(!folders[c2].deleted){foldersLength++;}
		
		document.getElementById('droplabel'+folders[c2].id).innerHTML = "Please wait..."
	}
	

	
	if(foldersLength==0){
	document.getElementById('warning').innerHTML="You need to create at least one folder in order to add files.";
	document.getElementById('warning').style.display = "block";
	return;
	}
	
	
	toPush = files.length;
	pushed = 0;
	overallError=false;


	for(var c = 0;c<files.length;c++){
		
		var name = filesT[c].name;
		
		if(!ready){c--;continue;}
		loopThroughFiles(files, c, name, filesT);
		
		
	}
	
}

function loopThroughFiles(files, c, name, filesT){


	
		if(c<files.length-1){
		readers.push(new BigReader(name,filesT[c],false));
		
		}else{
		readers.push(new BigReader(name,filesT[c],true));
		
		
		}
		

}


function BigReader(name, file, last){
	
	this.name = name;
	var reader = new FileReader();
	var data = reader.readAsDataURL(file);
	
	
	reader.onload = function(event) {
			
			
			var imgSpriteTemp = new Image();
			imgSpriteTemp.src = event.target.result;
			
			pushImg(imgSpriteTemp,name,last);

			
			}
		
	readers.splice(readers.indexOf(this),1);
		
}


