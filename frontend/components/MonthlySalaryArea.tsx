'use client'

import { useState, useEffect } from 'react';
import type { Value } from "react-calendar/dist/cjs/shared/types";


// 親コンポーネントから受け取るpropsの型定義
type Props = {
  date: Value;
  events: any[];
};


export default function MonthlySalaryArea({ date, events }: Props) {
  // カレンダーで選択した日付を格納
  const selectDate =new Date(date);


  // 予定を月ごとにフィルタリングする関数
  const filteredEvents = events.filter(event => {
    if (!event.start_time) return false;

    // カレンダーから選択された日付から年月を取得
    const selectedYear = selectDate.getFullYear();
    const selectedMonth = selectDate.getMonth();

    const eventDate = new Date(event.start_time);
    const eventYear = eventDate.getFullYear();
    const eventMonth = eventDate.getMonth();


    console.log(`selectedY：${selectedYear}、selectidM：${selectedMonth}、eventY：${eventYear}、eventM：${eventMonth}`)

    return selectedYear === eventYear && selectedMonth === eventMonth;
  })


  return (
    <div className='bg-[#fbfbfb] ml-5 mr-5 mt-2 rounded-md max-w-[280px] w-full h-[360.5px] text-center p-2 flex flex-col'>
      <div className='text-xl mb-2'>
        {selectDate.getMonth() + 1}月の収入
      </div>
      <div>
      {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <div className='flex' key={event.id}>
              <div>開始時間：{event.start_time}</div>
              <div>終了時間：{event.finish_time}</div>
            </div>
          ))
        ) : (
          <div className="mt-4 text-gray-500">この日の予定はありません。</div>
        )}
      </div>
    </div>
  );
}