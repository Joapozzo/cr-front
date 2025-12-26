/**
 * TYPES PARA INSCRIPCIONES Y PAGOS
 */

export interface InscripcionEquipo {
    id_inscripcion: number;
    id_equipo: number;
    id_categoria_edicion: number;
    monto_total: number;
    monto_pagado: number;
    monto_pendiente: number;
    estado_pago: 'PENDIENTE' | 'PARCIAL' | 'PAGADO';
    fecha_limite?: Date | string;
    habilitado: boolean;
    observaciones?: string;
    creado_en: Date | string;
    actualizado_en: Date | string;
    equipo?: EquipoInscripcion;
    categoriaEdicion?: CategoriaEdicionInscripcion;
    pagos?: PagoInscripcion[];
}

export interface EquipoInscripcion {
    id_equipo: number;
    nombre: string;
    img?: string;
}

export interface CategoriaEdicionInscripcion {
    id_categoria_edicion: number;
    categoria?: {
        division?: {
            nombre: string;
        };
        nombreCategoria?: {
            nombre_categoria: string;
        };
    };
}

export interface PagoInscripcion {
    id_pago_inscripcion: number;
    id_inscripcion: number;
    monto: number;
    metodo_pago: 'EFECTIVO' | 'TRANSFERENCIA' | 'MERCADOPAGO';
    comprobante_url?: string;
    numero_operacion?: string;
    banco_origen?: string;
    observaciones?: string;
    registrado_por: string;
    fecha_pago: Date | string;
    estado: 'APROBADO' | 'PENDIENTE' | 'RECHAZADO';
    inscripcion?: InscripcionEquipo;
    registrador?: {
        nombre: string;
        apellido: string;
    };
}

export interface CrearPagoEfectivoInput {
    id_inscripcion: number;
    monto: number;
    observaciones?: string;
}

export interface CrearPagoTransferenciaInput {
    id_inscripcion: number;
    monto: number;
    numero_operacion: string;
    banco_origen: string;
    comprobante_url?: string;
    observaciones?: string;
}

export interface ValidarTransferenciaInput {
    aprobada: boolean;
    motivo?: string;
    id_caja?: number;
}

export interface InscripcionesConDeudaResponse {
    inscripciones: InscripcionEquipo[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        totalPages: number;
    };
}

export interface TransferenciasPendientesResponse {
    pagos: PagoInscripcion[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        totalPages: number;
    };
}

