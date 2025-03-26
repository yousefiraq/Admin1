import { db, collection, getDocs, updateDoc, doc, deleteDoc, getDoc, setDoc, query, orderBy, serverTimestamp } from "./firebase-config.js";

function searchOrders() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#ordersTable tr');
    rows.forEach(row => {
        const name = row.cells[0].textContent.toLowerCase();
        row.style.display = name.includes(searchTerm) ? '' : 'none';
    });
}

let searchTimeout;
document.getElementById('searchInput').addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(searchOrders, 300);
});

async function fetchOrders() {
    const tableBody = document.getElementById("ordersTable");
    tableBody.innerHTML = "";
    let totalOrders = 0, pending = 0, delivered = 0, canceled = 0;

    try {
        const q = query(collection(db, "orders"), orderBy("orderDate", "desc"));
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((docItem) => {
            const data = docItem.data();
            totalOrders++;
            switch(data.status) {
                case 'قيد الانتظار': pending++; break;
                case 'تم التوصيل': delivered++; break;
                case 'ملغى': canceled++; break;
            }

            const orderDate = data.orderDate?.toDate ? 
                data.orderDate.toDate().toLocaleString('ar-EG') : 
                'غير محدد';

            const row = `
                <tr>
                    <td>${data.name}</td>
                    <td>${data.phone}</td>
                    <td>${data.pipes || 0}</td>
                    <td>${data.province || 'غير محدد'}</td>
                    <td>${orderDate}</td>
                    <td>
                        <select class="status-select" data-id="${docItem.id}">
                            <option value="قيد الانتظار" ${data.status === 'قيد الانتظار' ? 'selected' : ''}>قيد الانتظار</option>
                            <option value="تم التوصيل" ${data.status === 'تم التوصيل' ? 'selected' : ''}>تم التوصيل</option>
                            <option value="ملغى" ${data.status === 'ملغى' ? 'selected' : ''}>ملغى</option>
                        </select>
                    </td>
                    <td>
                        <div class="map-actions">
                            <button class="google-btn" onclick="openGoogleMaps(${data.latitude},${data.longitude})">
                                <i class="fab fa-google"></i> Google
                            </button>
                            <button class="waze-btn" onclick="openWaze(${data.latitude},${data.longitude})">
                                <i class="fab fa-waze"></i> Waze
                            </button>
                        </div>
                    </td>
                    <td>
                        <button class="action-btn edit-btn" data-id="${docItem.id}">✏️ تعديل</button>
                        <button class="action-btn delete-btn" data-id="${docItem.id}">🗑️ حذف</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

        document.getElementById('totalOrders').textContent = totalOrders;
        document.getElementById('pendingOrders').textContent = pending;
        document.getElementById('deliveredOrders').textContent = delivered;
        document.getElementById('canceledOrders').textContent = canceled;

        document.querySelectorAll('.status-select').forEach(select => {
            select.addEventListener('change', async () => {
                await updateOrderStatus(select.dataset.id, select.value);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (confirm('هل أنت متأكد من الحذف؟')) await deleteOrder(btn.dataset.id);
            });
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                await editOrderDetails(btn.dataset.id);
            });
        });

        searchOrders();

        const noteDoc = await getDoc(doc(db, "orders", "A", "notes", "current_note"));
        if (noteDoc.exists()) {
            document.getElementById('dynamicTitle').textContent = noteDoc.data().text;
            document.getElementById('noteText').value = noteDoc.data().text;
        }

    } catch (error) {
        console.error("حدث خطأ في جلب البيانات:", error);
        alert("تعذر تحميل الطلبات!");
    }
}

async function deleteOrder(orderId) {
    try {
        await deleteDoc(doc(db, "orders", orderId));
        await fetchOrders();
        alert("تم الحذف بنجاح!");
    } catch (error) {
        console.error("خطأ في الحذف:", error);
        alert("فشل في حذف الطلب!");
    }
}

async function updateOrderStatus(orderId, newStatus) {
    try {
        await updateDoc(doc(db, "orders", orderId), { status: newStatus });
        await fetchOrders();
    } catch (error) {
        console.error("خطأ في التحديث:", error);
        alert("فشل في تحديث الحالة!");
    }
}

async function editOrderDetails(orderId) {
    try {
        const docRef = doc(db, "orders", orderId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            const newName = prompt("الاسم الحالي: " + data.name + "\n\nأدخل الاسم الجديد:", data.name);
            const newPhone = prompt("الهاتف الحالي: " + data.phone + "\n\nأدخل الهاتف الجديد:", data.phone);
            const newPipes = prompt("عدد الأنابيب الحالي: " + (data.pipes || 0) + "\n\nأدخل العدد الجديد:", data.pipes);
            const newProvince = prompt("المحافظة الحالية: " + (data.province || 'غير محدد') + "\n\nأدخل المحافظة الجديدة:", data.province);
            
            if (
                newName !== null && 
                newPhone !== null && 
                newPipes !== null &&
                newProvince !== null
            ) {
                await updateDoc(docRef, {
                    name: newName || data.name,
                    phone: newPhone || data.phone,
                    pipes: newPipes ? parseInt(newPipes) : data.pipes,
                    province: newProvince || data.province
                });
                await fetchOrders();
                alert("تم التحديث بنجاح!");
            }
        }
    } catch (error) {
        console.error("خطأ في التعديل:", error);
        alert("فشل في التحديث: " + error.message);
    }
}

async function saveNoteToFirebase() {
    const noteText = document.getElementById('noteText').value.trim();
    if (!noteText) {
        alert("الرجاء إدخال ملاحظة جديدة!");
        return;
    }

    try {
        await setDoc(doc(db, "orders", "A", "notes", "current_note"), {
            text: noteText,
            timestamp: serverTimestamp()
        });
        alert("تم استبدال الملاحظة القديمة بنجاح!");
        document.getElementById('noteText').value = "";
        await fetchOrders();
    } catch (error) {
        console.error("حدث خطأ:", error);
        alert("فشل في الحفظ!");
    }
}

async function addNewOrder() {
    const name = prompt("أدخل اسم العميل:");
    const phone = prompt("أدخل رقم الهاتف:");
    const pipes = prompt("أدخل عدد الأنابيب:");
    const province = prompt("أدخل المحافظة:");
    
    if (name && phone) {
        try {
            await addDoc(collection(db, "orders"), {
                name: name,
                phone: phone,
                pipes: parseInt(pipes) || 0,
                province: province || 'غير محدد',
                orderDate: serverTimestamp(),
                status: "قيد الانتظار"
            });
            await fetchOrders();
            alert("تمت الإضافة بنجاح!");
        } catch (error) {
            console.error("خطأ في الإضافة:", error);
            alert("فشل في إضافة الطلب!");
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('saveNoteBtn').addEventListener('click', saveNoteToFirebase);
    document.getElementById('addOrderBtn').addEventListener('click', addNewOrder);
    fetchOrders();
});
