import { Link } from "react-router-dom";
import React, { useEffect } from 'react';
import ButtonLoading from "components/ButtonLoading";
import { Enum_Rol } from 'utils/enums';
import DropDown from 'components/Dropdown';
import useFormData from 'hooks/useFormData';
import { REGISTRO } from 'graphql/auth/mutations';
import { useMutation } from '@apollo/client';
import { useAuth } from 'context/authContext';
import { toast } from 'react-toastify';
import { ToastContainer } from "react-toastify";

const Register = () => {
    
    const { setToken } = useAuth();
    const { form, formData, updateFormData } = useFormData();
  
    const [registro, { data: dataMutation, loading: loadingMutation, error: errorMutation }] =
      useMutation(REGISTRO);
  
//La función registro pasa los valores de los inputs que vienen del formulario de registro 
    const submitForm = (e) => {
      e.preventDefault();
      registro({ variables: formData });
    };
  
    useEffect(() => {
        if (dataMutation) {
            if (dataMutation.registro.token) {
                setToken(dataMutation.registro.token);
                }
            }
        }, [dataMutation, setToken]);
        
    useEffect(() => {
        if (dataMutation) {
                toast.success('Usuario registrado con éxito');
                }
        },
         [dataMutation]);
    
        useEffect(()=>{
            if (errorMutation){
                toast.error('Error creando usuario');
                }      
        },[errorMutation])
    
    return (
    <div>       
        <div className='bg-blue-800 flex flex-col h-screen text-white overflow-y-auto '>
            <div className='mt-12 ml-96 pl-10 '> 
                    <h1 className=' ml-20 text-2xl font-bold '>Crea tu Cuenta🚀</h1>
                    <form onSubmit={submitForm} onChange={updateFormData} ref={form} className='flex flex-col mt-12'> 
                        
                        <label className='font-medium text-lg' htmlFor="NombreUsuario">Nombres</label>
                        <input type="text" name="nombre" 
                        className='mt-2 rounded-lg p-2 w-96 h-10 cursor-auto outline-none text-gray-900 text-base'
                        placeholder="Ingresa tu nombre completo" required/><br/>

                        <label className='font-medium text-lg' htmlFor="ApellidorUsuario">Apellidos </label>
                        <input type="text" name="apellido"
                        className='mt-2 rounded-lg p-2 w-96 h-10 cursor-auto outline-none text-gray-900 text-base'
                        placeholder="Ingresa tus apellidos" required/><br/>
                    
                        <label className='font-medium text-lg' htmlFor="id">Cédula</label>
                        <input type="numer" name="identificacion"
                        className='mt-2 rounded-lg p-2 w-96 h-10 cursor-auto outline-none text-gray-900 text-base'
                        placeholder="Ingresa tu documento de identidad" required/><br/>

                        <DropDown label='Rol Usuario' name='rol' required={true} options={Enum_Rol} /><br/>
                        
                        <label className='font-medium text-lg' htmlFor="emailUsuario">Correo</label>
                        <input type="email" id="email" name="correo"
                        className='mt-2 rounded-lg p-2 w-96 h-10 cursor-auto outline-none text-gray-900 text-base'
                        placeholder="Ingresa tu direccion de correo" required/><br/>

                        <label className='font-medium text-lg' htmlFor="contraseñaUsuario">Contraseña</label>
                        <input type="password" id="password" name="password"
                        className='mt-2 rounded-lg p-2 w-96 h-10 cursor-auto outline-none text-gray-900 text-base'
                        placeholder="Ingresa tu contraseña" required/><br/>

                        <ButtonLoading
                        disabled={Object.keys(formData).length === 0}
                        loading={loadingMutation}
                        className={"w-48 ml-20 h-10 bg-pink-600 text-white font-semibold text-xl mb-6 rounded-lg hover:bg-pink-400  shadow-md disabled:opacity-50 disabled:bg-gray-700"}
                        text='Registrarme'
                        /> 

                    </form>

                    <span className='ml-28 font-bold'>¿Ya tienes cuenta?</span><br/>
                    <div className='mb-8 mt-2'>
                        <Link to ='/auth/Login'>
                            <span className='text-red-400 font-bold text-xl ml-28'>Iniciar Sesión</span>
                        </Link>  
                    </div>
                    <ToastContainer/>
            </div>
            
        </div>
    </div>
    )
}

export default Register