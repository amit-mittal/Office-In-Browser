function sleep(milliseconds) {
	var start = new Date().getTime();
	while(true)
	{
		if((new Date().getTime() - start) > milliseconds){
			break;
		}
	}
};

function randomString() {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = 10;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
}

function refresh(){
	var currTime = new Date();
	var storedTime = new Date(parseInt(localStorage.getItem('token_time')));


	if(currTime - storedTime < 3600*1000 && !(localStorage["signedin"] == null)){
	
		chrome.identity.launchWebAuthFlow({
			'url': 'https://login.live.com/oauth20_authorize.srf?client_id=0000000044154892&scope=onedrive.appfolder&redirect_uri=https://ejogoajlecnhkiokfhffloiclmigggmf.chromiumapp.org/provider&response_type=token', 'interactive': true
			},
			function(redirect_url) {
			    var start = redirect_url.indexOf("#");
			    var end = redirect_url.indexOf("&token_type");
			    var tokenValue = redirect_url.substring(start+14,end);

			    localStorage.setItem('token_time', +new Date);

			    var storedTime = new Date(parseInt(localStorage.getItem('token_time')));
			    console.log(storedTime);
			    ///console.log(curTime);
			    console.log(storedTime);

			    localStorage["token"]= tokenValue;
			    localStorage["signedin"] = 1;
			}
		);

	}
	else
	{
		localStorage.removeItem("signedin");

	}
}

// The onClicked callback function.
function onClickHandler(info, tab) {
	var accessTkn = localStorage.getItem("token");
	var requestUrl = "https://api.onedrive.com/v1.0/drive/items/DE0E3168CF313CAA%21108/children?access_token="+accessTkn;

	var downloadUrl = info.linkUrl;
	var n = downloadUrl.lastIndexOf('/');
	var filename = downloadUrl.substring(n + 1);
	var ext_n = filename.lastIndexOf('.');
	var filename_p = filename.substring(0, ext_n);
	var ext = filename.substring(ext_n);

	var data = {
					"@content.sourceUrl": downloadUrl,
					"name": filename_p + "-" + randomString() + ext,
					"file": { }
				};

	$.ajax({
	    type: "POST",
	    url: requestUrl,
	    headers: { 'Prefer': 'respond-async' },
	    //async : false,
	    contentType: 'application/json',
	    data: JSON.stringify(data),
	    success: function(data, textStatus, request) {
	    	chrome.tabs.executeScript(null, { file: "hello.js" });
//	    	alert("File uploading..");
	    	sleep(15000);

	    	chrome.tabs.executeScript(null, { file: "hello1.js" });
//	    	alert("File uploaded to One Drive and opening ..");

    		$.ajax({
					dataType: "json",
					//async : false,
					url: request.getResponseHeader('Location'),
					success: function(data, textStatus, request) {
						window.open(data["webUrl"], '_blank').focus();
					}
				});	
	    	
		}});

	// chrome.tabs.executeScript({
	// 	code: 'document.body.style.cursor = "pointer"'
	// 	});
};

chrome.contextMenus.onClicked.addListener(onClickHandler);

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {
	// Create one test item for each context type.
	chrome.contextMenus.create({"title": "Open with Office Online", "contexts": ["link"],"id": "parent1234"});
});

setInterval(function(){refresh()}, 30*60*1000);