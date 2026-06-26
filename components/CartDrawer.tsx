'use client';
import { useCart } from '@/context/CartContext';

// ── Replace with real YOGNA WhatsApp number ──────────────────
const YOGNA_WHATSAPP = '919176088989'; // e.g. 919876543210

function buildWhatsAppMessage(items: { name: string; quantity: number }[]): string {
  const lines = items.map(i => `• ${i.name} (Qty: ${i.quantity})`).join('\n');
  return encodeURIComponent(
    `Hello YOGNA Team! 👋\n\nI would like to enquire about the following products:\n\n${lines}\n\nPlease provide availability and pricing details.\n\nThank you!`
  );
}

export default function CartDrawer() {
  const { items, isCartOpen, closeCart, removeFromCart, updateQuantity } = useCart();

  const handleWhatsApp = () => {
    const msg = buildWhatsAppMessage(items);
    window.open(`https://wa.me/${YOGNA_WHATSAPP}?text=${msg}`, '_blank');
  };

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div
          className="cart-overlay"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <aside className={`cart-drawer ${isCartOpen ? 'open' : ''}`} aria-label="Enquiry list">
        {/* Header */}
        <div className="cart-drawer-header">
          <h2 className="cart-drawer-title">Your Enquiry List</h2>
          <button className="cart-drawer-close" onClick={closeCart} aria-label="Close">✕</button>
        </div>

        {/* Items */}
        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <p className="cart-empty-text">Your enquiry list is empty.</p>
              <p className="cart-empty-sub">Browse products and add items to enquire.</p>
            </div>
          ) : (
            <ul className="cart-items-list">
              {items.map(item => (
                <li key={item.id} className="cart-item">
                  {/* Placeholder image */}
                  <div className="cart-item-thumb">
                    <span>{item.name.charAt(0)}</span>
                  </div>

                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-category">{item.category}</p>

                    <div className="cart-item-controls">
                      <div className="qty-controls">
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >−</button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >+</button>
                      </div>

                      <button
                        className="cart-remove-btn"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        🗑 Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <button className="whatsapp-btn" onClick={handleWhatsApp} id="whatsapp-enquiry-btn">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Enquire on WhatsApp
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
