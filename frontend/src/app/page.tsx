import Link from 'next/link'

export default function Home() {
  return (
    <main>
      {/* <h1>welcome to Shift Calendar!</h1> */}
      <div className="header">
        シフトカレンダー
      </div>
      <p>トップページ</p>
      <Link href="/login">ログインページへ</Link>
    </main>
  );
}
