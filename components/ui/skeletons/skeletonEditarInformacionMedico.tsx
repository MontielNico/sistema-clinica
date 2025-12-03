"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function SkeletonEditarInformacionMedico() {
  return (
    <>
      {/* Botón cancelar */}
      <div className="flex justify-start">
        <Skeleton className="h-10 w-28 rounded-md" />
      </div>

      <Card className="max-w-2xl mx-auto mt-8 shadow-md rounded-xl">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-40" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-56 mt-2" />
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col gap-6">

            {/* Nombre */}
            <div className="grid gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Apellido */}
            <div className="grid gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* DNI */}
            <div className="grid gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Matrícula */}
            <div className="grid gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" /> {/* Select */}
              <Skeleton className="h-4 w-36 mt-2" />
              <Skeleton className="h-10 w-full" /> {/* Input */}
              <Skeleton className="h-3 w-48" />
            </div>

            {/* Especialidades */}
            <div className="grid gap-3">
              <Skeleton className="h-4 w-28" />
              <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto border rounded-lg p-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </div>
            </div>

            {/* Teléfono */}
            <div className="grid gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Tarifa */}
            <div className="grid gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Convenios */}
            <div className="grid gap-4 mt-6">
              <Skeleton className="h-4 w-40" />
              <div className="flex justify-end">
                <Skeleton className="h-8 w-32 rounded-md" />
              </div>

              <div className="border rounded-lg divide-y">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3">
                    <div>
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-32 mt-2" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                ))}
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 mt-4">
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
