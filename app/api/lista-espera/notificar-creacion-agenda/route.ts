import { NextRequest, NextResponse } from "next/server";
import { sendReintegroNotification } from "@/hooks/email-resend-reintegro";
import { sendTurnoLiberadoNotification } from "@/hooks/email-resend-lista-espera";
import { createClient } from "@supabase/supabase-js";
import { sendTurnosLiberadosNotification } from "@/hooks/email-resend-turnos-liberados";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { legajo_medico, nombre, apellido, id_especialidad, descripcion } =
        body;

    //esto es para que chequear que falten mas de 24 horas para el turno
    //segun los que pusimos en el ers
    console.log("Hola como estas, lleguea la api de notificar creacion agenda");
    setTimeout(async () => {
        interface Patologia {
            prioridad: "Alta" | "Media" | "Baja";
        }

        interface Profile {
            email: string;
            dni_paciente: string;
        }

        interface Solicitud {
            dni_paciente: string;
            profiles: Profile | null;
            patologia: Patologia | null;
        }

        const { data: listaData, error: listaError } = await supabase
            .from("solicitudes_especialidad")
            .select(`profiles(email,dni_paciente), patologia(prioridad)`)
            .eq("id_especialidad", id_especialidad)
            .returns<Solicitud[]>();
        console.log("lista de espera de la especialidad", listaData);

        const { data: listaDataMedico, error: listaErrorMedico } =
            await supabase
                .from("solicitudes_medico")
                .select(
                    `profiles(email,dni_paciente), patologia(prioridad)`,
                )
                .eq("legajo_medico", legajo_medico)
                .eq("id_especialidad", id_especialidad)
                .returns<Solicitud[]>();

        console.log("lista medico", listaDataMedico);

        if (listaError || !listaData) {
            console.error("Error obteniendo lista de espera:", listaError);
            return;
        }

        if (listaErrorMedico || !listaDataMedico) {
            console.error(
                "Error obteniendo lista de espera por médico:",
                listaErrorMedico,
            );
            return;
        }

        const alta = listaData.filter(
            (item) => item.patologia?.prioridad === "Alta",
        );
        const media = listaData.filter(
            (item) => item.patologia?.prioridad === "Media",
        );
        const baja = listaData.filter(
            (item) => item.patologia?.prioridad === "Baja",
        );

        alta.forEach(async (item) => {
            const email = item.profiles?.email;
            if (email) {
                await sendTurnosLiberadosNotification({
                    pacienteEmail: email,
                    nombre: nombre,
                    apellido: apellido,
                    especialidad: descripcion,
                });
                console.log(
                    "Dni del paciente al que se le va a eliminar la solicirud",
                    item.profiles?.dni_paciente,
                );
                await supabase
                    .from("solicitudes_especialidad")
                    .delete()
                    .eq("id_especialidad", id_especialidad)
                    .eq("dni_paciente", item.profiles?.dni_paciente);
            }
        });

        setTimeout(
            () => {
                media.forEach(async (item) => {
                    const email = item.profiles?.email;
                    if (email) {
                        console.log("por enviar un email a ", email);
                        sendTurnosLiberadosNotification({
                            pacienteEmail: email,
                            nombre: nombre,
                            apellido: apellido,
                            especialidad: descripcion,
                        });
                    }
                });
            },
            60 * 1000, // 1 minuto
        );

        setTimeout(
            () => {
                baja.forEach(async (item) => {
                    const email = item.profiles?.email;
                    if (email) {
                        sendTurnosLiberadosNotification({
                            pacienteEmail: email,
                            nombre: nombre,
                            apellido: apellido,
                            especialidad: descripcion,
                        });
                    }
                });
            },
            2 * 60 * 1000, // 2 minutos
        );

        //ACA FILTRO PARA LAS NOTIFICACIONES DE LA LISTA DE ESPERA PARA UN MEDICO ESPECIFICO
        const altaMedico = listaDataMedico.filter(
            (item) => item.patologia?.prioridad === "Alta",
        );
        const mediaMedico = listaDataMedico.filter(
            (item) => item.patologia?.prioridad === "Media",
        );
        const bajaMedico = listaDataMedico.filter(
            (item) => item.patologia?.prioridad === "Baja",
        );
        altaMedico.forEach(async (item) => {
            const email = item.profiles?.email;
            if (email) {
                sendTurnosLiberadosNotification({
                    pacienteEmail: email,
                    nombre: nombre,
                    apellido: apellido,
                    especialidad: descripcion,
                });
                console.log(
                    "Dni del paciente al que se le va a eliminar la solicitud (por medico)",
                    item?.profiles?.dni_paciente,
                );
                // Eliminar solicitud de lista de espera por médico
                await supabase
                    .from("solicitudes_medico")
                    .delete()
                    .eq("legajo_medico", legajo_medico)
                    .eq("dni_paciente", item.profiles?.dni_paciente)
                    .eq("id_especialidad", id_especialidad);
            }
        });

        setTimeout(
            () => {
                mediaMedico.forEach(async (item) => {
                    const email = item.profiles?.email;
                    if (email) {
                        console.log("por enviar un email a ", email);
                        sendTurnosLiberadosNotification({
                            pacienteEmail: email,
                            nombre: nombre,
                            apellido: apellido,
                            especialidad: descripcion,
                        });
                    }
                });
            },
            60 * 1000, // 1 minuto
        );

        setTimeout(
            () => {
                bajaMedico.forEach(async (item) => {
                    const email = item.profiles?.email;
                    if (email) {
                        sendTurnosLiberadosNotification({
                            pacienteEmail: email,
                            nombre: nombre,
                            apellido: apellido,
                            especialidad: descripcion,
                        });
                    }
                });
            },
            2 * 60 * 1000, // 2 minutos
        );
    }, 0);

    return NextResponse.json({
        success: true,
        message: "Notificaciones enviándose en background.",
    });
}
