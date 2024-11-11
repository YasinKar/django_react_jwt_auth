import React, { useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AccountActivation = () => {
  const { handleActivateAccount } = useContext(AuthContext);

  const { authCode } = useParams();
  const authCodeRef = useRef(null);

  useEffect(() => {
    if (authCodeRef.current !== authCode) {
      authCodeRef.current = authCode;
      handleActivateAccount(authCode);
    }
  }, [authCode]);

  return (
    <div></div>
  );
};

export default AccountActivation;