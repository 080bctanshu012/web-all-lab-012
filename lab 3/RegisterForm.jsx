import { useState } from "react";
import InputField from "./InputField";
import { styles } from "./styles";

const initialFormState = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterForm({ onSwitch }) {
  const [fields, setFields] = useState({ ...initialFormState });
  const [validationErrors, setValidationErrors] = useState({});
  const [registered, setRegistered] = useState(false);

  const updateField = (fieldName) => (e) => {
    setFields((prev) => ({ ...prev, [fieldName]: e.target.value }));
  };

  const runValidation = () => {
    const result = {};

    if (!fields.fullName.trim()) {
      result.fullName = "Full name is required.";
    }

    if (!fields.email) {
      result.email = "Email is required.";
    } else if (!fields.email.includes("@")) {
      result.email = "Enter a valid email.";
    }

    if (!fields.password) {
      result.password = "Password is required.";
    } else if (fields.password.length < 6) {
      result.password = "Password must be at least 6 characters.";
    }

    if (!fields.confirmPassword) {
      result.confirmPassword = "Please confirm your password.";
    } else if (fields.password !== fields.confirmPassword) {
      result.confirmPassword = "Passwords do not match.";
    }

    return result;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errs = runValidation();

    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs);
      setRegistered(false);
    } else {
      setValidationErrors({});
      setRegistered(true);
      console.log("Registering:", fields);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Create Account</h2>
      <p style={styles.subtitle}>Register a new account</p>

      {registered && (
        <div style={styles.successBox}>
          Registered successfully! You can now log in.
        </div>
      )}

      <form onSubmit={handleFormSubmit}>
        <InputField
          label="Full Name"
          type="text"
          value={fields.fullName}
          onChange={updateField("fullName")}
          placeholder="Sita Sharma"
          error={validationErrors.fullName}
        />

        <InputField
          label="Email Address"
          type="email"
          value={fields.email}
          onChange={updateField("email")}
          placeholder="you@example.com"
          error={validationErrors.email}
        />

        <InputField
          label="Password"
          type="password"
          value={fields.password}
          onChange={updateField("password")}
          placeholder="Min. 6 characters"
          error={validationErrors.password}
        />

        <InputField
          label="Confirm Password"
          type="password"
          value={fields.confirmPassword}
          onChange={updateField("confirmPassword")}
          placeholder="Re-enter your password"
          error={validationErrors.confirmPassword}
        />

        <button type="submit" style={styles.button}>
          Register
        </button>
      </form>

      <p style={styles.switchText}>
        Already have an account?{" "}
        <span style={styles.link} onClick={onSwitch}>
          Login here
        </span>
      </p>
    </div>
  );
}
