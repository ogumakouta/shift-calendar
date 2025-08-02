'use client'

import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import type { Value } from "react-calendar/dist/cjs/shared/types";


// 親コンポーネントから受け取るpropsの型定義
type Props = {
  date: Value;
};


export default function EventListArea({ date }: Props) {
  const [user_id, setUser_id] = useState('');
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  // カレンダーで選択した日付を格納
  const selectDate = date instanceof Date ? date.toLocaleDateString("ja-JP") : "日付が選択されていません";

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

    return `${hours}:${minutes}`;
  }


  // 日付ごとの予定を表示する関数
  const filteredEvents = events.filter(event => {
    if (!event.start_time) return false;

    const eventDate = new Date(event.start_time).toLocaleDateString("ja-JP");
    return eventDate === selectDate;
  })


  return (
    <div className="bg-[#fbfbfb] ml-5 mr-5 mb-2 rounded-md max-w-[280px] w-full h-[360.5px] text-center p-2 flex flex-col">
      <div>
        {error}
      </div>
      <div className='text-xl mb-2'>{selectDate}の予定</div>
      <div className='text-center overflow-y-auto flex-grow'>
        {/* 日付ごとの予定を表示 */}
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <div className='flex' key={event.id}>
              <details className='w-full'>
                <summary className='bg-[#f2f2f2] text-center p-2 m-1 rounded-md cursor-pointer'>{event.title}</summary>
                <div className="p-2 text-left">
                  <div>開始時間：{formatTime(event.start_time)}</div>
                  <div>終了時間：{formatTime(event.finish_time)}</div>
                  {event.workplace && <div>休憩時間：{event.break_minutes ?? 0}分</div>}
                  {event.workplace && <div>勤務先：{event.workplace.name}</div>}
                  {event.location && <div>場所：{event.location}</div>}
                  {event.memo && <div>メモ：{event.memo}</div>}
                </div>
              </details>
            </div>
          ))
        ) : (
          <div className="mt-4 text-gray-500">この日の予定はありません。</div>
        )}
      </div>
    </div>
  );
}