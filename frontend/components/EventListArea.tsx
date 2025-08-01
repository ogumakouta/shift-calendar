'use client'

import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";



export default function EventListArea() {
  const [user_id, setUser_id] = useState('');
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  // APIのエンドポイントを.envから読み込む
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  // ユーザごとのイベント一覧を取得する関数
  async function getEvents (apiUrl, user_id) {
    const res = await fetch(`${apiUrl}/event/getEvents/${user_id}`);
    if (!res.ok) {
      throw new Error('予定の取得に失敗しました');
    }

    return res.json();
  }


  // ユーザIDをLocalStorageから取得
  useEffect (() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decodeToken = jwtDecode(token);
        setUser_id(decodeToken.sub);
        console.log('ユーザID: ', decodeToken.sub);
      } catch(error) {
        console.log('ユーザIDが見つかりません: ',error)
        setError('ログイン情報が無効です。再度ログインしてください。');
      }
    }
  }, []);

  // ユーザIDごとの予定を取得
  useEffect (() => {
    const getAndSetEvents = async () => {
      if (user_id) {
        try{
          const getedEvents = await getEvents(apiUrl, user_id);
          setEvents(getedEvents);
        } catch (error) {
          console.log(error);
        }
      }
    };

    getAndSetEvents();
  }, [user_id]);

  // ISO8601形式の時間から⚪︎時⚪︎分を取得する関数
  const formatTime = (isoString) => {
    if (!isoString) {
      return '時間未設定';
    }

    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}時${minutes}分`;
  }

  return (
    <div className="bg-[#fbfbfb] ml-5 mr-5 rounded-md max-w-[280px] w-full h-[362.5px] text-center p-2 flex flex-col">
      <div>
        {error}
      </div>
      <div className='text-xl mb-2'>予定一覧</div>
      <div className='text-center overflow-y-auto flex-grow'>
        {events.map(event => (
          <div className='flex' key={event.id}>
            <details className='w-full'>
              <summary className='bg-[#f2f2f2] text-center p-2 m-1 rounded-md'>{event.title}</summary>
              <div>開始時間：{formatTime(event.start_time)}</div>
              <div>終了時間：{formatTime(event.finish_time)}</div>
              {event.workplace && <div>休憩時間：{event.break_minutes ?? 0}分</div>}
              {event.workplace && <div>勤務先：{event.workplace.name}</div>}
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}