'use client'

import { useState, useEffect } from 'react';
import type { Value } from "react-calendar/dist/cjs/shared/types";


// 親コンポーネントから受け取るpropsの型定義
type Props = {
  date: Value;
  events: any[];
};

// APIのエンドポイント
const apiUrl = process.env.NEXT_PUBLIC_API_URL

// 時給取得
async function getHourlyWage(workplace_id) {
  const res = await fetch(`${apiUrl}/workplace/getWorkplaceWage/${workplace_id}`);
  if (!res.ok) {
    throw new Error('時給の取得に失敗しました');
  }
  const data = await res.json();
  return data.hourly_wage;
}

// 勤務時間を計算する関数
function calculateWorkHours(start_time, finish_time) {
  const start = new Date(start_time);
  const finish = new Date(finish_time);
  const diffMilliseconds = finish - start;
  // ミリ秒を時間単位に変換
  return diffMilliseconds / (1000 * 60 * 60);
}


export default function MonthlySalaryArea({ date, events }: Props) {
  // カレンダーで選択した日付を格納
  const selectDate =new Date(date);
  // 月の総給料を保持するstate
  const [monthlySalary, setMonthlySalary] = useState(0);
  // 計算中かどうかの状態を保持するstate
  const [isLoading, setIsLoading] = useState(false);


  // 選択された日付やイベントが変更されたら給料を再計算
  useEffect(() => {
    // dateが有効なDateオブジェクトでなければ何もしない
    if (!(date instanceof Date)) {
      setMonthlySalary(0); // 給料をリセット
      return;
    }

    const calculateSalary = async () => {
      setIsLoading(true);

      // 1. 選択された月のイベントをフィルタリング
      const filteredEvents = events.filter(event => {
        if (!event.start_time) return false;
        const eventDate = new Date(event.start_time);
        return date.getFullYear() === eventDate.getFullYear() && date.getMonth() === eventDate.getMonth();
      });

      if (filteredEvents.length === 0) {
        setMonthlySalary(0);
        setIsLoading(false);
        return;
      }

      try {
        // 2. 各イベントの給料計算プロミスを作成
        const salaryPromises = filteredEvents.map(async (event) => {
          if (!event || !event.workplace?.id) {
            return 0;
          }

          const hourlyWage = await getHourlyWage(event.workplace.id);
          const workHours = calculateWorkHours(event.start_time, event.finish_time);
          const calculatedSalary = hourlyWage * workHours;

          return calculatedSalary;
        });

        // 3. 全てのプロミスを並行して実行し、結果（給料の配列）を待つ
        const salaries = await Promise.all(salaryPromises);

        // 4. 給料の配列を合計する
        const totalSalary = salaries.reduce((total, current) => total + current, 0);

        // 5. stateを更新
        setMonthlySalary(totalSalary);
      } catch (error) {
        setMonthlySalary(0); // エラー時は0にリセット
      } finally {
        setIsLoading(false);
      }
    };

    calculateSalary();
  }, [date, events]); // dateかeventsが変更されたら再実行

  return (
    <div className='bg-[#fbfbfb] ml-5 mr-5 mt-2 rounded-md max-w-[280px] w-full h-[360.5px] text-center p-2 flex flex-col'>
      <div className='text-xl mb-2'>
        {selectDate.getMonth() + 1}月の収入
      </div>
      <div className='m-5 flex justify-center'>
        <div>
          {isLoading ? (
            <span>計算中...</span>
          ) : (
            // toLocaleString()で3桁区切りの通貨形式にする
            <span className='text-4xl'>¥{Math.floor(monthlySalary).toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
}