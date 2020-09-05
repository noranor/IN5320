window.sessionStorage;

const countryList = document.getElementById("countryList");
 // Array with the elements to keep track of elements in Console and add elements in browser storage.
let inputArray = [];

/*
    Takes the user input, creates an element (li) and assert the user input to the element. Then the function creates a button that enables a delete function to the element.

    parameters: N/A
    return: N/A
*/ 
function addUserInput(){
    let input = document.getElementById("userInput").value,  
        li = document.createElement("li"), 
        inputTxt = document.createTextNode(input);
    
    inputArray.push(input);
    console.log(inputArray);
    
    // Creates a button with text "X".
    const button = document.createElement("button");
    button.innerHTML=" X";
    
    // Adds user input to element (li), then button to element and lastly element to a list of all elements, countryList (ul).
    li.appendChild(inputTxt);
    li.appendChild(button);
    countryList.appendChild(li);

    offlineStorage(inputArray);

    // Resets the user input, essentially removing input from textbox after processed.
    document.getElementById("userInput").value = "";


    // Adds delete-function to the button created above. 
    button.addEventListener("click", function removeButton(e){
        button.parentNode.parentNode.removeChild(button.parentNode);
        inputArray.splice(inputArray.indexOf(button.parentNode));
        // Removes element from browser storage.
        // FIX: Doesn't work yet.
        sessionStorage.removeItem(e)

        console.log(inputArray);
    });
}

/*
    Iterates through elements (string) in inputArray and runs function setBrowserStorage() on them.
    
    parameters: inputArray - Array[text]
    return: N/A
*/ 
function offlineStorage(inputArray){
    for(let i = 0; i < inputArray.length; i++){
        console.log("Running setBrowserStorage, sessionStorage for " + inputArray[i]);
        setBrowserStorage(inputArray[i]);
    }
}

/*
    Checks if browser supports for localStorage or sessionStorage. If not browser will return "undefined" to this function and it will not be execued (elements will not be stored). If function does find support for Storage it will add an element (string) to sessionStorage.

    parameters: element (String)
    return: N/A
*/
function setBrowserStorage(element){
    if (typeof(Storage) !== "undefined") {
         sessionStorage.setItem(element, JSON.stringify(element));  
    } else {
        alert("No web storage support.")
    }
}

/*
    Enables a search function that takes in input from user, iterates through value (String) of elements (li) in countryList (ul) and checks if the user input match any of the elements. Lastly the function retuns all elements that match user input.
    
    parameters: countryList (ul)
    return: matches (Array)     ------ ????
*/
function searchFor(countryList, searchTerm){
    // Store matching list elements
    let matches = [];
    // Fetch the search term value from the search input box, and convert to lower case
    //let searchTerm = document.getElementById("searchInput").value.toLowerCase();

    console.log("I am searching for: ", searchTerm)
    // Loop through country list and find matches
    for (let i = 0; i < countryList.getElementsByTagName("li").length; i++){
        let current = countryList.getElementsByTagName("li")[i].firstChild;
        //let currentLowerCase = current.toLowerCase();

        console.log("(", i, ")", "Is ",current.textContent, "a match?");

        // Checks if lowercase-forced current element in countryList starts with same characters as searchTerm and shows the element if it does.
        if (current.textContent.toLowerCase().startsWith(searchTerm)){
            console.log("Yes!");
            matches.push(current.textContent);
            if(current.textContent.toLowerCase().indexOf(searchTerm) == 0){
                current.style.display="none";
            }else{
                current.display="none";
            }
        }
    }
    console.log(matches)
}

/*
    Function that activates when a keyboard key is released in the search input field. The function will run the searchFor()-function.
*/ 
$('#searchInput').keyup(function() {
    let input = this.value.toLowerCase();
        //length  = this.value.length;

    searchFor(document.getElementById("countryList"), input);
    //let liText = $(this).text(),
            //li = $(this),
            //htmlR = current.substr(0, length);
        //liTextLowerCase.indexOf(input) == 0) ? $(this).html(htmlR).show() : $(this).hide();
    //});
});
