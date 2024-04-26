'use client'

import useSWRMutation from 'swr/mutation'

async function createUser(url: string, { arg }) {
  await fetch(url, {
    method: 'POST',
    headers: {
      "Content-Type": 'application/json'
    },
    body: JSON.stringify(arg)
  })
}

export default function SignUpPage() {
  const { trigger: mutate } = useSWRMutation('/api/signup', createUser)

  const handleSubmit = async (formData: FormData) => {
    const name = formData.get('name')
    const email = formData.get('email')
    const password = formData.get('password')

    const isFormInvalid = !name || !email || !password;
    if (isFormInvalid) {
      alert('Form invalid')
      return;
    }

    const payload = { name, email, password };

    try {
      await mutate(payload)
      alert('Account created')
    } catch (err) {
      console.error('Error signing up :( ')
    }
  }

  return (
    <main className="flex flex-col items-center w-full h-screen justify-center">
      <h1>Abitus</h1>
      <p>Build habits. Be happy.</p>

      <form action={handleSubmit} className="w-full max-w-2xl mt-10 flex flex-col gap-y-6 px-4">
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
          <input name="password" type="password" placeholder="*******" required minLength={8} maxLength={100} />
        </label>

        <button type="submit">Create account</button>
      </form>
    </main>
  )
}