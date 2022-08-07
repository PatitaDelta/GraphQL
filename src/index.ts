import { ApolloServer, gql } from 'apollo-server'
// import * as Persons from './persons.json'

interface Person {
  id: string
  name: string
  phone: string
  street: string
  city: string
  address?: string
}

const PERSONS: Person[] = [
  {
    id: '66540929C',
    name: 'Guillermo',
    phone: '658233335',
    street: 'Alicante',
    city: 'Calle Azorín, 24, 03007'
  },
  {
    id: '46170877X',
    name: 'Tina',
    phone: '658233335',
    street: 'Valencia',
    city: 'Calle Leonardo da Vinci, 7, 41092'
  },
  {
    id: '30972358Y',
    name: 'Zoe',
    phone: null,
    street: 'Calle de Velázquez, 80, 08901',
    city: 'Astro'
  }
]

const typeDefs = gql`
    type Person {
        id: ID!
        name: String!
        phone: String
        street: String!
        city: String!
        address: String!
    }

    type Query {
        personsCount: Int!
        allPersons: [Person]!
        findPerson(name: String!): Person
    }
`

const resolvers = {
  Query: {
    personsCount: () => PERSONS.length,
    allPersons: () => PERSONS,
    findPerson: (_root: any, args: any) => PERSONS.find((p) => p.name === args.name)
  },
  Person: {
    address: (root: Person) => `${root.street}, ${root.city}`
  }
}

new ApolloServer({
  typeDefs,
  resolvers
}).listen().then(
  ({ url }) => console.log(`Server ready at ${url}`)
).catch(() => {})
