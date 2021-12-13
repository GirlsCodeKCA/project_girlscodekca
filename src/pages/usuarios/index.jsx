import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USUARIOS } from 'graphql/usuarios/queries';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Enum_Rol, Enum_EstadoUsuario } from 'utils/enums';
import PrivateRoute from 'components/PrivateRoute';


const IndexUsuarios = () => {
  const { data, error, loading } = useQuery(GET_USUARIOS);

  useEffect(() => {
    if (error) {
      toast.error('Error consultando los usuarios');
    }
  }, [error]);

  if (loading) return <div>Cargando....</div>;

  return (
    <PrivateRoute roleList={['ADMINISTRADOR', 'LIDER']}>
      <div>
        &nbsp;
        <center> <h1 class="text-3xl black-600 font-black"> INFORMACION DE LOS USUARIOS </h1> </center>
        <center><a href='https://postimg.cc/T5fpBMxD' target='_blank'><img src='https://i.postimg.cc/D0bLJnYB/bannerusers.jpg' border='0' alt='bannerusers' width="700"/></a> </center>
        <table className='tabla'>
          <thead>
            <tr>
              <th><center>Nombre</center></th>
              <th><center>Apellidos</center></th>
              <th><center>Correo</center></th>
              <th><center>Identificación</center></th>
              <th><center>Rol</center></th>
              <th><center>Estado</center></th>
              <th><center>Editar</center></th>
            </tr>
          </thead>
          <tbody>
            {data && data.Usuarios ? (
              <>
                {data.Usuarios.map((u) => {
                  return (
                    <tr key={u._id}>
                      <td>{u.nombre}</td>
                      <td>{u.apellido}</td>
                      <td>{u.correo}</td>
                      <td>{u.identificacion}</td>
                      <td>{Enum_Rol[u.rol]}</td>
                      <td>{Enum_EstadoUsuario[u.estado]}</td>
                      <td>
                        <Link to={`/usuarios/editar/${u._id}`}>
                          <center><i className='fas fa-user-edit fa-2x text-blue-600 hover:text-red-400 cursor-pointer' /></center>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </>
            ) : (
              <div>No autorizado</div>
            )}
          </tbody>
        </table>
      </div>

    </PrivateRoute>
      
   );
};

export default IndexUsuarios;
