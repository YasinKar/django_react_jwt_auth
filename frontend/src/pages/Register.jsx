import { Link, useNavigate } from "react-router-dom";
import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';

export default function Register() {
    const { handleRegister, loading, error, setError, user } = useContext(AuthContext);

    const navigate = useNavigate();

    const [email, setEmail] = useState(null)
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirm_password, setConfirmPassword] = useState(null)

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null)
        if (email && password && username && confirm_password) {
            handleRegister(email, username, password, confirm_password)
        } else {
            setError('لطفا فرم را به درستی پر کنید.')
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className="flex items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
            <div className="w-full bg-light rounded-lg md:mt-0 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-dark md:text-2xl">
                        ثبت حساب کاربری
                    </h1>
                    <form className="space-y-1" onSubmit={handleSubmit}>
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-dark"
                            >
                                ایمیل
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                className="bg-dark text-light rounded-lg block w-full p-2.5"
                                placeholder="example@example.com"
                                required=""
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-dark"
                            >
                                نام کاربری
                            </label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                className="bg-dark text-light rounded-lg block w-full p-2.5"
                                placeholder="example"
                                required=""
                                onChange={e => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-dark"
                            >
                                گذرواژه
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="••••••••"
                                className="bg-dark text-light rounded-lg block w-full p-2.5"
                                required=""
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-dark"
                            >
                                تائید گذرواژه
                            </label>
                            <input
                                type="password"
                                name="confirm_password"
                                id="confirm_password"
                                placeholder="••••••••"
                                className="bg-dark text-light rounded-lg block w-full p-2.5 mb-5"
                                required=""
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <p className="text-red-600 py-2">{error}</p>

                        <div>
                            <input
                                type="submit"
                                className="w-full text-dark bg-light border-2 border-dark hover:bg-dark hover:text-light font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                value={loading ? '...' : 'ثبت نام'} disabled={loading}
                            />
                            <p className="text-sm text-center mt-2 font-medium text-dark">
                                حساب فعالی دارید؟ {" "}
                                <Link
                                    to={'/login'}
                                    className="hover:underline"
                                >
                                    ورود
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}