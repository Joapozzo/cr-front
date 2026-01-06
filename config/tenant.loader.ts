import fs from 'fs';
import path from 'path';

export interface TenantConfig {
    id: string;
    nombre_empresa: string;
    nombre_corto: string;
    branding: {
        logo_principal: string;
        logo_header: string;
        favicon: string;
        titulo_pagina: string;
    };
    colores: {
        primario: string;
        secundario: string;
        acento: string;
        success: string;
        danger: string;
        warning: string;
    };
    features: {
        sistema_pagos: boolean;
        mercado_jugadores: boolean;
        dreamteam: boolean;
        inscripciones_online: boolean;
        validacion_dni_biometrica: boolean;
        caja_diaria: boolean;
    };
    reglas_negocio: {
        requiere_validacion_dni: boolean;
        permite_cambios_durante_partido: boolean;
        calculo_tabla_custom: boolean;
    };
    contacto: {
        email: string;
        telefono: string;
        direccion: string;
        redes: {
            instagram: string;
            facebook: string;
        };
    };
}

let tenantConfig: TenantConfig | null = null;

export const loadTenantConfig = (): TenantConfig => {
    if (tenantConfig) {
        return tenantConfig;
    }

    // Lee de variable de entorno
    const tenantId = process.env.TENANT_ID || 'coparelampago';

    const configPath = path.join(
        __dirname,
        'tenants',
        `${tenantId}.json`
    );

    try {
        const configFile = fs.readFileSync(configPath, 'utf-8');
        tenantConfig = JSON.parse(configFile);

        console.log(`✅ Configuración cargada para: ${tenantConfig?.nombre_empresa}`);

        return tenantConfig as TenantConfig;
    } catch (error) {
        console.error(`❌ Error al cargar configuración para tenant: ${tenantId}`);
        throw error;
    }
};

// Singleton para acceso rápido
export const getTenantConfig = (): TenantConfig => {
    if (!tenantConfig) {
        return loadTenantConfig();
    }
    return tenantConfig;
};

// Helper para verificar features
export const hasFeature = (feature: keyof TenantConfig['features']): boolean => {
    const config = getTenantConfig();
    return config.features[feature];
};