import { db, collection, addDoc } from "./firebase-config.js";

document.getElementById("orderForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    if (name && phone && address) {
        try {
            await addDoc(collection(db, "orders"), {
                name,
                phone,
                address,
                status: "قيد الانتظار",
                timestamp: new Date()
            });
            alert("تم إرسال الطلب بنجاح!");
            document.getElementById("orderForm").reset();
            await fetchOrders();
        } catch (error) {
            console.error("خطأ في الإرسال:", error);
        }
    } else {
        alert("يرجى تعبئة جميع الحقول!");
    }
});

document.getElementById("darkModeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});
