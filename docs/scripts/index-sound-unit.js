/*
 *  Αυτό είναι το υποσύστημα που κάνει τη 
 *  - μίξη μικροφώνου με μουσική,
 *  - αύξηση/μείωση volume
 *  - αλλαγή του κομματιού (music track) που παίζει τώρα
 *
 *  Για να γίνουν τα παραπάνω, χρειαζόμαστε συγκεκριμένα events που θα
 *      περνούν μέσα από το stream.io!
 * 
 *  H βασική λειτουργία του παρόντος υποσυστήματος θα είναι η προώθηση μουσικής (music track)
 *      στους e-radio clients (ακροατές).  Αυτό θα γίνεται με το event RADIO_SESSION_STARTING
 *      για την εκκίνηση του e-radio και στη συνέχεια με MUSIC_TRACK_DATA για απόκτηση δεδομένων,
 *      MUSIC_TRACK_VOLUME για αύξηση/μείωση ήχου και MICROPHONE_SESSION_STARTING/STOPPING για
 *      προειδοποίηση ότι πρόκειται να λάβουμε δεδομένα από το μικρόφωνο (MICROPHONE_DATA) ώστε
 *      να γίνει η μίξη σε πραγματικό χρόνο!
 *  
 *  Έτσι διακρίνουμε τα events:
 *      RADIO_SESSION_STARTING
 *      RADIO_SESSION_STOPPING
 * 
 *      MUSIC_TRACK_START
 *      MUSIC_TRACK_DATA
 *      MUSIC_TRACK_VOLUME
 *      MUSIC_TRACK_STOP
 * 
 *      MICROPHONE_SESSION_STARTING
 *      MICROPHONE_SESSION_STOPPING
 * 
 *      MICROPHONE_DATA
 * 
 *  Το βασικό πρόβλημα με τη συγκεκριμένη μέθοδο είναι ότι πρέπει οι αλλαγές στον ήχο, η μίξη και η αλλαγή
 *      της μουσικής να γίνονται on-demand, πράγμα που ίσως και να είναι αδύνατον εάν σκεφτούμε ότι στέλνουμε
 *      κβαντισμένη πληροφορία.
 */

exports.sound_unit = class {
    constructor(socket, io) {
        console.log('server: sound_unit init');

        // got microphone data from the console; broadcast to all clients!
        socket.on('console-mic-chunks', data => {
            io.emit('microphone-data-chunk', data);
        })

        socket.on('MUSIC_TRACK_START', song => {
            console.log('server: broadcasting call to play song!');
            io.emit('MUSIC_TRACK_START', song);
        });

        socket.on('MUSIC_TRACK_STOP', () => {
            io.emit('MUSIC_TRACK_STOP');
        });
    }
}