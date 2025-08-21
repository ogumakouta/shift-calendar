'use client'

import type { Value } from "react-calendar/dist/cjs/shared/types";
import DeleteEventButton from './DeleteEventButton';


// 親コンポーネントから受け取るpropsの型定義
type Props = {
  date: Value;
  events: any[];
  onEventCreated: () => void;
};


export default function EventListArea({ date, events, onEventCreated }: Props) {
  // カレンダーで選択した日付を格納
  const selectDate = date instanceof Date ? date.toLocaleDateString("ja-JP") : "日付が選択されていません";


  // ISO8601形式の時間から⚪︎時⚪︎分を取得する関数
  const formatTime = (isoString) => {
    if (!isoString) {
      return '時間未設定';
    }

    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }


  // 日付ごとの予定を表示する関数
  const filteredEvents = events.filter(event => {
    if (!event.start_time) return false;

    const eventDate = new Date(event.start_time).toLocaleDateString("ja-JP");
    return eventDate === selectDate;
  })


  return (
    <div className="bg-[#fbfbfb] ml-5 mr-5 mb-2 rounded-md max-w-[280px] w-full h-[360.5px] text-center p-2 flex flex-col
    dark:bg-[#505050]">
      <div className='text-xl mb-2'>{selectDate}の予定</div>
      <div className='text-center overflow-y-auto flex-grow'>
        {/* 日付ごとの予定を表示 */}
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <div className='flex' key={event.id}>
              <details className='w-full'>
                <summary 
                  className='bg-[#f2f2f2] text-center p-2 m-1 rounded-md cursor-pointer
                  dark:bg-[#727272] dark:text-white'
                >
                  {event.title}
                </summary>
                <div className="p-2 text-left">
                  {!event.is_allday && <div>開始時間：{formatTime(event.start_time)}</div>}
                  {!event.is_allday && <div>終了時間：{formatTime(event.finish_time)}</div>}
                  {event.is_allday && <div>時間：<strong>終日</strong></div>}
                  {event.workplace && <div>休憩時間：{event.break_minutes ?? 0}分</div>}
                  {event.workplace && <div>勤務先：{event.workplace.name}</div>}
                  {event.location && <div>場所：{event.location}</div>}
                  {event.memo && <div>メモ：{event.memo}</div>}
                  <div className='text-right mr-2'><DeleteEventButton eventId={event.id}  onEventCreated={onEventCreated} /></div>
                </div>
              </details>
            </div>
          ))
        ) : (
          <div className="mt-4 text-gray-500">この日の予定はありません。</div>
        )}
      </div>
    </div>
  );
}