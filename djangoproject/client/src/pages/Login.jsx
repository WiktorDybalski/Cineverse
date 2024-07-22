import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Login.css';
import axios from 'axios';

function Login({ setIsLogin, setUsername }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginAttempt, setLoginAttempt] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleSubmit(event);
        }
    };

    const validateForm = () => {
        let formIsValid = true;
        let errors = {};

        if (!email) {
            formIsValid = false;
            errors['email'] = 'Email is obligatory';
        }

        if (!password) {
            formIsValid = false;
            errors['password'] = 'Password is obligatory';
        }

        setErrors(errors);
        return formIsValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const response = await fetch('http://localhost:8000/api/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    email,
                    password
                })
            });
            const content = await response.json();
            if (response.ok) {
                setIsLogin(true);
                localStorage.setItem('isLogin', true);
                setLoginAttempt(true);
                const response = await fetch('http://localhost:8000/api/user/', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',

                });
                const content = await response.json();
                setUsername(content.username);
                localStorage.setItem('username', content.username);
                navigate('/user_profile');
            } else {
                console.error('Login error:', content);
            }
        }
    };

    useEffect(() => {
        if (loginAttempt) {
            setLoginAttempt(false);
        }
    }, [loginAttempt]);

    return (
        <div className="Login">
            <div id="content">
                <div className="login-form-container">
                    <h2 className="title">Log in</h2>
                    <form className="form" onSubmit={handleSubmit}>
                        {errors.server && <div className="error-message">{errors.server}</div>}
                        <input
                            type="email"
                            className={`input ${errors.email ? 'error-input' : ''}`}
                            placeholder={errors.email || "Email"}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <input
                            type="password"
                            className={`input ${errors.password ? 'error-input' : ''}`}
                            placeholder={errors.password || "Password"}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button type="submit" className="button">Log in</button>
                        <p className="message">
                            I am new <Link to="/register" className="link">Create an account</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;



