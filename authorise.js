function displayButtons(){
	var out = "";
	document.body.style.fontSize = "1.2em";

    // JavaScript source code
	var fileNames = new Array();
	var fileLinks = new Array();

	$.ajax({
	    url: "https://api.onedrive.com/v1.0/drive/special/approot/children?access_token="+localStorage["token"],
	    dataType: "json",
	    async: false,
	    success: function (data, textStatus, request) {
	        var allFiles = data["value"];
	        for (var i = 0; i < allFiles.length; i++) {
	            fileNames.push(allFiles[i]["name"]);
	            fileLinks.push(allFiles[i]["webUrl"]);
	        };
	    }
	});

    if(localStorage.getItem("signedin") == null){
    	out += '<a href="#" id="signOneDrive" class="btn btn-blue">Sign In</a>';
		//out += '<input id="signOneDrive" type="button" value="Signin OneDrive"/>';
	} else {
		out += '<div id="heading" style="margin-left: 1px">Recent Downloads</div>';
		out += '<div id="list4">';
	    
	    for (var i = 0; i < fileNames.length; i++) {
	    	out += '<span><a id="link_' + i+ '" href="' + fileLinks[i] + '" target="_blank">' + fileNames[i] + '</a></span></br>';
	    }

	    out += '</div>';

		out += '<a href="#" id="signOutDrive" class="btn btn-blue">Sign Out</a>';
		//out += '<input id="signOutDrive" type="button" value="Sign Out of OneDrive"/>';
	}

    document.getElementById('main_div').innerHTML = out;

    if(localStorage.getItem("signedin") == null){
		document.getElementById("signOneDrive").onclick = authoriseOneDrive;
	} else {
		document.getElementById("signOutDrive").onclick = signOutOneDrive;
	}
}

function authoriseOneDrive(){
	chrome.identity.launchWebAuthFlow(
	{'url': 'https://login.live.com/oauth20_authorize.srf?client_id=0000000044154892&scope=onedrive.appfolder&redirect_uri=https://ejogoajlecnhkiokfhffloiclmigggmf.chromiumapp.org/provider&response_type=token', 'interactive': true},
	function(redirect_url) {
		var start = redirect_url.indexOf("#");
		var end = redirect_url.indexOf("&token_type");
		var tokenValue = redirect_url.substring(start+14,end);

		localStorage.setItem('token_time', +new Date);

		storedTime = new Date(parseInt(localStorage.getItem('token_time')));
		
		localStorage["signedin"] = 1;
		localStorage["token"]= tokenValue;
		
		displayButtons();
	});

}

function signOutOneDrive(){
	localStorage.clear();
	displayButtons();

	/*$.ajax({
	    type: "GET",
	    url: "https://login.live.com/oauth20_logout.srf?client_id=0000000044154892&redirect_uri=https://ejogoajlecnhkiokfhffloiclmigggmf.chromiumapp.org/provider",
	    success: function(data, textStatus, request) {
	    	alert("Signed Out ..");
	    	alert(localStorage.getItem("signedin"));
	    	
		}});*/
}

displayButtons();