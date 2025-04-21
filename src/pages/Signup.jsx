import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return false;
    }
    
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await signup(formData.email, formData.password, formData.name);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="card border-0 shadow-lg signup-card">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold signup-title">Create an Account</h2>
                <p className="text-muted">Join our community today</p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-person"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control signup-input"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control signup-input"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control signup-input"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Create a password"
                    />
                  </div>
                  <small className="text-muted">Password must be at least 6 characters</small>
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock-fill"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control signup-input"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 mb-3 signup-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Creating Account...
                    </>
                  ) : 'Create Account'}
                </button>
              </form>

              <div className="text-center mt-3">
                <p className="mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary fw-bold text-decoration-none">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .signup-card {
          border-radius: 12px;
          transition: transform 0.3s ease;
        }
        
        .signup-card:hover {
          transform: translateY(-5px);
        }
        
        .signup-title {
          background: linear-gradient(90deg, #0d6efd, #6610f2);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        
        .signup-input {
          border-radius: 0 6px 6px 0 !important;
          padding: 0.6rem 1rem;
          transition: all 0.3s ease;
        }
        
        .signup-input:focus {
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
          border-color: #0d6efd;
        }
        
        .input-group-text {
          background-color: #f8f9fa;
          border-radius: 6px 0 0 6px !important;
          border-right: none;
        }
        
        .signup-btn {
          border-radius: 6px;
          font-weight: 600;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .signup-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: all 0.6s ease;
          z-index: 1;
        }
        
        .signup-btn:hover::before {
          left: 100%;
        }
        
        .signup-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(13, 110, 253, 0.4);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .card {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Signup;