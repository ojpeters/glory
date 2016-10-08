var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var imagedata="";
showposts();
 
document.addEventListener("deviceready", onDeviceReady, false);
 
function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
	//$.mobile.initializePage();
	showposts();
}

//on device ready call this
function showposts(){
	$.ajax({
            type: 'POST',
            url: 'http://www.gloriouswomenofwonders.org/app/getcats.php',
            dataType: 'text',
            contentType: 'application/text; charset=utf-8',
            success: function(response) {
                $('#posts').html(response);
            },
            error: function(error) {
                alert("error showing posts"+error);
				$("#error").append(error);
            }
	});
	
}
// A button will call this function
//
function capturePhoto() {
    sessionStorage.removeItem('imagepath');
	//$('#response').append("<p> started</p>");
	
		// Take picture using device camera and retrieve image as base64-encoded string
		navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50, encodingType : Camera.EncodingType.JPEG,
		targetWidth: 500,
		targetHeight: 288,
		correctOrientation: true,
		destinationType: Camera.DestinationType.FILE_URI });
		

	
}
    function getPhoto() {
      // Retrieve image file location from specified source
	  alert("attempt to get photo");
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
        destinationType: destinationType.FILE_URI,
		targetWidth: 400,
		targetHeight: 288,
        sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM });//PHOTOLIBRARY/SAVEDPHOTOALBUM
    }

function onPhotoDataSuccess(imageURI) {


 $('#postform #response').html("pic captured");
        // Uncomment to view the base64 encoded image data,      		 
		   //var imgProfile = document.getElementById('imgProfile');        
		//imgProfile.style.display = 'block';
        //imgProfile.src = imageURI;
		$('#mimage').append("<img with='100' height='100' src="+imageURI+" />");
		sessionStorage.setItem('imagepath', imageURI);//store value in session       		 
		   var imgProfile = document.getElementById('mimage');     
		
		
}
// Called if something bad happens.
// 
function onFail(message) {    
	$('#response').append(message);	
}

function movePic(file){ 
    window.resolveLocalFileSystemURI(file, resolveOnSuccess, resOnError); 
} 

//Callback function when the file system uri has been resolved
function resolveOnSuccess(entry){ 
    var d = new Date();
    var n = d.getTime();
    //new file name
    var newFileName = n + ".jpg";
    var myFolderApp = "appfiles";
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {      
    //The folder is created if doesn't exist
    fileSys.root.getDirectory( myFolderApp,
			{create:true, exclusive: false},
			function(directory) {
				entry.moveTo(directory, newFileName,  successMove, resOnError);
			},
			resOnError);
			},
    resOnError);
}

//Callback function when the file has been moved successfully - inserting the complete path
function successMove(entry) {
    //Store imagepath in session for future use
    // like to store it in database
    sessionStorage.setItem('imagepath', entry.fullPath);
	//showAlert("starting upload to ofullpath"+entry.fullPath);	 
	uploadPhoto(entry.fullPath);
}

function resOnError(error) {
    showAlert(error.code);
}
function showAlert(message) {
	navigator.notification.alert(
		message,  // message
		alertDismissed,         // callback
		'Notice:',            // title
		'OK'                  // buttonName
	);
}
function postData() {
	
	var target="http://www.gloriouswomenofwonders.org/app/dopost.php";
//var target="http://localhost/primetech/app/dopost.php";	
	//addTolocalDB();	
alert(target);	
		var formData = $("#postform").serialize();	

				$.ajax({
					type: "POST",
					url: target,
					cache: false,
					data: formData,
					dataType: 'text',
					beforeSend: function() {
						
						$('#postform button[type="button"]').attr("disabled",!0).addClass("processing")	
						
					},
					complete: function() {

					},
					success: function (result) {
						 $('#postform #response').html("response:"+result);	
						 								
								//$('#postform button[type="submit"]').attr("disabled",!1).removeClass("processing"),
							
								//$("#postform").resetForm();
								//$('#postform button[type="button"]').attr("disabled",!0), 
							//$("#postform .multi-submit-btn").css("display","none")								
								
								//handle images//check if image is captured an dupload
							if (sessionStorage.getItem('imagepath') == null){
								// myValue was not set
								$("#response").append("Image NOT set:");
							}else{
								// myValue was set	
															
								var imageitem=sessionStorage.getItem('imagepath');
								$("#response").append("uploading image");
								var returnedresult=result.split(":");// we separated it
								var newsid=returnedresult[0];
								//alert("we got an id "+newsid);
								uploadPhoto(imageitem,newsid);								
								//movePic(imageitem);								
								
							}
					},
					error:  function(r) {
						//alert("error"+r.responseCode);
						//$('#response').html("ErrorText: "+ err);
						$("#response").append("Error found: code:"+r.responseCode+"Response = " + r.response+"Sent = " + r.bytesSent);
							
					}        

			});
	

} 
/*
function docheck(){
	$("#postform").validate({
			errorClass:"error-view",validClass:"success-view",
			errorElement:"span",onkeyup:!1,onclick:!1,
			rules:{			
					title:{required:!0},
					category:{required:!0},
					message:{required:!0},
					code:{required:!0}
					
				},
				messages:{
						
						category:{required:"Please enter your category"},
						message:{required:"Please the post details"},						
						title:{required:"Please enter  title  for this post"},
						code:{required:"Please enter your authorization code"
						
						},
			
				submitHandler:function(){ alert("submitting now");
				postData();
				}
			})
			
}
*/

  /////////////image stuff
  ///////////////
function uploadPhoto(imageURI,newsid) {
    
	if($.isNumeric(newsid)){
		var options = new FileUploadOptions();
		options.fileKey="file";
		options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
		options.mimeType="text/plain";
		var params = new Object();
		params.newsid=newsid;

		options.params = params;

		var ft = new FileTransfer();
		ft.upload(imageURI, encodeURI("http://www.gloriouswomenofwonders.org/app/updatepost.php"), uploadsuccess, fail, options);
		$('#response').append("Image uploaded successful");	
	}else{
		$('#response').append($newsid);
	}
	
	
	
}


function uploadsuccess(r) {
    
	$("#response").append("Pictured upload successful");
	//sessionStorage.getItem('imagepath') = null;
   
}

function fail(error) {
    
	$("#response").append("Upload failed:An error has occurred: Code = " + error.code+"upload error source " + error.source+"upload error target " + error.target);
    
}


  function test(){
	  ////var imageURI="http://www.ojpeters.com/wp-content/uploads/2016/05/posted_name4.jpg";
	  //$('#mimage').append("<img src="+imageURI+" />");
	   var newsid="23";
	  	if($.isNumeric(newsid)){
			
			alert("Yes");
		}else{
			alert("No");
		}
	  
  }