// 📖 EJEMPLOS DE USO DEL LOADING SCREEN
// NO IMPORTAR ESTE ARCHIVO - Solo para referencia

import { LoadingScreen } from './LoadingScreen';

// ✅ Ejemplo 1: Loading simple
export const Example1 = () => {
  return (
    <LoadingScreen
      message="Cargando datos"
      state="loading"
    />
  );
};

// ✅ Ejemplo 2: Success
export const Example2 = () => {
  return (
    <LoadingScreen
      successMessage="¡Operación exitosa!"
      state="success"
    />
  );
};

// ✅ Ejemplo 3: Error con retry
export const Example3 = () => {
  const handleRetry = () => {
    console.log('Reintentar operación');
  };

  return (
    <LoadingScreen
      errorMessage="No se pudo completar la operación"
      state="error"
      onRetry={handleRetry}
    />
  );
};

// ✅ Ejemplo 4: Dinámico con estados
export const Example4 = () => {
  const [state, setState] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const doSomething = async () => {
      try {
        setState('loading');
        await someAsyncOperation();
        setState('success');
      } catch (error) {
        setState('error');
      }
    };
    doSomething();
  }, []);

  return (
    <LoadingScreen
      message="Procesando solicitud"
      successMessage="¡Todo listo!"
      errorMessage="Algo salió mal"
      state={state}
      onRetry={() => setState('loading')}
    />
  );
};

