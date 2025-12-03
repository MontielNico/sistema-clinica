"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SkeletonHistorialAusencias() {
  return (
      <div>  
      <hr className="w-full border-gray-300 my-4" />

      {/* Botón de volver */}
      <div className="ml-35 mt-5 flex justify-start">
        <Button variant="outline" className="flex items-center gap-2" disabled>
          <ArrowLeft className="h-4 w-4 text-gray-400" />
          Volver
        </Button>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col items-center bg-white py-10 w-full">

        {/* Tabla skeleton */}
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 rounded-lg shadow-lg bg-white">
            <thead>
              <tr>
                {["Fecha", "Nro Turno", "Médico", "Especialidad"].map((_, i) => (
                  <th key={i} className="border border-gray-300 px-4 py-2">
                    <Skeleton className="h-4 w-24 bg-neutral-300" />
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* 5 filas de skeleton */}
              {Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx}>
                  <td className="border border-gray-300 px-4 py-2">
                    <Skeleton className="h-4 w-28 bg-neutral-300" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Skeleton className="h-4 w-20 bg-neutral-300" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Skeleton className="h-4 w-36 bg-neutral-300" />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Skeleton className="h-4 w-40 bg-neutral-300" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
