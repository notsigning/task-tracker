var currPage = 0;
var file = "page" + currPage;
var title = "title" + currPage;
const displayElem = document.getElementById("displaybox");
const titleElem = document.getElementById("title");
const default_title = "New Page";
const default_content = "New content";
var MAX_PAGES = 5;
var darkmode = true;
const css_dark = ["darkblue", "darkred", "darkgreen"];
const css_light = ["lavender", "pink", "mocha"];
var css_index = 0;

/*

FUNCTIONS

*/

function check() {
    if (displayElem.innerHTML == default_content && titleElem.innerHTML == default_title) return true;
    if (displayElem.innerHTML != localStorage.getItem(file) || titleElem.innerText != localStorage.getItem(title)) {
        return confirm("Unsaved changes! Continue?");
    } else return true;
}
function darkShift() {
    darkmode = !darkmode;
    if (darkmode) document.body.className = css_dark[css_index];
    else document.body.className = css_light[css_index];
    localStorage.setItem("darkmode",darkmode);
}
function cssChange() {
    css_index++;
    css_index %= css_dark.length;
    //document.getElementById("css_thing").href = "CSS/" + css[css_index];
    if (darkmode) document.body.className = css_dark[css_index];
    else document.body.className = css_light[css_index];
    localStorage.setItem("css_index",css_index);
}
/*
Updates display without modifying page numbers/count.
*/
function update() {
  file = "page" + currPage;
  title = "title" + currPage;
  const content = localStorage.getItem(file);
  const titlecontent = localStorage.getItem(title);
  if (content != null) {
      displayElem.innerHTML = content;
  } else {
      displayElem.innerHTML = default_content;
  }
  if (titlecontent != null) {
      titleElem.innerHTML = titlecontent;
  } else {
      titleElem.innerHTML = default_title;
  }
  document.getElementById("header").innerHTML = "Page: " + (currPage + 1);
}
/*
Loads Content from localStorage & updates display.
*/
function load() {
    //update page
    //console.log("Going to page " + (currPage+1));
    const page_temp = localStorage.getItem("MAX_PAGES");
    if (page_temp != null) {
        MAX_PAGES = page_temp;
    }
    else MAX_PAGES = 5;
    update();
}
/*
Shifts a page a certain number of times.
*/
function shift(i) {
    if (check()) {
        if (currPage + i < 0) { //loop back
            currPage = MAX_PAGES - 1;
        } else if (currPage + i >= MAX_PAGES) {
            if (confirm("Create new page?")) {
                currPage += i;
                MAX_PAGES = parseInt(MAX_PAGES) + 1;
            }
        } else {
            currPage += i;
        }
        update();
        document.getElementById("savemsg").innerHTML = "";
    }
}
/*
Save the current page.
*/
function save() {
    localStorage.setItem(file, document.getElementById("displaybox").innerHTML);
    localStorage.setItem(title, document.getElementById("title").innerHTML);
    localStorage.setItem("MAX_PAGES", MAX_PAGES);
    document.getElementById("savemsg").innerHTML = "Last saved: " + Date().slice(16, 25);
}
/*
Resets the current page.
*/
function resetPage() {
    if (confirm("Are you sure?")) {
        localStorage.removeItem(file);
        localStorage.removeItem(title);
        load();
    }
}
/*
Adds a list into the content container.
*/
function addList() {
    displayElem.innerHTML += "<ul><li>Sample Item</li></ul>";
}
/*
Basically an update() function for the menu interface
*/
function updateMenu() {
  for (let i = 0; i < MAX_PAGES; i++) {
    const title = localStorage.getItem("title" + i);
    if (title) {
      buttons[i].innerText = i + 1 + ": " + title;
    }
  }
}
/*
Display the menu interface.
*/
function showMenu() {
  updateMenu();
  document.getElementById("menu").hidden = false;
  document.getElementById("main").hidden = true;
}

/*
Swap Functions (No interface but usable with browser consoles)
NOTE: Do not use zero-based indexing while calling this function.
*/

