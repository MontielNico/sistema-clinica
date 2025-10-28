import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function syncEspecialidades(legajo_medico: string, especialidades: any[]) {
  if (!legajo_medico) {
    throw new Error("legajo_medico es requerido");
  }

  if (!Array.isArray(especialidades)) {
    throw new Error("especialidades debe ser un array");
  }

  // Eliminar las asignaciones existentes
  const { error: deleteError } = await supabase
    .from("medico_especialidad")
    .delete()
    .eq("legajo_medico", legajo_medico);

  if (deleteError) {
    throw deleteError;
  }

  if (especialidades.length === 0) {
    return [];
  }

  // Convertir ids a número si parece necesario (intenta conservar el valor si ya es number)
  const rows = especialidades.map((id: any) => ({
    legajo_medico,
    id_especialidad: typeof id === "string" && !isNaN(Number(id)) ? Number(id) : id,
  }));

  const { data, error: insertError } = await supabase
    .from("medico_especialidad")
    .insert(rows);

  if (insertError) {
    throw insertError;
  }

  return data;
}
