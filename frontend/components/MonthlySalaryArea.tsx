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
function calculateWorkHours(start_time, finish_time, break_minutes) {
  // Date型に変換した差分を求めて勤務時間を出す
  const start = new Date(start_time);
  const finish = new Date(finish_time);
  const diffMilliseconds = finish - start;

  // ミリ秒を分単位に変換して休憩時間を引く
  const minutes_worktime = (diffMilliseconds / (1000 * 60)) - break_minutes;

  // 休憩時間を引いた分単位の勤務時間を時間単位に変換して返す
  return minutes_worktime / 60;
}


export default function MonthlySalaryArea({ date, events }: Props) {
  // カレンダーで選択した日付を格納
  const selectDate =new Date(date);
  // 月の総給料を保持するstate
  const [monthlySalary, setMonthlySalary] = useState(0);
  // 月の総勤務時間を保持するstate
  const [monthlyWorkTime, setMonthlyWorkTime] = useState(0);
  // 計算中かどうかの状態を保持するstate
  const [isLoading, setIsLoading] = useState(false);


  // 選択された日付やイベントが変更されたら給料を再計算
  useEffect(() => {
    // dateが有効なDateオブジェクトでなければ何もしない
    if (!(date instanceof Date)) {
      setMonthlySalary(0); // 給料をリセット
      setMonthlyWorkTime(0);// 総勤務時間をリセット
      return;
    }

    const calculateSalary = async () => {
      setIsLoading(true);

      // 選択された年月を取得
      const selectedYear = date.getFullYear();
      const selectedMonth = date.getMonth();

      // 予定をフィルタリングする関数
      const filteredEvents = events.filter(event => {
        // 必要な情報がなければ計算対象外
        if (!event.start_time) {
          return false;
        }

        // 予定の開始時間を取得
        const eventDate = new Date(event.start_time);
        // 締め日を取得
        const closingDay = event.workplace.closing_day;

        let startDate, endDate;
        
        // 選択された月の最終日を取得
        const lastDayOfSelectedMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

        // 締め日が月末か判定
        if (closingDay === 99) {
          // 月末締め
          startDate = new Date(selectedYear, selectedMonth, 1);
          endDate = new Date(selectedYear, selectedMonth, lastDayOfSelectedMonth, 23, 59, 59);
        } else {
          // 月途中締め
          startDate = new Date(selectedYear, selectedMonth - 1, closingDay + 1);
          endDate = new Date(selectedYear, selectedMonth, closingDay, 23, 59, 59);
        }
        
        return eventDate >= startDate && eventDate <= endDate;
      });

      if (filteredEvents.length === 0) {
        setMonthlySalary(0);
        setMonthlyWorkTime(0);
        setIsLoading(false);
        return;
      }

      try {
        // 2. 各イベントの給料計算プロミスを作成
        const salaryPromises = filteredEvents.map(async (event) => {
          if (!event || !event.workplace?.id) {
            return { salary: 0, hours: 0 };
          }

          const hourlyWage = await getHourlyWage(event.workplace.id);
          const workHours = calculateWorkHours(event.start_time, event.finish_time, event.break_minutes ?? 0);
          const calculatedSalary = hourlyWage * workHours;

          return { salary: calculatedSalary, hours: workHours };
        });

        // 3. 全てのプロミスを並行して実行し、結果（給料の配列）を待つ
        const results = await Promise.all(salaryPromises);

        // 4. 給料の配列を合計する
        const totals = results.reduce((acc, current) => {
          acc.totalSalary += current.salary;
          acc.totalHours += current.hours;
          return acc;
        }, { totalSalary: 0, totalHours: 0 });

        // 総勤務時間の小数点以下を割合から分に変換
        const minutes = Number((totals.totalHours % 1).toPrecision(2));
        const newMinutes = 60 * minutes;
        
        // 分に変換したものを総勤務時間の時間部分に分部分を足す
        const newMonthryWorkTime = Math.trunc(totals.totalHours) + (newMinutes / 100);
        
        // 5. stateを更新
        setMonthlySalary(totals.totalSalary);
        setMonthlyWorkTime(newMonthryWorkTime);
      } catch (error) {
        // エラー時は0にリセット
        setMonthlySalary(0);
        setMonthlyWorkTime(0);
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
            <div>
              <div className='text-4xl'>¥{Math.floor(monthlySalary).toLocaleString()}</div>
              <div className='text-xl mt-3'>勤務時間：{Math.trunc(monthlyWorkTime)}時間{Number((monthlyWorkTime % 1) * 100).toPrecision(2)}分</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}