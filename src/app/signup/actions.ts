'use server'

import {db} from "@/database/databaseClient";
import {eq} from "drizzle-orm";
import {users} from "@/modules";
import * as bcrypt from 'bcrypt'
import {redirect} from "next/navigation";

export type CreateUserAccountDto = {
  name: string;
  email: string;
  password: string;
}

export async function createUserAccount(previousFormState: any, formData: FormData) {
  const name = String(formData.get('name') || '')
  const email = String(formData.get('email') || '')
  const password = String(formData.get('password') || '')

  const isFormInvalid = !name || !email || !password;
  if (isFormInvalid) {
    return {
      error: {
        message: 'Missing form fields'
      }
    }
  }

  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email)
    })

    if (existingUser) {
      return {
        error: {
          message: 'Email already in use'
        }
      }
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = {
      email,
      name,
      password: hashedPassword,
    }

    await db.insert(users).values(user)
  } catch (err) {
    return {
      error: {
        message: 'Unexpected error occurred. Please try again.'
      }
    }
  }

  redirect(`/login?email=${email}`);
}