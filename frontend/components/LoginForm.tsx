'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
//   console.log(apiUrl);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      // ログインレスポンスが正常じゃない場合
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'ログインに失敗しました');
      }

      // 成功したらアクセストークンをlocalStorageに保存してカレンダーページに移動
      const loginData = await res.json();

      if (loginData.access_token) {
        localStorage.setItem('access_token', loginData.access_token);
        router.push('/calendar');
      }
    } catch (error: any) {
      setError('ログインに失敗しました');
    }
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
        />
      </div>
      <div className="text-sm text-center">アカウントをお持ちでない方は<Link href="signup" className="text-blue-500">新規登録</Link>してください</div>
      <button 
        type="submit"
        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        ログイン
      </button>
    </form>
  );
}