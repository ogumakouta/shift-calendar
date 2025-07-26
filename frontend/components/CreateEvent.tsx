'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";


export default function CreateEvent() {
  const [eventType, setEvemtType] = useState('');
  const [user_id, setUser_id] = useState('');
  const [title, setTitle] = useState('');
  const [selectedWorkplace, setSelectedWorkplace] = useState();
  const [workplace, setWorkplace] = useState([]);
  const [isAllday, setIsAllday] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [finishTime, setFinishTime] = useState('');
  const [breakMinutes, setBreakMinutes] = useState('');
  const [location, setLocation] = useState('');
  const [memo, setMemo] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // apiから取得した選択肢を配列で管理
  const [labels, setLabels] = useState([]);
  const [workplaces, setWorkplaces] = useState([]);

  useEffect (() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decodeToken = jwtDecode(token);
        setUser_id(decodeToken.sub);
      } catch(error) {
        console.log('ユーザIDが見つかりません；',error)
        setError('ログイン情報が無効です。再度ログインしてください。');
      }
    }
  }, []);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL
  useEffect (() => {
    // 予定の種類用のラベルを取得
    axios.get(`${apiUrl}/event-label/getLabels/${user_id}`)
    .then((res) => {
      console.log(res.data)
      setLabels(res.data);
    })
    .catch((err) => {
      console.error('ラベルの取得に失敗しました:', err);
      // setError('予定の種類の取得に失敗しました。');
    });

    // 勤務先の取得
    axios.get(`${apiUrl}/workplace/getWorkplace/${user_id}`)
    .then((res) => {
      console.log(res.data)
      setWorkplace(res.data);
    })
    .catch((err) => {
      console.error('勤務先の取得に失敗しました:', err);
      // setError('予定の種類の取得に失敗しました。');
    });
  }, [user_id]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

    const formData = new FormData(e.currentTarget);
    const eventName = formData.get('eventName');
    const eventDate = formData.get('eventDate');
    console.log({ eventName, eventDate });

    e.preventDefault();
    setError('');

    axios.post(`${apiUrl}/event/create`, {
      user_id: user_id,
      title: title,
      workplace_id: eventType === '予定' ? null : selectedWorkplace,
      is_Allday: isAllday,
      startTime: startTime,
      finishTime: finishTime,
      breakMinutes: eventType === '予定' ? null : breakMinutes,
      location: location,
      memo: memo
    })
    .then(res => {
        console.log('レスポンス：', res.data);
    })
    .catch((error: any) => {
        if (error.response && error.response.data && error.response.data.message) {
            setError(error.response.data.message);
            console.log('エラー内容:', error.response.data);
        } else {
            setError('予定の登録に失敗しました');
            console.log('その他のエラー:', error);
        }
    });
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
        <input type="hidden" id='user_id' value={user_id} />
        <div className="flex flex-col">
          <label htmlFor="eventType" className="font-semibold text-left">種類：</label>
          <select
            id="eventType"
            value={eventType}
            onChange={(e) => setEvemtType(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value=""></option>
            {labels.map((label) => (
              <option key={label.id} value={label.name}>{label.name}</option>
            ))}
          </select>
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
            value={selectedWorkplace}
            onChange={(e) => setSelectedWorkplace(e.target.value)}
            className="p-2 border rounded-md disabled:bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={eventType === '予定' || eventType === ''}
          >
            {workplace.map((workplace) => (
              <option key={workplace.id} value={workplace.id}>{workplace.name}</option>
            ))}

          </select>
        </div>
        <div className="flex">
          <label htmlFor="isAllday" className="font-semibold text-left">終日：</label>
          <input
            type="checkbox"
            id="isAllday"
            checked={isAllday}
            onChange={(e) => setIsAllday(e.target.value)}
            className="p-2 border rounded-md transform scale-150"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="startTime" className="font-semibold text-left">開始時間：</label>
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
            className="p-2 border rounded-md disabled:bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={eventType === '予定' || eventType === ''}
          >
            {Array.from({ length: 61 }, (_, i) => i).map(minute => (
              <option key={minute} value={minute}>
                {minute}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label htmlFor="location" className="font-semibold text-left">場所（任意）：</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="memo" className="font-semibold text-left">メモ（任意）：</label>
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