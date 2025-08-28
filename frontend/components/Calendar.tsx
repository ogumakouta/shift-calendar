// 日付の選択（状態管理）やクリック操作を扱うため、クライアントコンポーネントにします。
'use client';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import  './Calendar.css';
import type { Value } from "react-calendar/dist/cjs/shared/types";
import { useEffect, useState } from 'react';


// 親コンポーネントから受け取るpropsの型定義
type Props = {
  value: Value;
  onChange: (value: Value) => void;
  events: any[];
};

// 日付をyyyy-mm-ddの形式に変換する関数
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}


export default function MyCalendar({ value, onChange, events}: Props) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);
    
    // osのテーマが変更されたときに実行される関数
    const handleChange = (e) => {
      setIsDarkMode(e.matches);
    };

    // イベントリスナーを追加
    mediaQuery.addEventListener('change', handleChange);

    // コンポーネントが不要になったときにリスナーを解除
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const eventDates = events.map(event => {
    const eventDate = new Date(event.start_time);
    return formatDate(eventDate);
  });

  const addEventMarker = ({ date, view }) => {
    // 月表示のときのみ印を付ける
    if (view === 'month') {
      const formattedDate = formatDate(date);
      // 今描画しようとしている日付がイベントリストにあれば、印(div要素)を返す
      if (eventDates.includes(formattedDate)) {
        return <div className="event-marker"></div>;
      }
    }
    return null; // 印を付けない場合はnullを返す
  };

  return (
    <div className={isDarkMode ? 'dark-mode' : ''}>
      <Calendar 
        onChange={onChange}
        value={value} 
        tileContent={addEventMarker}
        locale="ja-JP"
      />
    </div>
  );
}