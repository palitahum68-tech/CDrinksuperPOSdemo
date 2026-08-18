// ===============================
// Order / End of Day
// ===============================

// Order แรก = 001
let orderNumber = 1;

// จำนวน Order ทั้งหมดวันนี้
let orderCount = 0;

// ยอดขายสะสมวันนี้
let dailyTotal = 0;

// เงินที่รับสะสมวันนี้
let dailyReceived = 0;
// ===============================
// แสดงเลข Order
// ===============================


function updateOrderDisplay() {

    document.getElementById("orderNumber").textContent =
        String(orderNumber).padStart(3, "0");

    document.getElementById("orderTime").textContent =
        orderTime || "--:--:--";

    document.getElementById("orderCount").textContent =
        orderCount;

    document.getElementById("dailyTotal").textContent =
        dailyTotal.toLocaleString("th-TH");

    document.getElementById("dailyReceived").textContent =
        dailyReceived.toLocaleString("th-TH");
}

// ===============================
// ตัวแปรเก็บรายการสินค้า
// ===============================

let cart = [];


// ===============================
// ตัวแปรเก็บเงินที่รับ
// ===============================

let moneyReceived = 0;

// รับเงินสูงสุด 50,000 บาท
const MAX_MONEY = 50000;


// ===============================
// เพิ่มสินค้า
// ===============================

