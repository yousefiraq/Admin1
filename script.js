import { db, collection, addDoc } from "./firebase-config.js";

document.getElementById("darkModeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});

window.addEventListener('load', () => {
    if (localStorage.getItem("darkMode") === 'true') {
        document.body.classList.add("dark-mode");
    }
});

window.openGoogleMaps = (lat, lng) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
};

window.openWaze = (lat, lng) => {
    window.open(`https://www.waze.com/ul?ll=${lat},${lng}&navigate=yes`, '_blank');
};
