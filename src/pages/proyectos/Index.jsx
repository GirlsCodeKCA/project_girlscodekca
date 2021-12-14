import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { PROYECTOS } from 'graphql/proyectos/queries';
import DropDown from 'components/Dropdown';
import Input from 'components/Input';
import { Dialog } from '@mui/material';
import { Enum_EstadoProyecto } from 'utils/enums';
//import { Enum_FaseProyecto } from 'utils/enums';
//import presupuesto from 'pages/proyectos/Index';
import ButtonLoading from 'components/ButtonLoading';
import { EDITAR_PROYECTO } from 'graphql/proyectos/mutations';
import useFormData from 'hooks/useFormData';
import PrivateComponent from 'components/PrivateComponent';
import { Link } from 'react-router-dom';
import { CREAR_INSCRIPCION } from 'graphql/inscripciones/mutaciones';
import { useUser } from 'context/userContext';
import { toast } from 'react-toastify';
import {
  AccordionStyled,
  AccordionSummaryStyled,
  AccordionDetailsStyled,
} from 'components/Accordion';
import { ELIMINAR_OBJETIVO } from 'graphql/proyectos/mutations';

import ReactLoading from 'react-loading';
import { Enum_TipoObjetivo } from 'utils/enums';
import { EDITAR_OBJETIVO } from 'graphql/proyectos/mutations';

const IndexProyectos = () => {
  const { data: queryData, loading } = useQuery(PROYECTOS);

  useEffect(() => {
    console.log('datos proyecto', queryData);
  }, [queryData]);

  if (loading) return <div>Cargando...</div>;

  if (queryData.Proyectos) {
    return (
      <div className='p-10 flex flex-col'>
        <div className='flex w-full items-center justify-center'>
          <h1 className="text-3xl black-600 font-black">LISTA DE PROYECTOS</h1>
        </div>
        &nbsp;
        <a href='https://postimg.cc/Mvwm2jRn' target='_blank'><center><img src='https://i.postimg.cc/jdwgfHS4/klipartz-com-3.png' border='0' alt='klipartz-com-3' width='500'/></center></a>
        <PrivateComponent roleList={['ADMINISTRADOR', 'LIDER']}>
          <div className='my-0 self-end'>
            <button className='bg-indigo-500 text-white p-2 rounded-lg shadow-lg hover:bg-indigo-400 font-bold'>
              <Link to='/proyectos/nuevo'>Crear nuevo proyecto</Link>
            </button>
          </div>
        </PrivateComponent>
        &nbsp;
        {queryData.Proyectos.map((proyecto) => {
          return <AccordionProyecto proyecto={proyecto} />;
        })}
      </div>
    );
  }

  return <></>;
};

const AccordionProyecto = ({ proyecto }) => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <AccordionStyled>
        <AccordionSummaryStyled expandIcon={<i className='fas fa-chevron-down' />}>
          <div className='flex w-full justify-between'>
            <div className='uppercase font-bold text-black '>
              {proyecto.nombre} - {proyecto.estado} 
            </div>
          </div>
        </AccordionSummaryStyled>
        <AccordionDetailsStyled>
          <PrivateComponent roleList={['ADMINISTRADOR']}>
            <i
              className='mx-4 fas fa-pen-square fa-3x text-blue-500 hover:text-pink-400'
              onClick={() => {
                setShowDialog(true);
              }}
            />
          </PrivateComponent>
          <PrivateComponent roleList={['ESTUDIANTE']}>
            <InscripcionProyecto
              idProyecto={proyecto._id}
              estado={proyecto.estado}
              inscripciones={proyecto.inscripciones}
            />
          </PrivateComponent>
          <div className='font-bold'>Liderado Por: {proyecto.lider.correo}</div>

          <div className='flex'>
            {proyecto.objetivos.map((objetivo, index) => {
              return (
                <Objetivo
                  index={index}
                  _id={objetivo._id}
                  idProyecto={proyecto._id}
                  tipo={objetivo.tipo}
                  descripcion={objetivo.descripcion}
                />
              );
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
        <FormEditProyecto _id={proyecto._id} />
      </Dialog>
    </>
  );
};

const FormEditProyecto = ({ _id }) => {
  const { form, formData, updateFormData } = useFormData();
  const [editarProyecto, { data: dataMutation, loading, error }] = useMutation(EDITAR_PROYECTO);

  const submitForm = (e) => {
    e.preventDefault();
    editarProyecto({
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
    <div className='p-4 '>
      <h1 className='font-bold text-center'>Modificar el Estado del Proyecto</h1>
      <form
        className={"w-96 h-10 bg-pink-600 text-white font-semibold text-xl mb-6 rounded-lg hover:bg-pink-400  shadow-md disabled:opacity-50 disabled:bg-gray-700"}
        ref={form}
        onChange={updateFormData}
        onSubmit={submitForm}
        className='flex flex-col items-center'
      >
        <DropDown  name='estado' options={Enum_EstadoProyecto} className={"border"}/>
        <ButtonLoading 
         disabled={false} 
         loading={loading} 
         className={"w-32 h-10 bg-pink-600 text-white font-semibold text-xl mb-6 rounded-lg hover:bg-pink-400  shadow-md disabled:opacity-50 disabled:bg-gray-700 mt-6"}
         text='Actualizar' 
        />
      </form>
    </div>
  );
};



const Objetivo = ({ index, _id, idProyecto, tipo, descripcion }) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [eliminarObjetivo, { data: dataMutationEliminar, loading: eliminarLoading }] = useMutation(
    ELIMINAR_OBJETIVO,
    {
      refetchQueries: [{ query: PROYECTOS }],
    }
  );

  useEffect(() => {
    console.log('eliminar objetivo:', dataMutationEliminar);
    if (dataMutationEliminar) {
      toast.success('objetivo eliminado satisfactoriamente');
    }
  }, [dataMutationEliminar]);

  const ejecutarEliminacion = () => {
    eliminarObjetivo({ variables: { idProyecto, idObjetivo: _id } });
  };

  if (eliminarLoading)
    return <ReactLoading data-testid='loading-in-button' type='spin' height={100} width={100} />;

  return (
    <div className='mx-5 my-4 bg-purple-900 p-8 rounded-lg flex flex-col items-center justify-center shadow-xl text-white'>
      <div className='text-lg font-bold text-white'>{tipo}</div>
      <div>{descripcion}</div>
      <PrivateComponent roleList={['ADMINISTRADOR', 'LIDER']}>
        <div className='flex my-2'>
          <i
            onClick={() => setShowEditDialog(true)}
            className='fas fa-pen mx-2 text-yellow-500 hover:text-yellow-200 cursor-pointer'
          />
          <i
            onClick={ejecutarEliminacion}
            className='fas fa-trash mx-2 text-red-500 hover:text-red-200 cursor-pointer'
          />
        </div>
        <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)}>
          <EditarObjetivo
            descripcion={descripcion}
            tipo={tipo}
            index={index}
            idProyecto={idProyecto}
            setShowEditDialog={setShowEditDialog}
          />
        </Dialog>
      </PrivateComponent>
    </div>
  );
};