/*
Swaps the content of a given page and the current page. 
*/
function swapCurrPage(page_index) {
  if (document.getElementById("main").hidden) {
    alert("Please select a page before swapping.")
  }
  else {
    swapPages(currPage + 1,page_index);
  }
}
/*
Swaps two pages given their indices
*/
function swapPages(index1, index2) {
  index1--; index2--;
  let title1 = localStorage.getItem("title" + index1);
  let content1 = localStorage.getItem("page" + index1);
  let title2 = localStorage.getItem("title" + index2);
  let content2 = localStorage.getItem("page" + index2);
  if (!title1 || !content1 || !title2 || !content2) {
    alert("Error in swapping: Other page has nothing saved.")
  }
  else {
    save();
    localStorage.setItem("title" + index2, title1);
    localStorage.setItem("page" + index2, content1);
    localStorage.setItem("title" + index1, title2);
    localStorage.setItem("page" + index1, content2);
    update();
  }
  updateMenu();
}
//Add a button to the menu
function addMenuButton(num) {
  buttons.push(document.createElement("button"));
  buttons[num].id = num;
  const title = localStorage.getItem("title" + num);
  if (title) {
    buttons[num].innerText = num + 1 + ": " + title;
  }
  else {
    buttons[num].innerText = num + 1 + ": New Page";
  }
  buttons[num].addEventListener("click", (event) => {
      currPage = parseInt(event.target.id);
      document.getElementById("menu").hidden = true;
      document.getElementById("main").hidden = false;
      load();
  });
  buttons[num].className = "main_button";
  menu.appendChild(buttons[num]);
  let newline = document.createElement('br');
  menu.appendChild(newline);
}

// Convert all text into a javascript object
function getAllText() {
  let page_titles = [];
  let page_contents = [];
  for (let i = 0; i < MAX_PAGES; i++){
    page_titles.push(localStorage.getItem("title" + i));
    page_contents.push(localStorage.getItem("page" + i));
  }
  let all_content = {
    MAX_PAGES: MAX_PAGES,
    page_titles: page_titles,
    page_contents: page_contents
  };
  if (confirm("Copy the object?")) {
    copy(JSON.stringify(all_content));
  }
  console.log(JSON.stringify(all_content));
}
// Reverse the process to load everything
function parseAllText_str(s) {
  let all_text = JSON.parse(s);
  parseAllText(all_text);
}
// Parse it in object form
function parseAllText(all_text) {
  if (all_text) {
    if (all_text["MAX_PAGES"] && all_text["page_titles"] && all_text["page_contents"]) {
      localStorage.setItem("MAX_PAGES", all_text["MAX_PAGES"]);
      for (let i = 0; i < all_text["MAX_PAGES"]; i++){
        if (all_text["page_titles"][i]) {
          localStorage.setItem("title"+i, all_text["page_titles"][i]);
        }
        if (all_text["page_contents"][i]) {
          localStorage.setItem("page"+i, all_text["page_contents"][i]);
        }
      }
      window.location.reload();
    }
    else {
      alert("Cannot parse given object for strings");
    }
  }
}


/*

INITIALIZATION

(TODO: Optimize to reduce the brief moment in which css is briefly default and buttons are unloaded)

*/


// Test if settings are available, and load them
const imported_settings = localStorage.getItem("settings")
if (imported_settings) {
  document.getElementById("page_title").innerText = imported_settings.substring(0, imported_settings.search(","));
  //document.body.className()
}

// Load style based on what's saved from previous session
// Reminder: Optimize lines 225, 226 since they repeat from darkShift() and cssChange()
const darkmode_saved = localStorage.getItem("darkmode");
if(darkmode_saved){
    darkmode = (darkmode_saved === "true" ? true:false);
}
const color_saved = localStorage.getItem("css_index");
if(color_saved){
    css_index = parseInt(color_saved);
}
if (darkmode) document.body.className = css_dark[css_index];
else document.body.className = css_light[css_index];

// Initialize Keybinds
document.addEventListener("keydown", (event) => {
    if (event.key === "s" && (event.ctrlKey || event.metaKey)) {
        save();
        event.preventDefault(); //prevent saving current page
    }
});


// Filter index parameter
const params = new URLSearchParams(window.location.search);
if (params.get('index')) {
    currPage = parseInt(params.get('index'));
}


// Load initial number of pages
const page_temp = localStorage.getItem("MAX_PAGES");
if (page_temp != null) {
    MAX_PAGES = page_temp;
}
else MAX_PAGES = 5;


//Add buttons to menu
const menu = document.getElementById("buttons")
var buttons = [];
for (var i = 0; i < MAX_PAGES; i++) {
  addMenuButton(i);
}
//Display menu on start.
showMenu();

// let test_input = parseInt(prompt("Hello world!"));
// if(test_input) console.log(test_input);