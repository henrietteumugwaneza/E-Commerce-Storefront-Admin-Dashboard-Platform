import { Link } from "react-router-dom";
import { useCart } from "../../hooks/useCart";
import { Button } from "../../components/ui/Button";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-28 bg-white rounded-3xl border border-slate-200 shadow-sm">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
        <p className="text-slate-500 text-sm mb-7">Looks like you haven't added anything yet.</p>
        <Link to="/"><Button size="lg">Browse Products</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-2xl font-extrabold text-slate-900">Shopping Cart
          <span className="ml-2 text-base font-semibold text-slate-400">({items.length} {items.length === 1 ? "item" : "items"})</span>
        </h1>
        <button onClick={clearCart} className="text-sm font-medium text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(({ product, quantity }) => {
            const image = product.images?.[0]?.url ?? "https://placehold.co/80x80?text=?";
            return (
              <div key={product.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-4 shadow-sm hover:shadow-md transition-shadow">
                <img src={image} alt={product.name}
                  className="w-20 h-20 object-cover rounded-xl bg-slate-100 shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/80x80?text=?"; }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 text-sm truncate">{product.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{product.brand}</p>
                    </div>
                    <button onClick={() => removeFromCart(product.id)} className="text-slate-300 hover:text-red-500 transition-colors shrink-0 p-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                      <button onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold text-sm transition-colors">−</button>
                      <span className="w-8 text-center text-sm font-bold text-slate-900">{quantity}</span>
                      <button onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 font-bold text-sm transition-colors">+</button>
                    </div>
                    <span className="font-extrabold text-slate-900">${(product.price * quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 h-fit shadow-sm sticky top-24">
          <h3 className="font-bold text-slate-900 mb-5 text-lg">Order Summary</h3>
          <div className="space-y-2.5 text-sm mb-5">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-slate-600">
                <span className="truncate mr-2">{product.name} <span className="text-slate-400">×{quantity}</span></span>
                <span className="shrink-0 font-medium">${(product.price * quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 pt-4 flex justify-between font-extrabold text-slate-900 text-lg mb-6">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Link to="/checkout">
            <Button className="w-full" size="lg">
              Proceed to Checkout →
            </Button>
          </Link>
          <Link to="/" className="block text-center text-sm text-slate-500 hover:text-indigo-600 mt-3 transition-colors">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
