import { styles } from "./styles";

export default function InputField({ label, type, value, onChange, placeholder, error }) {
  const inputStyle = {
    ...styles.input,
    borderColor: error ? "#fc5c7d" : "#2a2a3d",
  };

  return (
    <div style={styles.fieldWrapper}>
      <label style={styles.label}>{label}</label>
      <input
        type={type || "text"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={inputStyle}
      />
      {error && <p style={styles.errorText}>{error}</p>}
    </div>
  );
}
