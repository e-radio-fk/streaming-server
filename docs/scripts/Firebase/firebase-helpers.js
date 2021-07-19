/* isAdmin(user)
 *
 * takes a firebase `user` object and 
 * compares its uid to the uid of each of
 * the administrators stored inside the DB!
 * 
 * returns:
 *  true if admin
 *  false if not
 */
async function isAdmin(user)
{
    var database = firebase.database();
    var result = false;
    var gotDBReply = false;

    /* get a list of the admins from the DB */
    var snapshot = await database.ref().child('/admins').get();

    if (snapshot.exists())
    {
        var json = snapshot.val();

        Object.keys(json).forEach(key => {
            if (user.uid == json[key])
            {
                result = true;
                // TODO: break;
            }
        });
    }

    return result;
}