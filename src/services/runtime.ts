let javaFXReady: boolean | null = null;

export async function ensureJavaFX(): Promise<boolean> {
  if (javaFXReady !== null) return javaFXReady;

  const start = Date.now();

  return new Promise((resolve) => {
    const timer = setInterval(() => {
      if ((window as any).JavaFXApp) {
        javaFXReady = true;
        clearInterval(timer);
        resolve(true);
      }

      if (Date.now() - start > 4000) {
        javaFXReady = false;
        clearInterval(timer);
        resolve(false);
      }
    }, 50);
  });
}
