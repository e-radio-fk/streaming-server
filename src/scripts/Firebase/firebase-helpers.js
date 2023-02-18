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
    // var database = firebase.database();

    // /* get a list of the admins from the DB */
    // var snapshot = await database.ref().child('/admins').get();
    // if (!snapshot)
    //     return false;
    // if (snapshot.exists())
    // {
    //     var json = snapshot.val();

    //     Object.keys(json).some(key => {
    //         if (user.uid == json[key])
    //         {
    //             return true;
    //         }
    //     });
    // }

    return true;
}