var darkmode = true;
const css_dark = ["darkblue", "darkred", "darkgreen"];
const css_light = ["lavender", "pink", "mocha"];
var css_index = 0;

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

const settings = document.getElementsByTagName("input");
document.getElementById("settings").addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("Settings changed");
  // FormData is a fraud
  // const formData = new FormData(event.target);
  // add settings to localStorage
  let values = [];
  // For loop saves redundancy and helps with adding settings

  // List of checked radio button names
  let checked_radio = [];
  for (let i = 0; i < settings.length;i++) {
    if (settings[i].type == "text") values.push(settings[i].value);
    else if (settings[i].type == "checkbox") values.push(settings[i].checked);
    else if (settings[i].type == "radio" && !checked_radio.includes(settings[i].name)) {
      const selectedValue = document.querySelector('input[name="default_css"]:checked').value;
      console.log(selectedValue);
      values.push(selectedValue);
      checked_radio.push(settings[i].name);
    }
  }
  
  // let values = [document.getElementById("site_title").value];
  console.log(values);
  localStorage.setItem("settings", values);
});