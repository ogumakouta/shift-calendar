'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';


export default function CheckLogin() {
  const router = useRouter();

  useEffect(() => {
    // LocalStorageからアクセストークンを取得
    const token = localStorage.getItem('access_token');
    
    if (token) {
      router.push('/calendar');
    }
  }, []);
  
  return null;
}