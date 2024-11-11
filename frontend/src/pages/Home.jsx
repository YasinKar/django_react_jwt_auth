import { Link } from "react-router-dom";
import React, { useState, useContext } from 'react';
// Icons
import { CiLogin } from "react-icons/ci";
import { GoPerson } from "react-icons/go";
// Context
import AuthContext from '../context/AuthContext';

export default function Home() {
    const { user, handleLogout } = useContext(AuthContext);

    return (
        <div className="flex justify-center items-center h-screen flex-col md:flex-row gap-32">
            {
                !user && (
                    <>
                        <Link className="bg-light flex items-center py-5 px-14 rounded-md font-medium text-dark" to={'/login'}>
                            ورود<CiLogin className="mx-2 text2xl" />
                        </Link>
                        <Link className="bg-light flex items-center py-5 px-14 rounded-md font-medium text-dark" to={'/register'}>
                            ثبت نام<GoPerson className="mx-2 text2xl" />
                        </Link>
                    </>
                ) || (
                    <>
                        <Link className="bg-light flex items-center py-5 px-14 rounded-md font-medium text-dark" onClick={handleLogout}>
                            خروج<CiLogin className="mx-2 text2xl" />
                        </Link>
                    </>
                )
            }
        </div>
    );
}