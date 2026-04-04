let chart;
const API = "http://127.0.0.1:5000/api/transactions";

const form = document.getElementById("form");
const list = document.getElementById("list");
const balanceEl = document.getElementById("balance");

// ===== ADD DATA =====
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value.trim();
  const amount = Number(document.getElementById("amount").value);
  const type = document.getElementById("type").value;

  // VALIDATION
  if (!title || amount <= 0) {
    alert("❌ Please enter valid data");
    return;
  }

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, amount, type })
    });

    if (!res.ok) throw new Error();

    form.reset();
    loadData();

  } catch {
    alert("❌ Error adding transaction");
  }
});

// ===== LOAD DATA =====
async function loadData() {
  try {
    const res = await fetch(API);
    const data = await res.json();

    list.innerHTML = "";

    let balance = 0;
    let income = 0;
    let expense = 0;

    data.forEach(item => {
      const amount = Number(item.amount);

      // LOGIC
      if (item.type === "income") {
        balance += amount;
        income += amount;
      } else {
        balance -= amount;
        expense += amount;
      }

      // UI
      const li = document.createElement("li");
      li.className = item.type;

      li.innerHTML = `
        <span>${item.title} - ₹${amount}</span>
        <button class="delete-btn" onclick="deleteData('${item._id}')">❌</button>
      `;

      list.appendChild(li);
    });

    // ===== UPDATE DASHBOARD =====
    balanceEl.innerText = `Balance: ₹${balance}`;
    balanceEl.style.color = balance >= 0 ? "#00ff9d" : "red";
    document.body.style.opacity = "0";

window.onload = () => {
  document.body.style.transition = "1s";
  document.body.style.opacity = "1";
};

    // Income / Expense
    document.getElementById("income").innerText = income;
    document.getElementById("expense").innerText = expense;

    // ===== CHART =====
    if (chart) chart.destroy();

    const ctx = document.getElementById("chart").getContext("2d");

    chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Income", "Expense"],
        datasets: [{
          data: [income, expense],
          backgroundColor: ["#00ff9d", "#ff004c"]
        }]
      }
    });

  } catch (err) {
    console.log(err);
    alert("❌ Failed to load data");
  }
}

// ===== DELETE =====
async function deleteData(id) {
  if (!confirm("Delete this transaction?")) return;

  try {
    const res = await fetch(`${API}/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error();

    loadData();

  } catch {
    alert("❌ Error deleting");
  }
}

// ===== INIT =====
loadData();