import './App.css'

export default function App() {
  return (
    <div
      style={{
        backgroundColor: "#F8F5E4",
        minHeight: "100vh",
        padding: "40px 20px",
        color: "#2D2A26",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Header */}
      <img width={100} height={100} src="/icon.svg" alt="logo" />
      <h1
        style={{
          fontSize: "3rem",
          marginBottom: "10px",
          fontWeight: "600",
        }}
      >
        Sekarippu
      </h1>

      <p
        style={{
          maxWidth: "600px",
          textAlign: "center",
          fontSize: "1.1rem",
          marginBottom: "40px",
        }}
      >
        A minimal, elegant desktop application to organize and manage your
        personal library. Built with Tauri · Fast · Local · Secure.
      </p>

      {/* Download Section */}
      <div
        style={{
          backgroundColor: "#D8C9A6",
          padding: "24px 28px",
          borderRadius: "12px",
          boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "450px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>
          Download for Linux
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <a
            href="https://github.com/gauravtak/sekarippu/releases/download/v1.0.0/book-manager_0.1.0_amd64.deb"
            style={buttonStyle}
          >
            Download .deb
          </a>

          <a
            href="https://github.com/gauravtak/sekarippu/releases/download/v1.0.0/book-manager-0.1.0-1.x86_64.rpm"
            style={buttonStyle}
          >
            Download .rpm
          </a>

          <a
            href="https://github.com/gauravtak/sekarippu/releases/download/v1.0.0/book-manager_0.1.0_amd64.AppImage"
            style={buttonStyle}
          >
            Download AppImage
          </a>
        </div>
      </div>

      {/* Github */}
      <a
        href="https://github.com/gauravtak/sekarippu"
        target="_blank"
        style={{
          marginTop: "40px",
          color: "#5C4033",
          fontWeight: "600",
          textDecoration: "none",
          borderBottom: "2px solid #C1A45F",
          paddingBottom: "2px",
        }}
      >
        View on GitHub →
      </a>
    </div>
  );
}

const buttonStyle = {
  backgroundColor: "#5C4033",
  color: "#F8F5E4",
  padding: "12px 20px",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: "600",
  fontSize: "1rem",
  display: "block",
};


