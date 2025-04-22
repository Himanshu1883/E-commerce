import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
} from '../store/slices/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { CustomToastContainer } from './ToastNotification';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const cart = useSelector((state) => state.cart.items);
  // Get products data safely with a fallback to an empty array
  const products = useSelector((state) => state.products?.items || []);

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleIncrement = (id) => {
    const cartItem = cart.find(item => item.id === id);
    // Find the corresponding product to check its stock
    const product = products.find(product => product.id === id);

    if (product && cartItem && cartItem.quantity < (product.stock || Infinity)) {
      dispatch(incrementQuantity(id));
    } else if (product) {
      toast.warning(`Sorry! Only ${product.stock || 0} items available in stock.`);
    } else {
      dispatch(incrementQuantity(id)); // If no product info, allow increment
    }
  };

  const handleDecrement = (id) => {
    dispatch(decrementQuantity(id));
  };

  const handleCheckout = () => {
    if (!currentUser) {
      toast.info('Please log in to continue with checkout');
      navigate('/login?redirect=/details');
      return;
    }

    navigate('/details');
  };

  // Helper function to get remaining stock for an item
  const getRemainingStock = (itemId) => {
    const product = products.find(p => p.id === itemId);
    const cartItem = cart.find(item => item.id === itemId);

    if (!product || !product.stock) return Infinity;
    return product.stock - (cartItem ? cartItem.quantity : 0);
  };

  return (
    <div className="container mt-5">
      <CustomToastContainer />
      <h2 className="mb-4">Your Cart</h2>

      {cart.length === 0 ? (
        <div className="alert alert-info">
          Your cart is empty. <Link to="/">Go shopping</Link>
        </div>
      ) : (
        <>
          <div className="row">
            {cart.map((item, index) => {
              // Safely check if product exists in products array
              const product = products && products.length > 0
                ? products.find(p => p.id === item.id)
                : null;

              const isMaxStock = product && product.stock
                ? item.quantity >= product.stock
                : false;

              return (
                <div className="col-md-4 mb-4" key={index}>
                  <div className="card h-100 d-flex flex-column">
                    <img
                      src={item.image}
                      className="card-img-top"
                      alt={item.title}
                      style={{ objectFit: 'cover', height: '200px' }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{item.title}</h5>
                      <p className="card-text">₹{item.price}</p>
                      <div className="d-flex align-items-center mb-2">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => handleDecrement(item.id)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => handleIncrement(item.id)}
                          disabled={isMaxStock}
                        >
                          +
                        </button>
                      </div>
                      {product && product.stock && (
                        <small className={isMaxStock ? "text-danger mb-2" : "text-muted mb-2"}>
                          {isMaxStock
                            ? "Maximum stock reached"
                            : `${product.stock - item.quantity} more available`}
                        </small>
                      )}
                      <button
                        className="btn btn-danger mt-auto"
                        onClick={() => handleRemove(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4">
            <h4>Total: ₹{total.toFixed(2)}</h4>
            <button
              onClick={handleCheckout}
              className="btn btn-success mt-2"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;