const EditarObjetivo = ({ descripcion, tipo, index, idProyecto, setShowEditDialog }) => {
  const { form, formData, updateFormData } = useFormData();

  const [editarObjetivo, { data: dataMutation, loading }] = useMutation(EDITAR_OBJETIVO, {
    refetchQueries: [{ query: PROYECTOS }],
  });

  useEffect(() => {
    if (dataMutation) {
      toast.success('Objetivo editado con exito');
      setShowEditDialog(false);
    }
  }, [dataMutation, setShowEditDialog]);

  const submitForm = (e) => {
    e.preventDefault();
    editarObjetivo({
      variables: {
        idProyecto,
        indexObjetivo: index,
        campos: formData,
      },
    }).catch((e) => {
      console.log(e);
      toast.error('Error editando el objetivo');
    });
  };
  return (
    <div className='p-4'>
      <center><h1 className='text-2xl font-bold text-gray-900'>Editar Objetivo</h1></center>
      <form ref={form} onChange={updateFormData} onSubmit={submitForm}>
        <DropDown
          label='Tipo de Objetivo'
          name='tipo'
          required={true}
          options={Enum_TipoObjetivo}
          defaultValue={tipo}
        />
        <Input
          label='Descripcion del objetivo'
          name='descripcion'
          required={true}
          defaultValue={descripcion}
          
        />
        <center>
        <ButtonLoading
          text='Confirmar'
          disabled={Object.keys(formData).length === 0}
          loading={loading}
          className={"w-48 h-10 bg-pink-600 text-white font-semibold text-xl mb-6 rounded-lg hover:bg-pink-400  shadow-md disabled:opacity-50 disabled:bg-gray-700"}
        />
        </center>
      </form>
    </div>
  );
};


const InscripcionProyecto = ({ idProyecto, estado, inscripciones }) => {
  const [estadoInscripcion, setEstadoInscripcion] = useState('');
  const [crearInscripcion, { data, loading, error }] = useMutation(CREAR_INSCRIPCION);
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
      toast.success('Inscripcion creada con exito');
    }
  }, [data]);

  const confirmarInscripcion = () => {
    crearInscripcion({ variables: { proyecto: idProyecto, estudiante: userData._id } });
  };

  return (
    <>
      {estadoInscripcion !== '' ? (
        <span>Ya estas inscrito en este proyecto y el estado es {estadoInscripcion}</span>
      ) : (
        <ButtonLoading
          onClick={() => confirmarInscripcion()}
          disabled={estado === 'INACTIVO'}
          loading={loading}
          className={"w-80 h-10 bg-pink-600 text-white font-semibold text-xl mb-6 rounded-lg hover:bg-pink-400  shadow-md disabled:opacity-50 disabled:bg-gray-700 mt-6"}
          text='Inscribirme en este proyecto'
        />
      )}
    </>
  );
};

export default IndexProyectos;
