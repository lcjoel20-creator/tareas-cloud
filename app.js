// IMPORTANTE: Reemplazar con tus credenciales de Supabase
const SUPABASE_URL = "https://evtsaitpqkbmvuwzmjjk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2dHNhaXRwcWtibXZ1d3ptamprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NTkyMjYsImV4cCI6MjA5NzIzNTIyNn0.atmifra295jgK2Sg9a3yUs-wZJpDqwyLWGS0cwOIqws";

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ================= STATE =================
let editId = null;
let deleteId = null;

// ================= LOAD =================
async function cargarTareas() {
  const { data } = await db.from("tareas").select("*").order("created_at");
  renderTareas(data);
  lucide.createIcons();
}

// ================= REALTIME =================
db.channel("tareas")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "tareas" },
    () => {
      cargarTareas();
    },
  )
  .subscribe();

// ================= ADD =================
async function agregarTarea() {
  const titulo = document.getElementById("titulo").value;
  const responsable = document.getElementById("responsable").value;

  if (!titulo || !responsable) return;

  await db.from("tareas").insert([{ titulo, responsable }]);

  document.getElementById("titulo").value = "";
  document.getElementById("responsable").value = "";

  toast("Tarea creada", "ok");
}

// ================= TOGGLE =================
async function toggleEstado(id, estado) {
  await db.from("tareas").update({ completada: !estado }).eq("id", id);
}

// ================= SEARCH =================
async function buscarTareas() {
  const q = document.getElementById("busqueda").value.toLowerCase();

  const { data } = await db.from("tareas").select("*");

  renderTareas(
    data.filter(
      (t) =>
        t.titulo.toLowerCase().includes(q) ||
        t.responsable.toLowerCase().includes(q),
    ),
  );

  lucide.createIcons();
}

// ================= RENDER =================
function renderTareas(tareas) {
  document.getElementById("contador").innerText = tareas.length;

  const cont = document.getElementById("tareas-container");

  cont.innerHTML = tareas
    .map(
      (t) => `
    <div class="bg-slate-800 p-4 rounded flex justify-between items-center">

      <div>
        <p class="${t.completada ? "line-through text-slate-500" : ""}">
          ${t.titulo}
        </p>
        <p class="text-sm text-slate-400">${t.responsable}</p>
      </div>

      <div class="flex gap-2">

        <button onclick="toggleEstado('${t.id}', ${t.completada})"
          class="p-2 bg-emerald-500 rounded">
          <i data-lucide="check"></i>
        </button>

        <button onclick="abrirModal('${t.id}', '${t.titulo}', '${t.responsable}')"
          class="p-2 bg-blue-500 rounded">
          <i data-lucide="edit"></i>
        </button>

        <button onclick="eliminarTarea('${t.id}')"
          class="p-2 bg-red-500 rounded">
          <i data-lucide="trash"></i>
        </button>

      </div>
    </div>
  `,
    )
    .join("");
}

// ================= EDIT MODAL =================
function abrirModal(id, titulo, responsable) {
  editId = id;

  document.getElementById("editTitulo").value = titulo;
  document.getElementById("editResponsable").value = responsable;

  document.getElementById("modal").classList.remove("hidden");
}

function cerrarModal() {
  document.getElementById("modal").classList.add("hidden");
}

async function guardarEdicion() {
  await db
    .from("tareas")
    .update({
      titulo: document.getElementById("editTitulo").value,
      responsable: document.getElementById("editResponsable").value,
    })
    .eq("id", editId);

  cerrarModal();
  toast("Tarea actualizada", "ok");
}

// ================= DELETE =================
function eliminarTarea(id) {
  deleteId = id;
  document.getElementById("confirmDelete").classList.remove("hidden");
}

function cerrarDelete() {
  document.getElementById("confirmDelete").classList.add("hidden");
}

async function confirmarEliminar() {
  await db.from("tareas").delete().eq("id", deleteId);

  cerrarDelete();
  toast("Tarea eliminada", "error");
}

// ================= TOAST =================
function toast(msg, type) {
  const t = document.getElementById("toast");

  t.innerText = msg;
  t.className =
    "fixed top-5 right-5 px-4 py-3 rounded shadow text-white " +
    (type === "error" ? "bg-red-500" : "bg-emerald-500");

  t.classList.remove("hidden");

  setTimeout(() => t.classList.add("hidden"), 2000);
}

// ================= INIT =================
cargarTareas();
