// 日付の選択（状態管理）やクリック操作を扱うため、クライアントコンポーネントにします。
'use client';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import  './Calendar.css';
import type { Value } from "react-calendar/dist/cjs/shared/types";


// 親コンポーネントから受け取るpropsの型定義
type Props = {
  value: Value;
  onChange: (value: Value) => void;
};

export default function MyCalendar({ value, onChange}: Props) {

  return (
    <Calendar 
      onChange={onChange}
      value={value} 
      locale="ja-JP"
    />
  );
}