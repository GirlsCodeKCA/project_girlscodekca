import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Input from 'components/Input';
import { AVANCES } from 'graphql/avances/queries';
import { Link } from 'react-router-dom';
import DropDown from 'components/Dropdown';
import ButtonLoading from 'components/ButtonLoading';
import useFormData from 'hooks/useFormData';

import { nanoid } from 'nanoid';
import { ObjContext } from 'context/objContext';
import { useObj } from 'context/objContext';
import { CREAR_AVANCE } from 'graphql/avances/mutations';

const NuevoAvance = () => {
  const { form, formData, updateFormData } = useFormData();
  const [listaUsuarios, setListaUsuarios] = useState({});
  const { data, loading, error } = useQuery(AVANCES, {
    variables: {
      filtro: { rol: 'LIDER', estado: 'AUTORIZADO' },
      filtro: { rol: 'ESTUDIANTE', estado: 'AUTORIZADO' },
    },
  });

  const [crearAvance, { data: mutationData, loading: mutationLoading, error: mutationError }] =
    useMutation(CREAR_AVANCE);

  useEffect(() => {
    console.log(data);
    if (data) {
      const lu = {};
      data.Usuarios.forEach((elemento) => {
        lu[elemento._id] = elemento.correo;
      });

      setListaUsuarios(lu);
    }
  }, [data]);

  useEffect(() => {
    console.log('data mutation', mutationData);
  });

  const submitForm = (e) => {
    e.preventDefault();

    formData.objetivos = Object.values(formData.objetivos);
    formData.presupuesto = parseFloat(formData.presupuesto);

    crearAvance({
      variables: formData,
    });
  };

  if (loading) return <div>...Loading</div>;

  return (
    <div className='p-10 flex flex-col items-center'>
      <div className='self-start'>
        <Link to='/avances'>
          <i className='fas fa-arrow-left' />
        </Link>
      </div>
      <h1 className='text-2xl font-bold text-gray-900'>Crear Nuevo Avance</h1>
      <form ref={form} onChange={updateFormData} onSubmit={submitForm}>
        <Input name='nombre' label='Nombre del Avance' required={true} type='text' />

        <Input name='fechaCreacion' label='Fecha de creacion' required={true} type='date' />
        <Input name='descripcion' label='Descripcion del Avance' required={true} type='text' />

        <DropDown label='Líder' options={listaUsuarios} name='lider' required={true} />
        <DropDown label='Estudiante' options={listaUsuarios} name='estudiante' required={true} />
        <Observaciones />
        <ButtonLoading text='Crear Avance' loading={false} disabled={false} />
      </form>
    </div>
  );
};

const Observaciones = () => {
  const [listaObservaciones, setListaObservaciones] = useState([]);
  const [maxObservaciones, setMaxObservaciones] = useState(false);

  const eliminarObservacion = (id) => {
    setListaObservaciones(listaObservaciones.filter((el) => el.props.id !== id));
  };

  const componenteObservacionAgregado = () => {
    const id = nanoid();
    return <FormObservacion key={id} id={id} />;
  };

  useEffect(() => {
    if (listaObservaciones.length > 4) {
      setMaxObservaciones(true);
    } else {
      setMaxObservaciones(false);
    }
  }, [listaObservaciones]);

  return (
    <ObjContext.Provider value={{ eliminarObservacion }}>
      <div>
        <span>Observaciones del Avance</span>
        {!maxObservaciones && (
          <i
            onClick={() => setListaObservaciones([...listaObservaciones, componenteObservacionAgregado()])}
            className='fas fa-plus rounded-full bg-green-500 hover:bg-green-400 text-white p-2 mx-2 cursor-pointer'
          />
        )}
        {listaObservaciones.map((observacion) => {
          return observacion;
        })}
      </div>
    </ObjContext.Provider>
  );
};

const FormObservacion = ({ id }) => {
  const { eliminarObservaciones } = useObj();
  return (
    <div className='flex items-center'>
      <Input
        name={`nested||observaciones||${id}||descripcion`}
        label='Descripción'
        type='text'
        required={true}
      />

      <i
        onClick={() => eliminarObservaciones(id)}
        className='fas fa-minus rounded-full bg-red-500 hover:bg-red-400 text-white p-2 mx-2 cursor-pointer mt-6'
      />
    </div>
  );
};

export default NuevoAvance;
