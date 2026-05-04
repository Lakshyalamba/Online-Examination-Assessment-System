"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { BookOpen } from "lucide-react";
import { routes } from "@oeas/backend/lib/routes";

export function PublicHeader() {
  const { scrollY } = useScroll();
  const background = useTransform(
    scrollY,
    [0, 50],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.95)"]
  );
  const boxShadow = useTransform(
    scrollY,
    [0, 50],
    ["none", "0 1px 0 rgba(0,0,0,0.08)"]
  );

  return (
    <motion.header
      style={{
        background,
        boxShadow,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        padding: "0 32px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
    >
      <div style={{ maxWidth: "1200px", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        
        {/* Logo */}
        <Link href={routes.home} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: "10px",
            background: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(27,67,50,0.3)"
          }}>
            <BookOpen size={18} color="white" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: "1.125rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>
            OEAS
          </span>
        </Link>

        {/* Nav links */}
        <nav style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <Link href="#features" style={{ fontSize: "0.875rem", fontWeight: 500, color: "#374151", textDecoration: "none" }}>
            Features
          </Link>
          <Link
            href={routes.login}
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "white",
              background: "linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)",
              padding: "8px 20px",
              borderRadius: "8px",
              textDecoration: "none",
              boxShadow: "0 2px 8px rgba(27,67,50,0.25)"
            }}
          >
            Sign in
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}
