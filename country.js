window.sessionStorage;

const countryList = document.getElementById("countryList");
let searchWord = document.getElementById("search");
let inputArray = [];


function addUserInput(){
    let input = document.getElementById("userInput").value,  
        li = document.createElement("li"), 
        inputTxt = document.createTextNode(input);
    
    inputArray.push(input);
    console.log(inputArray);
    
    const button = document.createElement("button");
    button.innerHTML=" X";
    
    li.appendChild(inputTxt);
    li.appendChild(button);
    countryList.appendChild(li);

    offlineStorage(inputArray, myFunction);

    document.getElementById("userInput").value = "";

    button.addEventListener("click", function(e){
        button.parentNode.parentNode.removeChild(button.parentNode);
        inputArray.splice(inputArray.indexOf(button.parentNode));
        // Doesn't work
        sessionStorage.removeItem(e)

        console.log(inputArray);
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

function searchFor(){
    let matches = [];
    let searchWord = document.getElementById("searchInput").value;
    let liElements = document.querySelectorAll("li");

    $("#countryList li").each((id, element) => {
        console.log(element.innerText.replace("X", ""));
    });


}
