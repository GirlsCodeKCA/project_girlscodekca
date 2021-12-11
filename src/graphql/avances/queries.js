import { gql } from '@apollo/client';

const GET_AVANCES = gql`
  query Query($id: String!) {
    Proyecto(_id: $id) {
      _id
      nombre
      avances {
          _id
          fecha
          descripcion
          observaciones
      }
    }
  }
`;

export { GET_AVANCES };
