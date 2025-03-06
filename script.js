import { db, collection, addDoc } from "./firebase-config.js";

document.getElementById("orderForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let phone = document.getElementById("phone").value;
    let address = document.getElementById("address").value;

    if (name && phone && address) {
        try {
            await addDoc(collection(db, "orders"), { name, phone, address, status: "قيد الانتظار" });
            alert("تم إرسال الطلب بنجاح!");
            document.getElementById("orderForm").reset();
        } catch (error) {
            console.error("خطأ في إرسال الطلب: ", error);
        }
    } else {
        alert("يرجى ملء جميع الحقول!");
    }
});