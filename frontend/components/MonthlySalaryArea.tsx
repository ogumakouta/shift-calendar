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
  const [displayDate, setDisplayDate] = useState(new Date());

  // 月を「前へ」「次へ」と変更するための関数
  const handlePrevMonth = () => {
    setDisplayDate(currentDate => {
      // 現在の表示月から1ヶ月前の日付を生成して更新
      return new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    });
  };
  const handleNextMonth = () => {
    setDisplayDate(currentDate => {
      // 現在の表示月から1ヶ月後の日付を生成して更新
      return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    });
  };

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
      const selectedYear = displayDate.getFullYear();
      const selectedMonth = displayDate.getMonth();

      // 現在の年月を取得
      const nowDate = Date.now();
      const displayYear = new Date(nowDate).getFullYear();
      const displayMonth = new Date(nowDate).getMonth();

      // 予定をフィルタリングする関数
      const filteredEvents = events.filter(event => {
        // 必要な情報がなければ計算対象外
        if (
          !event.start_time || 
          !event.workplace || 
          event.workplace.closing_day == null ||
          !event.workplace.payment_month
        ) {
          return false;
        }

        // 予定の開始時間を取得
        const eventDate = new Date(event.start_time);
        const eventYear = eventDate.getFullYear();
        const eventMonth = eventDate.getMonth();
        const eventDay = eventDate.getDate();
        
        const closingDay = event.workplace.closing_day;
        const paymentMonthType = event.workplace.payment_month;

        // 予定の締め日と支給月を取得する
        let closingYear = eventYear;
        let closingMonth = eventMonth;

        // 月途中締めで、勤務日が締め日を過ぎている場合、締め月は翌月になる
        if (closingDay !== 99 && eventDay > closingDay) {
          closingMonth += 1;
        }

        // 支払日を設定
        const paymentDate = new Date(closingYear, closingMonth, 1); // 日にちを「1日」に固定

        if (paymentMonthType === 'next') {
          paymentDate.setMonth(paymentDate.getMonth() + 1); // 翌月
        } else if (paymentMonthType === 'after_next') {
          paymentDate.setMonth(paymentDate.getMonth() + 2); // 翌々月
        }

        return paymentDate.getFullYear() === selectedYear && paymentDate.getMonth() === selectedMonth;
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
  }, [events, displayDate]);

  return (
    <div className='bg-[#fbfbfb] ml-5 mr-5 mt-2 rounded-md max-w-[280px] w-full h-[360.5px] text-center p-2 flex flex-col'>
      <div className='text-xl mb-2 flex items-center justify-center space-x-2'>
        <button 
          onClick={handlePrevMonth} 
          className="px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="前の月へ"
        >
          &lt;
        </button>
        <div className="w-full text-center">
          {displayDate.getFullYear()}年{displayDate.getMonth() + 1}月の収入
        </div>
        <button 
          onClick={handleNextMonth} 
          className="px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="次の月へ"
        >
          &gt;
        </button>
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