import { gql } from '@apollo/client';

const EDITAR_AVANCE = gql`
  mutation EditarAvance($id: String!, $descripcion: String, $observaciones: [String]) {
    editarAvance(_id: $_id, descripcion: $descripcion, observaciones: $observaciones) {
      _id
      fecha
      descripcion
      observaciones
      proyecto {
          _id
      }
    }
  }
`;

const CREAR_AVANCE= gql`
mutation Mutation($fecha: Date!, $descripcion: String!, $observaciones: [String], $proyecto: String!, $creadoPor: String!) {
    crearAvance(fecha: $fecha, descripcion: $descripcion, observaciones: $observaciones, proyecto: $proyecto, creadoPor: $creadoPor) {
      _id
      fecha
      descripcion
      observaciones
      proyecto {
          _id
      }
      creadoPor {
          _id
      }
    }
  }
`;

export { EDITAR_AVANCE, CREAR_AVANCE };
