'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');
  const [password, setPassword] = useState('');
  const [check_password, setCheck_password] =useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // 生年月日が正しく入力されてるか確認
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    const birthdayDate = new Date(birthday);

    if (birthdayDate.getTime() > today.getTime()) {
        setError('生年月日に未来の日付は入力できません');
    } else if (password != check_password) { // 入力されたパスワードが一致してるか確認
      setError('パスワードが一致しません');
    } else {
      // 入力された値が問題なかったらリクエストを送信
      try{
        const res = await fetch(`${apiUrl}/user/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            birthday: birthday ? new Date(birthday) : null,
          }),
        });

        // 登録レスポンスが正常じゃない場合
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || '登録に失敗しました');
        }

        // 登録に成功したら自動でログイン
        const loginRes = await fetch(`${apiUrl}/auth/login`, {
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
        if (!loginRes.ok) {
          const errorData = await loginRes.json();
          throw new Error(errorData.message || 'ログインに失敗しました');
        }

        // 成功したらアクセストークンをlocalStorageに保存してカレンダーページに移動
        const loginData = await loginRes.json();

        if (loginData.access_token) {
          localStorage.setItem('access_token', loginData.access_token);
          router.push('/calendar');
        }
      } catch (error: any) {
        setError('登録に失敗しました');
      }
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
        <label htmlFor="name" className="font-semibold">名前:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded-md"
          required
        />
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
        <label htmlFor="birthday" className="font-semibold">生年月日（任意）:</label>
        <input
          type="date"
          id="birthday"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
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
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="check_password" className="font-semibold">パスワードの確認:</label>
        <input
          type="password"
          id="check_password"
          value={check_password}
          onChange={(e) => setCheck_password(e.target.value)}
          className="p-2 border rounded-md"
          required
        />
      </div>
      <div className="text-sm text-center">アカウントをお持ちの方は<Link href="login" className="text-blue-500">ログイン</Link>してください</div>
      <button 
        type="submit"
        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
      >
        登録
      </button>
    </form>
  );
}