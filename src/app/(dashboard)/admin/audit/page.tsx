import type { CSSProperties } from "react";

import {
  describeAdminAuditAction,
  listAdminAuditRecords,
  sortAdminAuditRecords,
} from "../../../../modules/admin";

const pageStyle: CSSProperties = {
  display: "grid",
  gap: "24px",
};

const heroStyle: CSSProperties = {
  display: "grid",
  gap: "18px",
  padding: "28px",
  borderRadius: "28px",
  background: "linear-gradient(135deg, #13253d 0%, #19446d 54%, #0b6b74 100%)",
  color: "#f8fbfd",
  boxShadow: "0 24px 48px rgba(16, 35, 60, 0.14)",
};

const heroBadgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  width: "fit-content",
  padding: "8px 12px",
  borderRadius: "999px",
  background: "rgba(255, 255, 255, 0.14)",
  fontSize: "0.875rem",
  fontWeight: 600,
};

const sectionCardStyle: CSSProperties = {
  display: "grid",
  gap: "18px",
  padding: "24px",
  borderRadius: "26px",
  background: "#ffffff",
  border: "1px solid rgba(16, 35, 60, 0.08)",
  boxShadow: "0 18px 40px rgba(16, 35, 60, 0.08)",
};

const tableWrapperStyle: CSSProperties = {
  overflowX: "auto",
  borderRadius: "20px",
  border: "1px solid rgba(16, 35, 60, 0.08)",
};

const tableStyle: CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#ffffff",
};

const headerCellStyle: CSSProperties = {
  padding: "14px 16px",
  textAlign: "left",
  fontSize: "0.82rem",
  fontWeight: 700,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "#475569",
  background: "#f5f8fc",
  borderBottom: "1px solid rgba(16, 35, 60, 0.08)",
  whiteSpace: "nowrap",
};

const cellStyle: CSSProperties = {
  padding: "14px 16px",
  borderBottom: "1px solid rgba(16, 35, 60, 0.08)",
  verticalAlign: "top",
};

const actionBadgeStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  width: "fit-content",
  padding: "7px 11px",
  borderRadius: "999px",
  background: "rgba(15, 118, 110, 0.12)",
  color: "#0f766e",
  fontSize: "0.84rem",
  fontWeight: 600,
  whiteSpace: "nowrap",
};

const entityBadgeStyle = (entityType: string): CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  width: "fit-content",
  padding: "6px 10px",
  borderRadius: "999px",
  background:
    entityType === "USER"
      ? "rgba(31, 79, 130, 0.12)"
      : entityType === "EXAM"
        ? "rgba(180, 83, 9, 0.12)"
        : "rgba(3, 105, 161, 0.12)",
  color: entityType === "USER" ? "#1f4f82" : entityType === "EXAM" ? "#b45309" : "#0369a1",
  fontSize: "0.78rem",
  fontWeight: 700,
  letterSpacing: "0.03em",
});

const emptyStateStyle: CSSProperties = {
  display: "grid",
  gap: "12px",
  padding: "22px",
  borderRadius: "18px",
  background: "rgba(236, 244, 248, 0.8)",
  border: "1px dashed rgba(31, 79, 130, 0.34)",
};

const formatDateTime = (value: Date): string =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);

type AdminAuditLogPageProps = {
  searchParams?: {
    empty?: string;
  };
};

export default function AdminAuditLogPage({ searchParams }: AdminAuditLogPageProps) {
  const allRecords = sortAdminAuditRecords(listAdminAuditRecords());
  const records = searchParams?.empty === "1" ? [] : allRecords;

  return (
    <div style={pageStyle}>
      <section style={heroStyle}>
        <span style={heroBadgeStyle}>Admin Audit Log</span>
        <div style={{ display: "grid", gap: "10px" }}>
          <h2 style={{ margin: 0, fontSize: "2rem", lineHeight: 1.1 }}>
            Admin event history now has a dedicated listing page.
          </h2>
          <p style={{ margin: 0, maxWidth: "760px", lineHeight: 1.7, color: "rgba(248, 251, 253, 0.88)" }}>
            The audit page stays focused on practical review work. Each row surfaces who acted, what changed,
            which entity was affected, and when the event occurred without collapsing density into unreadable
            log output.
          </p>
        </div>
      </section>

      <section style={sectionCardStyle}>
        <div style={{ display: "grid", gap: "8px" }}>
          <h2 style={{ margin: 0, fontSize: "1.25rem", lineHeight: 1.2 }}>Audit Events</h2>
          <p style={{ margin: 0, color: "#4b647a", lineHeight: 1.6 }}>
            This page remains admin-only by living inside the existing admin dashboard route group and shell.
            The table keeps row density compact while preserving scannable actor, action, entity, and
            timestamp columns.
          </p>
        </div>

        {records.length === 0 ? (
          <div style={emptyStateStyle}>
            <p style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#10233c" }}>
              No audit events are available yet.
            </p>
            <p style={{ margin: 0, color: "#4b647a", lineHeight: 1.6 }}>
              When admins create users, change roles, publish exams, or request exports, those events can
              appear here. Until then, the table area stays readable instead of showing a blank shell.
            </p>
          </div>
        ) : (
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={headerCellStyle}>Actor</th>
                  <th style={headerCellStyle}>Action</th>
                  <th style={headerCellStyle}>Entity</th>
                  <th style={headerCellStyle}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td style={cellStyle}>
                      <p style={{ margin: 0, fontWeight: 700, color: "#10233c" }}>{record.actor}</p>
                    </td>
                    <td style={cellStyle}>
                      <span style={actionBadgeStyle}>{describeAdminAuditAction(record.action)}</span>
                    </td>
                    <td style={cellStyle}>
                      <div style={{ display: "grid", gap: "8px" }}>
                        <span style={entityBadgeStyle(record.entityType)}>{record.entityType}</span>
                        <p style={{ margin: 0, color: "#10233c", lineHeight: 1.5 }}>{record.entity}</p>
                      </div>
                    </td>
                    <td style={cellStyle}>
                      <p style={{ margin: 0, color: "#334155", whiteSpace: "nowrap" }}>
                        {formatDateTime(record.occurredAt)}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
