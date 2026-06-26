'use client';
import { useCart } from '@/context/CartContext';

export default function CartToast() {
  const { toast, openCart } = useCart();

  const handleViewCart = () => {
    openCart();
  };

  return (
    <div
      className={`cart-toast-pill ${toast.visible ? 'visible' : ''}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Left: checkmark icon */}
      <span className="toast-check" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      </span>

      {/* Message text */}
      <span className="toast-message">{toast.message}</span>

      {/* Right: view cart button */}
      <button
        className="toast-cart-btn"
        onClick={handleViewCart}
        aria-label="View enquiry cart"
        tabIndex={toast.visible ? 0 : -1}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      </button>
    </div>
  );
}
