// 日付の選択（状態管理）やクリック操作を扱うため、クライアントコンポーネントにします。
'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
// デフォルトのスタイルをインポートします。
// import 'react-calendar/dist/Calendar.css';

// react-calendarが提供する型をインポート
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function MyCalendar() {
  // 選択された日付を保持するためのstate
  const [date, setDate] = useState<Value>(new Date());

  return (
    <div>
      <Calendar 
        onChange={setDate} 
        value={date} 
        // locale="ja-JP" // 日本語化したい場合
      />
      <div className="text-center mt-4">
        {/* Dateオブジェクトを文字列に変換して表示 */}
        <p>選択中の日付: {date instanceof Date ? date.toLocaleDateString('ja-JP') : '日付を選択してください'}</p>
      </div>
    </div>
  );
}