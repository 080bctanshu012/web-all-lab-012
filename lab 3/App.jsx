import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { styles } from "./styles";

export default function App() {
  const [activeView, setActiveView] = useState("login");

  const goToRegister = () => setActiveView("register");
  const goToLogin = () => setActiveView("login");

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.appTitle}>Auth App</h1>
        <p style={styles.appSub}>LAB 3 - React + State</p>
      </div>

      {activeView === "login" ? (
        <LoginForm onSwitch={goToRegister} />
      ) : (
        <RegisterForm onSwitch={goToLogin} />
      )}
    </div>
  );
}
