"use client";
import PartidoHeaderSticky from "@/app/components/partido/CardPartidoHeader";
import PartidoTabs from "@/app/components/partido/CardTeamsAndIncidents";
import JugadoresTabsUnified from "@/app/components/partido/JugadoresTabsUnified";
import { useUltimoYProximoPartido } from "@/app/hooks/usePartidosEquipo";
import { IncidenciaPartido, JugadorPlantel } from "@/app/types/partido";

const jugadoresLocal: JugadorPlantel[] = [
    {
        id_jugador: 1,
        id_equipo: 9,
        nombre: 'Lionel',
        apellido: 'Messi',
        dorsal: 10,
        capitan: true,
        eventual: 'N',
        sancionado: 'N',
        destacado: true,
        fecha_adicion: new Date('2025-01-15'),
        posicion: { codigo: 'DEL', nombre: 'Delantero' },
        dni: '12345678',
        img: '/img/messi.png',
        nacimiento: new Date('1987-06-24')
    },
    {
        id_jugador: 2,
        id_equipo: 9,
        nombre: 'Paulo',
        apellido: 'Dybala',
        dorsal: 21,
        capitan: false,
        eventual: 'N',
        sancionado: 'N',
        destacado: false,
        fecha_adicion: new Date('2025-01-15'),
        posicion: { codigo: 'DEL', nombre: 'Delantero' },
        dni: '23456789',
        img: '/img/dybala.png',
        nacimiento: new Date('1993-11-15')
    },
    {
        id_jugador: 3,
        id_equipo: 9,
        nombre: 'Emiliano',
        apellido: 'Martínez',
        dorsal: 1,
        capitan: false,
        eventual: 'N',
        sancionado: 'N',
        destacado: false,
        fecha_adicion: new Date('2025-01-15'),
        posicion: { codigo: 'ARQ', nombre: 'Arquero' },
        dni: '34567890',
        img: '/img/emi-martinez.png',
        nacimiento: new Date('1992-09-02')
    },
    {
        id_jugador: 4,
        id_equipo: 9,
        nombre: 'Nicolás',
        apellido: 'Otamendi',
        dorsal: 19,
        capitan: false,
        eventual: 'N',
        sancionado: 'S',
        destacado: false,
        fecha_adicion: new Date('2025-01-15'),
        posicion: { codigo: 'DEF', nombre: 'Defensor Central' },
        dni: '45678901',
        img: '/img/otamendi.png',
        nacimiento: new Date('1988-02-12')
    }
];

const jugadoresVisita: JugadorPlantel[] = [
    {
        id_jugador: 5,
        id_equipo: 10,
        nombre: 'Neymar',
        apellido: 'Jr',
        dorsal: 10,
        capitan: true,
        eventual: 'N',
        sancionado: 'N',
        destacado: false,
        fecha_adicion: new Date('2025-01-15'),
        posicion: { codigo: 'DEL', nombre: 'Delantero' },
        dni: '56789012',
        img: '/img/neymar.png',
        nacimiento: new Date('1992-02-05')
    },
    {
        id_jugador: 6,
        id_equipo: 10,
        nombre: 'Kylian',
        apellido: 'Mbappé',
        dorsal: 7,
        capitan: false,
        eventual: 'N',
        sancionado: 'N',
        destacado: false,
        fecha_adicion: new Date('2025-01-15'),
        posicion: { codigo: 'DEL', nombre: 'Delantero' },
        dni: '67890123',
        img: '/img/mbappe.png',
        nacimiento: new Date('1998-12-20')
    },
    {
        id_jugador: 7,
        id_equipo: 10,
        nombre: 'Sergio',
        apellido: 'Ramos',
        dorsal: 4,
        capitan: false,
        eventual: 'N',
        sancionado: 'N',
        destacado: false,
        fecha_adicion: new Date('2025-01-15'),
        posicion: { codigo: 'DEF', nombre: 'Defensor Central' },
        dni: '78901234',
        img: '/img/ramos.png',
        nacimiento: new Date('1986-03-30')
    }
];

