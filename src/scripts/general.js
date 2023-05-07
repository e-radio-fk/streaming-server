/* 
 * general scripts used everywhere 
 */

/**
 *  show_info
 *  
 *  takes the header element and adds an info banner
 */
function show_info(info_message) {
  /* create new node */
  var node = document.createElement('div');
  /* get header */
  var header = document.getElementsByTagName('header')[0];

  /* create node's contents */
  node.innerHTML = '<div class="info-alert">' + info_message + ' <span class="alert-close-button" onclick="this.parentElement.style.display=\'none\';">&times;</span></div>';

  /* add node to header */
  header.insertBefore(node, header.firstChild);
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
  node.innerHTML = '<div class="error-alert">' + error_message + ' <span class="alert-close-button" onclick="this.parentElement.style.display=\'none\';">&times;</span></div>';

  /* add node to header */
  header.insertBefore(node, header.firstChild);

  /* debugging */
  console.log(error_message + ': ' + error);
}

/**
 *  show_green(good_message:string)
 *  
 *  takes the header element and adds a green banner
 */
 function show_green(good_message) {
  /* create new node */
  var node = document.createElement('div');
  /* get header */
  var header = document.getElementsByTagName('header')[0];

  /* create node's contents */
  node.innerHTML = '<div class="green-alert">' + good_message + ' <span class="alert-close-button" onclick="this.parentElement.style.display=\'none\';">&times;</span></div>';

  /* add node to header */
  header.insertBefore(node, header.firstChild);
}