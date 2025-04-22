import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming this is where your auth data is

function FakePayment() {
    const cart = useSelector((state) => state.cart.items);
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const { currentUser } = useAuth(); 
    const [addressInfo, setAddressInfo] = useState({
        name: '',
        mobile: '',
        address: '',
        city: '',
        pincode: '',
    });

    const navigate = useNavigate();
    useEffect(() => {
        if (currentUser) {
            setAddressInfo(prevState => ({
                ...prevState,
                name: currentUser.displayName || '',
                mobile: currentUser.phoneNumber || '',
                // You might have these stored in your user profile
                address: currentUser.address || '',
                city: currentUser.city || '',
                pincode: currentUser.pincode || ''
            }));
        }
    }, [currentUser]);

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
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h3 className="mb-0">Shipping Information</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleAddressSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            value={addressInfo.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Mobile Number</label>
                                        <input
                                            type="tel"
                                            name="mobile"
                                            className="form-control"
                                            value={addressInfo.mobile}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your mobile number"
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">Full Address</label>
                                    <textarea
                                        name="address"
                                        className="form-control"
                                        value={addressInfo.address}
                                        onChange={handleChange}
                                        required
                                        rows="3"
                                        placeholder="Enter your street address"
                                    ></textarea>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">City</label>
                                        <input
                                            type="text"
                                            name="city"
                                            className="form-control"
                                            value={addressInfo.city}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your city"
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label fw-bold">Pincode</label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            className="form-control"
                                            value={addressInfo.pincode}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your pincode"
                                        />
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mt-4">
                                    <div className="text-end">
                                        <p className="mb-0 fw-bold">Order Total: ₹{total.toFixed(2)}</p>
                                    </div>
                                    <button type="submit" className="btn btn-primary">
                                        <i className="bi bi-credit-card me-2"></i>
                                        Proceed to Payment
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FakePayment;