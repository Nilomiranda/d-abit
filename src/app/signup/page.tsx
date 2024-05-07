'use client'

import Link from "next/link";
import {createUserAccount} from "@/app/signup/actions";
import { useFormStatus, useFormState } from 'react-dom'

export default function SignUpPage() {
  const { pending } = useFormStatus();
  const [state, formAction] = useFormState(createUserAccount, { error: { message: '' } });

  return (
    <main className="flex flex-col items-center w-full h-screen justify-center">
      <h1>Abitus</h1>
      <p>Build habits. Be happy.</p>

      <form action={formAction} className="w-full max-w-2xl mt-10 flex flex-col gap-y-6 px-4">
        <label className="form-field">
          <span>Name</span>
          <input name="name" type="text" placeholder="John Doe" required/>
        </label>
        <label className="form-field">
          <span>Email</span>
          <input name="email" type="email" placeholder="name@example.com" required/>
        </label>
        <label className="form-field">
          <span>Password</span>
          <input name="password" type="password" placeholder="*******" required minLength={8} maxLength={100}/>
        </label>

        <button disabled={pending} type="submit">{pending ? 'Creating account' : 'Create account'}</button>

        <p>Have an account? <Link href="/login">Login</Link>.</p>

        { state?.error?.message ? <span className="text-red-400 font-medium">{state.error.message}</span> : null }
      </form>
    </main>
  )
}
