const tableBody = document.getElementById("menuTableBody");
const btnNext = document.getElementById("btnNext");
const btnPrev = document.getElementById("btnPrev");
const pageInfo = document.getElementById("pageInfo");

let currentPage = 1;
const pageSize = 3;

async function loadMenus() {
  try {
    const res = await fetch(`http://localhost:3000/sql/menu?page=${currentPage}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    tableBody.innerHTML = "";

    if (data.menus.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4">No hay más platos para mostrar</td></tr>`;
      return;
    }

    data.menus.forEach(menu => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${menu.dishId}</td>
        <td>${menu.name}</td>
        <td>${menu.amount}</td>
        <td>${menu.description}</td>
      `;
      tableBody.appendChild(row);
    });

    pageInfo.textContent = `Página ${currentPage}`;
  } catch (err) {
    console.error("Error cargando menús:", err);
    tableBody.innerHTML = `<tr><td colspan="4">Error cargando menús</td></tr>`;
  }
}

btnNext.addEventListener("click", () => {
  currentPage++;
  loadMenus();
});

btnPrev.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadMenus();
  }
});

loadMenus();
