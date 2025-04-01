import React, { useState } from 'react';
import './Login.css';
import assets from '../../assets/assets';
import { signup, login } from '../../config/firebase';

const Login = () => {
    const [currState, setCurrState] = useState("Sign Up");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            if (currState === 'Sign Up') {
                await signup(userName, email, password);
                alert("Signup successful!");
                setCurrState("Login");
            } else {
                await login(email, password);
                alert("Login successful!");
            }

            // Reset fields after successful action
            setUserName("");
            setEmail("");
            setPassword("");
        } catch (error) {
            let errorMessage = error.message;

            switch (error.code) {
                case "auth/email-already-in-use":
                    errorMessage = "Email is already in use. Please use a different email.";
                    break;
                case "auth/invalid-email":
                    errorMessage = "Invalid email address. Please check your email.";
                    break;
                case "auth/weak-password":
                    errorMessage = "Password should be at least 6 characters.";
                    break;
                case "auth/user-not-found":
                case "auth/wrong-password":
                    errorMessage = "Invalid email or password. Please try again.";
                    break;
                default:
                    errorMessage = "Something went wrong. Please try again.";
            }

            alert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login">
            <img src={assets.logo_big} alt="App Logo" className="logo" />
            <form onSubmit={onSubmitHandler} className="login-form">
                <h2>{currState}</h2>

                {currState === 'Sign Up' && (
                    <input
                        onChange={(e) => setUserName(e.target.value)}
                        value={userName}
                        type="text"
                        placeholder="Username"
                        className="form-input"
                        required
                    />
                )}

                <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    placeholder="Email address"
                    className="form-input"
                    required
                />

                <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    placeholder="Password"
                    className="form-input"
                    required
                />

                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Loading..." : currState}
                </button>

                <div className="login-term">
                    <input type="checkbox" id="terms" required />
                    <label htmlFor="terms">Agree to the terms of use & privacy policy</label>
                </div>

                <div className="login-forgot">
                    <p className="login-toggle">
                        {currState === 'Sign Up'
                            ? 'Already have an account? '
                            : "Don't have an account? "}
                        <span onClick={() => setCurrState(currState === 'Sign Up' ? 'Login' : 'Sign Up')}>
                            Click here
                        </span>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default Login;
