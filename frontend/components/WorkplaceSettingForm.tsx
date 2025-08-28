'use client'

import { useEffect, useState } from "react";
import type { Value } from "react-calendar/dist/cjs/shared/types";
import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

// 親コンポーネントから受け取るpropsの型定義
type Props = {
  user_id: Value;
};

// Workplaceの型を定義
type Workplace = {
  id: number | string;
  user_id: number | string;
  name: string;
  location: string;
  closing_day: number | string;
  payment_month: number | string;
  payment_day: number | string;
  hourly_wage: number | string;
};

// 締め日・支払日の選択肢
const dayOptions = [
  ...Array.from({ length: 30 }, (_, i) => ({ value: i + 1, label: `${i + 1}日` })),
  { value: 99, label: '月末' }
];

// 支払月の選択肢
const paymentMonthOptions = [
  { value: 'current', label: '当月' },
  { value: 'next', label: '翌月' },
  { value: 'after_next', label: '翌々月' },
];

// APIのエンドポイント
const apiUrl = process.env.NEXT_PUBLIC_API_URL

// ユーザIDごとの勤務先を取得する関数
const getWorkplace = async (user_id: number | string) => {
  if (!user_id) return;

  // 勤務先を取得
  try {
    console.log('リクエスト送信');
    const res = await fetch(`${apiUrl}/workplace/getWorkplace/${user_id}`);
    // レスポンスが正常じゃなかったらエラー
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('勤務先の取得に失敗しました:', err);
  }
}

