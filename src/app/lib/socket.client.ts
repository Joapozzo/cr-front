import { io, Socket } from 'socket.io-client';
import { auth, onAuthStateChanged } from '../lib/firebase.config';

/**
 * Cliente Socket.IO singleton
 * Maneja la conexión única con el servidor WebSocket
 */

let socket: Socket | null = null;

/**
 * Obtiene la URL del servidor Socket.IO
 * Socket.IO usa la misma URL HTTP/HTTPS del servidor, no ws:// o wss://
 * IMPORTANTE: 
 * - No debe incluir /socket.io en la URL, Socket.IO lo agrega automáticamente
 * - No debe incluir /api, Socket.IO se conecta a la raíz del servidor
 */
const getSocketUrl = (): string => {
  let url: string;
  
  // Si hay una URL específica para Socket.IO, usarla (debe ser HTTP/HTTPS, no ws://)
  if (process.env.NEXT_PUBLIC_SOCKET_URL) {
    url = process.env.NEXT_PUBLIC_SOCKET_URL;
    // Asegurar que no tenga ws:// o wss://
    url = url.replace(/^wss?:\/\//, 'https://').replace(/^ws:\/\//, 'http://');
  } else if (typeof window !== 'undefined') {
    // En desarrollo, usar la URL del API pero remover /api si existe
    // Socket.IO se conecta a la raíz del servidor, no a /api
    url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  } else {
    url = 'http://localhost:3001';
  }
  
  // IMPORTANTE: Remover /api de la URL porque Socket.IO se conecta a la raíz del servidor
  // El servidor Socket.IO está en la raíz, no en /api/socket.io
  url = url.replace(/\/api\/?$/, '');
  
  // Asegurar que la URL no termine con /socket.io (Socket.IO lo agrega automáticamente)
  url = url.replace(/\/socket\.io\/?$/, '');
  
  // Asegurar que la URL no termine con /
  url = url.replace(/\/$/, '');
  
  // Log para debugging (solo en desarrollo)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔌 Socket.IO URL:', url);
    console.log('🔌 API URL original:', process.env.NEXT_PUBLIC_API_URL);
  }
  
  return url;
};

/**
 * Configura los listeners del socket
 */
function setupSocketListeners(
  socket: Socket,
  socketUrl: string,
  getAuthToken: () => Promise<string | null>
) {
  // Manejar eventos de conexión
  socket.on('connect', () => {
    console.log('✅ Socket.IO conectado:', socket?.id);
  });

  socket.on('disconnect', async (reason) => {
    console.log('❌ Socket.IO desconectado:', reason);
    
    // Reconectar con nuevo token si el servidor desconectó por autenticación
    if (reason === 'io server disconnect') {
      const token = await getAuthToken();
      if (token && socket) {
        socket.auth = { token };
        socket.connect();
      }
    }
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Error de conexión Socket.IO:', error.message);
    console.error('🔍 URL intentada:', socketUrl);
    console.error('🔍 Error completo:', error);
    
    // Si el error es de autenticación, esperar a que el usuario se autentique
    if (error.message.includes('Authentication error') || error.message.includes('Token requerido')) {
      console.log('⏳ Esperando autenticación del usuario...');
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user && socket && !socket.connected) {
          unsubscribe();
          const token = await getAuthToken();
          if (token && socket) {
            socket.auth = { token };
            socket.connect();
          }
        }
      });
    }
  });

  socket.on('error', (error) => {
    console.error('❌ Error Socket.IO:', error);
  });
}

/**
 * Obtiene o crea la instancia de Socket.IO
 * Espera a que el usuario esté autenticado antes de conectar
 */
export const getSocket = (): Socket => {
  // Si hay un socket existente pero no está conectado y hay un error, desconectarlo primero
  if (socket && !socket.connected) {
    // Si el socket tiene un error persistente, crear uno nuevo
    socket.disconnect();
    socket = null;
  }
  
  if (socket && socket.connected) {
    return socket;
  }

  // Obtener token de autenticación
  const getAuthToken = async (): Promise<string | null> => {
    try {
      const user = auth.currentUser;
      if (user) {
        return await user.getIdToken();
      }
      return null;
    } catch (error) {
      console.error('Error al obtener token para Socket.IO:', error);
      return null;
    }
  };

  // Obtener URL del socket
  const socketUrl = getSocketUrl();
  
  // Verificar si hay usuario autenticado antes de conectar
  const currentUser = auth.currentUser;
  
  if (!currentUser) {
    // Si no hay usuario, crear el socket pero no conectar automáticamente
    socket = io(socketUrl, {
      autoConnect: false, // No conectar automáticamente
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      auth: async (cb) => {
        const token = await getAuthToken();
        cb({ token });
      },
    });

    // Esperar a que el usuario esté autenticado antes de conectar
    onAuthStateChanged(auth, async (user) => {
      if (user && socket && !socket.connected) {
        socket.connect();
      }
    });

    setupSocketListeners(socket, socketUrl, getAuthToken);
    
    return socket;
  }
  
  // Si ya hay usuario, conectar normalmente
  socket = io(socketUrl, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    auth: async (cb) => {
      const token = await getAuthToken();
      cb({ token });
    },
  });

  setupSocketListeners(socket, socketUrl, getAuthToken);

  return socket;
};

/**
 * Desconecta el socket
 */
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Verifica si el socket está conectado
 */
export const isSocketConnected = (): boolean => {
  return socket?.connected || false;
};

