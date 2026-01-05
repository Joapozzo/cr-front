import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useAuthStore, isDniDataExpired } from '../authStore';
import { act } from '@testing-library/react';

const localStorageMock = (function () {
    let store: Record<string, string> = {};
    return {
        getItem: function (key: string) {
            return store[key] || null;
        },
        setItem: function (key: string, value: string) {
            store[key] = value.toString();
        },
        removeItem: function (key: string) {
            delete store[key];
        },
        clear: function () {
            store = {};
        }
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

// Mock matchMedia
window.matchMedia = window.matchMedia || function () {
    return {
        matches: false,
        addListener: function () { },
        removeListener: function () { }
    };
};

describe('Auth Store', () => {
    beforeEach(() => {
        // Reset store before each test
        act(() => {
            useAuthStore.setState({
                token: null,
                usuario: null,
                equipos: [],
                isAuthenticated: false,
                dniEscaneado: null,
                isHydrated: true,
            });
        });

        localStorage.clear();

        // Clear cookies
        if (typeof document !== 'undefined') {
            document.cookie.split(";").forEach((c) => {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
        }
    });

    it('should initialize with null user', () => {
        const state = useAuthStore.getState();
        expect(state.usuario).toBeNull();
        expect(state.token).toBeNull();
        expect(state.isAuthenticated).toBe(false);
    });

    it('should set user correctly on login', () => {
        const mockUser = {
            uid: '123',
            email: 'test@test.com',
            // ... other props
        } as any;

        const token = 'test-token-123';

        act(() => {
            useAuthStore.getState().login(token, mockUser);
        });

        const state = useAuthStore.getState();
        expect(state.usuario).toEqual(mockUser);
        expect(state.token).toBe(token);
        expect(state.isAuthenticated).toBe(true);

        // Check cookie
        expect(document.cookie).toContain(`auth-token=${token}`);
    });

    it('should clear user data on logout', () => {
        // Setup initial state directly
        act(() => {
            useAuthStore.setState({
                token: 'token',
                usuario: { uid: '123' } as any,
                isAuthenticated: true
            });
        });

        // Logout
        act(() => {
            useAuthStore.getState().logout();
        });

        const state = useAuthStore.getState();
        expect(state.usuario).toBeNull();
        expect(state.isAuthenticated).toBe(false);
        expect(state.token).toBeNull();
    });

    it('should store scanned DNI data', () => {
        const dniData = {
            dni: '12345678',
            nombre: 'Juan',
            apellido: 'Perez',
            fechaNacimiento: '1990-01-01',
            timestamp: 0
        };

        act(() => {
            useAuthStore.getState().setDniEscaneado(dniData);
        });

        const state = useAuthStore.getState();
        expect(state.dniEscaneado).not.toBeNull();
        expect(state.dniEscaneado?.dni).toBe('12345678');
        expect(state.dniEscaneado?.timestamp).toBeGreaterThan(0);
    });

    it('should set hydrated state', () => {
        act(() => {
            useAuthStore.getState().setHydrated(false);
        });
        expect(useAuthStore.getState().isHydrated).toBe(false);
        act(() => {
            useAuthStore.getState().setHydrated(true);
        });
        expect(useAuthStore.getState().isHydrated).toBe(true);
    });

    it('should clear DNI data', () => {
        const dniData = { dni: '1', nombre: 'Test', apellido: 'T', fechaNacimiento: '', timestamp: Date.now() };
        act(() => {
            useAuthStore.getState().setDniEscaneado(dniData);
        });
        expect(useAuthStore.getState().dniEscaneado).not.toBeNull();

        act(() => {
            useAuthStore.getState().clearDniEscaneado();
        });
        expect(useAuthStore.getState().dniEscaneado).toBeNull();
    });
});

describe('Auth Helpers', () => {
    it('should return true if DNI data is expired', () => {
        const expiredData = { dni: '1', nombre: 'A', apellido: 'B', fechaNacimiento: '', timestamp: Date.now() - (25 * 60 * 60 * 1000) };
        expect(isDniDataExpired(expiredData)).toBe(true);
    });

    it('should return false if DNI data is valid', () => {
        const validData = { dni: '1', nombre: 'A', apellido: 'B', fechaNacimiento: '', timestamp: Date.now() - (1 * 60 * 60 * 1000) };
        expect(isDniDataExpired(validData)).toBe(false);
    });
});
