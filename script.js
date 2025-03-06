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

// تفعيل الوضع الداكن
document.getElementById("darkModeToggle").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
});

// إضافة مستخدم جديد
function addUser() {
    let table = document.getElementById("usersTable");
    let rowCount = table.rows.length;
    let row = table.insertRow(rowCount);
    
    row.insertCell(0).innerHTML = rowCount; // ترقيم المستخدمين
    row.insertCell(1).innerHTML = document.getElementById("nameInput").value;
    row.insertCell(2).innerHTML = document.getElementById("emailInput").value;
    row.insertCell(3).innerHTML = '<button onclick="editUser(this)">تعديل</button> <button onclick="deleteUser(this)">حذف</button>';

    document.getElementById("nameInput").value = "";
    document.getElementById("emailInput").value = "";
}

// حذف مستخدم
function deleteUser(btn) {
    let row = btn.parentNode.parentNode;
    row.parentNode.removeChild(row);
    updateUserNumbers();
}

// تعديل مستخدم
function editUser(btn) {
    let row = btn.parentNode.parentNode;
    let name = row.cells[1].innerHTML;
    let email = row.cells[2].innerHTML;

    let newName = prompt("تعديل الاسم:", name);
    let newEmail = prompt("تعديل البريد:", email);

    if (newName && newEmail) {
        row.cells[1].innerHTML = newName;
        row.cells[2].innerHTML = newEmail;
    }
}

// تحديث أرقام المستخدمين بعد الحذف
function updateUserNumbers() {
    let table = document.getElementById("usersTable");
    for (let i = 1; i < table.rows.length; i++) {
        table.rows[i].cells[0].innerHTML = i;
    }
}
