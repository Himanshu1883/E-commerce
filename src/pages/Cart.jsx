import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
} from '../store/slices/cartSlice';
import { Link } from 'react-router-dom';

function Cart() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleIncrement = (id) => {
    dispatch(incrementQuantity(id));
  };

  const handleDecrement = (id) => {
    dispatch(decrementQuantity(id));
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Your Cart</h2>

      {cart.length === 0 ? (
        <div className="alert alert-info">
          Your cart is empty. <Link to="/">Go shopping</Link>
        </div>
      ) : (
        <>
          <div className="row">
            {cart.map((item, index) => (
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
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="btn btn-danger mt-auto"
                      onClick={() => handleRemove(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <h4>Total: ₹{total.toFixed(2)}</h4>
            <Link to="/payment" className="btn btn-success mt-2">
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
