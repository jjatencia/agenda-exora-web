'use client';

import { useState } from 'react';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<string | null>(null);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = { email: formData.get('email'), password: formData.get('password') };
    const parse = schema.safeParse(data);
    if (!parse.success) {
      setErrors('Datos inválidos');
      return;
    }
    const res = await signIn('credentials', {
      email: parse.data.email,
      password: parse.data.password,
      redirect: false,
    });
    if (res?.ok) {
      router.push('/');
    } else {
      setErrors('Credenciales incorrectas');
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-complement3 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-heading text-primary">Iniciar sesión</h1>
        <label className="block">
          <span className="text-sm">Email</span>
          <input name="email" type="email" required className="mt-1 w-full border p-2 rounded" />
        </label>
        <label className="block">
          <span className="text-sm">Contraseña</span>
          <input name="password" type="password" required className="mt-1 w-full border p-2 rounded" />
        </label>
        {errors && <p className="text-secondary text-sm" role="alert">{errors}</p>}
        <button type="submit" className="w-full bg-primary text-white py-2 rounded">Entrar</button>
      </form>
    </div>
  );
}
