'use client';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


export default function CreateEvent() {
  const [date, setDate] = useState('');
  const [eventType, setEvemtType] = useState('');
  const [title, setTitle] = useState('');
  const [workplace, setWorkplace] = useState('');
  const [isAllday, setIsAllday] = useState('false');
  const [startTime, setStartTime] = useState('');
  const [finishTime, setFinishTime] = useState('');
  const [breakMinutes, setBreakMinutes] = useState('');
  const [location, setLocation] = useState('');
  const [memo, setMemo] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  // 選択された日付がDateオブジェクトの場合のみ、フォーマットする

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
//   console.log(apiUrl);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

    const formData = new FormData(e.currentTarget);
    const eventName = formData.get('eventName');
    const eventDate = formData.get('eventDate');
    console.log({ eventName, eventDate });

    e.preventDefault();
    setError('');
  };

  return (
    <div>
    <h1 className='text-center text-3xl'>予定の追加</h1>
      <form 
        onSubmit={handleSubmit} 
        className="flex flex-col gap-2 max-w-md mx-auto p-8 pt-0 m-0"
      >
        <div className="text-center text-red-500">
          {error}
        </div>
        <div className="flex flex-col">
          <label htmlFor="date" className="font-semibold text-left">日付：</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="eventType" className="font-semibold text-left">種類：</label>
          <select
            id="eventType"
            value={eventType}
            onChange={(e) => setEvemtType(e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="title" className="font-semibold text-left">タイトル：</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="workplace" className="font-semibold text-left">勤務先：</label>
          <select
            id="workplace"
            value={workplace}
            onChange={(e) => setWorkplace(e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>
        <div className="flex">
          <label htmlFor="isAllday" className="font-semibold text-left">終日：</label>
          <input
            type="checkbox"
            id="isAllday"
            value={isAllday}
            onChange={(e) => setIsAllday(e.target.value)}
            className="p-2 border rounded-md transform scale-150"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="eventType" className="font-semibold text-left">開始時間：</label>
          <input
          type="time"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="finishTime" className="font-semibold text-left">終了時間：</label>
          <input
          type="time"
            id="finishTime"
            value={finishTime}
            onChange={(e) => setFinishTime(e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="breakMinutes" className="font-semibold text-left">休憩時間：</label>
          <select
            id="breakMinutes"
            value={breakMinutes}
            onChange={(e) => setBreakMinutes(e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="location" className="font-semibold text-left">場所：</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="memo" className="font-semibold text-left">メモ：</label>
          <input
            type="text"
            id="memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>
        <button 
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          追加
        </button>
      </form>
    </div>
  );
}