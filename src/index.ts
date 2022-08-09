import { gql, UserInputError, ApolloServer } from 'apollo-server'
import { v1 as uuid } from 'uuid'

interface Person {
  id: string
  name: string
  phone?: string
  street: string
  city: string
  address?: string
}

const PERSONS: Person[] = [
  {
    id: '66540929C',
    name: 'Guillermo',
    phone: '123456789',
    street: 'Alicante',
    city: 'Calle Vergul, 2, 05841'
  },
  {
    id: '46170877X',
    name: 'Tina',
    phone: '987654321',
    street: 'Valencia',
    city: 'Calle Leonardo da Vinci, 7, 41092'
  },
  {
    id: '30972358Y',
    name: 'Zoe',
    street: 'Calle de Velázquez, 80, 08901',
    city: 'Astro'
  }
]

const typeDefs = gql`
    enum YesNo {
      yes,
      no
    }

    type Person {
        id: ID!
        name: String!
        phone: String
        street: String!
        city: String!
        address: String
    }

    type Query {
        personsCount: Int!
        allPersons(phone: YesNo): [Person]!
        findPerson(name: String!): Person
    }

    type Mutation {
      addPerson(
        name: String!
        phone: String
        street: String!
        city: String!
        address: String
      ): Person
    }
`

const resolvers = {
  Query: {
    personsCount: () => PERSONS.length,
    allPersons: (_root: any, args: Person) => PERSONS.filter((p) => args.phone === 'yes' ? p.phone : p.phone == null),
    findPerson: (_root: any, args: Person) => PERSONS.find((p) => p.name === args.name)
  },
  Person: {
    address: (root: Person) => `${root.street}, ${root.city}`
  },
  Mutation: {
    addPerson: (_root: any, args: Person) => {
      const person: Person = { ...args, id: uuid() }

      if (PERSONS.find((p) => p.name === args.name) === null) {
        PERSONS.push(person)
      } else {
        throw new UserInputError('Name must be unique', { invalidArgs: args.name })
      }

      return person
    }
  }
}

new ApolloServer({
  typeDefs,
  resolvers
}).listen().then(
  ({ url }) => console.log(`Server ready at ${url}`)
).catch(() => {})
