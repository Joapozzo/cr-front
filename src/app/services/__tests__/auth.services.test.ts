import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../auth.services';
import { api } from '../../lib/api';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    sendPasswordResetEmail
} from 'firebase/auth';

// Mock API
vi.mock('../../lib/api', () => ({
    api: {
        post: vi.fn(),
        get: vi.fn(),
    },
    getApiBaseUrl: vi.fn(() => 'http://localhost:3000'),
    getApiUrl: vi.fn(() => 'http://localhost:3000'),
}));

// Mock Firebase Config
vi.mock('../../lib/firebase.config', () => ({
    auth: { currentUser: null },
}));

// Mock Firebase Auth
vi.mock('firebase/auth', async () => {
    const actual = await vi.importActual('firebase/auth');
    return {
        ...actual,
        createUserWithEmailAndPassword: vi.fn(),
        signInWithEmailAndPassword: vi.fn(),
        signInWithPopup: vi.fn(),
        GoogleAuthProvider: vi.fn(),
        sendEmailVerification: vi.fn(),
        signOut: vi.fn(),
        sendPasswordResetEmail: vi.fn(),
    };
});

describe('Auth Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('loginConEmail', () => {
        it('should login with valid credentials', async () => {
            const mockUser = { uid: 'test-uid', email: 'test@test.com' };
            (signInWithEmailAndPassword as any).mockResolvedValue({ user: mockUser });

            const result = await authService.loginConEmail('test@test.com', 'password123');

            expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'test@test.com', 'password123');
            expect(result.success).toBe(true);
            expect(result.user).toBe(mockUser);
        });

        it('should return error with invalid credentials', async () => {
            const err = new Error('Auth Error');
            (err as any).code = 'auth/wrong-password';
            (signInWithEmailAndPassword as any).mockRejectedValue(err);

            const result = await authService.loginConEmail('test@test.com', 'wrongpassword');

            expect(result.success).toBe(false);
            expect(result.error).toBe('Contraseña incorrecta');
        });
    });

    describe('registrarseConEmail', () => {
        it('should register new user correctly', async () => {
            const mockUser = { uid: 'new-uid', email: 'new@test.com', getIdToken: vi.fn().mockResolvedValue('token') };
            (createUserWithEmailAndPassword as any).mockResolvedValue({ user: mockUser });
            (api.post as any).mockResolvedValue({ success: true });

            global.fetch = vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({ success: true }),
            } as Response);

            const result = await authService.registrarseConEmail('new@test.com', 'password123');

            expect(createUserWithEmailAndPassword).toHaveBeenCalled();
            expect(sendEmailVerification).toHaveBeenCalled();
            expect(result.success).toBe(true);
        });
    });

    describe('loginConGoogle', () => {
        it('should login with google successfully', async () => {
            const mockUser = { uid: 'google-uid', email: 'google@test.com' };
            (signInWithPopup as any).mockResolvedValue({ user: mockUser });

            const result = await authService.loginConGoogle();

            expect(GoogleAuthProvider).toHaveBeenCalled();
            expect(signInWithPopup).toHaveBeenCalled();
            expect(result.success).toBe(true);
            expect(result.user).toBe(mockUser);
        });

        it('should handle google login cancel', async () => {
            const err = new Error('Popup closed');
            (err as any).code = 'auth/popup-closed-by-user';
            (signInWithPopup as any).mockRejectedValue(err);

            const result = await authService.loginConGoogle();
            expect(result.success).toBe(false);
            expect(result.error).toContain('Ventana cerrada');
        });
    });

    describe('cerrarSesion', () => {
        it('should sign out successfully', async () => {
            (signOut as any).mockResolvedValue(undefined);

            const result = await authService.cerrarSesion();
            expect(signOut).toHaveBeenCalled();
            expect(result.success).toBe(true);
        });
    });

    describe('recuperarPassword', () => {
        it('should send reset email', async () => {
            (sendPasswordResetEmail as any).mockResolvedValue(undefined);

            const result = await authService.recuperarPassword('reset@test.com');
            expect(sendPasswordResetEmail).toHaveBeenCalledWith(expect.anything(), 'reset@test.com', expect.any(Object));
            expect(result.success).toBe(true);
        });
    });

    describe('verificarDisponibilidad', () => {
        it('should check username availability', async () => {
            (api.get as any).mockResolvedValue({ username: { disponible: true, mensaje: 'OK' } });

            const result = await authService.verificarDisponibilidad('username', 'testuser');

            expect(api.get).toHaveBeenCalledWith(expect.stringContaining('/auth/verificar-disponibilidad'));
            expect(result.disponible).toBe(true);
        });
    });

    describe('procesarLoginBackend', () => {
        it('should calls api.post with correct uid', async () => {
            const mockResponse = { success: true, usuario: { id: 1 } };
            (api.post as any).mockResolvedValue(mockResponse);

            const result = await authService.procesarLoginBackend('user-uid');

            expect(api.post).toHaveBeenCalledWith('/auth/login', { uid: 'user-uid' });
            expect(result).toEqual(mockResponse);
        });
    });
});
