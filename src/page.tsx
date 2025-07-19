import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/Page/login');
  return null;
}
