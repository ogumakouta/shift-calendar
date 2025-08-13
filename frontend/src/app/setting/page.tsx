'use client'

import UserSettingForm from "../../../components/UserSettingForm";
import EventLabelSettingForm from "../../../components/EventLabelSettingForm";

export default function SettingPage() {
  return (
    <div>
      <UserSettingForm/>
      <EventLabelSettingForm/>
    </div>
  );
}