export default function WorkplaceSettingForm({ user_id }: Props) {
  const [workplaces, setWorkplaces] = useState<Workplace[]>([]);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [newWorkplaceName, setNweWorkplaceName] = useState('');
  const [newWorkplaceLocation, setNewWorkplaceLocation] = useState('');
  const [newWorkplaceClosing_day, setNewWorkplaceClosing_day] = useState('');
  const [newWorkplacePayment_month, setNewWorkplacePayment_month] = useState('');
  const [newWorkplacePayment_day, setNewWorkplacePayment_day] = useState('');
  const [newWorkplaceHourly_wage, setNewWorkplaceHourly_wage] = useState('');
  const [newPlaceMassage, setNewPlaceMessage] = useState('');

  // 勤務先追加フォームをクリアする関数
  const clearAddForm = () => {
    setNweWorkplaceName('');
    setNewWorkplaceLocation('');
    setNewWorkplaceClosing_day('');
    setNewWorkplacePayment_month('');
    setNewWorkplacePayment_day('');
    setNewWorkplaceHourly_wage('');
  }

  useEffect(() => {
    const fetchData = async (user_id: number | string) => {
      // 予定の種類を取得してlabelsステートにセット
      const res = await getWorkplace(user_id);
      setWorkplaces(res || []);

      // 取得したユーザ情報を入力フォームに表示
      const currentName = res.name || '';
      setName(currentName);
    }

    // ユーザIDがあるときだけ予定の種類を取得す関数を実行する
    if (user_id) {
      fetchData(user_id)
    }
  }, [user_id])

  // map内の各inputを個別に編集するためのハンドラ
  const handleWorkplaceUpdate = (id: number | string, updatedField: Partial<Workplace>) => {
    setWorkplaces(prevWorkplaces =>
      prevWorkplaces.map(workplace =>
        workplace.id === id ? { ...workplace, ...updatedField } : workplace
      )
    );
  };

  // 勤務先の更新
  const handleUpdate = async (user_id: number | string, workplace_id: number | string) => {
    // 更新対象の勤務先を探す
    const targetWorkplace = workplaces.find(workplace => workplace.id === workplace_id);
    if (!targetWorkplace) return;

    // 更新対象の勤務先が見つかったら更新リクエストを送信
    try {
      const res = await fetch(`${apiUrl}/workplace/updateWorkplace/${user_id}/${workplace_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: targetWorkplace.name,
          location: targetWorkplace.location,
          closing_day: parseInt(String(targetWorkplace.closing_day), 10),
          payment_month: targetWorkplace.payment_month,
          payment_day: parseInt(String(targetWorkplace.payment_day), 10),
          hourly_wage: parseInt(String(targetWorkplace.hourly_wage), 10),
        }),
      });

      if (!res) {
        setMessage('勤務先の更新に失敗しました');
        throw new Error('勤務先の更新に失敗しました');
      }
      console.log('勤務先更新リクエスト送信')
      setMessage(`${targetWorkplace.name}を更新しました`);
    } catch (error) {
      setMessage('勤務先の更新に失敗しました');
    }
  }

  // 勤務先の削除
  const handleDel = async (user_id: number | string, workplace_id: number | string) => {
    // 削除対象のラベルを探す
    const targetWorkplace = workplaces.find(workplace => workplace.id === workplace_id);
    if (!targetWorkplace) return;

    // 削除対象のラベルが見つかったら削除リクエストを送信
    setWorkplaces(prevWorkplaces => prevWorkplaces.filter(workplace => workplace.id !== workplace_id));
    try {
      const res = await fetch(`${apiUrl}/workplace/deleteWorkplace/${user_id}/${workplace_id}`, {
        method: 'DELETE',
      });

      if (!res) {
        setMessage('勤務先の削除に失敗しました');
        throw new Error('勤務先の削除に失敗しました');
      }
      setMessage(`${targetWorkplace.name}を削除しました`);
    } catch (error) {
      setMessage('勤務先の削除に失敗しました');
    }
  }

  // 勤務先の追加
  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 全ての項目が埋まってなかったら処理を中断
    if (!newWorkplaceName.trim() || !newWorkplaceLocation.trim() || !newWorkplaceClosing_day || !newWorkplacePayment_month || !newWorkplacePayment_day || !newWorkplaceHourly_wage.trim()) {
      setNewPlaceMessage('全ての項目を入力してください');
      return;
    }
    // 同じ勤務先名があれが処理を中断
    const targetWorkplace = workplaces.find(workplace => workplace.name === newWorkplaceName);
    if (targetWorkplace) {
      setMessage(`${newWorkplaceName}は既に存在しています`)
      return;
    }

    setNewPlaceMessage('');

    // 追加リクエスト送信
    try {
      const res = await fetch(`${apiUrl}/workplace/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: user_id,
          name: newWorkplaceName,
          location: newWorkplaceLocation,
          closing_day: parseInt(String(newWorkplaceClosing_day), 10),
          payment_month: newWorkplacePayment_month,
          payment_day: parseInt(String(newWorkplacePayment_day), 10),
          hourly_wage: parseInt(String(newWorkplaceHourly_wage), 10),
        }),
      });

      if (!res.ok) throw new Error('追加に失敗しました');
      const createdWorkplace = await res.json();

      // stateを更新して画面に反映
      setWorkplaces(prevWorkplaces => [...prevWorkplaces, createdWorkplace]);
      clearAddForm(); // 入力欄をクリア
      setMessage(`「${newWorkplaceName}」を追加しました。`);
    } catch(err) { console.error(err); }
  }

  return (
    <div className="w-[410px]">
      <h1 className="text-2xl text-center">勤務先</h1>
      <div className='flex flex-col gap-4 max-w-md mx-auto my-8 p-8 rounded-lg shadow-md'>
        <div className="text-center text-red-500">
          {message}
        </div>
        {workplaces.length > 0 ? (
          workplaces.map(workplace => (
            <div className='flex' key={workplace.id}>
              <details className='w-full'>
                <summary 
                  className='bg-[#f2f2f2] text-center p-2 m-1 rounded-md cursor-pointer 
                  dark:bg-[#727272] dark:text-white'
                >
                  {workplace.name}
                </summary>
                <div className="p-2 text-left flex flex-col">
                  <label htmlFor={`name-${workplace.id}`} className="font-semibold mt-3">勤務先名:</label>
                  <input
                    type="text"
                    id={`name-${workplace.id}`}
                    value={workplace.name}
                    onChange={(e) => handleWorkplaceUpdate(workplace.id, { name: e.target.value })}
                    className="p-2 border rounded-md"
                  />
                  <label htmlFor={`location-${workplace.id}`} className="font-semibold mt-3">勤務先住所:</label>
                  <input
                    type="text"
                    id={`location-${workplace.id}`}
                    value={workplace.location || ''}
                    onChange={(e) => handleWorkplaceUpdate(workplace.id, { location: e.target.value })}
                    className="p-2 border rounded-md"
                  />
                  <label htmlFor={`closing_day-${workplace.id}`} className="font-semibold mt-3">締め日:</label>
                  <Listbox value={workplace.closing_day} onChange={(newValue) => handleWorkplaceUpdate(workplace.id, { closing_day: newValue })}>
                    <div className="relative">
                      <Listbox.Button className="relative w-full cursor-default rounded-md border p-2 pr-10 text-left shadow-sm focus:outline-none dark:bg-[#363636] dark:text-white">
                        <span className="block truncate">{dayOptions.find(opt => opt.value == workplace.closing_day)?.label}</span>
                        <ChevronUpDownIcon className="pointer-events-none absolute inset-y-0 right-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                      </Listbox.Button>
                      <Listbox.Options className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md py-1 shadow-lg focus:outline-none dark:bg-[#4e4e4e]">
                        {dayOptions.map((option) => (
                          <Listbox.Option key={option.value} value={option.value} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-500 text-white' : 'dark:text-gray-200'}`}>
                            {({ selected }) => (
                              <>
                                <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>{option.label}</span>
                                {selected && <CheckIcon className="absolute inset-y-0 left-0 h-5 w-5 pl-3" aria-hidden="true" />}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  </Listbox>
                  <label htmlFor={`payment_day-${workplace.id}`} className="font-semibold mt-3">給料日:</label>
                  <div className="flex gap-2">
                    <Listbox value={workplace.payment_month} onChange={(newValue) => handleWorkplaceUpdate(workplace.id, { payment_month: newValue })}>
                      <div className="relative w-full">
                        <Listbox.Button className="relative w-full cursor-default rounded-md border p-2 pr-10 text-left shadow-sm focus:outline-none dark:bg-[#363636] dark:text-white">
                          <span className="block truncate">{paymentMonthOptions.find(opt => opt.value === workplace.payment_month)?.label}</span>
                            <ChevronUpDownIcon className="pointer-events-none absolute inset-y-0 right-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                        </Listbox.Button>
                        <Listbox.Options className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md py-1 shadow-lg focus:outline-none dark:bg-[#4e4e4e]">
                          {paymentMonthOptions.map((option) => (
                            <Listbox.Option key={option.value} value={option.value} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-500 text-white' : 'dark:text-gray-200'}`}>
                              {({ selected }) => (
                                <>
                                  <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>{option.label}</span>
                                  {selected && <CheckIcon className="absolute inset-y-0 left-0 h-5 w-5 pl-3" aria-hidden="true" />}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>
                    <Listbox value={workplace.payment_day} onChange={(newValue) => handleWorkplaceUpdate(workplace.id, { payment_day: newValue })}>
                      <div className="relative w-full">
                        <Listbox.Button className="relative w-full cursor-default rounded-md border p-2 pr-10 text-left shadow-sm focus:outline-none dark:bg-[#363636] dark:text-white">
                          <span className="block truncate">{dayOptions.find(opt => opt.value == workplace.payment_day)?.label}</span>
                          <ChevronUpDownIcon className="pointer-events-none absolute inset-y-0 right-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                        </Listbox.Button>
                        <Listbox.Options className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md py-1 shadow-lg focus:outline-none dark:bg-[#4e4e4e]">
                          {dayOptions.map((option) => (
                            <Listbox.Option key={option.value} value={option.value} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-500 text-white' : 'dark:text-gray-200'}`}>
                              {({ selected }) => (
                                <>
                                  <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>{option.label}</span>
                                  {selected && <CheckIcon className="absolute inset-y-0 left-0 h-5 w-5 pl-3" aria-hidden="true" />}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    </Listbox>
                  </div>
                  <label htmlFor={`hourly_wage-${workplace.id}`} className="font-semibold mt-3">時給:</label>
                  <input
                    type="number"
                    id={`hourly_wage-${workplace.id}`}
                    value={workplace.hourly_wage}
                    onChange={(e) => handleWorkplaceUpdate(workplace.id, { hourly_wage: e.target.value })}
                    className="p-2 border rounded-md"
                  />
                  <button 
                    type="button"
                    onClick={() => handleUpdate(user_id, workplace.id)}
                    className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors w-full mt-4"
                  >
                    更新
                  </button>
                  <button 
                    type="button"
                    onClick={() => handleDel(user_id, workplace.id)}
                    className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors w-full mt-4"
                  >
                    削除
                  </button>
                </div>
              </details>
            </div>
          ))
        ) : (
          <div className="mt-4 text-gray-500">勤務先が登録されていません</div>
        )}
        <div className="relative flex items-center pt-5">
          <div className="flex-grow border-t border-gray-400"></div>
          <span className="flex-shrink mx-4 text-black-500">
            勤務先の追加
          </span>
          <div className="flex-grow border-t border-gray-400"></div>
        </div>
        <form onSubmit={handleAdd}>
          <div className="p-2 text-left flex flex-col">
            <div className="text-center text-red-500">
              {newPlaceMassage}
            </div>
            <label htmlFor={'new-name'} className="font-semibold mt-3">勤務先名:</label>
            <input
              type="text"
              id={'new-name'}
              value={newWorkplaceName}
              onChange={(e) => setNweWorkplaceName(e.target.value)}
              className="p-2 border rounded-md"
            />
            <label htmlFor={'new-location'} className="font-semibold mt-3">勤務先住所:</label>
            <input
              type="text"
              id={'new-location'}
              value={newWorkplaceLocation}
              onChange={(e) => setNewWorkplaceLocation(e.target.value)}
              className="p-2 border rounded-md"
            />
            <label htmlFor={'new-closing_day'} className="font-semibold mt-3">締め日:</label>
            <Listbox value={newWorkplaceClosing_day} onChange={setNewWorkplaceClosing_day}>
              <div className="relative">
                <Listbox.Button className="relative w-full cursor-default rounded-md border p-2 pr-10 text-left shadow-sm focus:outline-none dark:bg-[#363636] dark:text-white">
                  <span className="block truncate">{dayOptions.find(opt => opt.value == newWorkplaceClosing_day)?.label || <span className="text-gray-400">選択してください</span>}</span>
                    <ChevronUpDownIcon className="pointer-events-none absolute inset-y-0 right-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md py-1 shadow-lg focus:outline-none dark:bg-[#4e4e4e]">
                  {dayOptions.map((option) => (
                    <Listbox.Option key={option.value} value={option.value} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-500 text-white' : 'dark:text-gray-200'}`}>
                      {({ selected }) => (
                        <>
                          <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>{option.label}</span>
                          {selected && <CheckIcon className="absolute inset-y-0 left-0 h-5 w-5 pl-3" aria-hidden="true" />}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
            <label htmlFor={'new-payment_day'} className="font-semibold mt-3">給料日:</label>
            <div className="flex gap-2">
              <Listbox value={newWorkplacePayment_month} onChange={setNewWorkplacePayment_month}>
                <div className="relative w-full">
                  <Listbox.Button className="relative w-full cursor-default rounded-md border p-2 pr-10 text-left shadow-sm focus:outline-none dark:bg-[#363636] dark:text-white">
                    <span className="block truncate">{paymentMonthOptions.find(opt => opt.value === newWorkplacePayment_month)?.label || <span className="text-gray-400">選択</span>}</span>
                      <ChevronUpDownIcon className="pointer-events-none absolute inset-y-0 right-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md py-1 shadow-lg focus:outline-none dark:bg-[#4e4e4e]">
                    {paymentMonthOptions.map((option) => (
                      <Listbox.Option key={option.value} value={option.value} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-500 text-white' : 'dark:text-gray-200'}`}>
                        {({ selected }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>{option.label}</span>
                            {selected && <CheckIcon className="absolute inset-y-0 left-0 h-5 w-5 pl-3" aria-hidden="true" />}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>

              <Listbox value={newWorkplacePayment_day} onChange={setNewWorkplacePayment_day}>
                <div className="relative w-full">
                  <Listbox.Button className="relative w-full cursor-default rounded-md border p-2 pr-10 text-left shadow-sm focus:outline-none dark:bg-[#363636] dark:text-white">
                    <span className="block truncate">{dayOptions.find(opt => opt.value == newWorkplacePayment_day)?.label || <span className="text-gray-400">選択</span>}</span>
                      <ChevronUpDownIcon className="pointer-events-none absolute inset-y-0 right-0 h-5 w-5 text-gray-400" aria-hidden="true" />
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md py-1 shadow-lg focus:outline-none dark:bg-[#4e4e4e]">
                    {dayOptions.map((option) => (
                      <Listbox.Option key={option.value} value={option.value} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-indigo-500 text-white' : 'dark:text-gray-200'}`}>
                        {({ selected }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>{option.label}</span>
                            {selected && <CheckIcon className="absolute inset-y-0 left-0 h-5 w-5 pl-3" aria-hidden="true" />}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
            <label htmlFor={'new-hourly_wage'} className="font-semibold mt-3">時給:</label>
            <input
              type="number"
              id={'new-hourly_wage'}
              value={newWorkplaceHourly_wage}
              onChange={(e) => setNewWorkplaceHourly_wage(e.target.value)}
              className="p-2 border rounded-md"
            />
            <button 
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors w-full mt-4"
            >
              追加
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}