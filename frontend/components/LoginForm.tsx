'use client';
import { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('ログイン情報:', { email, password });
    alert(`ログイン試行: ${email}`);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex flex-col gap-4 max-w-md mx-auto my-8 p-8 border rounded-lg shadow-md"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-semibold">メールアドレス:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded-md"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="font-semibold">パスワード:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded-md"
          required
        />
      </div>
      <button 
        type="submit"
        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        ログイン
      </button>
    </form>
  );
}