import React, { useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import PrivateRoute from 'components/PrivateRoute';
import { GET_INSCRIPCIONES } from 'graphql/inscripciones/queries';
import { APROBAR_INSCRIPCION } from 'graphql/inscripciones/mutaciones';
//import { RECHAZAR_INSCRIPCION } from 'graphql/inscripciones/mutaciones';
import ButtonLoading from 'components/ButtonLoading';
import { toast } from 'react-toastify';
import {
  AccordionStyled,
  AccordionSummaryStyled,
  AccordionDetailsStyled,
} from 'components/Accordion';

const IndexInscripciones = () => {
  const { data, loading, error, refetch } = useQuery(GET_INSCRIPCIONES);

  useEffect(() => {
    console.log(data);
  }, [data]);
  if (loading) return <div>Loading...</div>;
  return (
    <PrivateRoute roleList={['ADMINISTRADOR', 'LIDER']}>
      <div className='p-10 font-bold text-black'>
        <div className="text-3xl black-600 font-black"><center>LISTA DE INSCRIPCIONES</center></div>
        &nbsp;
        <a href='https://postimages.org/' target='_blank'><center><img src='https://i.postimg.cc/WbHssL9b/klipartz-com-2.png' border='0' alt='klipartz-com-2' width='400'/></center></a>
        <div className='my-4'>
          <AccordionInscripcion
            titulo='INSCRIPCIONES APROBADAS'
            data={data.Inscripciones.filter((el) => el.estado === 'ACEPTADO')}
          />
          <AccordionInscripcion
            titulo='INSCRIPCIONES PENDIENTES'
            data={data.Inscripciones.filter((el) => el.estado === 'PENDIENTE')}
            refetch={refetch}
          />
          <AccordionInscripcion
            titulo='INSCRIPCIONES RECHAZADAS'
            data={data.Inscripciones.filter((el) => el.estado === 'RECHAZADO')}
          />
        </div>
      </div>
    </PrivateRoute>
  );
};

const AccordionInscripcion = ({ data, titulo, refetch = () => {} }) => {
  return (
    <AccordionStyled>
      <AccordionSummaryStyled>
        {titulo} ({data.length})
      </AccordionSummaryStyled>
      <AccordionDetailsStyled>
        <div className='flex'>
          {data &&
            data.map((inscripcion) => {
              return <Inscripcion inscripcion={inscripcion} refetch={refetch} />;
            })}
        </div>
      </AccordionDetailsStyled>
    </AccordionStyled>
  );
};

const Inscripcion = ({ inscripcion, refetch }) => {
  const [aprobarInscripcion, { data, loading, error }] = useMutation(APROBAR_INSCRIPCION);

  useEffect(() => {
    if (data) {
      toast.success('Inscripcion aprobada con exito');
      refetch();
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error('Error aprobando la inscripcion');
    }
  }, [error]);

  const cambiarEstadoInscripcion = () => {
    aprobarInscripcion({
      variables: {
        aprobarInscripcionId: inscripcion._id,
      },
    });
  };

  

  return (
    <div className='bg-purple-900 text-white flex flex-col p-6 m-2 rounded-lg shadow-xl'>
      <span>{inscripcion.proyecto.nombre}</span>
      <span>{inscripcion.estudiante.nombre}</span>
      <span>{inscripcion.estado}</span>
      {inscripcion.estado === 'PENDIENTE' && (
        <ButtonLoading 
          onClick={() => {
            cambiarEstadoInscripcion();
          }}
          text='Aprobar Inscripcion'
          loading={loading}
          disabled={false}
          className={"w-64 h-10 bg-pink-600 text-white font-semibold text-xl mb-6 rounded-lg hover:bg-pink-400  shadow-md disabled:opacity-50 disabled:bg-gray-700"}
        />
      )}
      {inscripcion.estado === 'PENDIENTE' && (
        <ButtonLoading 
          onClick={() => {
            cambiarEstadoInscripcion();
          }}
          text='Rechazar Inscripcion'
          loading={loading}
          disabled={false}
          className={"w-64 h-10 bg-pink-600 text-white font-semibold text-xl mb-6 rounded-lg hover:bg-pink-400  shadow-md disabled:opacity-50 disabled:bg-gray-700"}
        />
      )}
    </div>
  );
};

export default IndexInscripciones;
