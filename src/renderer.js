import './index.css';
import fs from "fs";

console.log('👋 This message is being logged by "renderer.js", included via webpack');
const {ipcRenderer} = require("electron");
const openButton = document.getElementById("openProjectorWindow");
openButton.addEventListener("click", () => {
    ipcRenderer.send("projector-window");
});
document.getElementById("runProjector").addEventListener("click", () => {
    ipcRenderer.send("run-projector");
});
ipcRenderer.on("projector-window-state", (event, args) => {
    if (args === 'closed')
        openButton.innerHTML = "Открыть проектор";
    else if (args === 'opened')
        openButton.innerHTML = "Закрыть проектор";
})
