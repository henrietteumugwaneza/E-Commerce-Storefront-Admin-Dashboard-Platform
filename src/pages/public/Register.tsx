import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import { useAuth } from "../../hooks/useAuth";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import toast from "react-hot-toast";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
type FormData = z.infer<typeof schema>;

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/auth/users/register", { email: data.email, password: data.password });
      await login(data.email, data.password);
      toast.success("Account created! Welcome to ShopZone.");
      navigate("/");
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-3xl overflow-hidden">

        {/* Left panel */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-violet-600 via-indigo-600 to-indigo-700 p-10 text-white">
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
              Join thousands of<br />happy shoppers.
            </h2>
            <p className="text-indigo-200 text-sm leading-relaxed">
              Create your free account and start exploring the best deals across all categories.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: "✅", text: "Free to join, no hidden fees" },
              { icon: "📦", text: "Track all your orders in one place" },
              { icon: "💳", text: "Multiple secure payment options" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-sm text-indigo-100">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="bg-white p-8 sm:p-10 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Create account</h2>
            <p className="text-slate-500 text-sm mt-1">Fill in the details below to get started.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input label="Email address" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
            <Input label="Password" type="password" placeholder="Min. 6 characters" error={errors.password?.message} {...register("password")} />
            <Input label="Confirm Password" type="password" placeholder="••••••••" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
            <Button type="submit" loading={isSubmitting} className="w-full" size="lg">Create Account</Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
