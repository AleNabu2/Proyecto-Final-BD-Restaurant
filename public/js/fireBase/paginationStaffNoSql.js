const tableBody = document.getElementById("staffTableBody");
const btnNext = document.getElementById("btnNext");
const btnPrev = document.getElementById("btnPrev");

let currentPage = 1;

async function loadStaff() {
  try {
    const res = await fetch(`http://localhost:3000/nosql/staff?page=${currentPage}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    tableBody.innerHTML = "";

    if (!data.staff || data.staff.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="4">No hay más staff</td></tr>`;
      return;
    }

    data.staff.forEach(member => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${member.id}</td>
        <td>${member.active ? "Sí" : "No"}</td>
        <td>${member.name || "-"}</td>
        <td>${member.position || "-"}</td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error cargando staff:", error);
    tableBody.innerHTML = `<tr><td colspan="4">Error cargando staff</td></tr>`;
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
