/* 
 * general scripts used everywhere 
 */

const options = {
  backgroundColor: '#4a2cb4',  // default: '#fff'
  time: '0.5s',
  autoMatchOsTheme: true
}

const darkmode =  new Darkmode(options);

/**
 * toggle_dark_mode()
 * 
 * Toggles the dark mode of the app
 */
function toggle_dark_mode() {
  darkmode.toggle();
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