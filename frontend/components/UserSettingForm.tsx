'use client'

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";


// APIのエンドポイントを.envから読み込む
const apiUrl = process.env.NEXT_PUBLIC_API_URL

// ユーザIDからユーザ情報を取得する関数
const getUser = async (user_id) => {
  const payload = {
    id: user_id
  }
  const res = await fetch(`${apiUrl}/user/getUser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('ユーザ情報の取得に失敗しました');
  }

  return res.json();
}

export default function UserSettingForm() {
  // const [user_id, setUser_id] = useState('');
  const [user, setUser] = useState([]);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');

  useEffect(() => {
    const getAndSetUser = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.log('ユーザIDが見つかりません')
        return;
      }
  
      try{
        const decodeToken = jwtDecode(token);
        const user_id = decodeToken.sub;
  
        const userRes = await getUser(user_id);
        setUser(userRes);
      } catch (error) {
        console.error('処理中にエラーが発生しました：', error);
      }
    }

    getAndSetUser();
  }, [])

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      
      // 誕生日の形式をyyyy-mm-ddに変更
      if (user.birthday) {
        const formattedDate = new Date(user.birthday).toISOString().split('T')[0];
        setBirthday(formattedDate);
      }
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
  }
  return (
    <div>
      <h1 className="text-2xl text-center">ユーザ情報</h1>
      <form 
        onSubmit={handleSubmit} 
        className="flex flex-col gap-4 max-w-md mx-auto my-8 p-8 rounded-lg shadow-md"
      >
        <div className="text-center text-red-500">
          {message}
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
          <label htmlFor="birthday" className="font-semibold">生年月日:</label>
          <input
            type="date"
            id="birthday"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>
        <button 
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          更新
        </button>
      </form>
    </div>
  )
}