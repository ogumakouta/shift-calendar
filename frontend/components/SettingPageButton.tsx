'use client';
import Image from "next/image";
import settingBtn from '../public/setting_icon.svg';
import Link from "next/link";

export default function SettingPageButton() {
  return (
    <Link href='/setting' className='m-2'><Image src={settingBtn} alt='設定' height={48}/></Link>
  );
}