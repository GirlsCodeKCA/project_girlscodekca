import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_AVANCES } from 'graphql/avances/queries';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

import PrivateRoute from 'components/PrivateRoute';

const IndexAvances = () => {
  const { data, error, loading } = useQuery(GET_AVANCES);

  useEffect(() => {
    if (error) {
      toast.error('Error consultando los Avances');
    }
  }, [error]);

  if (loading) return <div>Cargando....</div>;

  return (
    <PrivateRoute roleList={['ADMINISTRADOR']}>
      <div>
      &nbsp;
        <center> <h1 class="text-3xl black-600 font-black"> INFORMACION DE LOS AVANCES </h1> </center>
        &nbsp;
        <a href='https://postimages.org/' target='_blank'><center><img src='https://i.postimg.cc/hG7sHsxy/klipartz-com-1.png' border='0' alt='klipartz-com-1' width='500'/></center></a>
        <table className='tabla'>
          <thead>
            <tr>
              <th><center>ID Avances</center></th>
              <th><center>Fecha</center></th>
              <th><center>Descripcion</center></th>
              <th><center>Observaciones</center></th>
              <th><center>ID Proyecto</center></th>
              <th><center>Lider Proyecto</center></th>
              <th><center>Editar</center></th>
            </tr>
          </thead>
          <tbody>
            {data && data.Avances ? (
              <>
                {data.Avances.map((u) => {
                  return (
                    <tr key={u._id}>
                      <td>{u.fecha}</td>
                      <td>{u.descripcion}</td>
                      <td>{u.observacion}</td>

                      <td>
                        <Link to={`/avances/editar/${u._id}`}>
                          <center><i className='fas fa-user-edit text-blue-600 hover:text-red-400 cursor-pointer' /></center>
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

export default IndexAvances;

