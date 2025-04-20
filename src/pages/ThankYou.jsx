import { Link } from "react-router-dom";

const ThankYou = () => {
    return (
        <div className="container py-5 my-5 bg-light rounded shadow-sm text-center">
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8">
                    <h1 className="text-success display-3 mb-4">
                        🎉 Thank You!
                    </h1>
                    <p className="lead text-muted mb-4">
                        Your payment was successful.
                    </p>
                    <Link
                        to={'/'}
                        className="btn btn-primary btn-lg px-5 py-3 rounded-pill"
                    >
                        Go to Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ThankYou;

