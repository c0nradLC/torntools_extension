"use strict";

function addInformationSection() {
    if (document.find(".tt-sidebar-information")) return;

    const parent = document.find("#sidebarroot div[class*='user-information_'] div[class*='toggle-content_'] div[class*='content_']");

    parent.appendChild(document.newElement({ type: "hr", class: "tt-sidebar-information-divider tt-delimiter tt-hidden" }));
    parent.appendChild(document.newElement({ type: "div", class: "tt-sidebar-information tt-hidden" }));
}

function showInformationSection() {
    document.find(".tt-sidebar-information-divider").classList.remove("tt-hidden");
    document.find(".tt-sidebar-information").classList.remove("tt-hidden");
}