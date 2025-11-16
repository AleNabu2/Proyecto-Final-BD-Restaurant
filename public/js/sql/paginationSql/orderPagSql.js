const tableBody = document.getElementById("orderTableBody");
const btnNext = document.getElementById("btnNext");
const btnPrev = document.getElementById("btnPrev");
const pageInfo = document.getElementById("pageInfo");

let currentPage = 1;
const pageSize = 3;

async function loadOrders() {
  try {
    const res = await fetch(`http://localhost:3000/sql/order?page=${currentPage}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    tableBody.innerHTML = "";

    if (data.orders.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5">No hay más órdenes para mostrar</td></tr>`;
      return;
    }

    data.orders.forEach(order => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${order.orderId}</td>
        <td>${order.table_tableId}</td>
        <td>${order.staff_staffId}</td>
        <td>${order.status}</td>
        <td>${new Date(order.date).toLocaleString()}</td>
      `;
      tableBody.appendChild(row);
    });

    pageInfo.textContent = `Página ${currentPage}`;
  } catch (err) {
    console.error("Error cargando órdenes:", err);
    tableBody.innerHTML = `<tr><td colspan="5">Error cargando órdenes</td></tr>`;
  }
}

btnNext.addEventListener("click", () => {
  currentPage++;
  loadOrders();
});

btnPrev.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadOrders();
  }
});

loadOrders();
