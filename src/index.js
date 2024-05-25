import { CMachine } from "./core/Machine.js";

let machine = null;

function init() {
    const canvas = document.getElementById('canvas')
    machine = new CMachine(canvas);
    document.getElementById('start').addEventListener('click', () => start());
    document.getElementById('stop').addEventListener('click', () => stop());
    console.log('OK');
}

function start() {
    console.log('start');
    machine.loop();
}

function stop() {
    machine.cancel();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        init();
    });
} else {
    init();
}
