import { gql } from '@apollo/client';

const AVANCES = gql`
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

export { AVANCES };
