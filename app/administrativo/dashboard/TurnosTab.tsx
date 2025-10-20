import React, { useMemo, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TabsContent } from "@/components/ui/tabs"
import { Clock } from "lucide-react"
import {turnosAgendados } from '@/app/data/Info'
import { pacientes } from '../../data/Info';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import FiltrosTurnos from './FiltrosTurnos';

export const TurnosTab = () => {
  const [filters, setFilters] = useState<{medico?: string; fechaInicio?: string; fechaFin?: string}>({});

  const filteredTurnos = useMemo(() => {
    return turnosAgendados.filter((turno) => {
      if (filters.medico && filters.medico !== '' && turno.medico !== filters.medico) {
        return false;
      }

      if ((filters.fechaInicio && filters.fechaInicio !== '') || (filters.fechaFin && filters.fechaFin !== '')) {
        const turnoDate = new Date(turno.fecha);

        if (filters.fechaInicio && filters.fechaInicio !== '') {
          const start = new Date(filters.fechaInicio);
          
          start.setHours(0,0,0,0);
          turnoDate.setHours(12,0,0,0);
          if (turnoDate < start) return false;
        }

        if (filters.fechaFin && filters.fechaFin !== '') {
          const end = new Date(filters.fechaFin);
          end.setHours(23,59,59,999);
          turnoDate.setHours(12,0,0,0);
          if (turnoDate > end) return false;
        }
      }

      return true;
    });
  }, [filters]);

  return (
    <>
      

    <TabsContent value="turnos" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestión de Turnos</h2>
            </div>
      <FiltrosTurnos filters={filters} onChange={setFilters} />
    <Table className="w-full text-sm">
      <TableHeader>
        <TableRow>
          <TableHead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">Paciente</TableHead>
          <TableHead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">Médico</TableHead>
          <TableHead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">Fecha</TableHead>
          <TableHead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">Hora</TableHead>
          <TableHead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">Consultorio</TableHead>
          <TableHead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"> Acciones</TableHead>
        
        </TableRow>
      </TableHeader>
      <TableBody>
  {filteredTurnos.map((turno) => (
          <TableRow key={turno.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <TableCell>{turno.paciente}</TableCell>
            <TableCell>{turno.medico}</TableCell>
            <TableCell>{turno.fecha}</TableCell>
            <TableCell>{turno.hora}</TableCell>
            <TableCell>{turno.direccion}</TableCell>
            <TableCell>  <Button
                          variant="outline"
                          size="sm"
                          onClick={() => (window.location.href = `../administrativo/turnos/${turno.id}`)}
                        >
                          Ver Detalle
                        </Button></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
          </TabsContent>
    </>

  )
}

