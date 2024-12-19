import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';

export default function ForgotPassword() {
    const { handleForgotPassword, loading, error, setError } = useContext(AuthContext);

    const [email, setEmail] = useState(null)

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null)
        if (email) {
            handleForgotPassword(email)
        } else {
            setError('لطفا فرم را به درستی پر کنید.')
        }
    };

    return (
        <div className="flex items-center justify-center px-6 py-8 mx-auto h-screen lg:py-0">
            <div className="w-full bg-light rounded-lg md:mt-0 sm:max-w-md xl:p-0">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-dark md:text-2xl">
                        بازیابی گذرواژه
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
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

                        <p className="text-red-600 py-2">{error}</p>

                        <div>
                            <input
                                type="submit"
                                className="w-full text-dark bg-light border-2 border-dark hover:bg-dark hover:text-light font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                value={loading ? '...' : 'ورود'} disabled={loading}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}