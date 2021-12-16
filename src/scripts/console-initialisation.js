function initialise_console_page()
{
    /*
     * Page Initialisation
     */

    /* construct photo path */
    var serverFilePath = '/' + user.uid + '/user_photo';
    var photoURL = 'https://eradiofk.sirv.com' + serverFilePath;
    
    console.log('got photo: ', photoURL);
    
    var userPhoto = document.getElementById('banner-user-img');
    
    if (photoURL)
        userPhoto.style.borderRadius = '35%';
    
    /* set user photo */
    userPhoto.src = photoURL;
    
    /* initialisation has finished; show the UI */
    document.getElementsByTagName('header')[0].style.visibility = 'visible';
    document.getElementsByTagName('body')[0].style.visibility = 'visible';

    /* dropdowns */
    var dropdown = document.getElementsByClassName('dropdown');
    for (const dropdownElement of dropdown)
    {
        dropdownElement.onclick = () => {
            var dropdown_content = dropdownElement.getElementsByClassName('dropdown-content')[0];

            var clicked = dropdownElement.getAttribute('clicked');
            if (clicked == 'yes')
            {
                dropdownElement.setAttribute('clicked', 'no');
                dropdown_content.style.display = 'none';
            }
            else
            {
                dropdownElement.setAttribute('clicked', 'yes');
                dropdown_content.style.display = 'block';
            }
        };
    }

    /* 
     * Modals Initialisation & Configuration 
     */

    // TODO:
    /* on modal exit, all elements must be reverted to normal */

    /*
     *  Initialise MCDatepicker 
     */
    /* create */
    const datePicker = MCDatepicker.create({
        el: '#podcast-datepicker',
        bodyType: 'modal'
    });

    /* hack: on open, quickly change z-index (>= 1061) so that calendar shows up above any bootstrap modal */
    datePicker.onOpen(() => {
        document.getElementsByClassName('mc-calendar--modal')[0].style.zIndex = "1062";
    });
    /* on OK button, save the date on a label element */
    datePicker.onSelect((date, formatedDate) => {
        document.getElementById('podcast-date-picked-label').innerHTML = formatedDate;
    });

    /*
     * Initialise Firebase Realtime Database
     */
    var database = firebase.database();

    /*
     * Fill contents of the start-podcast dropdown
     */
    var start_podcast_dropdown_content = document.getElementById('start-podcast-dropdown-content');
    if (start_podcast_dropdown_content)
    {
		database.ref().child('/scheduled-podcasts').get().then((snapshot) => {
			if (snapshot.exists())
			{
                function html(podcast_title, podcast_id)
                {
                    var html = "<p class='dropdown-content-button' onclick='start_podcast('" + podcast_id + "')'>" + podcast_title + "</p>"
                    return html;
                }

                var inner_html;
				var json = snapshot.val();

                if (json)
                {
                    Object.keys(json).forEach(key => {
                        var element = json[key];
    
                        if (element)
                        {
                            var title      = element['title'];
                            var podcast_id = element['id'];
        
                            /* skip erroneous */
                            if (title && podcast_id)
                                inner_html += html(title, podcast_id);
                        }
                    });
    
                    start_podcast_dropdown_content.innerHTML += inner_html;
                }
            }
            else
            {
                // show_error('Δεν έχουν προγραμματιστεί podcast για αυτή τη βδομάδα! Μπορείς να ξεκινήσεις νέο!', '');
            }
        }).catch((error) => {
            console.error('Error getting a list of week\'s scheduled podcasts: ' + error);
        });
    }
}

initialise_console_page();