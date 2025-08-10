'use client'
import LoginForm from "../../../components/LoginForm";
import CheckLogin from '../../../components/CheckLogin';


export default function LoginPage() {
  return (
    <main>
      <CheckLogin/>
      <h1 className='text-center text-3xl'>ログイン</h1>
      <LoginForm />
    </main>
    );
}