const tableBody = document.getElementById("staffTableBody");
const btnNext = document.getElementById("btnNext");
const btnPrev = document.getElementById("btnPrev");
const pageInfo = document.getElementById("pageInfo");

let currentPage = 1;
const pageSize = 3;

async function loadStaff() {
  try {
    const res = await fetch(`http://localhost:3000/sql/staff?page=${currentPage}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    tableBody.innerHTML = "";

    if (data.staffs.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4">No hay más platos para mostrar</td></tr>`;
      return;
    }

    data.staffs.forEach(staff => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${staff.staffId}</td>
        <td>${staff.name}</td>
        <td>${staff.active}</td>
        <td>${staff.position}</td>
      `;
      tableBody.appendChild(row);
    });

    pageInfo.textContent = `Página ${currentPage}`;
  } catch (err) {
    console.error("Error cargando staffs:", err);
    tableBody.innerHTML = `<tr><td colspan="4">Error cargando staffs</td></tr>`;
  }
}

btnNext.addEventListener("click", () => {
  currentPage++;
  loadStaff();
});

btnPrev.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    loadStaff();
  }
});

loadStaff();
