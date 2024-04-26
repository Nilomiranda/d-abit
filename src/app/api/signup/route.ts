import {db} from "@/database/databaseClient";
import {eq} from "drizzle-orm";
import {users} from "@/modules";
import * as bcrypt from 'bcrypt'

export async function GET(request: Request) {
  const users = await db.query.users.findFirst()

  return Response.json(users);
}

export async function POST(request: Request) {
  console.log({request})
  const body = await request.json()
  const { name, email, password } = body;

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, body.email)
  })

  console.log({existingUser})

  if (existingUser) {
    return Response.json({
      error: 'Email already in use.'
    }, { status: 409 })
  }

  const hashedPassword = await bcrypt.hash(password, 8);

  const user = {
    email,
    name,
    password: hashedPassword,
  }

  const savedUser = await db.insert(users).values(user)

  return Response.json({ ...user, password: undefined })
}