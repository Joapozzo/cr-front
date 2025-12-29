declare module 'quagga' {
  interface DecodeResult {
    codeResult?: {
      code: string;
      format: string;
    };
  }

  interface QuaggaConfig {
    src: string;
    numOfWorkers?: number;
    locate?: boolean;
    inputStream?: {
      size?: number;
    };
    decoder?: {
      readers?: string[];
    };
  }

  interface Quagga {
    decodeSingle(
      config: QuaggaConfig,
      callback: (result: DecodeResult) => void
    ): void;
  }

  const Quagga: Quagga;
  export default Quagga;
}

