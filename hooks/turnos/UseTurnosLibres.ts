"use client";
import { useState, useEffect, useRef } from "react";

interface DiaSemana {
  dia_semana: number; // 0=domingo ... 6=sábado
  hora_inicio: string; // formato "HH:MM"
  hora_fin: string;    // formato "HH:MM"
}

interface Agenda {
  fechainiciovigencia: string;
  fechafinvigencia: string;
  duracionturno: number;
  dia_semana: DiaSemana[];
}

interface TurnoBody {
  legajo_medico: number;
  dni_paciente: number;
  fecha_hora_turno: Date | string;
  id_especialidad: number;
  id_obra: string | null;
  turno_pagado?: boolean;
  estado_turno: string;
  turno_modificado?: boolean;
  presencia_turno?: boolean;
}

interface Resultado {
  libres: string[];

}

/**
 * Calcula los turnos libres de un médico según su agenda y turnos ocupados.
 * @param legajoMedico - Legajo del médico (number)
 */

export function useTurnosLibres(especialidad: number, legajoMedico?: number) {
  const [data, setData] = useState<{ libres: string[] }>({ libres: [] });
  const [agendas, setAgendas] = useState<any[]>([]);
  const [turnosMedico, setTurnosMedico] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const esp = useRef<number>(0); // guarda la última especialidad consultada

  // Buscar turnos libres por médico (cuando hay médico seleccionado)
  useEffect(() => {
    if (!legajoMedico) return;
    if (esp.current === 0) return; // si venía de una búsqueda por especialidad, no repetir

    const fetchDatosMedico = async () => {
      try {
        setLoading(true);
        setError(null);
           //  Obtener datos del médico
        const resEsp = await fetch(`/api/medico/${legajoMedico}`);
        const jsonEsp = await resEsp.json();
        if (!resEsp.ok) throw new Error(jsonEsp.error || "Error al cargar esp medico ");

        const especialidadMedico: number = jsonEsp.id_especialidad
          ? jsonEsp.id_especialidad
          : [jsonEsp.id_especialidad];
          if (especialidadMedico!=especialidad) return;
        //  Obtener agenda del médico
        const resAgenda = await fetch(`/api/agenda/${legajoMedico}`);
        const jsonAgenda = await resAgenda.json();
        if (!resAgenda.ok) throw new Error(jsonAgenda.error || "Error al cargar agenda");

        const agenda: Agenda[] = Array.isArray(jsonAgenda.agenda)
          ? jsonAgenda.agenda
          : [jsonAgenda.agenda];

        // Obtener turnos ocupados de ese médico
        const resTurnos = await fetch(`/api/turnos/por-medico?legajo_medico=${legajoMedico}`);
        const jsonTurnos = await resTurnos.json();
        if (!resTurnos.ok) throw new Error(jsonTurnos.error || "Error al cargar turnos");

        const turnosOcupados: TurnoBody[] = jsonTurnos;

        // Generar turnos libres
        const libres = generarTurnosLibres(agenda, turnosOcupados);

        setData({ libres });
        setAgendas(agenda);
        setTurnosMedico(turnosOcupados);

        console.log(` Turnos libres médico ${legajoMedico}:`, libres.length);
      } catch (err: any) {
        setError(err.message);
        console.error("Error en fetchDatosMedico:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDatosMedico();
  }, [legajoMedico]);

  //  Buscar agendas y turnos de todos los médicos de una especialidad
  useEffect(() => {
    if (!especialidad || legajoMedico) return; // solo si hay especialidad y no hay médico
    if (especialidad === esp.current) return; // evitar repetir misma especialidad

    esp.current = especialidad; // actualiza el ref

    const fetchDatosEspecialidad = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener agendas de todos los médicos de la especialidad
        const resAgendas = await fetch(
          `/api/agenda/por-especialidad?id_especialidad=${encodeURIComponent(especialidad)}`
        );
        const jsonAgendas = await resAgendas.json();
        if (!resAgendas.ok) throw new Error(jsonAgendas.error || "Error al obtener agendas");
        const agendasData: Agenda[] = Array.isArray(jsonAgendas) ? jsonAgendas : [];
        setAgendas(agendasData);

        // Obtener turnos ocupados de todos los médicos de la especialidad
        const resTurnos = await fetch(
          `/api/turnos/por-especialidad?id_especialidad=${encodeURIComponent(especialidad)}`,
          { cache: "no-store" }
        );
        const jsonTurnos = await resTurnos.json();
        if (!resTurnos.ok) throw new Error(jsonTurnos.error || "Error al obtener turnos");
        const turnosOcupados: TurnoBody[] = Array.isArray(jsonTurnos) ? jsonTurnos : [];
        setTurnosMedico(turnosOcupados);

        //Generar turnos libres combinando todas las agendas
        const libres = generarTurnosLibres(agendasData, turnosOcupados);
        setData({ libres });

        console.log(" Agendas cargadas:", agendasData.length);
        console.log(" Turnos cargados:", turnosOcupados.length);
        console.log(" Turnos libres generados:", libres.length);
      } catch (err: any) {
        setError(err.message);
        console.error("Error en fetchDatosEspecialidad:", err);
        setAgendas([]);
        setTurnosMedico([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDatosEspecialidad();
  }, [especialidad]);

  return { ...data, agendas, turnosMedico, loading, error };
}

function parseDuracionToMinutos(duracion: string | number): number {
  if (typeof duracion === "number") return duracion;
  const [hh, mm, ss] = duracion.split(":").map(Number);
  return hh * 60 + mm + Math.round(ss / 60);
}

export function generarTurnosLibres(
  agendas: Agenda[],
  turnosOcupados: TurnoBody[]
): string[] {
  const turnosLibres: string[] = [];

  const ocupadas = new Set(
    turnosOcupados.map((t) =>
      new Date(t.fecha_hora_turno).toISOString().slice(0, 16)
    )
  );

  const hoy = new Date();
  const limite = new Date();
  limite.setDate(hoy.getDate() + 30);

  for (const agenda of agendas) {
    const inicioAgenda = new Date(agenda.fechainiciovigencia);
    const finAgenda = new Date(agenda.fechafinvigencia);
    const duracionMin = parseDuracionToMinutos(agenda.duracionturno);
    const duracionMs = duracionMin * 60 * 1000;

    let fecha = new Date(Math.max(hoy.getTime(), inicioAgenda.getTime()));

    while (fecha <= finAgenda && fecha <= limite) {
      const dia = fecha.getDay() === 0 ? 7 : fecha.getDay(); // ajuste domingo=7
      const diaActivo = agenda.dia_semana.find((d) => d.dia_semana === dia);
      if (!diaActivo) {
        fecha.setDate(fecha.getDate() + 1);
        continue;
      }

      const fechaISO = fecha.toISOString().split("T")[0];
      const horaInicio = new Date(`${fechaISO}T${diaActivo.hora_inicio}`);
      const horaFin = new Date(`${fechaISO}T${diaActivo.hora_fin}`);


      for (
        let turno = new Date(horaInicio);
        turno < horaFin;
        turno = new Date(turno.getTime() + duracionMs)
      ) {
        const isoTurno = turno.toISOString().slice(0, 16);
        if (!ocupadas.has(isoTurno)) {
          turnosLibres.push(isoTurno);
        }
      }

      fecha.setDate(fecha.getDate() + 1);
    }
  }

  return turnosLibres;
}

// export function generarTurnosLibres(
//   agendas: Agenda[],
//   turnosOcupados: TurnoBody[]
// ): string[] {
//   const turnosLibres: string[] = [];

//   //  Normalizamos los turnos ocupados en un Set para búsquedas rápidas
//   const ocupadas = new Set(
//     turnosOcupados.map((t) =>
//       new Date(t.fecha_hora_turno).toISOString().slice(0, 16) // minuto exacto
//     )
//   );

//   // 2 Establecemos el rango de fechas: hoy → 30 días adelante
//   const hoy = new Date();
//   const limite = new Date();
//   limite.setDate(hoy.getDate() + 30);

//   //  Recorremos cada agenda (puede ser 1 o varias)
//   for (const agenda of agendas) {
//     const inicioAgenda = new Date(agenda.fechainiciovigencia);
//     const finAgenda = new Date(agenda.fechafinvigencia);
//     const duracionMs = agenda.duracionturno * 60 * 1000;

//     // Fecha inicial de recorrido: la más cercana entre hoy y el inicio de la agenda
//     let fecha = new Date(Math.max(hoy.getTime(), inicioAgenda.getTime()));

//     while (fecha <= finAgenda && fecha <= limite) {
//       const dia = fecha.getDay(); // 0=domingo, 1=lunes...
//       const diaActivo = agenda.dia_semana.find((d) => d.dia_semana === dia);
//       if (!diaActivo) {
//         fecha.setDate(fecha.getDate() + 1);
//         continue;
//       }

//       // Construimos el horario base del día
//       const fechaISO = fecha.toISOString().split("T")[0];
//       const horaInicio = new Date(`${fechaISO}T${diaActivo.hora_inicio}:00`);
//       const horaFin = new Date(`${fechaISO}T${diaActivo.hora_fin}:00`);

//       for (
//         let turno = new Date(horaInicio);
//         turno < horaFin;
//         turno = new Date(turno.getTime() + duracionMs)
//       ) {
//         const isoTurno = turno.toISOString().slice(0, 16); // minuto exacto
//         if (!ocupadas.has(isoTurno)) {
//           turnosLibres.push(isoTurno);
//         }
//       }

//       fecha.setDate(fecha.getDate() + 1);
//     }
//   }

//   return turnosLibres;
// }
