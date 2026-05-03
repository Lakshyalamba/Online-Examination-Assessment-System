"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { routes } from "@oeas/backend/lib/routes";
import { LoginForm } from "@oeas/backend/modules/auth/components/login-form";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  const fillTestCredentials = (role: "admin" | "examiner" | "student") => {
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;
    if (emailInput && passwordInput) {
      emailInput.value = `${role}@oeas.local`;
      passwordInput.value = "OeasDemo@123";
    }
  };

  return (
    <div className="login-panel" style={{ width: "100%", display: "flex", flexDirection: "column", gap: "24px", alignItems: "center", textAlign: "center" }}>
      <div className="login-panel__header" style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
        <div style={{ padding: "16px", background: "rgba(27, 67, 50, 0.1)", borderRadius: "16px", marginBottom: "4px" }}>
          <GraduationCap size={40} color="#1b4332" />
        </div>
        <h2 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#111827", margin: 0 }}>
          {activeTab === "login" ? "Welcome back" : "Create an account"}
        </h2>
        <p style={{ color: "#6b7280", fontSize: "0.925rem", margin: 0 }}>
          {activeTab === "login" 
            ? "Enter your credentials to access the examination workspace." 
            : "Sign up to join the assessment platform."}
        </p>
      </div>

      <div style={{ width: "100%", background: "#fff", borderRadius: "16px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)", border: "1px solid #e5e7eb", overflow: "hidden" }}>
        <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb" }}>
          <button 
            onClick={() => setActiveTab("login")}
            style={{ flex: 1, padding: "16px", fontWeight: 600, fontSize: "0.925rem", color: activeTab === "login" ? "#111827" : "#6b7280", border: "none", borderBottom: activeTab === "login" ? "2px solid #1b4332" : "2px solid transparent", outline: "none", background: activeTab === "login" ? "#fff" : "#f9fafb", cursor: "pointer" }}
          >
            Log in
          </button>
          <button 
            onClick={() => setActiveTab("signup")}
            style={{ flex: 1, padding: "16px", fontWeight: 600, fontSize: "0.925rem", color: activeTab === "signup" ? "#111827" : "#6b7280", border: "none", borderBottom: activeTab === "signup" ? "2px solid #1b4332" : "2px solid transparent", outline: "none", background: activeTab === "signup" ? "#fff" : "#f9fafb", cursor: "pointer" }}
          >
            Sign up
          </button>
        </div>
        
        <div style={{ padding: "32px", position: "relative", minHeight: "350px" }}>
          <AnimatePresence mode="wait">
            {activeTab === "login" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                style={{ textAlign: "left" }}
              >
                <LoginForm />
                
                <div style={{ marginTop: "24px", paddingTop: "24px", borderTop: "1px solid #e5e7eb" }}>
                  <p style={{ fontSize: "0.825rem", color: "#6b7280", marginBottom: "12px", textAlign: "center", fontWeight: 500 }}>Quick Test Profiles (Demo)</p>
                  <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                    <button onClick={() => fillTestCredentials("student")} style={{ padding: "6px 12px", fontSize: "0.825rem", background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "999px", color: "#374151", cursor: "pointer" }}>Student</button>
                    <button onClick={() => fillTestCredentials("examiner")} style={{ padding: "6px 12px", fontSize: "0.825rem", background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "999px", color: "#374151", cursor: "pointer" }}>Examiner</button>
                    <button onClick={() => fillTestCredentials("admin")} style={{ padding: "6px 12px", fontSize: "0.825rem", background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "999px", color: "#374151", cursor: "pointer" }}>Admin</button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "40px 0" }}
              >
                <div style={{ background: "#f3f4f6", borderRadius: "50%", padding: "16px", marginBottom: "16px" }}>
                  <ArrowRight size={32} color="#9ca3af" />
                </div>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 600, color: "#111827", marginBottom: "8px" }}>Sign up is currently restricted</h3>
                <p style={{ fontSize: "0.925rem", color: "#6b7280", maxWidth: "280px" }}>
                  Please use the <strong>Test Profiles</strong> in the login tab to explore the platform modules and tests.
                </p>
                <button 
                  onClick={() => setActiveTab("login")}
                  style={{ marginTop: "24px", padding: "8px 24px", background: "#1b4332", color: "white", borderRadius: "6px", fontWeight: 500, cursor: "pointer" }}
                >
                  Go to Login
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="login-form__actions" style={{ marginTop: "8px" }}>
        <Link 
          href={routes.home}
          style={{ color: "#1b4332", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none" }}
        >
          &larr; Back to landing
        </Link>
      </div>
    </div>
  );
}
