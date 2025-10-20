"use client";
import { useState, useEffect } from "react";

interface DiaSemana {
  dia_semana: number; 
  hora_inicio: string; 
  hora_fin: string;
}

interface Agenda {
  fechainiciovigencia: string;
  fechafinvigencia: string;
  duracionturno: number;
  dia_semana: DiaSemana[];
}

interface TurnoOcupado {
  fecha_hora_turno: string;
}

interface Resultado {
  libres: string[];
  ocupados: string[];
  agenda?: Agenda;
}

/**
 * Calcula los turnos libres de un médico según su agenda y turnos ocupados.
 * @param legajoMedico - Legajo del médico (string)
 */
export function useTurnosLibres(legajoMedico: string) {
  const [data, setData] = useState<Resultado>({ libres: [], ocupados: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!legajoMedico) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/agenda/${legajoMedico}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Error al cargar agenda");

        const agenda: Agenda = json.agenda;
        const turnosOcupados: TurnoOcupado[] = json.turnosOcupados;

        const libres = generarTurnosLibres(agenda, turnosOcupados);
        const ocupados = turnosOcupados.map((t) =>
          new Date(t.fecha_hora_turno).toISOString()
        );

        setData({ libres, ocupados, agenda });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [legajoMedico]);

  return { ...data, loading, error };
}


function generarTurnosLibres(
  agenda: Agenda,
  turnosOcupados: TurnoOcupado[]
): string[] {
  const inicio = new Date(agenda.fechainiciovigencia);
  const fin = new Date(agenda.fechafinvigencia);
  const duracionMs = agenda.duracionturno * 60 * 1000;
  const ocupadas = new Set(
    turnosOcupados.map((t) => new Date(t.fecha_hora_turno).toISOString())
  );

  const turnosLibres: string[] = [];

  // Iterar cada día entre inicio y fin
  for (
    let fecha = new Date(inicio);
    fecha <= fin;
    fecha.setDate(fecha.getDate() + 1)
  ) {
    const dia = fecha.getDay(); // 0=domingo, 1=lunes...
    const diaActivo = agenda.dia_semana.find((d) => d.dia_semana === dia);
    if (!diaActivo) continue; // no trabaja ese día

    // Crear los horarios del día activo
    const horaInicio = new Date(
      `${fecha.toISOString().split("T")[0]}T${diaActivo.hora_inicio}`
    );
    const horaFin = new Date(
      `${fecha.toISOString().split("T")[0]}T${diaActivo.hora_fin}`
    );

    for (
      let turno = new Date(horaInicio);
      turno < horaFin;
      turno = new Date(turno.getTime() + duracionMs)
    ) {
      const iso = turno.toISOString();
      if (!ocupadas.has(iso)) turnosLibres.push(iso);
    }
  }

  return turnosLibres;
}
