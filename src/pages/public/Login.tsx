import { useAuth } from "../../hooks/useAuth";

const Login = () => {
  const { login } = useAuth();

  return (
    <div>
      <button onClick={() => login("admin@admin.com", "admin123")}>
        Login as Admin
      </button>
    </div>
  );
};

export default Login;