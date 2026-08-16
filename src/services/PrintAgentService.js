  export const checkPrintAgentStatus = async () => {
    try {
      const res = await fetch("http://localhost:9100/status", {
        timeout: 2000,
      });
      return res.ok;
    } catch (err) {
      console.error("Error checking print agent status:", err);
      return false;
    }
  };
  