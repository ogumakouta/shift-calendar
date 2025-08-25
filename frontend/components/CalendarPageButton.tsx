'use client'

import Link from "next/link";

export function CalendarPageButton() {
  return (
    <Link href='calendar' 
      className="flex justify-center text-center p-2 bg-[#fbfbfb] rounded-md hover:bg-gray-200 transition-colors
      dark:bg-[#565656] dark:hover:bg-gray-500"
    >
      カレンダーページ<br></br>に戻る
    </Link>
  );
}