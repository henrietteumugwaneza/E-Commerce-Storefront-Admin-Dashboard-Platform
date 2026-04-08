import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../api/axios";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../hooks/useAuth";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import type { PaymentMethod } from "../../types";
import toast from "react-hot-toast";

const schema = z.object({
  fullName: z.string().min(1, "Full name is required").trim(),
  shippingAddress: z.string().min(1, "Address is required").trim(),
  city: z.string().min(1, "City is required").trim(),
  postalCode: z.string().optional(),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone must be exactly 10 digits"),
  email: z.string().email("Enter a valid email"),
  paymentMethod: z.enum(["CREDIT_CARD", "PAYPAL", "MOBILE_MONEY", "CASH_ON_DELIVERY"]),
});
type FormData = z.infer<typeof schema>;

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  CREDIT_CARD: "Credit Card",
  PAYPAL: "PayPal",
  MOBILE_MONEY: "Mobile Money",
  CASH_ON_DELIVERY: "Cash on Delivery",
};

const STEPS = ["Shipping", "Payment", "Review"];

const Checkout = () => {
  const [step, setStep] = useState(0);
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, trigger, getValues, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: user?.email ?? "", paymentMethod: "CASH_ON_DELIVERY" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) =>
      api.post("/auth/orders", {
        shippingAddress: data.shippingAddress,
        city: data.city,
        postalCode: data.postalCode,
        phoneNumber: data.phoneNumber,
        paymentMethod: data.paymentMethod,
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      }),
    onSuccess: () => {
      clearCart();
      toast.success("Order placed successfully!");
      navigate("/profile");
    },
    onError: (err: any) => toast.error(err.message || "Order failed"),
  });

  const nextStep = async () => {
    const fields: (keyof FormData)[][] = [
      ["fullName", "shippingAddress", "city", "phoneNumber", "email"],
      ["paymentMethod"],
    ];
    const valid = await trigger(fields[step]);
    if (valid) setStep((s) => s + 1);
  };

  if (items.length === 0) { navigate("/cart"); return null; }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Checkout</h1>

      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${i <= step ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"}`}>
              {i < step ? "✓" : i + 1}
            </div>
            <span className={`ml-2 text-sm font-medium ${i === step ? "text-indigo-600" : "text-slate-500"}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-3 ${i < step ? "bg-indigo-600" : "bg-slate-200"}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <form onSubmit={handleSubmit((d) => mutate(d))}>
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Shipping Information</h2>
              <Input label="Full Name" placeholder="John Doe" error={errors.fullName?.message} {...register("fullName")} />
              <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
              <Input label="Phone Number (10 digits)" placeholder="0712345678" error={errors.phoneNumber?.message} {...register("phoneNumber")} />
              <Input label="Shipping Address" placeholder="123 Main St" error={errors.shippingAddress?.message} {...register("shippingAddress")} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="City" placeholder="Nairobi" error={errors.city?.message} {...register("city")} />
                <Input label="Postal Code (optional)" placeholder="00100" {...register("postalCode")} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Payment Method</h2>
              <div className="space-y-3">
                {(Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map((method) => (
                  <label key={method} className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-indigo-400 transition-colors has-[:checked]:border-indigo-600 has-[:checked]:bg-indigo-50">
                    <input type="radio" value={method} {...register("paymentMethod")} className="accent-indigo-600" />
                    <span className="text-sm font-medium text-slate-700">{PAYMENT_LABELS[method]}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Order Review</h2>
              <div className="bg-slate-50 rounded-xl p-4 mb-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Name</span><span className="font-medium">{getValues("fullName")}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Address</span><span className="font-medium">{getValues("shippingAddress")}, {getValues("city")}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Phone</span><span className="font-medium">{getValues("phoneNumber")}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Payment</span><span className="font-medium">{PAYMENT_LABELS[getValues("paymentMethod")]}</span></div>
              </div>
              <div className="space-y-2 mb-4">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex justify-between text-sm">
                    <span className="text-slate-600">{product.name} × {quantity}</span>
                    <span className="font-medium">${(product.price * quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-slate-900">
                <span>Total</span><span>${total.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6">
            {step > 0 ? <Button type="button" variant="secondary" onClick={() => setStep((s) => s - 1)}>Back</Button> : <div />}
            {step < STEPS.length - 1
              ? <Button type="button" onClick={nextStep}>Continue</Button>
              : <Button type="submit" loading={isPending}>Place Order</Button>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
