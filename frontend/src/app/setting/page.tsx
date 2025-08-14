'use client'

import UserSettingForm from "../../../components/UserSettingForm";
import EventLabelSettingForm from "../../../components/EventLabelSettingForm";
import WorkplaceSettingForm from "../../../components/WorkplaceSettingForm";
import { CalendarPageButton } from "../../../components/CalendarPageButton";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function SettingPage() {
  const [user_id, setUser_id] = useState('');
  const [userSetting, setUserSetting] = useState(true);
  const [eventLabelSetting, setEventLabelSetting] = useState(false);
  const [workplaceSetting, setWorkplaceSetting] = useState(false);

  // ユーザIDを取得
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('ユーザIDが見つかりません')
      return;
    }

    const decodeToken = jwtDecode(token);
    setUser_id(decodeToken.sub)
  }, [])

  // ユーザ設定ボタンを押した時に実行する関数
  const handleUser = () => {
    if (userSetting) return;

    setUserSetting(true);
    setEventLabelSetting(false);
    setWorkplaceSetting(false);
  }

  // 予定の種類設定ボタンを押した時に実行する関数
  const handleEventLabel = () => {
    if (eventLabelSetting) return;

    setUserSetting(false);
    setEventLabelSetting(true);
    setWorkplaceSetting(false);
  }

  // 勤務先設定ボタンを押した時に実行する関数
  const handleWorkplace = () => {
    if (workplaceSetting) return;

    setUserSetting(false);
    setEventLabelSetting(false);
    setWorkplaceSetting(true);
  }

  return (
    <div className="flex">
      <div>
      <div className="m-4 flex flex-col w-[200px] h-[680px] bg-[#fbfbfb] rounded-md">
        <h1 className="text-2xl text-center m-3">設定</h1>
        <button
        type="button"
        onClick={handleUser}
        className="my-2 p-2 hover:bg-gray-200 transition-colors"
        >
          ユーザ設定
        </button>
        <button
        type="button"
        onClick={handleEventLabel}
        className="my-2 p-2 hover:bg-gray-200 transition-colors"
        >
          予定の種類設定
        </button>
        <button
        type="button"
        onClick={handleWorkplace}
        className="my-2 p-2 hover:bg-gray-200 transition-colors"
        >
          勤務先設定
        </button>
      </div>
      <div className="m-4">
        <CalendarPageButton/>
      </div>
      </div>
      <div className="w-full flex justify-center">
        {userSetting && <UserSettingForm user_id={user_id} />}
        {eventLabelSetting && <EventLabelSettingForm user_id={user_id} />}
        {workplaceSetting && <WorkplaceSettingForm user_id={user_id}/>}
      </div>
    </div>
  );
}