const incidencias: IncidenciaPartido[] = [
    {
        tipo: 'gol',
        id: 1,
        id_jugador: 1,
        id_equipo: 9,
        minuto: 15,
        nombre: 'Lionel',
        apellido: 'Messi',
        penal: 'N',
        en_contra: 'N'
    },
    {
        tipo: 'asistencia',
        id: 2,
        id_jugador: 2,
        id_equipo: 9,
        minuto: 15,
        nombre: 'Paulo',
        apellido: 'Dybala',
        id_gol: 1
    },
    {
        tipo: 'amarilla',
        id: 3,
        id_jugador: 7,
        id_equipo: 10,
        minuto: 23,
        nombre: 'Sergio',
        apellido: 'Ramos'
    },
    {
        tipo: 'gol',
        id: 4,
        id_jugador: 2,
        id_equipo: 9,
        minuto: 34,
        nombre: 'Paulo',
        apellido: 'Dybala',
        penal: 'S',
        en_contra: 'N'
    },
    {
        tipo: 'amarilla',
        id: 5,
        id_jugador: 3,
        id_equipo: 9,
        minuto: 42,
        nombre: 'Emiliano',
        apellido: 'Martínez'
    },
    {
        tipo: 'gol',
        id: 6,
        id_jugador: 5,
        id_equipo: 10,
        minuto: 56,
        nombre: 'Neymar',
        apellido: 'Jr',
        penal: 'N',
        en_contra: 'N'
    },
    {
        tipo: 'asistencia',
        id: 7,
        id_jugador: 6,
        id_equipo: 10,
        minuto: 56,
        nombre: 'Kylian',
        apellido: 'Mbappé',
        id_gol: 6
    },
    {
        tipo: 'amarilla',
        id: 8,
        id_jugador: 6,
        id_equipo: 10,
        minuto: 67,
        nombre: 'Kylian',
        apellido: 'Mbappé'
    },
    {
        tipo: 'roja',
        id: 9,
        id_jugador: 4,
        id_equipo: 9,
        minuto: 78,
        nombre: 'Nicolás',
        apellido: 'Otamendi'
    },
    {
        tipo: 'gol',
        id: 10,
        id_jugador: 1,
        id_equipo: 9,
        minuto: 85,
        nombre: 'Lionel',
        apellido: 'Messi',
        penal: 'N',
        en_contra: 'N'
    },
    {
        tipo: 'asistencia',
        id: 11,
        id_jugador: 2,
        id_equipo: 9,
        minuto: 85,
        nombre: 'Paulo',
        apellido: 'Dybala',
        id_gol: 10
    },
    {
        tipo: 'amarilla',
        id: 12,
        id_jugador: 7,
        id_equipo: 10,
        minuto: 90,
        nombre: 'Sergio',
        apellido: 'Ramos'
    }
];

export default function Page() {
    const { data: partidosData, isLoading: isLoadingProximoPartido } = useUltimoYProximoPartido(10, 44);

    return (
        <div className="min-h-screen p-4 flex flex-col gap-6 max-w-4xl mx-auto">
            <PartidoHeaderSticky
                partido={partidosData?.proximo}
                goles={partidosData?.ultimo?.incidencias.goles}
            />
            <JugadoresTabsUnified
                mode="view"  // ← Modo solo lectura
                equipoLocal={{
                    id_equipo: 9,  // ← Agregar ID
                    nombre: 'River Plate',
                    jugadores: jugadoresLocal
                }}
                equipoVisita={{
                    id_equipo: 10,  // ← Agregar ID
                    nombre: 'Boca Juniors',
                    jugadores: jugadoresVisita
                }}
                incidencias={incidencias}
                destacados={jugadoresLocal.filter(j => j.destacado).map(j => ({
                    id_jugador: j.id_jugador,
                    id_equipo: j.id_equipo
                }))}
            />
        </div>
    );
}