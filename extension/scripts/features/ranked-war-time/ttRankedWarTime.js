"use strict";

(async () => {
    const devices = await checkDevice();
    if (devices.mobile || devices.tablet) return "Not supported on mobiles or tablets!";

    featureManager.registerFeature(
        "Ranked war timer",
        "sidebar",
        () => settings.pages.sidebar.rankedWarTimer && (factiondata?.ranked_wars ?? false),
        null,
        showRankedWarTimer,
		removeRankedWarTimer,
		{
			storage: ["settings.pages.sidebar.rankedWarTimer", "factiondata.ranked_wars"],
		},
		() => {
			if (!hasAPIData()) return "No API access.";
            else if (!factiondata) return "You are not in a faction.";
			else if (!factiondata.ranked_wars) return "There are no current ranked wars on your faction.";
		}
    );

    async function showRankedWarTimer() {
		await requireSidebar();

		removeRankedWarTimer();
		addInformationSection();
		showInformationSection();

		if (factiondata?.ranked_wars) {
			const rankedWarTimerElement  = document.newElement({ type: "span", class: "countdown" });
			const rankedWarId = Object.keys(factiondata.ranked_wars)[0];
			
			if (rankedWarId > 0) {
				const rankedWarStartTime = TO_MILLIS.SECONDS * factiondata.ranked_wars[rankedWarId].war.start;
				const rankedWarEndTime = factiondata.ranked_wars[rankedWarId].war.end;
				let timeLeft = 0;

				if (rankedWarEndTime === 0) {
					timeLeft = rankedWarStartTime - Date.now();

					if (timeLeft <= TO_MILLIS.HOURS * 24)
						rankedWarTimerElement.classList.add('preparation-24hs-remaining');

					rankedWarTimerElement.textContent = formatTime({ milliseconds: timeLeft }, { type: "wordTimer", extraShort: true, showDays: true });
					rankedWarTimerElement.dataset.end = rankedWarStartTime;
				}
				else {
					timeLeft = rankedWarEndTime - Date.now();

					if (timeLeft <= TO_MILLIS.HOURS * 12)
						rankedWarTimerElement.classList.add('ongoing-12hs-remaining');
					else if (timeLeft <= TO_MILLIS.HOURS * 24)
						rankedWarTimerElement.classList.add('ongoing-24hs-remaining');

					rankedWarTimerElement.textContent = formatTime({ milliseconds: timeLeft }, { type: "wordTimer", extraShort: true, showDays: true });
					rankedWarTimerElement.dataset.end = rankedWarEndTime;
				}

				rankedWarTimerElement.dataset.seconds = timeLeft.dropDecimals();
				rankedWarTimerElement.dataset.timeSettings = JSON.stringify({ type: "wordTimer", extraShort: true, showDays: true });

				countdownTimers.push(rankedWarTimerElement);
			}
			else rankedWarTimerElement.textContent = "No current Ranked War.";

			document.find(".tt-sidebar-information").appendChild(
				document.newElement({
					type: "section",
					id: "rankedWarTimer",
					children: [
						document.newElement({ type: "a", class: "title",
							text: "RW: ", href: LINKS.rankedWar }),
						rankedWarTimerElement,
					],
				})
			);
		}
	}

	function removeRankedWarTimer() {
		const rwTimer = document.find("#rankedWarTimer");
		if (rwTimer) rwTimer.remove();
	}
})();