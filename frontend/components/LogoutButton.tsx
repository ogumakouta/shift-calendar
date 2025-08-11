'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';


export default function LogoutButton() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // LocalStorageからアクセストークンを取得
    const token = localStorage.getItem('access_token');
    // 取得できたらtrueにする
    if (token) {
      setIsLogin(true);
    }
  }, [pathname]);// URLが変更されるたびに実行

  // LocalStorageからトークンを削除
  function logout() {
    localStorage.removeItem('access_token');
    setIsLogin(false);
    router.push('/login');
  }

  // ログインしてたら表示
  if(isLogin) {
    return <button className="h-12 p-3 bg-white border-glay-500 cursor-pointer rounded-md" onClick={logout}>ログアウト</button>
  }

  // ログインしてなかったら非表示
  return null;
}