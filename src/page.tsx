import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Page() {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/Page/login');
  }, [navigate]);
  
  return null;
}
