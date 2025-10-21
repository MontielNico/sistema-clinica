"use client";
/* el any es una solucion temporal , vamos a armar la libreria de tipos  */

import { TurnosAcciones } from "./TurnosAcciones";
import InfoTurno from "./InfoTurno";
import { turnoPaciente } from "@/app/data/Info";
import InfoPaciente from "./InfoPaciente";
import HeaderTurno from "./HeaderTurno";
// interface MedicoProps {
//   medico?: {
//     id: number
//     nombre: string
//     especialidad: string
//     estado: "activo" | "inactivo"
//     agenda: boolean
//   }
// }

export default function TurnoDetalle({ medico }: any, param: string) {
  // Mock data - en una app real vendría de la API
  const turno = turnoPaciente;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <HeaderTurno turno={turno}>{}</HeaderTurno>
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <InfoTurno turno={turno}></InfoTurno>

            {/* Paciente Info */}
            <InfoPaciente turno={turno}></InfoPaciente>
            {/* Medico Info */}
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            <TurnosAcciones></TurnosAcciones>

            {/* Quick Stats */}
            {/* <QuickStats
            turno={ turno }
            ></QuickStats> */}
          </div>
        </div>
      </div>
    </div>
  );
}
