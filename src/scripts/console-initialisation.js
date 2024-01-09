var database;

const initialise_console_page = () => {
	/*
	 * Page Initialisation
	 */
	try {
		/* construct photo path */
		var serverFilePath = "/" + user.uid + "/user_photo";
		var photoURL = "https://eradiofk.sirv.com" + serverFilePath;

		console.log("got photo: ", photoURL);

		var userPhoto = document.getElementById("banner-user-img");

		if (photoURL) userPhoto.style.borderRadius = "35%";

		/* set user photo */
		userPhoto.src = photoURL;
	} catch (error) {
		console.log(error);
	}

	/*
	 * Modals Initialisation & Configuration
	 */

	try {
		// TODO:
		/* on modal exit, all elements must be reverted to normal */

		/*
		 *  Initialise MCDatepicker
		 */
		/* create */
		const datePicker = MCDatepicker.create({
			el: "#podcast-datepicker",
			bodyType: "modal",
		});

		/* hack: on open, quickly change z-index (>= 1061) so that calendar shows up above any bootstrap modal */
		datePicker.onOpen(() => {
			document.getElementsByClassName("mc-calendar--modal")[0].style.zIndex =
				"1062";
		});
		/* on OK button, save the date on a label element */
		datePicker.onSelect((date, formatedDate) => {
			document.getElementById("podcast-date-picked-label").innerHTML =
				formatedDate;
		});
	} catch (error) {
		console.log(error);
	}

	/*
	 * Initialise Firebase Realtime Database
	 */
	try {
		database = firebase.database();

		/*
		 * Fill contents of the start-podcast dropdown
		 */
		const start_podcast_dropdown_content = $("#start-podcast-dropdown-content");

		database
			.ref()
			.child("/scheduled-podcasts")
			.get()
			.then((snapshot) => {
				if (!snapshot.exists()) throw "Failed to get snapshot!";

				const json = snapshot.val();
				if (!json) throw "Failed to get json";

				Object.keys(json).forEach((key) => {
					const currentPodcast = json[key];

					if (currentPodcast) {
						var title = currentPodcast["title"];
						var podcast_id = currentPodcast["id"];

						/* skip erroneous */
						if (title && podcast_id)
							start_podcast_dropdown_content.append(
								$("<p>")
									.text(title)
									.addClass("dropdown-content-button")
									.click(() => {
										start_podcast(currentPodcast);
									})
							);
					}
				});
			})
			.catch((error) => {
				console.error(
					"Error getting a list of week's scheduled podcasts: " + error
				);
			});
	} catch (error) {
		console.log(error);
	}
};

initialise_console_page();
