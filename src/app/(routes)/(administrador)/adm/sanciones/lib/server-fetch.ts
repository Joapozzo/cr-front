import { cookies } from 'next/headers';
import { getApiBaseUrl } from '@/app/lib/api';
import { CategoriaActual } from '@/app/types/categoria';
import { SancionesResponse } from '@/app/types/sancion';

/**
 * Server-side fetch utility for fetching data with authentication
 */
async function serverFetch<T>(endpoint: string): Promise<T> {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    const baseUrl = getApiBaseUrl();
    const url = `${baseUrl}${endpoint}`;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    try {
        const response = await fetch(url, {
            headers,
            cache: 'no-store', // Always fetch fresh data on server
        });

        if (!response.ok) {
            // If unauthorized, return null to let client handle it
            if (response.status === 401 || response.status === 403) {
                return null as T;
            }
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        // Return null on error, client will handle fetching
        return null as T;
    }
}

/**
 * Fetch categorías activas on the server
 */
export async function fetchCategoriasActivas(): Promise<CategoriaActual[] | null> {
    try {
        const data = await serverFetch<CategoriaActual[]>('/admin/categorias/actuales/activas');
        return data;
    } catch (error) {
        console.error('Error fetching categorías activas:', error);
        return null;
    }
}

/**
 * Fetch sanciones por categoría on the server
 */
export async function fetchSancionesPorCategoria(
    id_categoria_edicion: number
): Promise<SancionesResponse | null> {
    if (!id_categoria_edicion || id_categoria_edicion <= 0) {
        return null;
    }

    try {
        const data = await serverFetch<SancionesResponse>(
            `/admin/sanciones/categoria/${id_categoria_edicion}`
        );
        return data;
    } catch (error) {
        console.error('Error fetching sanciones por categoría:', error);
        return null;
    }
}

