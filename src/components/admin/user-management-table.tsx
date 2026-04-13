import type { CSSProperties } from "react";

import type {
  AdminUserListFilters,
  AdminUserListSummary,
  AdminUserRecord,
} from "../../modules/admin";

type UserManagementTableProps = {
  users: readonly AdminUserRecord[];
  filters: Required<AdminUserListFilters>;
  summary: AdminUserListSummary;
};

const toolbarStyle: CSSProperties = {
  display: "grid",
  gap: "16px",
};

const toolbarGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(220px, 1.8fr) repeat(2, minmax(180px, 1fr)) auto",
  gap: "12px",
  alignItems: "end",
};

const inputGroupStyle: CSSProperties = {
  display: "grid",
  gap: "8px",
};

const labelStyle: CSSProperties = {
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "#334155",
};

const inputStyle: CSSProperties = {
  height: "48px",
  padding: "0 14px",
  borderRadius: "12px",
  border: "1px solid #d5dfea",
  background: "#ffffff",
  color: "#10233c",
  fontSize: "0.95rem",
};

const buttonStyle: CSSProperties = {
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  height: "48px",
  padding: "0 18px",
  borderRadius: "12px",
  border: "none",
  background: "#1f4f82",
  color: "#f8fafc",
  fontWeight: 600,
  cursor: "pointer",
};

const secondaryLinkStyle: CSSProperties = {
  display: "inline-flex",
  justifyContent: "center",
  alignItems: "center",
  height: "48px",
  padding: "0 18px",
  borderRadius: "12px",
  textDecoration: "none",
  border: "1px solid #d5dfea",
  background: "#ffffff",
  color: "#10233c",
  fontWeight: 600,
};

const summaryGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: "12px",
};

const summaryCardStyle: CSSProperties = {
  display: "grid",
  gap: "6px",
  padding: "14px 16px",
  borderRadius: "16px",
  background: "rgba(245, 248, 252, 0.96)",
  border: "1px solid rgba(16, 35, 60, 0.08)",
};

const tableWrapperStyle: CSSProperties = {
  overflowX: "auto",
  borderRadius: "18px",
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
};

const cellStyle: CSSProperties = {
  padding: "16px",
  borderBottom: "1px solid rgba(16, 35, 60, 0.08)",
  verticalAlign: "top",
};

const emptyStateStyle: CSSProperties = {
  display: "grid",
  gap: "12px",
  padding: "24px",
  borderRadius: "18px",
  background: "rgba(236, 244, 248, 0.8)",
  border: "1px dashed rgba(31, 79, 130, 0.34)",
};

const getRoleBadgeStyle = (role: AdminUserRecord["role"]): CSSProperties => {
  switch (role) {
    case "ADMIN":
      return {
        background: "rgba(31, 79, 130, 0.12)",
        color: "#1f4f82",
      };
    case "EXAMINER":
      return {
        background: "rgba(15, 118, 110, 0.12)",
        color: "#0f766e",
      };
    case "STUDENT":
      return {
        background: "rgba(3, 105, 161, 0.12)",
        color: "#0369a1",
      };
  }
};

const getStatusBadgeStyle = (status: AdminUserRecord["status"]): CSSProperties =>
  status === "ACTIVE"
    ? {
        background: "rgba(21, 128, 61, 0.12)",
        color: "#15803d",
      }
    : {
        background: "rgba(180, 83, 9, 0.12)",
        color: "#b45309",
      };

const formatDateTime = (value: Date): string =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(value);

export function UserManagementTable({
  users,
  filters,
  summary,
}: UserManagementTableProps) {
  return (
    <div style={{ display: "grid", gap: "18px" }}>
      <form action="/admin" method="get" style={toolbarStyle}>
        <div style={toolbarGridStyle}>
          <div style={inputGroupStyle}>
            <label htmlFor="q" style={labelStyle}>
              Search name or email
            </label>
            <input
              id="q"
              name="q"
              type="search"
              defaultValue={filters.query}
              placeholder="Search by user name or institutional email"
              style={inputStyle}
            />
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="role" style={labelStyle}>
              Role
            </label>
            <select id="role" name="role" defaultValue={filters.role} style={inputStyle}>
              <option value="ALL">All roles</option>
              <option value="ADMIN">Admin</option>
              <option value="EXAMINER">Examiner</option>
              <option value="STUDENT">Student</option>
            </select>
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="status" style={labelStyle}>
              Status
            </label>
            <select id="status" name="status" defaultValue={filters.status} style={inputStyle}>
              <option value="ALL">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "end" }}>
            <button type="submit" style={buttonStyle}>
              Apply Filters
            </button>
            <a href="/admin" style={secondaryLinkStyle}>
              Reset
            </a>
          </div>
        </div>

        <div style={summaryGridStyle}>
          {[
            { label: "Visible", value: String(summary.visible) },
            { label: "All Users", value: String(summary.total) },
            { label: "Active", value: String(summary.activeCount) },
            { label: "Inactive", value: String(summary.inactiveCount) },
            { label: "Admins", value: String(summary.adminCount) },
            { label: "Examiners", value: String(summary.examinerCount) },
            { label: "Students", value: String(summary.studentCount) },
          ].map((item) => (
            <div key={item.label} style={summaryCardStyle}>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b", textTransform: "uppercase" }}>
                {item.label}
              </p>
              <p style={{ margin: 0, fontSize: "1.35rem", fontWeight: 700, color: "#10233c" }}>{item.value}</p>
            </div>
          ))}
        </div>
      </form>

      {users.length === 0 ? (
        <div style={emptyStateStyle}>
          <p style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#10233c" }}>
            No users match the current filters.
          </p>
          <p style={{ margin: 0, color: "#4b647a", lineHeight: 1.6 }}>
            Try clearing one filter or broadening the search query so the admin table can show matching
            accounts again.
          </p>
        </div>
      ) : (
        <div style={tableWrapperStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={headerCellStyle}>User</th>
                <th style={headerCellStyle}>Role</th>
                <th style={headerCellStyle}>Status</th>
                <th style={headerCellStyle}>Department</th>
                <th style={headerCellStyle}>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={cellStyle}>
                    <div style={{ display: "grid", gap: "6px" }}>
                      <p style={{ margin: 0, fontWeight: 700, color: "#10233c" }}>{user.name}</p>
                      <p style={{ margin: 0, color: "#475569" }}>{user.email}</p>
                    </div>
                  </td>
                  <td style={cellStyle}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "7px 11px",
                        borderRadius: "999px",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        ...getRoleBadgeStyle(user.role),
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td style={cellStyle}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "7px 11px",
                        borderRadius: "999px",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        ...getStatusBadgeStyle(user.status),
                      }}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td style={cellStyle}>{user.department}</td>
                  <td style={cellStyle}>{formatDateTime(user.lastActiveAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
