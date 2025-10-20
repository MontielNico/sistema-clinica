import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import ObrasSocialesMedico from './ObrasSocialesMedico';


interface AgendarProps {
     turnoAConfirmar: any;
     setTurnoAConfirmar: React.Dispatch<React.SetStateAction<any>>;
     setTurnosAgendados: React.Dispatch<React.SetStateAction<any[]>>;
     setTurnosDisponibles: React.Dispatch<React.SetStateAction<any[]>>;
}
interface TurnoBody {
  legajo_medico: string;
  dni_paciente: number;
  fecha_hora_turno: string;
  id_especialidad: number;
  id_obra: string | null;
  turno_pagado?: boolean;
  estado_turno: string;
  turno_modificado?: boolean;
  presencia_turno?: boolean; // opcional
}

async function agendarTurno(payload: TurnoBody) {
  const res = await fetch("/api/turnos/agendar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error al agendar turno");
  return data;
}

const Agendar = ({ turnoAConfirmar, setTurnoAConfirmar, setTurnosAgendados, setTurnosDisponibles }: AgendarProps) => {

     const [selectedObraSocial, setSelectedObraSocial] = useState<string>("null");

     // Función para confirmar el pago y agendar el turno
     const pagarYConfirmarTurno = async () => {
          // if (!turnoAConfirmar) return;

          // Construir el payload para la API
          const payload = {
               legajo_medico: turnoAConfirmar.medico.legajo_medico ?? turnoAConfirmar.legajo_medico,
               dni_paciente:2, //aca iria el dni del apciente que lo sacamos de la sesion.
               id_obra: selectedObraSocial === "null" ? null : selectedObraSocial,
               fecha_hora_turno: turnoAConfirmar.fecha_hora_turno ?? turnoAConfirmar.fecha,
               id_especialidad: turnoAConfirmar.id_especialidad ?? turnoAConfirmar.especialidad_id,
               estado_turno: "confirmado"
          };
try {
  await agendarTurno(payload);

   setTurnosAgendados((prev) => [
                    ...prev,
                    {
                         ...turnoAConfirmar,
                         direccion: "A confirmar",
                    },
               ]);
               setTurnosDisponibles((prev) =>
                    prev.map((t) =>
                         t.id === turnoAConfirmar.id ? { ...t, estado: "ocupado" } : t
                    )
               );
               setTurnoAConfirmar(null);
} catch (err: any) {
  alert(err.message);
}
}    
          
          
     return (
          <>
               <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                         <h3 className="text-xl font-bold mb-4">
                              Debe pagar el turno para confirmarlo
                         </h3>
                         <p className="mb-4">
                              Médico: <b>{turnoAConfirmar.medico}</b> <br />
                              Especialidad: <b>{turnoAConfirmar.especialidad}</b> <br />
                              Fecha: <b>{turnoAConfirmar.fecha}</b> - Hora:{" "}
                              <b>{turnoAConfirmar.hora}</b>
                         </p>


                         <ObrasSocialesMedico
                              obrasSociales={turnoAConfirmar.medico.obrasSociales}
                              onObraSocialChange={setSelectedObraSocial}
                         />

                         {/* aparece pagar solo si eligio particular */}
                         {selectedObraSocial === "null" && (
                              <Button className="w-full mb-2" onClick={pagarYConfirmarTurno}>
                                   Pagar turno
                              </Button>
                         )}

                         <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => setTurnoAConfirmar(null)}
                         >
                              Cancelar
                         </Button>
                    </div>
               </div>

          </>
     )
}


export default Agendar
