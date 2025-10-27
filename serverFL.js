import { ApolloServer, gql } from 'apollo-server';

// Aquí definimos el schema 
const typeDefs = gql`
  type Producto {
    id: ID!
    nombre: String!
    descrpicion: String!
    valor: Int!
  }

  type Query {
    productos: [Producto!]!
    producto(id: ID!): Producto
  }

  type Mutation {
    crearProducto(nombre: String!, descripcion: String!, valor: Int!): Producto
    actualizarProducto(id: ID!, nombre: String, descripcion: String, valor: Int): Producto
    eliminarProducto(id: ID!): Boolean
  }
`;

// Datos en memoria 
let productos = [];
let contador = 1;

// Aquí definimos los resolvers 
const resolvers = {
  Query: {
    productos: () => productos,
    producto: (_, { id }) => productos.find(p => p.id === id),
  },
  Mutation: {
    crearProducto: (_, { nombre, descripcion, valor }) => {
      const nuevo = { id: String(contador++), nombre, descripcion, valor };
      productos.push(nuevo);
      return nuevo;
    },
    actualizarProducto: (_, { id, nombre, descripcion, valor }) => {
      const prod = productos.find(p => p.id === id);
      if (!prod) return null;
      if (nombre !== undefined) prod.nombre = nombre;
      if (descripcion !== undefined) prod.descripcion = descripcion;
      if (valor !== undefined) prod.valor = valor;
      return prod;
    },
    eliminarProducto: (_, { id }) => {
      const i = productos.findIndex(p => p.id === id);
      if (i === -1) return false;
      productos.splice(i, 1);
      return true;
    },
  },
};

// Ahora creamos y levantamos el servidor
const server = new ApolloServer({ typeDefs, resolvers });

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Servidor GraphQL listo en: ${url}`);
});
 