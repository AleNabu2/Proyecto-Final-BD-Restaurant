const tableBody = document.getElementById("tableTableBody");
const btnNext = document.getElementById("btnNext");
const btnPrev = document.getElementById("btnPrev");
const pageInfo = document.getElementById("pageInfo");

let currentPage = 1;
const pageSize = 3;

async function loadTables() {
  try {
    const res = await fetch(`http://localhost:3000/sql/table?page=${currentPage}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    tableBody.innerHTML = "";

    if (data.tables.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4">No hay más mesas para mostrar</td></tr>`;
      return;
    }

    data.tables.forEach(table => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${table.tableId}</td>
        <td>${table.position}</td>
        <td>${table.active}</td>
      `;
      tableBody.appendChild(row);
    });

    pageInfo.textContent = `Página ${currentPage}`;
  } catch (err) {
    console.error("Error cargando mesas:", err);
    tableBody.innerHTML = `<tr><td colspan="4">Error cargando mesas</td></tr>`;
  }
}

btnNext.addEventListener("click", () => {
  currentPage++;
  loadTables();
});

btnPrev.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadTables();
  }
});

loadTables();
