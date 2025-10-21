import React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Edit,
  UserX,
  RotateCcw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const InfoTurno = ({ turno }: any) => {
  return (
    <>
      {/* Turno Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Información del Turno
            </CardTitle>
            <Badge
              variant={
                turno.estado === "confirmado"
                  ? "default"
                  : turno.estado === "pendiente de pago"
                  ? "secondary"
                  : "destructive"
              }
            >
              {turno.estado}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Fecha</p>
                <p className="font-medium">{turno.fecha}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Hora</p>
                <p className="font-medium">
                  {turno.hora} ({turno.duracion})
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Obra Social</p>
                <p className="font-medium">{turno.paciente.obraSocial}</p>
              </div>
            </div>
          </div>

          {/* <div>
                  <p className="text-sm text-muted-foreground">Motivo de la consulta</p>
                  <p className="font-medium">{turno.motivo}</p>
                </div> */}

          {/* {turno.observaciones && (
                  <div>
                    <p className="text-sm text-muted-foreground">Observaciones</p>
                    <p className="font-medium">{turno.observaciones}</p>
                  </div>
                )} */}
        </CardContent>
      </Card>
    </>
  );
};

export default InfoTurno;
