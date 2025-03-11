import { db, collection, addDoc, serverTimestamp } from "./firebase-config.js";

document.getElementById("darkModeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});

window.addEventListener('load', () => {
    if (localStorage.getItem("darkMode") === 'true') {
        document.body.classList.add("dark-mode");
    }
});

const platform = new H.service.Platform({
    apikey: "7kAhoWptjUW7A_sSWh3K2qaZ6Lzi4q3xaDRYwFWnCbE"
});

window.showOrderMap = (lat, lng) => {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        height: 70vh;
        background: white;
        z-index: 1000;
        border-radius: 15px;
        box-shadow: 0 0 25px rgba(0,0,0,0.2);
        overflow: hidden;
    `;

    modal.innerHTML = `
        <div id="mapContainer" style="height: 100%; width: 100%;"></div>
        <button 
            onclick="this.parentElement.remove()" 
            style="
                position: absolute;
                top: 15px;
                left: 15px;
                padding: 8px 15px;
                background: #dc3545;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                z-index: 1001;
            "
        >
            ✕ إغلاق
        </button>
    `;

    document.body.appendChild(modal);

    setTimeout(() => {
        const defaultLayers = platform.createDefaultLayers();
        const map = new H.Map(
            document.getElementById('mapContainer'),
            defaultLayers.vector.normal.map,
            { 
                center: { lat: lat, lng: lng }, 
                zoom: 15,
                pixelRatio: window.devicePixelRatio || 1 
            }
        );

        const marker = new H.map.Marker({ lat: lat, lng: lng });
        map.addObject(marker);
        new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
        H.ui.UI.createDefault(map, defaultLayers);
    }, 100);
};

window.openGoogleMaps = (lat, lng) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
};

window.openWaze = (lat, lng) => {
    window.open(`https://www.waze.com/ul?ll=${lat},${lng}&navigate=yes`, '_blank');
};

async function addOrder() {
    try {
        await addDoc(collection(db, "orders"), {
            name: "مثال",
            phone: "07701234567",
            province: "بغداد",
            pipes: 2,
            orderDate: serverTimestamp(),
            status: "قيد الانتظار",
            latitude: 33.3152,
            longitude: 44.3661
        });
        alert("تم إضافة الطلب!");
    } catch (error) {
        console.error("خطأ في الإضافة:", error);
        alert("فشل في الإضافة!");
    }
}
