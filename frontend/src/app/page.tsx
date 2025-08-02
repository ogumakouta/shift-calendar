import Link from 'next/link'

export default function Home() {
  return (
    <main>
      {/* <h1>welcome to Shift Calendar!</h1> */}
      <p>トップページ</p>
      <Link href="/login">ログインページへ</Link>
    </main>
  );
}
