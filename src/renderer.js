import './index.scss';

let APP_DATA = null;
console.log('👋 This message is being logged by "renderer.js", included via webpack');
const {ipcRenderer} = require("electron");

const openButton = document.getElementById("openProjectorWindow");
openButton.addEventListener("click", () => {
    ipcRenderer.send("projector-window");
});

document.getElementById("updateProjector").addEventListener("click", () => {
    ipcRenderer.send("update-projector");
});

document.getElementById("zoomIn").addEventListener("click", () => {
    ipcRenderer.send("zoom", 0.05);
});
document.getElementById("zoomOut").addEventListener("click", () => {
    ipcRenderer.send("zoom", -0.05);
});
document.getElementById("zoomReset").addEventListener("click", () => {
    ipcRenderer.send("zoom-reset");
});

document.getElementById("load-config").addEventListener("click", () => {
    ipcRenderer.send("read-config");
});

document.getElementById("save-config").addEventListener("click", () => {
    loadFromPanels(true);
});

function activateButtonHandler(event) {
    APP_DATA.panel = event.target.parentElement.querySelector("input[name=slug]").value;
    loadFromPanels(true, true)
}

ipcRenderer.on("projector-window-state", (event, args) => {
    if (args === 'closed')
        openButton.innerHTML = "Открыть проектор";
    else if (args === 'opened')
        openButton.innerHTML = "Закрыть проектор";
});

const panelController = document.getElementById("control-panels");
const examplePanels = {
    countdown: document.getElementById("panel-example-countdown"),
    text: document.getElementById("panel-example-text"),
    action: document.getElementById("panel-example-action"),
};

document.getElementById("add-button").addEventListener("click", () => {
    const slug = document.getElementById("add-slug").value;
    if (APP_DATA.panels[slug])
        return false;
    const type = document.getElementById("add-type").value;
    const newPanel = examplePanels[type].cloneNode(true);
    newPanel.classList.remove("d-none");
    newPanel.id = "panel-" + slug;
    newPanel.querySelector("input[name=slug]").value = slug;
    newPanel.querySelector("input[name=type]").value = type;
    newPanel.querySelector("button.btn-activate").addEventListener("click", activateButtonHandler);
    panelController.appendChild(newPanel);
});

function updatePanels() {
    panelController.innerHTML = "";
    for (const panelName in APP_DATA.panels) {
        if (!APP_DATA.panels.hasOwnProperty(panelName))
            continue
        const panelData = APP_DATA.panels[panelName];
        const newPanel = examplePanels[panelData.type].cloneNode(true);
        newPanel.classList.remove("d-none");
        newPanel.id = "panel-" + panelName;
        newPanel.querySelector("input[name=slug]").value = panelName;
        newPanel.querySelector("input[name=type]").value = panelData.type;
        newPanel.querySelector("button.btn-activate").addEventListener("click", activateButtonHandler);
        switch (panelData.type) {
            case "countdown":
                newPanel.querySelector("input[name=title]").value = panelData.title;
                newPanel.querySelector("input[name=until]").value = panelData.until;
                break;
            case "text":
                newPanel.querySelector("input[name=text]").value = panelData.text;
                break;
            case "action":
                newPanel.querySelector("input[name=artist]").value = panelData.artist;
                newPanel.querySelector("input[name=performance]").value = panelData.performance;
                break;
        }
        panelController.appendChild(newPanel);
    }
}

function loadFromPanels(save = false, updateProjector = false) {
    const NEW_DATA = {panel: APP_DATA.panel, panels: {}}
    for (const form of panelController.querySelectorAll("form")) {
        const inputs = form.querySelectorAll("input");
        const panelData = {};
        for (const input of inputs)
            if (input.getAttribute("name") !== "slug")
                panelData[input.getAttribute("name")] = input.value;
        NEW_DATA.panels[form.querySelector("input[name=slug]").value] = panelData;
    }

    APP_DATA = NEW_DATA;

    if (save)
        ipcRenderer.send("save-config", APP_DATA);
    if (updateProjector)
        ipcRenderer.send("update-projector");
}

ipcRenderer.on("config", (event, args) => {
    APP_DATA = JSON.parse(args);
    updatePanels();
})

ipcRenderer.send("read-config");