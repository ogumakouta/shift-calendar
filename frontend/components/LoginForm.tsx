'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
//   console.log(apiUrl);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    axios.post(`${apiUrl}/auth/login`, {
        email: email,
        password: password,
    })
    .then(res => {
        console.log('レスポンス：', res.data);
        if (res.data.access_token) {
            localStorage.setItem('access_token', res.data.access_token);
            router.push('/calendar');
        }
    })
    .catch((error: any) => {
        if (error.response && error.response.data && error.response.data.message) {
            setError(error.response.data.message);
            console.log('エラー内容:', error.response.data);
        } else {
            setError('ログインに失敗しました');
            console.log('その他のエラー:', error);
        }
    });
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex flex-col gap-4 max-w-md mx-auto my-8 p-8 border rounded-lg shadow-md"
    >
      <div className="text-center text-red-500">
        {error}
      </div>
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