'use client'

import UserSettingForm from "../../../components/UserSettingForm";
import EventLabelSettingForm from "../../../components/EventLabelSettingForm";
import WorkplaceSettingForm from "../../../components/WorkplaceSettingForm";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function SettingPage() {
  const [user_id, setUser_id] = useState('');

  // ユーザIDを取得
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('ユーザIDが見つかりません')
      return;
    }

    const decodeToken = jwtDecode(token);
    setUser_id(decodeToken.sub)
    console.log('ユーザID取得')
  }, [])

  return (
    <div>
      <UserSettingForm/>
      <EventLabelSettingForm user_id={user_id} />
      <WorkplaceSettingForm user_id={user_id}/>
    </div>
  );
}