'use client';
import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import type { Value } from "react-calendar/dist/cjs/shared/types";
import { Listbox } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

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

  // 選択された予定ラベルを探して表示
  const selectedLabel = labels.find(label => label.name === eventType);
  const displayWorkplase = workplace.find(wp => wp.id === selectedWorkplace);

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

  const handleEventTypeChange = (newType) => {
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
      console.log(selectedWorkplace);
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

    if (!eventType || !title || !startTime || !finishTime) {
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
    <div className='h-[96%] max-w-[15%] w-full mx-[15px]'>
    <h1 className='text-center text-3xl'>予定の追加</h1>
      <form 
        onSubmit={handleSubmit} 
        className="flex flex-col gap-2"
      >
        <div className="text-center text-red-500 text-xs h-[16px]"> {/* エラーメッセージ */}
          {message}
        </div>
        <input type="hidden" id='user_id' value={user_id} />
        <div className="flex flex-col">
          <label htmlFor="eventType" className="font-semibold text-left">種類：</label>
          <Listbox value={eventType} onChange={handleEventTypeChange}>
            <div className="relative w-full">
              {/* ボタン部分 */}
              <Listbox.Button 
                className="relative w-full cursor-default rounded-md border p-2 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500
                          bg-[#ededed] dark:bg-[#363636] dark:border-white-500 dark:text-white"
              >
                <span className="block truncate">
                  {/* eventTypeが存在すればその名前を、なければプレースホルダーを表示 */}
                  {selectedLabel ? selectedLabel.name : <span className="text-gray-400">種類を選択</span>}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              
              {/* オプションリスト部分 */}
              <Listbox.Options 
                className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md py-1 shadow-lg ring-1 ring-black/5 focus:outline-none
                          bg-[#ededed] dark:bg-[#4e4e4e]"
              >
                {labels.map((label) => (
                  <Listbox.Option
                    key={label.id}
                    value={label.name} // onChangeで渡される値
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-indigo-500 text-white' : 'text-gray-900 dark:text-gray-200'
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                          {label.name}
                        </span>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600 dark:text-indigo-400">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
        <div className="flex flex-col">
          <label htmlFor="title" className="font-semibold text-left">タイトル：</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 border rounded-md disabled:bg-gray-200 disabled:opacity-70 disabled:cursor-not-allowed
            dark:disabled:bg-gray-600"
            disabled={eventType === 'バイト'}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="workplace" className="font-semibold text-left">勤務先：</label>
          <Listbox value={selectedWorkplace} onChange={setSelectedWorkplace}>
            <div className="relative w-full">
              {/* ボタン部分 */}
              <Listbox.Button 
                className="relative w-full cursor-default rounded-md border p-2 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500
                          bg-[#ededed] dark:bg-[#363636] dark:border-white-500 dark:text-white
                          disabled:bg-gray-200 disabled:opacity-70 disabled:cursor-not-allowed dark:disabled:bg-gray-600"
                disabled={eventType !== 'バイト'}
              >
                <span className="block truncate">
                  {/* displayWorkplaseが存在すればその名前を、なければプレースホルダーを表示 */}
                  {displayWorkplase ? displayWorkplase.name : <span className="text-gray-400">勤務先を選択</span>}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              
              {/* オプションリスト部分 */}
              <Listbox.Options 
                className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md py-1 shadow-lg ring-1 ring-black/5 focus:outline-none
                          bg-[#ededed] dark:bg-[#4e4e4e]"
              >
                {workplace.map((wp) => (
                  <Listbox.Option
                    key={wp.id}
                    value={wp.id} // onChangeで渡される値
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-indigo-500 text-white' : 'text-gray-900 dark:text-gray-200'
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                          {wp.name}
                        </span>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600 dark:text-indigo-400">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
        </div>
        <div className="flex">
          <label htmlFor="isAllday" className="font-semibold text-left">終日：</label>
          <input
            type="checkbox"
            id="isAllday"
            checked={isAllday}
            onChange={(e) => setIsAllday(e.target.checked)}
            className="p-2 border rounded-md transform scale-150 disabled:bg-gray-200 disabled:opacity-70 disabled:cursor-not-allowed
            dark:disabled:bg-gray-600"
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
            className="p-2 border rounded-md disabled:bg-gray-200 disabled:opacity-70 disabled:cursor-not-allowed
            dark:disabled:bg-gray-600"
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
            className="p-2 border rounded-md disabled:bg-gray-200 disabled:opacity-70 disabled:cursor-not-allowed
            dark:disabled:bg-gray-600"
            disabled={isAllday}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="breakMinutes" className="font-semibold text-left">休憩時間：</label>
          <Listbox value={breakMinutes} onChange={setBreakMinutes}>
            <div className="relative w-full">
              {/* ボタン部分 */}
              <Listbox.Button 
                className="relative w-full cursor-default rounded-md border p-2 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500
                          bg-[#ededed] dark:bg-[#363636] dark:border-white-500 dark:text-white
                          disabled:bg-gray-200 disabled:opacity-70 disabled:cursor-not-allowed dark:disabled:bg-gray-600"
                disabled={eventType !== 'バイト'}
              >
                <span className="block truncate">
                  {/* breakMinutesが存在すればその名前を、なければプレースホルダーを表示 */}
                  {breakMinutes ? breakMinutes : <span className="text-gray-400">休憩時間を選択</span>}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>
              
              {/* オプションリスト部分 */}
              <Listbox.Options 
                className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md py-1 shadow-lg ring-1 ring-black/5 focus:outline-none
                          bg-[#ededed] dark:bg-[#4e4e4e]"
              >
                {Array.from({ length: 61 }, (_, i) => i).map(minute => (
                  <Listbox.Option
                    key={minute}
                    value={minute} // onChangeで渡される値
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-indigo-500 text-white' : 'text-gray-900 dark:text-gray-200'
                      }`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                          {minute}分
                        </span>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600 dark:text-indigo-400">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Listbox>
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