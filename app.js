// IMPORTANTE: Reemplazar con tus credenciales de Supabase
const SUPABASE_URL = "https://evtsaitpqkbmvuwzmjjk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2dHNhaXRwcWtibXZ1d3ptamprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NTkyMjYsImV4cCI6MjA5NzIzNTIyNn0.atmifra295jgK2Sg9a3yUs-wZJpDqwyLWGS0cwOIqws";

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==============================
// CARGAR TAREAS
// ==============================
async function cargarTareas() {
  const { data, error } = await db
    .from("tareas")
    .select("*")
    .order("created_at");

  if (error) {
    console.error(error);
    return;
  }

  renderTareas(data);
}

// ==============================
// REALTIME
// ==============================
db.channel("tareas-canal")
  .on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "tareas",
    },
    () => {
      cargarTareas();
    },
  )
  .subscribe();

// ==============================
// AGREGAR TAREA
// ==============================
async function agregarTarea() {
  const titulo = document.getElementById("titulo").value.trim();
  const responsable = document.getElementById("responsable").value.trim();

  if (!titulo || !responsable) {
    alert("Completa todos los campos");
    return;
  }

  await db.from("tareas").insert([{ titulo, responsable }]);

  document.getElementById("titulo").value = "";
  document.getElementById("responsable").value = "";
}

// ==============================
// TOGGLE ESTADO
// ==============================
async function toggleEstado(id, estado) {
  await db.from("tareas").update({ completada: !estado }).eq("id", id);
}

// ==============================
// ELIMINAR
// ==============================
async function eliminarTarea(id) {
  if (confirm("¿Eliminar esta tarea?")) {
    await db.from("tareas").delete().eq("id", id);
  }
}

// ==============================
// ✏️ EDITAR (NUEVO)
// ==============================
async function editarTarea(id, tituloActual, responsableActual) {
  const nuevoTitulo = prompt("Editar título:", tituloActual);
  const nuevoResponsable = prompt("Editar responsable:", responsableActual);

  if (!nuevoTitulo || !nuevoResponsable) return;

  await db
    .from("tareas")
    .update({
      titulo: nuevoTitulo.trim(),
      responsable: nuevoResponsable.trim(),
    })
    .eq("id", id);
}

// ==============================
// 🔎 BUSCAR (NUEVO)
// ==============================
async function buscarTareas() {
  const texto = document.getElementById("busqueda").value.toLowerCase();

  const { data, error } = await db
    .from("tareas")
    .select("*")
    .order("created_at");

  if (error) {
    console.error(error);
    return;
  }

  const filtradas = data.filter(
    (t) =>
      t.titulo.toLowerCase().includes(texto) ||
      t.responsable.toLowerCase().includes(texto),
  );

  renderTareas(filtradas);
}

// ==============================
// RENDER (TU DISEÑO ORIGINAL + BOTÓN EDITAR)
// ==============================
function renderTareas(tareas) {
  const cont = document.getElementById("tareas-container");

  document.getElementById("contador").textContent = `(${tareas.length})`;

  if (tareas.length === 0) {
    cont.innerHTML = '<p class="vacio">No hay tareas aún.</p>';
    return;
  }

  cont.innerHTML = tareas
    .map(
      (t) => `
      <div class="tarea ${t.completada ? "completada" : ""}">
        <div class="tarea-info">
          <strong>${t.titulo}</strong>
          <span>Responsable: ${t.responsable}</span>
        </div>

        <div class="tarea-acciones">
          <button onclick="toggleEstado('${t.id}', ${t.completada})">
            ${t.completada ? "Reabrir" : "Completar"}
          </button>

          <button onclick="editarTarea('${t.id}', '${t.titulo}', '${t.responsable}')">
            Editar
          </button>

          <button class="btn-eliminar" onclick="eliminarTarea('${t.id}')">
            Eliminar
          </button>
        </div>
      </div>
    `,
    )
    .join("");
}

// ==============================
// INICIAR
// ==============================
cargarTareas();
