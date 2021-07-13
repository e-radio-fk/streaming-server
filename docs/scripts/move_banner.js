try
{
    var original_string = Cookies.get('now-playing');
    if (!original_string)
    {
        console.error('Failed to get the now-playing cookie!');
        throw new Error('Failed to get the now-playing cookie!');
    }

    document.getElementById('now-playing-banner-text').innerText = original_string;

    function get_container_width()
    {
        // The banner now contains the User Photo; we need to subtract its width!
        var user_photo_width = 33;  // 33px

        return document.getElementById('now-playing-banner-object').offsetWidth - user_photo_width;
    }

    function move_banner()
    {
        var before = 0;
        var after = 0;
        
        string_off = document.getElementById('now-playing-banner-text').offsetWidth;

        // get old position
        before = parseInt(document.getElementById('now-playing-banner-text').style.paddingLeft || 0, 10);

        // make sure text will 'cycle'
        if (string_off + 100 >= get_container_width())
        {
            var text = document.getElementById('now-playing-banner-text').textContent;

            if (text.length == 0)
            {
                before = 0;
                text = original_string;
            }
            else
                text = text.substr(0, text.length - 2)

            document.getElementById('now-playing-banner-text').textContent = text;
        }

        // increment position index
        after = before + 1 + "%";

        // set new position
        document.getElementById('now-playing-banner-text').style.paddingLeft = after;

        // make this a recurring function
        setTimeout(move_banner, 110);
    }

    move_banner();
}
catch (e)
{
    console.error('Error getting now-playing: ' + e);
}