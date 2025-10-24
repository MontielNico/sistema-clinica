import { NextRequest, NextResponse } from "next/server";
import { sendReintegroNotification } from "@/hooks/email-resend-reintegro";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { cod_turno } = body;
  const { data: turnoData, error: turnoError } = await supabase
    .from("turno")
    .select("profiles(id_especialidad, legajo_medico)")
    .eq("cod_turno", cod_turno)
    .single();
  if (turnoError || !turnoData?.profiles) {
    return NextResponse.json(
      { error: "No se encontraron datos del paciente" },
      { status: 404 }
    );
  }

  setTimeout(async () => {
    const { data: turnoData, error: turnoError } = await supabase
      .from("solicitudes_especialidad")
      .select("profiles(id_especialidad, legajo_medico)")
      .eq("cod_turno", cod_turno)
      .single();
  }, 0);
}
