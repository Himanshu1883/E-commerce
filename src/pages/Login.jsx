import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
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
        <div className="col-md-6 col-lg-5">
          <div className="card border-0 shadow-lg login-card">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold login-title">Welcome Back!</h2>
                <p className="text-muted">Sign in to your account to continue</p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control login-input"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <label htmlFor="password" className="form-label">Password</label>
                    <Link to="/forgot-password" className="text-primary text-decoration-none small">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control login-input"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 mb-4 login-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Signing in...
                    </>
                  ) : 'Sign In'}
                </button>
              </form>

              <div className="text-center mt-3">
                <p className="mb-0">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-primary fw-bold text-decoration-none">
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .login-card {
          border-radius: 12px;
          transition: transform 0.3s ease;
        }
        
        .login-card:hover {
          transform: translateY(-5px);
        }
        
        .login-title {
          background: linear-gradient(90deg, #0d6efd, #6610f2);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        
        .login-input {
          border-radius: 0 6px 6px 0 !important;
          padding: 0.6rem 1rem;
          transition: all 0.3s ease;
        }
        
        .login-input:focus {
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
          border-color: #0d6efd;
        }
        
        .input-group-text {
          background-color: #f8f9fa;
          border-radius: 6px 0 0 6px !important;
          border-right: none;
        }
        
        .login-btn {
          border-radius: 6px;
          font-weight: 600;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .login-btn::before {
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
        
        .login-btn:hover::before {
          left: 100%;
        }
        
        .login-btn:hover {
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

export default Login;