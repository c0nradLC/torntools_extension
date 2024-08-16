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

		const rankedWarTimerElement  = document.newElement({ type: "span", class: "countdown" });
		if (factiondata?.ranked_wars) {
			const rankedWarId = Object.keys(factiondata.ranked_wars)[0];
			
			if (rankedWarId <= 0 || !rankedWarId) return; 
			
			const rankedWarStartTime = TO_MILLIS.SECONDS * factiondata.ranked_wars[rankedWarId].war.start;
			const timeLeft = rankedWarStartTime - Date.now();

			if (timeLeft > 0) {
				if (timeLeft <= TO_MILLIS.HOURS * 24)
					rankedWarTimerElement.classList.add('preparation-24hs-remaining');

				rankedWarTimerElement.textContent = formatTime({ milliseconds: timeLeft }, { type: "wordTimer", extraShort: true, showDays: true });
				rankedWarTimerElement.dataset.seconds = timeLeft.dropDecimals();
				rankedWarTimerElement.dataset.end = rankedWarStartTime;
				rankedWarTimerElement.dataset.timeSettings = JSON.stringify({ type: "wordTimer", extraShort: true, showDays: true });

				countdownTimers.push(rankedWarTimerElement);
			}
			else {
				rankedWarTimerElement.textContent = "Ongoing";
				rankedWarTimerElement.classList.add("ongoing");
			}
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

	function removeRankedWarTimer() {
		const rwTimer = document.find("#rankedWarTimer");
		if (rwTimer) rwTimer.remove();
	}
})();