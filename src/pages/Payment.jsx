
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../store/slices/cartSlice';
const Payment = () => {
    const navigate = useNavigate();
    const cartTotal = useSelector((state) => state.cart.totalAmount);
    const dispatch = useDispatch()
    const [form, setForm] = useState({
        cardNumber: '',
        name: '',
        cvv: '',
        expiry: '',
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePayment = () => {
        const { cardNumber, name, cvv, expiry } = form;
        if (cardNumber && name && cvv && expiry) {
            alert('💳 Payment Successful!');
            dispatch(clearCart())
            navigate('/thank-you');
        } else {
            alert('Please fill all fields');
        }
    };

    return (
        <div className="container mt-5">
            <div className="card p-4 shadow mx-auto" style={{ maxWidth: '500px' }}>
                <h3 className="text-center mb-4">Payment</h3>
                <p><strong>Total Amount:</strong> ₹{cartTotal}</p>

                <div className="mb-3">
                    <label className="form-label">Card Number</label>
                    <input
                        type="text"
                        className="form-control"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={form.cardNumber}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Cardholder Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        placeholder="Your Name"
                        value={form.name}
                        onChange={handleChange}
                    />
                </div>

                <div className="row">
                    <div className="col-6 mb-3">
                        <label className="form-label">CVV</label>
                        <input
                            type="password"
                            className="form-control"
                            name="cvv"
                            placeholder="123"
                            value={form.cvv}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-6 mb-3">
                        <label className="form-label">Expiry (MM/YY)</label>
                        <input
                            type="text"
                            className="form-control"
                            name="expiry"
                            placeholder="MM/YY"
                            value={form.expiry}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <button className="btn btn-primary w-100" onClick={handlePayment}>
                    Pay Now
                </button>
            </div>
        </div>
    );
};

export default Payment;