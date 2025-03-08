import { db, collection, getDocs, updateDoc, doc } from "./firebase-config.js";

async function fetchOrders() {
    const tableBody = document.getElementById("ordersTable");
    tableBody.innerHTML = "";

    try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        querySnapshot.forEach((docItem) => {
            const data = docItem.data();
            const row = `
                <tr>
                    <td>${data.name}</td>
                    <td>${data.phone}</td>
                    <td>${data.address}</td>
                    <td>${data.status}</td>
                    <td>
                        <button class="edit-btn" data-id="${docItem.id}">تعديل الحالة</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', () => updateOrderStatus(button.dataset.id));
        });
    } catch (error) {
        console.error("خطأ في جلب الطلبات:", error);
    }
}

async function updateOrderStatus(orderId) {
    const newStatus = prompt("أدخل الحالة الجديدة (مثال: تم التوصيل):");
    if (newStatus) {
        try {
            await updateDoc(doc(db, "orders", orderId), { status: newStatus });
            alert("تم تحديث الحالة بنجاح!");
            await fetchOrders();
        } catch (error) {
            console.error("خطأ في التحديث:", error);
            alert("حدث خطأ أثناء التحديث!");
        }
    }
}

window.onload = fetchOrders;
