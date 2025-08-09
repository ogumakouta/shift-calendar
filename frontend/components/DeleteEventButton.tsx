'use client';
import { useEffect, useState } from "react";
import type { Value } from "react-calendar/dist/cjs/shared/types";
import { jwtDecode } from "jwt-decode";

// 親コンポーネントから受け取るpropsの型定義
type Props = {
  eventId: Value;
  onEventCreated: () => void;
};

// APIのエンドポイントを.envから読み込む
const apiUrl = process.env.NEXT_PUBLIC_API_URL

// 予定を削除する関数
async function deleteEvent (apiUrl, userId, eventId, onEventCreated) {
  console.log(`${apiUrl}/event/deleteEvent/${userId}/${eventId}`);
  const res = await fetch(`${apiUrl}/event/deleteEvent/${userId}/${eventId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('予定の削除に失敗しました');
  }

  onEventCreated();
  return res.json();
}

export default function DeleteEventButton({ eventId, onEventCreated }: Props) {
  const [userId, setUserId] = useState('');

  // ユーザIDをLocalStorageから取得
useEffect (() => {
  const token = localStorage.getItem('access_token');
  if (token) {
    try {
      const decodeToken = jwtDecode(token);
      setUserId(decodeToken.sub);
    } catch(error) {
      console.log('ユーザIDが見つかりません：',error)
    }
  }
}, []);

  return (
    <button className="p-3 pt-1 pb-1 bg-red-500 text-white border-glay-500 cursor-pointer rounded-md" onClick={() => deleteEvent(apiUrl, userId, eventId, onEventCreated)}>削除</button>
  );
}