import { getFirestore, collection, doc, setDoc, updateDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const db = getFirestore(); // الاتصال بقاعدة البيانات

// ✅ إضافة مستخدم جديد
async function addUser(userId, name, email) {
    try {
        await setDoc(doc(db, "users", userId), { name, email });
        console.log("تمت إضافة المستخدم بنجاح!");
        getUsers(); // تحديث الجدول تلقائيًا
    } catch (error) {
        console.error("خطأ في الإضافة:", error);
    }
}

// ✅ تحديث بيانات المستخدم
async function updateUser(userId, newData) {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, newData);
        console.log("تم التحديث بنجاح!");
        getUsers(); // تحديث الجدول تلقائيًا
    } catch (error) {
        console.error("خطأ في التحديث:", error);
    }
}

// ✅ حذف مستخدم
async function deleteUser(userId) {
    if (confirm("هل أنت متأكد أنك تريد حذف هذا المستخدم؟")) {
        try {
            await deleteDoc(doc(db, "users", userId));
            console.log("تم الحذف بنجاح!");
            getUsers(); // تحديث الجدول تلقائيًا
        } catch (error) {
            console.error("خطأ في الحذف:", error);
        }
    }
}

// ✅ جلب وعرض المستخدمين في الجدول
async function getUsers() {
    const querySnapshot = await getDocs(collection(db, "users"));
    const tableBody = document.getElementById("usersTableBody");
    tableBody.innerHTML = ""; // مسح الجدول قبل إعادة تحميله

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const row = `<tr>
            <td>${doc.id}</td>
            <td>${data.name}</td>
            <td>${data.email}</td>
            <td>
                <button onclick="updateUser('${doc.id}', { name: prompt('أدخل الاسم الجديد:', '${data.name}') })">تحديث</button>
                <button onclick="deleteUser('${doc.id}')">❌ حذف</button>
            </td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

// ✅ دالة إضافة المستخدم من الإدخال
function addUserFromInput() {
    const userId = document.getElementById("userId").value;
    const name = document.getElementById("userName").value;
    const email = document.getElementById("userEmail").value;
    
    if (userId && name && email) {
        addUser(userId, name, email);
    } else {
        alert("يرجى إدخال جميع البيانات!");
    }
}

// ✅ تحميل البيانات عند فتح الصفحة
window.onload = getUsers;
