var original_string = "Last Christmas I Gave You My Heart";

function get_container_width()
{
    return document.getElementById('now-playing-banner-object').offsetWidth;
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