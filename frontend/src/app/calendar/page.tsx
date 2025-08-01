'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Calender from '../../../components/Calendar';
import CreateEvent from '../../../components/CreateEvent';
import EventListArea from '../../../components/EventListArea';
import Link from 'next/link';

export default function CalendarPage() {
  const router = useRouter();
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

  function logout() {
    localStorage.removeItem('access_token');
    router.push('/login');
  }

  // 認証が成功した場合に表示されるページ内容
  return (
    <div className="flex">
      <CreateEvent/>
      <Calender/>
      <EventListArea/>
    </div>
  );
}