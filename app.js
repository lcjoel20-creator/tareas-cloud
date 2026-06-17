// IMPORTANTE: Reemplazar con tus credenciales de Supabase
const SUPABASE_URL = "https://evtsaitpqkbmvuwzmjjk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2dHNhaXRwcWtibXZ1d3ptamprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NTkyMjYsImV4cCI6MjA5NzIzNTIyNn0.atmifra295jgK2Sg9a3yUs-wZJpDqwyLWGS0cwOIqws";

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==============================
// Cargar tareas al iniciar
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
// Suscripción en tiempo real
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
// Agregar tarea nueva
// ==============================
async function agregarTarea() {
  const titulo = document.getElementById("titulo").value.trim();
  const responsable = document.getElementById("responsable").value.trim();

  if (!titulo || !responsable) {
    alert("Completa todos los campos");
    return;
  }

  await db.from("tareas").insert({
    titulo,
    responsable,
  });

  document.getElementById("titulo").value = "";
  document.getElementById("responsable").value = "";
}

// ==============================
// Cambiar estado
// ==============================
async function toggleEstado(id, estado) {
  await db
    .from("tareas")
    .update({
      completada: !estado,
    })
    .eq("id", id);
}

// ==============================
// Eliminar tarea
// ==============================
async function eliminarTarea(id) {
  if (confirm("¿Eliminar esta tarea?")) {
    await db.from("tareas").delete().eq("id", id);
  }
}

// ==============================
// Renderizar lista
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

          <button
            class="btn-eliminar"
            onclick="eliminarTarea('${t.id}')"
          >
            Eliminar
          </button>
        </div>
      </div>
    `,
    )
    .join("");
}

// ==============================
// Iniciar aplicación
// ==============================
cargarTareas();
