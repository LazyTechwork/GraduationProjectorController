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

document.getElementById("load-config").addEventListener("click", () => {
    ipcRenderer.send("read-config");
});

document.getElementById("save-config").addEventListener("click", () => {
});

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

function updatePanels() {
    panelController.innerHTML = "";
    for (const panelName in APP_DATA.panels) {
        if (!APP_DATA.panels.hasOwnProperty(panelName))
            continue
        const panelData = APP_DATA.panels[panelName];
        const newPanel = examplePanels[panelData.type].cloneNode(true);
        newPanel.classList.remove("d-none");
        newPanel.id = "panel-" + panelName;
        console.log(newPanel);
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

ipcRenderer.on("config", (event, args) => {
    APP_DATA = JSON.parse(args);
    updatePanels();
})

ipcRenderer.send("read-config");