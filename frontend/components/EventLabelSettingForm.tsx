'use client'

import { useEffect, useState } from "react";
import type { Value } from "react-calendar/dist/cjs/shared/types";

// 親コンポーネントから受け取るpropsの型定義
type Props = {
  user_id: Value;
};

// Labelの型を定義
type Label = {
  id: number | string;
  name: string;
  common: number | string;
};

// APIのエンドポイント
const apiUrl = process.env.NEXT_PUBLIC_API_URL

const getEventLabels = async (user_id) => {
  if (!user_id) return;

  // 予定の種類を取得
  try {
    console.log('リクエスト送信');
    const labelsRes = await fetch(`${apiUrl}/event-label/getLabels/${user_id}`);
    // レスポンスが正常じゃなかったらエラー
    if (!labelsRes.ok) {
      throw new Error(`HTTP error! status: ${labelsRes.status}`);
    }
    return await labelsRes.json();
  } catch (err) {
    console.error('ラベルの取得に失敗しました:', err);
  }
}

export default function EventLabelSettingForm({ user_id }: Props) {
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [labels, setLabels] = useState<Label[]>([]);


  useEffect(() => {
    const fetchData = async (user_id) => {
      // 予定の種類を取得してlabelsステートにセット
      const labelsRes = await getEventLabels(user_id);
      setLabels(labelsRes || []);

      // 取得したユーザ情報を入力フォームに表示
      const currentName = labelsRes.name || '';
      setName(currentName);
    }

    // ユーザIDがあるときだけ予定の種類を取得す関数を実行する
    if (user_id) {
      fetchData(user_id)
    }
  }, [user_id])

  // console.log(labels);

  // map内の各inputを個別に編集するためのハンドラ
  const handleLabelNameChange = (id: number | string, newName: string, newCommon: number | string) => {
    setLabels(prevLabels => 
      prevLabels.map(label => 
        label.id === id ? { ...label, name: newName, common: newCommon } : label
      )
    );
  };

  // 予定の種類名更新処理
  const handleUpdate = async (user_id: number | string, label_id: number | string) => {
    // 更新対象のラベルを探す
    const targetLabel = labels.find(label => label.id === label_id);
    if (!targetLabel) return;

    // 対象ラベルが「バイト」か「予定」だったら処理を中断
    if (targetLabel.name === "予定" || targetLabel.name === "バイト") {
      setMessage('「バイト」と「予定」は更新できません');
      return;
    }

    // 更新対象のラベルが見つかったら更新リクエストを送信
    try {
      const res = await fetch(`${apiUrl}/event-label/updateLabel/${user_id}/${label_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: targetLabel.name }),
      });

      if (!res) {
        setMessage('種類名の更新に失敗しました');
        throw new Error('種類名の更新に失敗しました');
      }
      setMessage(`${targetLabel.name}を更新しました`);
    } catch (error) {
      setMessage('種類名の更新に失敗しました');
    }
  }

  const handleDel = async (id: number | string) => {
  }

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  return (
    <div>
      <h1 className="text-2xl text-center">予定の種類</h1>
      <div
        className="flex flex-col gap-4 max-w-md mx-auto my-8 p-8 rounded-lg shadow-md"
      >
        <div className="text-center text-red-500">
          {message}
        </div>
        {labels.length > 0 ? (
          labels.map(label => (
            <div className="flex" key={label.id}>
              <div className='flex flex-col w-full'>
                <label htmlFor={`name-${label.id}`} className="font-semibold">種類名:</label>
                <input
                  type="text"
                  id={`name-${label.id}`}
                  value={label.name}
                  onChange={(e) => handleLabelNameChange(label.id, e.target.value, label.common)}
                  className="p-2 border rounded-md"
                />
              </div>
              <div className="flex items-end">
              <button 
                type="button"
                onClick={() => handleUpdate(user_id, label.id)}
                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors w-[70px] h-[50px]  ml-3 mr-3"
                disabled={label.common === 1}
              >
                更新
              </button>
              <button 
                type="button"
                onClick={handleDel}
                className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors w-[70px] h-[50px]"
                disabled={label.common === 1}
              >
                削除
              </button>
              </div>
            </div>
          ))
        ) : (
          <div className="mt-4 text-gray-500">予定の種類は登録されていません。</div>
        )}
        <div className="flex flex-col gap-2 mt-7">
          <label htmlFor="name" className="font-semibold">追加する種類名:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border rounded-md"
          />
        </div>
        <button 
          type="submit"
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          追加
        </button>
      </div>
    </div>
  );
}