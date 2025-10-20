"use client";

import React from "react";
import { useState,useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import {
  UserPlus,
  Heart,
} from "lucide-react";



async function getMedicos() {
  try {
    const response = await fetch("/api/medico", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Error al obtener medicos");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error: ", error);
    return [];
  }
}

export default function  MedicoTab  () {
 const [allMedicos, setAllMedicos] = useState<any[]>([]);
  const [search, setSearch] = useState("");

   useEffect(() => {
      const fetchMedicos = async () => {
        const data = await getMedicos();
        setAllMedicos(Array.isArray(data) ? data : []);
      };
  
      fetchMedicos();
    }, []);
  
  return (
    <TabsContent value="medicos" className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Médicos</h2>
        <Button onClick={() => (window.location.href = "/admin/medicos/nuevo")}>
          <UserPlus className="h-4 w-4 mr-2" />
          Registrar Nuevo Médico
        </Button>
      </div>

      <div className="grid gap-4">
        {allMedicos.map((medico) => (
          <Card key={medico.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-accent/10 p-2 rounded-lg">
                    <Heart className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">{medico.nombre} {medico.apellido}</p>
                    <p className="text-sm text-muted-foreground">
                      {medico.especialidad}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      medico.estado === "activo" ? "default" : "secondary"
                    }
                  >
                    {medico.estado}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      (window.location.href = `/administrativo/medicos/${medico.id}/agenda`)
                    }
                  >
                    {medico.agenda ? "Modificar Agenda" : "Crear Agenda"}
                  </Button>
                  <Button
                    onClick={() =>
                      (window.location.href = `../administrativo/medicos/${medico.id}/TurnosMedico`)
                    }
                    variant="outline"
                    size="sm"
                  >
                    Ver Turnos Medico
                  </Button>
                  <Button
                    variant={
                      medico.estado === "activo" ? "destructive" : "default"
                    }
                    size="sm"
                  >
                    {medico.estado === "activo" ? "Inhabilitar" : "Habilitar"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </TabsContent>
  );
};
