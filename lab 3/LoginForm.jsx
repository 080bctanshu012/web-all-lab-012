import { useState } from "react";
import InputField from "./InputField";
import { styles } from "./styles";

const LoginForm = ({ onSwitch }) => {
  const [userEmail, setUserEmail] = useState("");
  const [userPass, setUserPass] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const checkValidity = () => {
    const errs = {};

    if (!userEmail) {
      errs.email = "Email is required.";
    } else if (!userEmail.includes("@")) {
      errs.email = "Enter a valid email address.";
    }

    if (!userPass) {
      errs.password = "Password is required.";
    } else if (userPass.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }

    return errs;
  };

  const onSubmit = (evt) => {
    evt.preventDefault();
    const errs = checkValidity();

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      setShowSuccess(false);
      return;
    }

    setFieldErrors({});
    setShowSuccess(true);
    console.log("Logging in with:", { userEmail, userPass });
  };

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>Welcome Back</h2>
      <p style={styles.subtitle}>Login to your account</p>

      {showSuccess && (
        <div style={styles.successBox}>
          Login successful! (Connect to backend for real auth)
        </div>
      )}

      <form onSubmit={onSubmit}>
        <InputField
          label="Email Address"
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          placeholder="you@example.com"
          error={fieldErrors.email}
        />

        <InputField
          label="Password"
          type="password"
          value={userPass}
          onChange={(e) => setUserPass(e.target.value)}
          placeholder="Enter your password"
          error={fieldErrors.password}
        />

        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>

      <p style={styles.switchText}>
        Don't have an account?{" "}
        <span style={styles.link} onClick={onSwitch}>
          Register here
        </span>
      </p>
    </div>
  );
};

export default LoginForm;
