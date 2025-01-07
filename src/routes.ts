import type { FastifyTypeInstance } from './types'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'

interface User {
  id: string
  name: string
  email: string
}

const users: User[] = []

export async function routes(app: FastifyTypeInstance) {
  app.get(
    '/users',
    {
      schema: {
        tags: ['users'],
        description: 'Get all users',
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              email: z.string(),
            })
          ),
        },
      },
    },
    async () => {
      return users
    }
  )

  app.post(
    '/users',
    {
      schema: {
        tags: ['users'],
        description: 'Create user',
        body: z.object({
          name: z.string(),
          email: z.string().email(),
        }),
        response: {
          201: z.null().describe('Created user'),
        },
      },
    },
    async (request, reply) => {
      const { email, name } = request.body

      users.push({
        id: randomUUID(),
        name,
        email,
      })

      return reply.status(201).send()
    }
  )
}