function addToCart(name, price) {

    // ตรวจสอบว่าสินค้ามีอยู่ในตะกร้าหรือยัง
    let existingItem = cart.find(item => item.name === name);

    if (existingItem) {

        // ถ้ามีแล้ว เพิ่มจำนวน
        existingItem.quantity++;

    } else {

        // ถ้ายังไม่มี เพิ่มสินค้าใหม่
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    // แสดงรายการใหม่
    renderCart();
}


// ===============================
// ลบสินค้า
// ===============================

function deleteItem(name) {

    // ลบสินค้าที่ชื่อเดียวกันออกจาก cart
    cart = cart.filter(item => item.name !== name);

    // แสดงรายการใหม่
    renderCart();
}


// ===============================
// แสดงรายการขาย
// ===============================

function renderCart() {

    const cartElement = document.getElementById("cart");

    // ถ้าไม่มีสินค้า
    if (cart.length === 0) {

        cartElement.innerHTML = "ยังไม่มีสินค้า";

        document.getElementById("total").textContent = "0";

        calculateChange();

        return;
    }


    let html = "";
    let total = 0;


    // วนดูสินค้าแต่ละรายการ
    cart.forEach(item => {

        // ราคาของสินค้ารายการนี้
        let itemTotal = item.price * item.quantity;

        // รวมยอด
        total += itemTotal;


        html += `
            <div class="cart-item">

                <span>
                    ${item.name}
                    x ${item.quantity}
                    = ${itemTotal} บาท
                </span>

                <button
                    class="delete-button"
                    onclick="deleteItem('${item.name}')">
                    🗑️ ลบ
                </button>

            </div>
        `;
    });


    // แสดงรายการ
    cartElement.innerHTML = html;


    // แสดง Total
    document.getElementById("total").textContent = total;


    // คำนวณเงินทอนใหม่
    calculateChange();
}


// ===============================
// กดแป้นตัวเลข 0 - 9
// ===============================

function pressNumber(number) {

    // เอาจำนวนเงินเดิมมาต่อกับเลขใหม่
    let newMoney = Number(
        String(moneyReceived) + String(number)
    );


    // ป้องกันเงินเกิน 50,000
    if (newMoney > MAX_MONEY) {

        alert("รับเงินได้สูงสุด 50,000 บาท");

        return;
    }


    // ป้องกันค่าติดลบ
    if (newMoney < 0) {

        moneyReceived = 0;

        return;
    }


    moneyReceived = newMoney;


    // อัปเดตหน้าจอ
    updateMoneyDisplay();
}


// ===============================
// กดปุ่มแบงก์
// ===============================

function addMoney(amount) {

    // ตรวจสอบจำนวนเงินที่เพิ่ม
    if (amount < 0) {

        return;
    }


    let newMoney = moneyReceived + amount;


    // ป้องกันเกิน 50,000
    if (newMoney > MAX_MONEY) {

        alert("รับเงินได้สูงสุด 50,000 บาท");

        return;
    }


    moneyReceived = newMoney;


    // อัปเดตหน้าจอ
    updateMoneyDisplay();
}


// ===============================
// แสดงจำนวนเงินที่รับ
// ===============================

function updateMoneyDisplay() {

    document.getElementById("money").textContent =
        moneyReceived.toLocaleString("th-TH");


    // คำนวณเงินทอน
    calculateChange();
}


// ===============================
// ปุ่ม C
// ล้างจำนวนเงิน
// ===============================

function clearMoney() {

    moneyReceived = 0;

    updateMoneyDisplay();
}


// ===============================
// ปุ่ม ⌫
// ลบตัวเลขทีละหลัก
// ===============================

function deleteNumber() {

    let moneyString = String(moneyReceived);


    if (moneyString.length <= 1) {

        moneyReceived = 0;

    } else {

        moneyReceived = Number(
            moneyString.slice(0, -1)
        );
    }


    updateMoneyDisplay();
}


// ===============================
// คำนวณเงินทอน
// ===============================

function calculateChange() {

    let total = Number(
        document.getElementById("total").textContent
    );


    let change = moneyReceived - total;


    // ถ้าเงินไม่พอ
    if (change < 0) {

        change = 0;
    }


    document.getElementById("change").textContent =
        change.toLocaleString("th-TH");
}

// ===============================
// ชำระเงิน
// ===============================

function payment() {

    let total = Number(
        document.getElementById("total").textContent
    );


    // ตรวจสอบว่ายังไม่มีสินค้า
    if (total === 0) {

        alert("ยังไม่มีสินค้าในรายการ");

        return;
    }


    // ตรวจสอบเงินไม่พอ
    if (moneyReceived < total) {

        alert(
            "จำนวนเงินไม่เพียงพอ\n\n" +
            "ยอดรวม: " + total + " บาท\n" +
            "รับเงิน: " + moneyReceived + " บาท"
        );

        return;
    }


    // ========================================
    // บันทึกเวลา Order ตอนชำระเงินสำเร็จ
    // ========================================

    orderTime = getCurrentTime();


    // คำนวณเงินทอน
    let change = moneyReceived - total;


    // ========================================
    // บันทึกยอด End of Day
    // ========================================

    orderCount++;

    dailyTotal += total;

    dailyReceived += moneyReceived;


    // ========================================
    // แสดงใบเสร็จชั่วคราว
    // ========================================

    alert(
        "ชำระเงินเรียบร้อย\n\n" +

        "Order: " +
        String(orderNumber).padStart(3, "0") +
        "\n" +

        "เวลา: " +
        orderTime +
        "\n" +

        "ยอดรวม: " +
        total.toLocaleString("th-TH") +
        " บาท\n" +

        "รับเงิน: " +
        moneyReceived.toLocaleString("th-TH") +
        " บาท\n" +

        "เงินทอน: " +
        change.toLocaleString("th-TH") +
        " บาท"
    );


    // ========================================
    // Order ถัดไป
    // ========================================

    orderNumber++;


    // ========================================
    // ล้างตะกร้า
    // ========================================

    cart = [];


    // ========================================
    // ล้างเงินรับ
    // ========================================

    moneyReceived = 0;


    // ========================================
    // รีเซ็ตหน้าจอ
    // ========================================

    renderCart();

    updateMoneyDisplay();

    updateOrderDisplay();
}

// ===============================
// Clear ยอด / เริ่มวันใหม่
// ===============================

function clearDailySales() {

    const confirmClear = confirm(
        "ต้องการล้างยอดขายทั้งหมดและเริ่ม Order 001 ใหม่หรือไม่?"
    );

    if (!confirmClear) {
        return;
    }


    // ===============================
    // Reset ยอดขาย
    // ===============================

    cart = [];

    orderNumber = 1;

    orderCount = 0;

    dailyTotal = 0;

    dailyReceived = 0;

    orderTime = "";

    moneyReceived = 0;


    // ===============================
    // Reset หน้ารายการขาย
    // ===============================

    document.getElementById("cart").innerHTML =
        "ยังไม่มีสินค้า";

    document.getElementById("total").textContent =
        "0";


    // ===============================
    // Reset เงินรับ
    // ===============================

    document.getElementById("money").textContent =
        "0";


    // ===============================
    // Reset เงินทอน
    // ===============================

    document.getElementById("change").textContent =
        "0";


    // ===============================
    // Update Summary
    // ===============================

    updateOrderDisplay();
    updateMoneyDisplay();

    alert(
        "ล้างยอดเรียบร้อยแล้ว\n\n" +
        "เริ่ม Order ใหม่ที่ 001"
    );
}
















// ===============================
// วันที่ / เวลา Order
// ===============================

let orderTime = "";


function getCurrentTime() {

    const now = new Date();

    return now.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}

orderTime = getCurrentTime();
