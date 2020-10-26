let data = "";
let noradIdList = {}
let launchList = [];
// let satJson = {};

// console.log(launchList);
// console.log(noradIdList);

fetch('/serverRefresh');

let method1 = document.getElementById("method1");
method1.addEventListener("click", function () {

    fetch('/serverRefresh');

    loadJsonMain()  
    
    let main = document.getElementById("main");
    if (document.getElementById("sideBarDiv")) {
        main.removeChild(document.getElementById("sideBarDiv"));
    }

    if (document.getElementById("root").style.display !== "none") {
        document.getElementById("root").style.display ="none"
    }

    let mainDiv = document.getElementById("mainDiv");
    while (mainDiv.childElementCount !== 0) {
        mainDiv.removeChild(mainDiv.lastChild);
    }

    let mapDiv = document.getElementById("mapDiv");
    while (mapDiv.childElementCount !== 0) {
        mapDiv.removeChild(mapDiv.lastChild);
    }

    addSideBar();
    toggleSideBar()

    let newFrame = document.createElement("iframe");
    newFrame.id="iframeMap";
    newFrame.frameBorder="0";
    newFrame.scrolling="no";
    newFrame.marginheight="0";
    newFrame.marginwidth="0";
    newFrame.src="maps.html";
    mapDiv.appendChild(newFrame);
});

// method2 event listener with React.js
let method2 = document.getElementById("method2");
method2.addEventListener("click", function () {
    
    fetch('/serverRefresh');
    if (document.getElementById("sideBarToggleDiv")) {
        document.getElementById("sideBarToggleDiv").remove();
    }

    let main = document.getElementById("main");
    if (document.getElementById("sideBarDiv")) {
        main.removeChild(document.getElementById("sideBarDiv"));
    }

    let rootReact = document.getElementById("root");
    rootReact.style.display = "inline"
    // while (rootReact.childElementCount !== 0) {
    //     rootReact.removeChild(rootReact.lastChild);
    // }

    let mainDiv = document.getElementById("mainDiv");
    while (mainDiv.childElementCount !== 0) {
        mainDiv.removeChild(mainDiv.lastChild);
    }

    let mapDiv = document.getElementById("mapDiv");
    while (mapDiv.childElementCount !== 0) {
        mapDiv.removeChild(mapDiv.lastChild);
    }

    loadJsonMain()

    document.getElementById("main").classList.remove("active");

    // addSideBar();

    // toggleSideBar();
});

let userNameInput = document.getElementById("username");
let passwordInput = document.getElementById("password");
userNameInput.addEventListener("click", function() {
    alert("PLEASE don't use an actual username/password");
}, {once : true});

let method3 = document.getElementById("method3");
method3.addEventListener("click", function() {
    return fetch("/getUser?" + new URLSearchParams({
        name : userNameInput.value,
        pass : passwordInput.value
    })).then(function (response){
        return response.json();
    }).then(function (data){
        if(Array.isArray(data) && data.length){
            name = data[0].name;
            alert("Welcome "+name);
        }
        else{
            alert("User not found. Please try again.");
        }
    }).catch(function (error) {
        console.log(error);
    });
});

let method4 = document.getElementById("method4");
method4.addEventListener("click", function() {
    return fetch("/newUser?" + new URLSearchParams({
        name : userNameInput.value,
        pass : passwordInput.value
    })).then(function (response){
        return response.json();
    }).then(function (data){
        if(data.hasOwnProperty("code")){
            throw data;
        }
        console.log(data);
        method3.click();
    }).catch(function (error) {
        if(error.code === "23502"){
            alert("No entry for username and/or password.");  
        }
        else if(error.code === "23505"){
            alert("Username is already taken. Try another one.");
        }
        else {
            alert("Unknown error IDK.");
        }
    });
});

