function loadJsonHelper(callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', './data.json', false);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
};

function loadJsonMain() {
    loadJsonHelper(function(response) {
        data = JSON.parse(response);
        // console.log(data);
        launchList = data["groups"]
        for (let i = 0; i < launchList.length; i++){
            noradIdList[launchList[i]] = data[launchList[i]];
        }
    });
};

function addDivEventListener(divId) {
    // console.log(divId) 

    let sidebarListItem = document.getElementById(`${divId}dropdown`)
    sidebarListItem.classList.toggle('active')   
    if(sidebarListItem.classList.contains('active')){
        return fetch(
            "/satdata/tle?" + new URLSearchParams({
                    launchgroup: divId
                })
        )
            .then((response) => response.json())
            .then((data) => {                
                // console.log(data); // Outputs satJson to browser console
                
                if (data.sat) {
                    let numSats = Object.keys(data.sat).length;
                    
                    for (var i = 0; i < numSats; i++) {
                        
                        // satCountMsg.textContent = '# of satellites tracked: ' + Object.keys(data.sat).length;

                        // satJson = data;

                        while (mapDiv.childElementCount !== 0) {
                            mapDiv.removeChild(mapDiv.lastChild);
                        }
                        let newFrame = document.createElement("iframe");
                        newFrame.id = "iframeMap";
                        newFrame.frameBorder="0";
                        newFrame.scrolling="no";
                        newFrame.marginheight="0";
                        newFrame.marginwidth="0";
                        // newFrame.onload="resizeIframe(this)"
                        newFrame.src="maps.html";
                
                        mapDiv.appendChild(newFrame);
                    }
                
                } else {
                    console.log("Error!");
                };
            })
    }
};

function toggleSideBar() {
    if (document.getElementById("sideBarDiv").className !== document.getElementById("main").className) {
        document.getElementById("main").className = document.getElementById("sideBarDiv").className;
    }
    else {
        document.getElementById("main").classList.toggle('active');
        document.getElementById("sideBarDiv").classList.toggle('active');
    }
};

function addSideBar() {

    let main = document.getElementById("main");

    let sideBarDiv = document.createElement("div");
    main.insertBefore(sideBarDiv, main.firstChild);
    sideBarDiv.id = "sideBarDiv"
    
    let sideBarToggleDiv = document.createElement("div");
    sideBarToggleDiv.id = "sideBarToggleDiv";
    sideBarToggleDiv.className = "toggle"
    sideBarToggleDiv.addEventListener("click", toggleSideBar, false); 
        
    let sideBarToggleSpan = document.createElement("span");
    sideBarToggleSpan.id = "sideBarToggleSpan";
    sideBarToggleSpan.addEventListener("click", toggleSideBar, false); 

    let sideBarList = document.createElement("ul");
    sideBarList.id = "sideBarList";

    let sideBarHeader = document.createElement("div");
    sideBarHeader.id = "sideBarHeader"
    sideBarHeader.innerHTML = `Launch Group List`;
    sideBarList.appendChild(sideBarHeader);

    for (var launchGroupCount = 0; launchGroupCount < launchList.length; launchGroupCount++) {
        
        let newLaunchGroupItem = document.createElement("li");
        newLaunchGroupItem.id = launchList[launchGroupCount];

        let divTag = launchList[launchGroupCount]
        let newLaunchGroupItemDiv = document.createElement("div")
        newLaunchGroupItemDiv.id = `${launchList[launchGroupCount]}Div`;
        newLaunchGroupItemDiv.innerHTML = `${launchList[launchGroupCount]} &blacktriangledown;`
        newLaunchGroupItemDiv.addEventListener('click', function() {
            addDivEventListener(divTag);
        });
        
        // console.log(noradIdList)
        // console.log("a bug says hello");

        newLaunchGroupItemDropdown = document.createElement("ul");
        newLaunchGroupItemDropdown.id = `${launchList[launchGroupCount]}dropdown`

        

        for (let noradIdGroupCount = 0; noradIdGroupCount < noradIdList[`${launchList[launchGroupCount]}`].length; noradIdGroupCount++) {

            let newLaunchGroupItemDropdownItem = document.createElement("li")

            let radioButton = document.createElement("radio");
            radioButton.id = noradIdList[`${launchList[launchGroupCount]}`][noradIdGroupCount];
            radioButton.textContent = `${noradIdList[launchList[launchGroupCount]][noradIdGroupCount]}`

            newLaunchGroupItemDropdownItem.append(radioButton)
            newLaunchGroupItemDropdown.append(newLaunchGroupItemDropdownItem);
            // console.log("a bug2 says hello");
        }

        newLaunchGroupItem.append(newLaunchGroupItemDiv)
        newLaunchGroupItem.append(newLaunchGroupItemDropdown);
        sideBarList.append(newLaunchGroupItem);
    }

    sideBarToggleDiv.append(sideBarToggleSpan.cloneNode(true), sideBarToggleSpan.cloneNode(true), sideBarToggleSpan.cloneNode(true));

    let primaryButtonDiv = document.getElementById("primaryButtonDiv");

    if (document.getElementById("sideBarToggleDiv") == null) {
        primaryButtonDiv.insertBefore(sideBarToggleDiv, primaryButtonDiv.firstChild);
    }
    sideBarDiv.append(sideBarList);
    
    // sideBarDiv.append(sideBarToggleDiv, sideBarList);
};

function resizeIframe(obj) {
    obj.style.height = obj.contentWindow.document.documentElement.scrollHeight + 'px';
};