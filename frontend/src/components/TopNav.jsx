import AuthContext from '../context/AuthContext'
import { useContext } from 'react';

export default function TopNav() {
    const { response } = useContext(AuthContext)

    return (
        <div className='sticky top-0 left-0 bg-light z-10 shadow-xl' dir='rtl'>
            {
                response &&
                (<p className='text-dark text-center p-2'>{response}</p>)
            }
        </div>
    )
}
