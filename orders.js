import { db, collection, getDocs } from "./firebase-config.js";

async function fetchOrders() {
    let tableBody = document.getElementById("ordersTable");
    tableBody.innerHTML = "";

    try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        querySnapshot.forEach((doc) => {
            let data = doc.data();
            let row = `<tr>
                        <td>${data.name}</td>
                        <td>${data.phone}</td>
                        <td>${data.address}</td>
                        <td>${data.status}</td>
                      </tr>`;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("خطأ في جلب الطلبات:", error);
    }
}

window.onload = fetchOrders;