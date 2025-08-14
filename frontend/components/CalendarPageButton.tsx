'use client'

import Link from "next/link";

export function CalendarPageButton() {
  return (
    <Link href='calendar' className="flex justify-center text-center p-2 bg-[#fbfbfb] rounded-md hover:bg-gray-200 transition-colors">カレンダーページ<br></br>に戻る</Link>
  );
}