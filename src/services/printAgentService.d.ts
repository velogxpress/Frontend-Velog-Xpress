function isJavaFXWebView(): boolean {
  const w = window as any;
  const ua = navigator.userAgent || "";

  return (
    w.__WINDOWS_WEBVIEW__ === true ||
    w.top?.__WINDOWS_WEBVIEW__ === true ||
    w.__RUNTIME__ === "WINDOWS_JAVAFX_WEBVIEW" ||
    w.top?.__RUNTIME__ === "WINDOWS_JAVAFX_WEBVIEW" ||
    /OperisDesktop\/JAVAFX/i.test(ua) ||
    typeof w.JavaFXApp?.isPrintAgentRunning === "function"
  );
}

export async function checkPrintAgentStatus(): Promise<boolean> {
  const w = window as any;

  // ✅ JavaFX WebView: PA FÈ fetch localhost, li flag Java mete a
  if (isJavaFXWebView()) {
    if (typeof w.__PRINT_AGENT_RUNNING__ === "boolean")
      return w.__PRINT_AGENT_RUNNING__;
    if (typeof w.top?.__PRINT_AGENT_RUNNING__ === "boolean")
      return w.top.__PRINT_AGENT_RUNNING__;

    if (typeof w.JavaFXApp?.isPrintAgentRunning === "function") {
      try {
        return !!w.JavaFXApp.isPrintAgentRunning();
      } catch {
        return false;
      }
    }
    return false;
  }

  // 🌐 Browser normal
  try {
    const res = await fetch("http://localhost:9100/status");
    return res.ok;
  } catch {
    return false;
  }
}
