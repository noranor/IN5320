window.sessionStorage;

//const countryList = document.getElementById("countryList");
let searchWord = document.getElementById("search");
let inputArray = [];


function addUserInput(){
    let input = document.getElementById("userInput").value; 
    const countryList = document.getElementById("countryList"); 
        //li = document.createElement("li"), 
    let inputTxt = document.createTextNode(input);
    
    inputArray.push(input);
    console.log(inputArray);
    let li = addLiToUl(inputTxt, countryList);
    addButtonToLi(li);
    
    //const button = document.createElement("button");
    //button.innerHTML=" X";
    
    //li.appendChild(inputTxt);
    //li.appendChild(button);
    //countryList.appendChild(li);
    console.log("listen = " + countryList.value);

    offlineStorage(inputArray, myFunction);

    document.getElementById("userInput").value = "";

    /*button.addEventListener("click", function(e){
        button.parentNode.parentNode.removeChild(button.parentNode);
        inputArray.splice(inputArray.indexOf(button.parentNode));*/
        // Doesn't work
        //sessionStorage.removeItem(e)

        console.log(inputArray);
    /*});*/
}

 function addLiToUl(input, list){
     let li = document.createElement("li");
     li.value = input;

     list.appendChild(input);
     /*let items = document.querySelectorAll("#countryList li");
     let indexArray = [], index;

     for(let i = 0; i > items.length; i++){
         indexArray.push(items[i].innerHTML);
     }
     index = indexArray.indexOf(input);*/

     console.log(countryList[countryList.length - 1]);
 }

 function addButtonToLi(li){
    const button = document.createElement("button");
    button.innerHTML=" X";

    li.appendChild(button);
    button.addEventListener("click", function(e){
        button.parentNode.parentNode.removeChild(button.parentNode);
        inputArray.splice(inputArray.indexOf(button.parentNode));
        // Doesn't work
        //sessionStorage.removeItem(e.value);
    });
 }

function offlineStorage(inputArray, myFunction){
    for(let i = 0; i < inputArray.length; i++){
        console.log("Running myFunction, sessionStorage for " + inputArray[i]);
        myFunction(inputArray[i]);
    }
}

function myFunction(e){
    if (typeof(Storage) !== "undefined") {
         sessionStorage.setItem(e, JSON.stringify(e));  
    } else {
        alert("No web storage support.")
    }
}

function isSearchTrue(element, searchWord){
    if(element.startsWith(searchWord)){
        console.log("OK2");
        return true;
    }else{
        return false;
    }
}

function searchFor(){
    let matches = [];
    let searchWord = JSON.stringify(document.getElementById("searchInput").value);
    //kan prøve countryList.childNodes;
    let allLi = JSON.stringify(document.querySelectorAll('#countryList li'));

    for(let i = 0; i <= allLi.length - 1; i++){
        console.log(allLi);
        if(isSearchTrue(allLi[i], searchWord)){
            matches.push(allLi[i]);
            console.log(element.innerText.replace("X", "") + " har blitt lagt til som mulige treff på søkeord.");
        }
    }
    return matches;
}
