import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/employees/home');
}
