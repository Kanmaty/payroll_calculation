// src/styles.js

export const styles = {
  container: { fontFamily: "sans-serif", padding: "20px", color: "#333", maxWidth: "1000px", margin: "auto" },
  card: {
    background: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "20px",
    boxSizing: "border-box",
    width: "90vw",
  },
  title: { borderBottom: "2px solid #007bff", paddingBottom: "10px", marginBottom: "20px" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  inputGroup: { marginBottom: "15px" },
  label: { display: "block", marginBottom: "5px", fontWeight: "bold" },
  input: { width: "95%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" },
  select: { width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" },
  button: { padding: "10px 20px", border: "none", background: "#007bff", color: "white", borderRadius: "4px", cursor: "pointer", fontSize: "16px" },
  toggleButton: {
    padding: "8px 16px",
    border: "1px solid #007bff",
    background: "white",
    color: "#007bff",
    borderRadius: "4px",
    cursor: "pointer",
    marginBottom: "20px",
  },
  table: { width: "100%", borderCollapse: "collapse", tableLayout: "fixed" },
  th: { background: "#f2f2f2", padding: "12px", border: "1px solid #ddd", textAlign: "left", whiteSpace: "nowrap", width: "100px", backgroundColor: "#f2f2f2" },
  td: { padding: "12px", border: "1px solid #ddd", whiteSpace: "nowrap", width: "100px", backgroundColor: "#fff" },
  // 固定するヘッダーセル用のスタイル
  thSticky: {
    position: "sticky",
    left: 0,
    zIndex: 1, // 他の要素より手前に表示
    // ★ thの背景色と同じ色を指定
    backgroundColor: "#f2f2f2",
    textAlign: "center",
    width: "30px",
  },

  // 固定するデータセル用のスタイル
  tdSticky: {
    position: "sticky",
    left: 0,
    zIndex: 1,
    // ★ tdの背景色と同じ色を指定
    backgroundColor: "#fff",
    // 月の列は中央揃えの方が見やすいかもしれません (任意)
    textAlign: "center",
    width: "30px",
  },
};
