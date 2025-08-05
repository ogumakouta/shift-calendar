'use client'
import LoginForm from "../../../components/LoginForm";
import CheckLogin from '../../../components/CheckLogin';


export default function LoginPage() {
  return (
    <main>
      <CheckLogin/>
      <h1 style={{ textAlign: 'center' }}>ログイン</h1>
      <LoginForm />
    </main>
    );
}