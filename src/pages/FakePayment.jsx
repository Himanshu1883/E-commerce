import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function FakePayment() {
    const cart = useSelector((state) => state.cart.items);
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const [addressInfo, setAddressInfo] = useState({
        name: '',
        mobile: '',
        address: '',
        city: '',
        pincode: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setAddressInfo({ ...addressInfo, [e.target.name]: e.target.value });
    };

    const handleAddressSubmit = (e) => {
        e.preventDefault();
        if (
            addressInfo.name &&
            addressInfo.mobile &&
            addressInfo.address &&
            addressInfo.city &&
            addressInfo.pincode
        ) {
            navigate('/payment');
        } else {
            alert('Please fill in all fields.');
        }
    };

    return (
        <div className="container mt-5">
            <h3 className="mb-3">Enter Shipping Address</h3>
            <form onSubmit={handleAddressSubmit}>
                <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={addressInfo.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Mobile Number</label>
                    <input
                        type="text"
                        name="mobile"
                        className="form-control"
                        value={addressInfo.mobile}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Full Address</label>
                    <textarea
                        name="address"
                        className="form-control"
                        value={addressInfo.address}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>

                <div className="mb-3">
                    <label className="form-label">City</label>
                    <input
                        type="text"
                        name="city"
                        className="form-control"
                        value={addressInfo.city}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Pincode</label>
                    <input
                        type="text"
                        name="pincode"
                        className="form-control"
                        value={addressInfo.pincode}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Proceed to Payment
                </button>
            </form>
        </div>
    );
}

export default FakePayment;
