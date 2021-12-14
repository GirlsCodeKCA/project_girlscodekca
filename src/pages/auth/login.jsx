import { Link } from "react-router-dom";
import logo from "styles/images/inicio.jpg"
import ButtonLoading from "components/ButtonLoading";
import React, { useEffect } from 'react';
import useFormData from 'hooks/useFormData';
import { useMutation } from '@apollo/client';
import { LOGIN } from 'graphql/auth/mutations';
import { useAuth } from 'context/authContext';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import ReactLoading from 'react-loading';

function Login() {

  const navigate = useNavigate();
  const { setToken } = useAuth();
  const { form, formData, updateFormData } = useFormData();

  const [login, { data: dataMutation, loading: mutationLoading, error: mutationError }] =
    useMutation(LOGIN);
    
  const submitForm = (e) => {
    e.preventDefault();
    
    login({
      variables: formData,
      
    });
  };

  useEffect(() => {
    console.log("data",dataMutation);
    if (dataMutation !=null) {
      if (dataMutation.login!=null) {
        setToken(dataMutation.login.token);
        navigate('/');
      }else{
        alert("Usuario y/o contraseña incorrecta");
      }
      }
  }, [dataMutation, setToken, navigate]);

  
  useEffect(() => {
    console.log("error",mutationError);
  }, [mutationError]);
  return (
    <div className='flex h-screen bg-blue-900'> 
        <div className='flex flex-col h-screen bg-blue-800 text-white'>
            <center>
            <form onSubmit={submitForm} onChange={updateFormData} ref={form} className='mx-18 mt-20 '>
                <h1 className='text-2xl font-bold'>¡Welcome to Project Universe🚀!</h1>
                <p className='mb-8 text-base mt-6'>Ingresa a tu cuenta</p>
                <label className='font-medium text-lg '>Correo</label><br/>
                <input name='correo' type="email"  placeholder="example@misiontic.com"
                className='mt-2 rounded-lg p-2 h-10 w-64 mb-4 cursor-auto outline-none text-blue-900 text-base'>
                </input><br/>
                <label className='font-medium text-lg' >Contraseña</label><br /> 
                <input type="password" placeholder="******" name='password' 
                className='mt-2 rounded-lg p-2 h-10 w-64 mb-4 cursor-auto outline-none text-blue-900 text-xl'></input>
                <br /> 
                <br /> 
                <center><ButtonLoading
                        disabled={Object.keys(formData).length === 0}
                       
                        className={"w-48 h-10 bg-pink-600 text-white font-semibold text-xl mb-6 rounded-lg hover:bg-pink-400  shadow-md disabled:opacity-50 disabled:bg-gray-700"}
                        text='Iniciar Sesión'
                /></center>
            </form>  
            </center>   
            <center><span className='text-base'>¿Aun no tienes una cuenta?</span></center><br/>
              <Link to='/auth/register'>
                <center><span className='text-red-400 font-bold text-xl '>Regístrate</span></center>
              </Link>
          <p className='absolut mt-12 mx-60 text-xs'></p>            
        </div>
        <div className='flex '>
          <img className='h-100 w-100' src={logo} alt="girlscode" />

        </div>
    </div>
  );
};

export default Login;