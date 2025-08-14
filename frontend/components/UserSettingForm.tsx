'use client'

import { useState, useEffect } from "react";
import type { Value } from "react-calendar/dist/cjs/shared/types";
import LogoutButton from "./LogoutButton";

// 親コンポーネントから受け取るpropsの型定義
type Props = {
  user_id: Value;
};

// APIのエンドポイントを.envから読み込む
const apiUrl = process.env.NEXT_PUBLIC_API_URL

// ユーザIDからユーザ情報を取得する関数
const getUser = async (user_id: number | string) => {
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

export default function UserSettingForm({ user_id }: Props) {
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');

  // ユーザ情報の初期データを保持するState
  const [initialData, setInitialData] = useState({ name: '', email: '', birthday: '' });

  useEffect(() => {
    const getAndSetUser = async () => {
      try{
        // ユーザ情報を取得する関数を実行
        const userRes = await getUser(user_id);

        // 取得したユーザ情報を入力フォームに表示
        const currentName = userRes.name || '';
        const currentEmail = userRes.email || '';
        // 誕生日の形式をyyyy-mm-ddに変更
        const formattedDate = userRes.birthday ? new Date(userRes.birthday).toISOString().split('T')[0] : '';
        setName(currentName);
        setEmail(currentEmail);
        setBirthday(formattedDate);

        // 比較用の初期データをセット
        setInitialData({
          name: currentName,
          email: currentEmail,
          birthday: formattedDate,
        });
      } catch (error) {
        console.error('処理中にエラーが発生しました：', error);
      }
    }

    getAndSetUser();
  }, [user_id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email) {
      // 名前とメールアドレスのどちらかが空だったら処理を中断
      setMessage('名前とメールアドレスは必須です');
      return;
    } else if (initialData.name === name && initialData.email === email && initialData.birthday === birthday) {
      // 情報が変更されてなかったら処理を中断
      setMessage('情報が変更されていません')
      return;
    }

    const payload = {
      name: name,
      email: email,
      birthday: birthday ? new Date(birthday) : null,
    }

    try {
      setMessage('');
      const res = await fetch(`${apiUrl}/user/updateUser/${user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // レスポンスが正常じゃない場合
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'ユーザー情報の更新に失敗しました');
      }

      setMessage('ユーザー情報を更新しました');

      // 初期データを更新
      setInitialData({
        name: name,
        email: email,
        birthday: birthday,
      });

    } catch (error: any) {
      console.error('ユーザー情報の更新でエラーが発生しました：', error);
      setMessage('ユーザー情報の更新に失敗しました');
    }
  }
  return (
    <div className="w-[410px]">
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
      <div>
        <LogoutButton/>
      </div>
    </div>
  )
}