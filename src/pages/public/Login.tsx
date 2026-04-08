import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import toast from "react-hot-toast";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
      const saved = localStorage.getItem("user");
      const role = saved ? JSON.parse(saved).role : null;
      toast.success("Welcome back!");
      navigate(role === "ADMIN" ? "/admin" : "/");
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden">

        {/* Left panel */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-10 text-white">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="font-bold text-xl tracking-tight">ShopZone</span>
          </div>

          <div>
            <h2 className="text-3xl font-bold leading-snug mb-4">
              Your favourite store,<br />always open.
            </h2>
            <p className="text-indigo-200 text-sm leading-relaxed">
              Thousands of products. Fast delivery. Secure checkout. Sign in to continue shopping.
            </p>
          </div>

          <div className="flex gap-3">
            {["🛍️ 10k+ Products", "🚚 Fast Delivery", "🔒 Secure"].map((t) => (
              <span key={t} className="text-xs bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">{t}</span>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="bg-white p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Sign in</h2>
            <p className="text-slate-500 text-sm mt-1">Welcome back! Enter your credentials.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input label="Email address" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
            <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register("password")} />
            <Button type="submit" loading={isSubmitting} className="w-full" size="lg">Sign in</Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-semibold">Create one</Link>
          </p>

          <div className="mt-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
            <p className="text-xs font-semibold text-indigo-700 mb-2 flex items-center gap-1">
              <span>🔑</span> Demo credentials
            </p>
            <div className="space-y-1 text-xs text-slate-600">
              <p><span className="font-medium">Admin:</span> admin@admin.com / admin123</p>
              <p><span className="font-medium">User:</span> Register a new account</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
