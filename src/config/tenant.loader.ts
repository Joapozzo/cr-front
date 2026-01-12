// Importar JSONs directamente en lugar de usar fs (funciona en Vercel)
import coparelampagoConfig from '../../config/tenants/coparelampago.json';
import ucfaConfig from '../../config/tenants/ucfa.json';

export interface TenantConfig {
    id: string;
    nombre_empresa: string;
    nombre_corto: string;
    tipo_futbol: "futbol-7" | "futbol-11";
    branding: {
        logo_principal: string;
        logo_header: string;
        favicon: string;
        titulo_pagina: string;
        favicons_path: string;
    };
    imagenes: {
        hero: string;
        hero_mobile: string;
        about: string;
        login: string;
    };
    seo: {
        keywords: string[];
        description: string;
        tipo_torneo: string;
    };
    colores: {
        primary: string;
        primaryStrong: string;
        secondary: string;
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

// Mapa de configuraciones por tenant ID
const tenantConfigs: Record<string, TenantConfig> = {
    'coparelampago': coparelampagoConfig as TenantConfig,
    'ucfa': ucfaConfig as TenantConfig,
};

let tenantConfig: TenantConfig | null = null;

export const loadTenantConfig = (): TenantConfig => {
    if (tenantConfig) {
        return tenantConfig;
    }

    // Lee de variable de entorno (NEXT_PUBLIC_ para acceso en cliente)
    const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || process.env.TENANT_ID || 'coparelampago';

    // Buscar configuración en el mapa
    const config = tenantConfigs[tenantId];

    if (!config) {
        console.error(`❌ Configuración no encontrada para tenant: ${tenantId}`);
        console.log(`✅ Tenants disponibles: ${Object.keys(tenantConfigs).join(', ')}`);
        
        // Fallback a coparelampago si no se encuentra
        if (tenantConfigs['coparelampago']) {
            console.warn(`⚠️ Usando configuración por defecto: coparelampago`);
            tenantConfig = tenantConfigs['coparelampago'] as TenantConfig;
            return tenantConfig;
        }
        
        throw new Error(`Tenant configuration not found: ${tenantId}`);
    }

    tenantConfig = config;
    console.log(`✅ Configuración cargada para: ${tenantConfig.nombre_empresa}`);

    return tenantConfig;
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

