'use client'

import { useEffect, useState } from "react";
import type { Value } from "react-calendar/dist/cjs/shared/types";

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
  payment_day: number | string;
  hourly_wage: number | string;
};

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
  const [workplaceName, setWorkplaceName] = useState('');
  const [name, setName] = useState('');

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
  const handleWorkplaceNameChange = (id: number | string, newName: string, newLocation: string, newClosing_day: number | string, newPayment_day: number | string, newHourly_wage: number | string,) => {
    setWorkplaces(prevWorkplaces => 
      prevWorkplaces.map(workplace => 
        workplace.id === id ? { ...workplace, name: newName, location: newLocation, closing_day: newClosing_day, payment_day: newPayment_day, hourly_wage: newHourly_wage } : workplace
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
    
  }

  // 勤務先の追加
  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  return (
    <div>
      <h1 className="text-2xl text-center">勤務先</h1>
      <div className='flex flex-col gap-4 max-w-md mx-auto my-8 p-8 rounded-lg shadow-md'>
        <div className="text-center text-red-500">
          {message}
        </div>
        {workplaces.length > 0 ? (
          workplaces.map(workplace => (
            <div className='flex' key={workplace.id}>
              <details className='w-full'>
                <summary className='bg-[#f2f2f2] text-center p-2 m-1 rounded-md cursor-pointer'>{workplace.name}</summary>
                <div className="p-2 text-left flex flex-col">
                  <label htmlFor={`name-${workplace.id}`} className="font-semibold mt-3">勤務先名:</label>
                  <input
                    type="text"
                    id={`name-${workplace.id}`}
                    value={workplace.name}
                    onChange={(e) => handleWorkplaceNameChange(workplace.id, e.target.value, workplace.location, workplace.closing_day, workplace.payment_day, workplace.hourly_wage)}
                    className="p-2 border rounded-md"
                  />
                  <label htmlFor={`location-${workplace.id}`} className="font-semibold mt-3">勤務先住所:</label>
                  <input
                    type="text"
                    id={`location-${workplace.id}`}
                    value={workplace.location || ''}
                    onChange={(e) => handleWorkplaceNameChange(workplace.id, workplace.name, e.target.value, workplace.closing_day, workplace.payment_day, workplace.hourly_wage)}
                    className="p-2 border rounded-md"
                  />
                  <label htmlFor={`closing_day-${workplace.id}`} className="font-semibold mt-3">締め日:</label>
                  <input
                    type="number"
                    id={`closing_day-${workplace.id}`}
                    value={workplace.closing_day}
                    onChange={(e) => handleWorkplaceNameChange(workplace.id, workplace.name, workplace.location, e.target.value, workplace.payment_day, workplace.hourly_wage)}
                    className="p-2 border rounded-md"
                  />
                  <label htmlFor={`payment_day-${workplace.id}`} className="font-semibold mt-3">給料日:</label>
                  <input
                    type="number"
                    id={`payment_day-${workplace.id}`}
                    value={workplace.payment_day}
                    onChange={(e) => handleWorkplaceNameChange(workplace.id, workplace.name, workplace.location, workplace.closing_day, e.target.value, workplace.hourly_wage)}
                    className="p-2 border rounded-md"
                  />
                  <label htmlFor={`hourly_wage-${workplace.id}`} className="font-semibold mt-3">時給:</label>
                  <input
                    type="number"
                    id={`hourly_wage-${workplace.id}`}
                    value={workplace.hourly_wage}
                    onChange={(e) => handleWorkplaceNameChange(workplace.id, workplace.name, workplace.location, workplace.closing_day, workplace.payment_day, e.target.value)}
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
      </div>
    </div>
  );
}