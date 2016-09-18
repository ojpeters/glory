var pictureSource;   // picture source
var destinationType; // sets the format of returned value
var imagedata="";

 
document.addEventListener("deviceready", onDeviceReady, false);
 
function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
	//$.mobile.initializePage();
}
// A button will call this function
//
function capturePhoto() {
    sessionStorage.removeItem('imagepath');
	//$('#response').append("<p> started</p>");
	
		// Take picture using device camera and retrieve image as base64-encoded string
		navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50, encodingType : Camera.EncodingType.JPEG,
		targetWidth: 768,
		targetHeight: 288,
		correctOrientation: true,
		destinationType: Camera.DestinationType.FILE_URI });
		

	
}
    function getPhoto(source) {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
        destinationType: destinationType.FILE_URI,
		targetWidth: 768,
		targetHeight: 288,
        sourceType: source });
    }

function onPhotoDataSuccess(imageURI) {


 $('#postform #response').html("pic captured");
        // Uncomment to view the base64 encoded image data,      		 
		   //var imgProfile = document.getElementById('imgProfile');        
		//imgProfile.style.display = 'block';
        //imgProfile.src = imageURI;
		$('#mimage').append("<img with='60' height='60' src="+imageURI+" />");
		sessionStorage.setItem('imagepath', imageURI);//store value in session 
		
      		 
		   var imgProfile = document.getElementById('mimage');

        // Show the captured photo
        // The inline CSS rules are used to resize the image
        
        //imgProfile.src = imageURI;
		//sessionStorage.setItem('imagepath', imageURI);//store value in session 
		
		
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
							
								$("#postform").resetForm(),
								$('#postform button[type="button"]').attr("disabled",!0), 
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
						alert("error"+r.responseCode);
						//$('#response').html("ErrorText: "+ err);
						$("#response").append("Error found: code:"+r.responseCode+"Response = " + r.response+"Sent = " + r.bytesSent);
							
					}        

			});
	

} 
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

/*$(document).ready(function(){
	//posting
	alert("starting")

	function e(){
		$("#postform .logic-block-checkbox").change(function(){
		$(".multi-next-btn").css("display","block");
		}).change()
		}
		
		$("#postform").validate({
			errorClass:"error-view",validClass:"success-view",
			errorElement:"span",onkeyup:!1,onclick:!1,
			rules:{name:{required:!0},
					category:{required:!0},
					message:{required:!0},
					title:{required:!0},
					airline_flight_number:{required:!0}
					
				},
				messages:{
						name:{required:"Please enter your name"},
						category:{required:"Please enter your category"},
						message:{required:"Please the post details"},						
						title:{required:"Please enter  title  for this post"},
						airline_flight_number:{required:"Please enter a flight number"}
						
						},
				highlight:function(e,s,t){
						$(e).closest(".input").removeClass(t).addClass(s),
						($(e).is(":checkbox")||$(e).is(":radio"))&&$(e).closest(".check").removeClass(t).addClass(s)
						},
				unhighlight:function(e,s,t){
						$(e).closest(".input").removeClass(s).addClass(t),
						($(e).is(":checkbox")||$(e).is(":radio"))&&$(e).closest(".check").removeClass(s).addClass(t)
						},
				errorPlacement:function(e,s){
						$(s).is(":checkbox")||$(s).is(":radio")?$(s).closest(".check").append(e):$(s).closest(".unit").append(e)
				},
				submitHandler:function(){ alert("submitting now");
				postData();
				}
			}),
			
				$("form.j-multistep").length&&$("form.j-multistep").each(function(){
					var s=$(this).attr("id"),
						t=$("#"+s+" fieldset").length,
						i=$("#"+s+" .step").length,
						a=$("#"+s+" .multi-next-btn"),
						r=$("#"+s+" .multi-prev-btn"),
						l=$("#"+s+" .multi-submit-btn"),
						d=$("#"+s+" .logic-block-checkbox").closest("fieldset").index("fieldset");
						
					$("#"+s+" fieldset").eq(0).addClass("active-fieldset"),
					i&&$("#"+s+" .step").eq(0).addClass("active-step"),
					$("#"+s+" fieldset").eq(0).hasClass("active-fieldset")&&(l.css("display","none"),
					r.css("display","none"),
					e()),
					l.click(function(){
						for(var e=$("#"+s+" fieldset").length,
						t=$("#"+s).find("fieldset.active-fieldset").index("fieldset");e>t+1;
						)
						$("#"+s+" fieldset").eq(e-1).find('select, textarea, input[type="text"], input[type="email"]').val(""),
						$("#"+s+" fieldset").eq(e-1).find('input[type="radio"], input[type="checkbox"]').prop("checked",!1),
						e--
						}),
					a.on("click",function(){
							return 1!=$("#"+s).valid()?!1:($("#"+s+" fieldset.active-fieldset").removeClass("active-fieldset").next("fieldset").addClass("active-fieldset"),i&&$("#"+s+" .step.active-step").removeClass("active-step").addClass("passed-step").next(".step").addClass("active-step"),
							r.css("display","block"),
							$("#takePicBtn").css("display","block"),
							$("#"+s+" fieldset").eq(t-1).hasClass("active-fieldset")&&(l.css("display","block"),a.css("display","none")),void 0)
					}),
					r.on("click",function(){
								$("#"+s+" fieldset.active-fieldset").removeClass("active-fieldset").prev("fieldset").addClass("active-fieldset"),
								i&&$("#"+s+" .step.active-step").removeClass("active-step").prev(".step").removeClass("passed-step").addClass("active-step"),
								$("#"+s+" fieldset").eq(0).hasClass("active-fieldset")&&r.css("display","none"),
$("#"+s+" fieldset").eq(d-1).hasClass("active-fieldset")&&(l.css("display","none"),
								a.css("display","block")),
								$("#"+s+" fieldset").eq(t-2).hasClass("active-fieldset")&&(l.css("display","none"),
								a.css("display","block"))
					})
				})
				
				
  });
  
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
		ft.upload(imageURI, encodeURI("http://www.sportsmangist.com/app/updatepost.php"), uploadsuccess, fail, options);
		$('#response').append("Image uploaded successful");	
	}else{
		$('#response').append($newsid);
	}
	
	
	
}


function uploadsuccess(r) {
    
	$("#response").append("Upload successful: code:"+r.responseCode+"Response = " + r.response+"Sent = " + r.bytesSent);
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