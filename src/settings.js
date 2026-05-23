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