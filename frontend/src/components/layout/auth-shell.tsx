"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="shell-frame shell-frame--auth" style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Decorative background shapes */}
      <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50%", height: "50%", background: "radial-gradient(circle, rgba(27,67,50,0.1) 0%, rgba(255,255,255,0) 70%)", borderRadius: "50%" }}></div>
      <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "60%", height: "60%", background: "radial-gradient(circle, rgba(27,67,50,0.05) 0%, rgba(255,255,255,0) 70%)", borderRadius: "50%" }}></div>

      <div style={{ position: "relative", zIndex: 10, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", padding: "24px" }}>
        <motion.main 
          className="auth-shell__main" 
          id="app-main-content" 
          tabIndex={-1}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: "24px",
            boxShadow: "0 20px 40px -10px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.6) inset",
            padding: "48px",
            width: "100%",
            maxWidth: "480px",
            border: "1px solid rgba(230,230,230,0.6)"
          }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
