const tableBody = document.getElementById("orderTableBody");
const btnNext = document.getElementById("btnNext");
const btnPrev = document.getElementById("btnPrev");

let currentPage = 1;
const pageSize = 3;

async function loadOrders() {
  try {
    const res = await fetch(`http://localhost:3000/nosql/orders?page=${currentPage}`);
    const data = await res.json();
    tableBody.innerHTML = "";
    data.orders.forEach(order => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${order.id}</td>
        <td>${order.table_tableId}</td>
        <td>${order.staff_staffId}</td>
        <td>${order.status ? "Activa" : "Cerrada"}</td>
        <td>${new Date(order.date._seconds * 1000).toLocaleString()}</td>
      `;
      tableBody.appendChild(row);
    });

    if (data.orders.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5">No hay más órdenes</td></tr>`;
    }
  } catch (error) {
    console.error("Error cargando órdenes:", error);
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
