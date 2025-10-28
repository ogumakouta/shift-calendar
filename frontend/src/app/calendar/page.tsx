'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Calender from '../../../components/Calendar';
import CreateEvent from '../../../components/CreateEvent';
import EventListArea from '../../../components/EventListArea';
import MonthlySalaryArea from '../../../components/MonthlySalaryArea';
import type { Value } from "react-calendar/dist/cjs/shared/types";
import { jwtDecode } from "jwt-decode";


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

export default function CalendarPage() {
  const router = useRouter();
  const [user_id, setUser_id] = useState('');
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [eventUpdateTrigger, setEventUpdateTrigger] = useState(0);

  useEffect(() => {
    // access_tokenを取得
    const token = localStorage.getItem('access_token');

    if (!token) {
      router.push('/login');
    } else {
      // トークンが存在すればカレンダーを表示
      setIsLoading(false);
      // ユーザIDを取得
      const decodeToken = jwtDecode(token);
      setUser_id(decodeToken.sub);
    }
  }, [router]); // routerオブジェクトが変更された場合に再実行（通常は初回のみ）

  // ユーザIDごとの予定を取得
  useEffect(() => {
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
  }, [user_id, eventUpdateTrigger]);

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  const handleEventCreated = () => {
    // トリガーの状態を更新してuseEffectを再実行させる
    setEventUpdateTrigger(prev => prev + 1);
  };


  // 認証が成功した場合に表示されるページ内容
  return (
    <div className="flex h-[calc(100vh-80px)] w-full">
      <CreateEvent onEventCreated={handleEventCreated} date={selectedDate}/>
      <Calender value={selectedDate} onChange={setSelectedDate} events={events}/>
      <div className='flex flex-col max-w-[15%] w-full mx-[15px] gap-y-4'>
        <EventListArea date={selectedDate} events={events} onEventCreated={handleEventCreated}/>
        <MonthlySalaryArea date={selectedDate} events={events}/>
      </div>
    </div>
  );
}