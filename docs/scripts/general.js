/* 
 * general scripts used everywhere 
 */

var options = {
  light: "css/_light.css",
  dark: "css/_dark.css",
  checkSystemScheme: true,
  saveOnToggle: true
};
var DarkMode = new DarkMode(options);

document.getElementById('darkmode-toggle-button').onclick = toggle_dark_mode;

/**
 * toggle_dark_mode()
 * 
 * Toggles the dark mode of the app
 */
function toggle_dark_mode() {
  DarkMode.toggleMode();
}

/**
 *  show_error(error_message:string, error:whatever)
 *  
 *  takes the header element and adds an error banner
 */
function show_error(error_message, error) {
  /* create new node */
  var node = document.createElement('div');
  /* get header */
  var header = document.getElementsByTagName('header')[0];

  /* create node's contents */
  node.innerHTML = '<div class="error">' + error_message + ' <span class="error-close-button" onclick="this.parentElement.style.display=\'none\';">&times;</span></div>';

  /* add node to header */
  header.insertBefore(node, header.firstChild);

  /* debugging */
  console.log(error_message + ': ' + error);
}