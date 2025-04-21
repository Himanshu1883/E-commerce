import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';

// This component handles custom toast styling and animations
function CustomToastContainer() {
  useEffect(() => {
    // Add custom toast styling
    const style = document.createElement('style');
    style.innerHTML = `
      /* Custom Toast Styling */
      .Toastify__toast {
        border-radius: 12px !important;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12) !important;
        overflow: hidden !important;
        background: linear-gradient(145deg, #ffffff, #f8f9fa) !important;
        border: 1px solid rgba(0, 0, 0, 0.05) !important;
        padding: 12px !important;
        animation-duration: 0.5s !important;
      }

      .Toastify__toast-icon {
        font-size: 1.5rem !important;
        margin-right: 12px !important;
      }

      .Toastify__toast--success {
        background: linear-gradient(145deg, #ebffef, #d4f7db) !important;
        border-left: 5px solid #28a745 !important;
      }

      .Toastify__toast--error {
        background: linear-gradient(145deg, #fff0f0, #ffdddd) !important;
        border-left: 5px solid #dc3545 !important;
      }

      .Toastify__toast--warning {
        background: linear-gradient(145deg, #fff9e6, #fff3c6) !important;
        border-left: 5px solid #ffc107 !important;
      }

      .Toastify__toast--info {
        background: linear-gradient(145deg, #e6f7ff, #c6eeff) !important;
        border-left: 5px solid #0dcaf0 !important;
      }

      .Toastify__progress-bar {
        height: 4px !important;
        border-radius: 2px !important;
      }

      .Toastify__toast-body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
        font-size: 0.95rem !important;
        color: #212529 !important;
        padding: 0 !important;
      }

      .toast-message {
        display: flex;
        align-items: center;
      }

      .toast-content {
        padding-left: 6px;
      }

      .toast-title {
        font-weight: 600;
        font-size: 1rem;
        margin-bottom: 2px;
      }

      .toast-subtitle {
        font-size: 0.85rem;
        opacity: 0.7;
      }

      .toast-product-image {
        width: 40px;
        height: 40px;
        object-fit: contain;
        margin-right: 12px;
        border-radius: 6px;
        background-color: #f8f9fa;
        border: 1px solid rgba(0, 0, 0, 0.1);
        padding: 2px;
      }

      /* Toast Animation */
      @keyframes toastShimmer {
        0% {
          background-position: -100% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }

      .Toastify__toast::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
        background-size: 200% 100%;
        animation: toastShimmer 2s infinite;
      }

      /* Custom toast close button */
      .Toastify__close-button {
        opacity: 0.5;
        transition: all 0.3s ease;
      }

      .Toastify__close-button:hover {
        opacity: 1;
        transform: scale(1.1);
      }

      /* Entrance and exit animations */
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }

      .Toastify__toast--enter {
        animation: slideInRight 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards !important;
      }

      .Toastify__toast--exit {
        animation: slideOutRight 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards !important;
      }

      /* Make toast container fixed at top right */
      .Toastify__toast-container--top-right {
        top: 1em;
        right: 1em;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
}

// Enhanced add to cart toast function
const showAddToCartToast = (product) => {
  toast.success(
    <div className="toast-message">
      <img src={product.image} alt={product.title} className="toast-product-image" />
      <div className="toast-content">
        <div className="toast-title">Added to Cart</div>
        <div className="toast-subtitle">{product.title}</div>
      </div>
    </div>,
    {
      icon: () => <i className="bi bi-cart-check-fill text-success" style={{ fontSize: '20px' }}></i>,
    }
  );

  // Play a subtle sound effect (optional)
  const audio = new Audio('/path/to/add-to-cart-sound.mp3'); // Replace with actual path if you have one
  audio.volume = 0.3;
  // audio.play().catch(() => {}); // Uncomment if you have a sound file
};

// Usage in component
// Replace existing toast.success calls with showAddToCartToast(product)
// Example for Home.js:

  
  // Use enhanced toast instead of basic toast


// Example for ProductDetail.js:


export { CustomToastContainer, showAddToCartToast };