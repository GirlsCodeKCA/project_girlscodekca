import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { AVANCES } from 'graphql/avances/queries';
import DropDown from 'components/Dropdown';
import { Dialog } from '@mui/material';

import ButtonLoading from 'components/ButtonLoading';
import { EDITAR_AVANCE } from 'graphql/avances/mutations';
import useFormData from 'hooks/useFormData';
import PrivateComponent from 'components/PrivateComponent';
import { Link } from 'react-router-dom';
import { CREAR_AVANCE } from 'graphql/avances/mutacions';
import { useUser } from 'context/userContext';
import { toast } from 'react-toastify';
import {
  AccordionStyled,
  AccordionSummaryStyled,
  AccordionDetailsStyled,
} from 'components/ConfigAvances';

const IndexAvances = () => {
  const { data: queryData, loading, error } = useQuery(AVANCES);

  useEffect(() => {
    console.log('datos avance', queryData);
  }, [queryData]);

  if (loading) return <div>Cargando...</div>;

  if (queryData.Avances) {
    return (
      <div className='p-10 flex flex-col'>
        <div className='flex w-full items-center justify-center'>
          <h1 className='text-2xl font-bold text-gray-900'>Lista de Avances</h1>
        </div>
        <PrivateComponent roleList={['ADMINISTRADOR', 'LIDER', 'ESTUDIANTE']}>
          <div className='my-2 self-end'>
            <button className='bg-indigo-500 text-gray-50 p-2 rounded-lg shadow-lg hover:bg-indigo-400'>
              <Link to='/proyectos/nuevo'>Crear nuevo avance</Link>
            </button>
          </div>
        </PrivateComponent>
        {queryData.Avances.map((avance) => {
          return <AccordionAvance avance={avance} />;
        })}
      </div>
    );
  }

  return <></>;
};

const AccordionAvance = ({ avance }) => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <AccordionStyled>
        <AccordionSummaryStyled expandIcon={<i className='fas fa-chevron-down' />}>
          <div className='flex w-full justify-between'>
            <div className='uppercase font-bold text-gray-100 '>
              {avance.nombre} - {avance.estado}
            </div>
          </div>
        </AccordionSummaryStyled>
        <AccordionDetailsStyled>
          <PrivateComponent roleList={['ADMINISTRADOR']}>
            <i
              className='mx-4 fas fa-pen text-yellow-600 hover:text-yellow-400'
              onClick={() => {
                setShowDialog(true);
              }}
            />
          </PrivateComponent>
          <PrivateComponent roleList={['ESTUDIANTE']}>
            <InscripcionAvance
              idAvance={avance._id}
              estado={avance.estado}
              inscripciones={avance.inscripciones}
            />
          </PrivateComponent>
          <div>Realizado por: {avance.lider.correo}</div>
          <div className='flex'>
            {avance.objetivos.map((objetivo) => {
              return <Objetivo tipo={objetivo.tipo} descripcion={objetivo.descripcion} />;
            })}
          </div>
        </AccordionDetailsStyled>
      </AccordionStyled>
      <Dialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
        }}
      >
        <FormEditAvance _id={avance._id} />
      </Dialog>
    </>
  );
};

const FormEditAvance = ({ _id }) => {
  const { form, formData, updateFormData } = useFormData();
  const [editarAvance, { data: dataMutation, loading, error }] = useMutation(EDITAR_AVANCE);

  const submitForm = (e) => {
    e.preventDefault();
    editarAvance({
      variables: {
        _id,
        campos: formData,
      },
    });
  };

  useEffect(() => {
    console.log('data mutation', dataMutation);
  }, [dataMutation]);

  return (
    <div className='p-4'>
      <h1 className='font-bold'>Modificar Estado del Avance</h1>
      <form
        ref={form}
        onChange={updateFormData}
        onSubmit={submitForm}
        className='flex flex-col items-center'
      >
        <DropDown label='Estado del Avance' name='estado' options={Enum_EstadoAvance} />
        <ButtonLoading disabled={false} loading={loading} text='Confirmar' />
      </form>
    </div>
  );
};

const Objetivo = ({ tipo, descripcion }) => {
  return (
    <div className='mx-5 my-4 bg-gray-50 p-8 rounded-lg flex flex-col items-center justify-center shadow-xl'>
      <div className='text-lg font-bold'>{tipo}</div>
      <div>{descripcion}</div>
      <PrivateComponent roleList={['ADMINISTRADOR']}>
        <div>Editar</div>
      </PrivateComponent>
    </div>
  );
};

const InscripcionAvance = ({ idAvance, estado, inscripciones }) => {
  const [estadoInscripcion, setEstadoInscripcion] = useState('');
  const [crearInscripcion, { data, loading, error }] = useMutation(CREAR_AVANCE);
  const { userData } = useUser();

  useEffect(() => {
    if (userData && inscripciones) {
      const flt = inscripciones.filter((el) => el.estudiante._id === userData._id);
      if (flt.length > 0) {
        setEstadoInscripcion(flt[0].estado);
      }
    }
  }, [userData, inscripciones]);

  useEffect(() => {
    if (data) {
      console.log(data);
      toast.success('avance creado con exito');
    }
  }, [data]);

  const confirmarInscripcion = () => {
    crearInscripcion({ variables: { avance: idavance, estudiante: userData._id } });
  };
};

export default IndexAvances;
