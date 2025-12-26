/**
 * TYPES PARA PAGOS DE CANCHA
 */

export interface PagoCancha {
    id_pago: number;
    id_partido: number;
    id_equipo: number;
    monto_total: number;
    monto_pagado: number;
    monto_pendiente: number;
    estado_pago: 'PENDIENTE' | 'PARCIAL' | 'PAGADO' | 'VENCIDO';
    fecha_limite_pago?: Date | string;
    habilitado: boolean;
    creado_en: Date | string;
    actualizado_en: Date | string;
    partido?: PartidoConPago;
    equipo?: EquipoPago;
    transacciones?: TransaccionPagoCancha[];
}

export interface PartidoConPago {
    id_partido: number;
    jornada: number;
    dia?: Date | string;
    hora?: string;
    equipoLocal?: {
        id_equipo: number;
        nombre: string;
        img?: string;
    };
    equipoVisita?: {
        id_equipo: number;
        nombre: string;
        img?: string;
    };
    categoriaEdicion?: {
        id_categoria_edicion: number;
        categoria?: {
            division?: {
                nombre: string;
            };
            nombreCategoria?: {
                nombre_categoria: string;
            };
        };
    };
    cancha_ref?: {
        nombre: string;
        predio?: {
            nombre: string;
        };
    };
    requiere_pago?: boolean;
    pago_habilitado?: boolean;
}

export interface EquipoPago {
    id_equipo: number;
    nombre: string;
    img?: string;
}

export interface TransaccionPagoCancha {
    id_transaccion: number;
    id_pago: number;
    monto: number;
    metodo_pago: 'EFECTIVO' | 'TRANSFERENCIA' | 'MERCADOPAGO' | 'PERDONADO';
    id_mercadopago?: string;
    estado_mp?: string;
    qr_data?: string;
    comprobante_transferencia?: string;
    banco_origen?: string;
    numero_operacion?: string;
    fecha_transaccion: Date | string;
    tipo: 'PAGO' | 'PERDONADO';
    observaciones?: string;
}

export interface CrearPagoEfectivoInput {
    id_pago: number;
    monto: number;
    observaciones?: string;
}

export interface CrearPagoTransferenciaInput {
    id_pago: number;
    monto: number;
    numero_operacion: string;
    banco_origen: string;
    comprobante_transferencia?: string;
    observaciones?: string;
}

export interface QRResponse {
    qr_data: string;
    id_mercadopago: string;
    transaccion: TransaccionPagoCancha;
}

export interface PerdonarDeudaInput {
    motivo: string;
}

export interface PagosPendientesResponse {
    pagos: PagoCancha[];
    pagination: {
        total: number;
        limit: number;
        offset: number;
        totalPages: number;
    };
}

