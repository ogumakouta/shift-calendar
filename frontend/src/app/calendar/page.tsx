'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Calender from '../../../components/Calendar';
import CreateEvent from '../../../components/CreateEvent';
import EventListArea from '../../../components/EventListArea';
import MonthlySalaryArea from '../../../components/MonthlySalaryArea';
import type { Value } from "react-calendar/dist/cjs/shared/types";

export default function CalendarPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // access_tokenを取得
    const token = localStorage.getItem('access_token');

    if (!token) {
      router.push('/login');
    } else {
      // トークンが存在カレンダーを表示
      setIsLoading(false);
    }
  }, [router]); // routerオブジェクトが変更された場合に再実行（通常は初回のみ）

  if (isLoading) {
    return <div>読み込み中...</div>;
  }


  // 認証が成功した場合に表示されるページ内容
  return (
    <div className="flex">
      <CreateEvent/>
      <Calender value={selectedDate} onChange={setSelectedDate} />
      <div className='w-[280px]'>
        <EventListArea date={selectedDate} />
        <MonthlySalaryArea/>
      </div>
    </div>
  );
}