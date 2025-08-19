'use client';
import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import type { Value } from "react-calendar/dist/cjs/shared/types";

// 親コンポーネントから受け取るpropsの型定義
type Props = {
  onEventCreated: Function ;
  date: Value;
};

export default function CreateEvent({ onEventCreated, date }: Props) {
  const [eventType, setEventType] = useState('');
  const [user_id, setUser_id] = useState('');
  const [title, setTitle] = useState('');
  const [selectedWorkplace, setSelectedWorkplace] = useState('');
  const [workplace, setWorkplace] = useState([]);
  const [isAllday, setIsAllday] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [ISOStartTime, setISOStartTime] = useState('');
  const [finishTime, setFinishTime] = useState('');
  const [ISOFinishTime, setISOFinishTime] = useState('');
  const [breakMinutes, setBreakMinutes] = useState('');
  const [location, setLocation] = useState('');
  const [memo, setMemo] = useState('');
  const [message, setMessage] = useState('');

  // apiから取得した選択肢を配列で管理
  const [labels, setLabels] = useState([]);

  // フォームの値をクリアする関数
  const clearForm = () => {
    setEventType('');
    setTitle('');
    setSelectedWorkplace('');
    setIsAllday(false);
    setStartTime('');
    setFinishTime('');
    setBreakMinutes('');
    setLocation('');
    setMemo('');
  };

  // ユーザIDをLocalStorageから取得
  useEffect (() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decodeToken = jwtDecode(token);
        setUser_id(decodeToken.sub);
      } catch(error) {
        console.log('ユーザIDが見つかりません：',error)
        setMessage('ログイン情報が無効です。再度ログインしてください。');
      }
    }
  }, []);

  // APIのエンドポイントを取得
  const apiUrl = process.env.NEXT_PUBLIC_API_URL

  // 予定の種類と勤務先を取得する
  useEffect (() => {
    const fetchData = async () => {
      if (!user_id) return;

      // 予定の種類を取得
      try {
        const labelsRes = await fetch(`${apiUrl}/event-label/getLabels/${user_id}`);
        // レスポンスが正常じゃなかったらエラー
        if (!labelsRes.ok) {
          throw new Error(`HTTP error! status: ${labelsRes.status}`);
        }
        const labelsData = await labelsRes.json();
        setLabels(labelsData);
      } catch (err) {
        console.error('ラベルの取得に失敗しました:', err);
      }

      // 勤務先を取得
      try {
        const workplaceRes = await fetch(`${apiUrl}/workplace/getWorkplace/${user_id}`);
        // レスポンスが正常じゃなかったらエラー
        if (!workplaceRes.ok) {
          throw new Error(`HTTP error! status: ${workplaceRes.status}`);
        }
        const workplaceData = await workplaceRes.json();
        setWorkplace(workplaceData);
      } catch (err) {
        console.error('勤務先の取得に失敗しました:', err);
      }
    };

    fetchData();
  }, [user_id]);

  const handleEventTypeChange = (e) => {
    const newType = e.target.value;
    setEventType(newType);

    // もし新しい種類が「バイト」なら、「終日」チェックを外す
    if (newType === 'バイト') {
      setIsAllday(false);
    }
  };

  // カレンダー上で選択された日付を予定作成フォームに入れる
  useEffect (() => {
    // dateが有効なDateオブジェクトでない場合は処理を中断
    if (!date || !(date instanceof Date)) return;

    // 現在の時間を取得
    const nowHour = new Date(Date.now()).getHours();
    
    // 選択された年月日を取得
    const selectedYear = date.getFullYear();
    const selectedMonth = String(date.getMonth() + 1).padStart(2, '0');
    const selectedDate = String(date.getDate()).padStart(2, '0');
    
    if (isAllday) {
      // 入力されている予定が終日だった時
      const formatStartDate = `${selectedYear}-${selectedMonth}-${selectedDate}T00:00`;
      const formatFinishDate = `${selectedYear}-${selectedMonth}-${selectedDate}T23:59`;

      setStartTime(formatStartDate);
      setFinishTime(formatFinishDate);

      if (formatStartDate) {
        setISOStartTime(new Date(formatStartDate).toISOString());
      }
      if (formatFinishDate) {
        setISOFinishTime(new Date(formatFinishDate).toISOString());
      }
    } else {
      // 入力されている予定が終日じゃなかった時
      const formatStartDate = `${selectedYear}-${selectedMonth}-${selectedDate}T${String((nowHour + 1) % 24).padStart(2, '0')}:00`;
      const formatFinishDate = `${selectedYear}-${selectedMonth}-${selectedDate}T${String((nowHour + 2) % 24).padStart(2, '0')}:00`;

      setStartTime(formatStartDate);
      setFinishTime(formatFinishDate);

      if (formatStartDate) {
        setISOStartTime(new Date(formatStartDate).toISOString());
      }
      if (formatFinishDate) {
        setISOFinishTime(new Date(formatFinishDate).toISOString());
      }
    }
  }, [date, isAllday])

  // 開始時間をISO8601の形式に変換
  const handleStart_timeChange = (e) => {
    const inputValue = e.target.value;
    setStartTime(inputValue);

    // inputが空でない場合のみ変換を実行
    if (inputValue) {
      // inputの値を元にDateオブジェクトを生成
      const localDate = new Date(inputValue);

      // toISOString()でUTCのISO 8601形式に変換
      const iso = localDate.toISOString();
      setISOStartTime(iso);
    } else {
      setISOStartTime('');
    }
  };

  // 終了時間をISO8601の形式に変換
  const handleFinish_timeChange = (e) => {
    const inputValue = e.target.value;
    setFinishTime(inputValue);

    // inputが空でない場合のみ変換を実行
    if (inputValue) {
      // inputの値を元にDateオブジェクトを生成
      const localDate = new Date(inputValue);

      // toISOString()でUTCのISO 8601形式に変換
      const iso = localDate.toISOString();
      setISOFinishTime(iso);
    } else {
      setISOFinishTime('');
    }
  };

  // 予定の種類がバイト先だったらタイトルにバイト先名を入れる
  useEffect(() => {
    if (eventType === 'バイト' && selectedWorkplace) {
      const findWorkplace = workplace.find((wp) => wp.id === parseInt(selectedWorkplace, 10))
      console.log(findWorkplace);
      if (findWorkplace) {
        setTitle(findWorkplace.name)
      }
    } else {
      setTitle('');
    }
  }, [eventType, selectedWorkplace])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');

    if (!title || !startTime || !finishTime) {
      setMessage('必須項目を全て入力してください');
      return;
    } else if (eventType === 'バイト' && !selectedWorkplace) {
      setMessage('勤務先を選択してください');
      return;
    } else if (new Date(finishTime) - new Date(startTime) <= 0) {
      setMessage('終了時間は開始時間より後に設定してください');
      return;
    }
    // 予定の種類のIDを取得
    const selectLabel = labels.find(label => label.name === eventType);
      // setLabel_id(selectLabel.id);
      const label_id = selectLabel ? selectLabel.id : null;

    const payload = {
      user_id: user_id,
      event_label_id: label_id,
      title: title,
      workplace_id: eventType !== 'バイト' ? null : parseInt(selectedWorkplace, 10),
      is_allday: isAllday,
      start_time: ISOStartTime,
      finish_time: ISOFinishTime,
      break_minutes: eventType !== 'バイト' ? null : parseInt(breakMinutes, 10),
      location: location,
      memo: memo
    };

    try {
      // エラーがなければ、常にこの処理が実行される
      setMessage('');
      const res = await fetch(`${apiUrl}/event/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // レスポンスが正常じゃない場合
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || '予定の追加に失敗しました');
      }

      setMessage('予定を追加しました');
      // フォームクリア
      clearForm();

      if (onEventCreated) {
        onEventCreated(); // 親コンポーネントに通知
      }
    } catch (error: any) {
      console.error('予定追加でエラーが発生しました：', error);
      setMessage('予定の追加に失敗しました');
    }
  }


  return (
    <div>
    <h1 className='text-center text-3xl'>予定の追加</h1>
      <form 
        onSubmit={handleSubmit} 
        className="flex flex-col gap-2 max-w-[265px] mx-auto p-8 pt-0 pb-0 m-0"
      >
        <div className="text-center text-red-500">
          {message}
        </div>
        <input type="hidden" id='user_id' value={user_id} />
        <div className="flex flex-col">
          <label htmlFor="eventType" className="font-semibold text-left">種類：</label>
          <select
            id="eventType"
            value={eventType}
            onChange={handleEventTypeChange}
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
            className="p-2 border rounded-md disabled:bg-gray-200 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={eventType === 'バイト'}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="workplace" className="font-semibold text-left">勤務先：</label>
          <select
            id="workplace"
            value={selectedWorkplace}
            onChange={(e) => setSelectedWorkplace(e.target.value)}
            className="p-2 border rounded-md disabled:bg-gray-200 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={eventType !== 'バイト'}
          >
            <option value=""></option>
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
            onChange={(e) => setIsAllday(e.target.checked)}
            className="p-2 border rounded-md transform scale-150 disabled:bg-gray-200 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={eventType === 'バイト'}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="startTime" className="font-semibold text-left">開始時間：</label>
          <input
            type="datetime-local"
            id="startTime"
            value={startTime}
            onChange={handleStart_timeChange}
            className="p-2 border rounded-md disabled:bg-gray-200 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isAllday}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="finishTime" className="font-semibold text-left">終了時間：</label>
          <input
          type="datetime-local"
            id="finishTime"
            value={finishTime}
            onChange={handleFinish_timeChange}
            className="p-2 border rounded-md disabled:bg-gray-200 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isAllday}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="breakMinutes" className="font-semibold text-left">休憩時間：</label>
          <select
            id="breakMinutes"
            value={breakMinutes}
            onChange={(e) => setBreakMinutes(e.target.value)}
            className="p-2 border rounded-md disabled:bg-gray-200 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={eventType !== 'バイト'}
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