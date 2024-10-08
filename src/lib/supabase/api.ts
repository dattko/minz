export const fetchSupabaseData = async (tableName: string) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL or Anon Key is not defined');
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/${tableName}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'apikey': supabaseAnonKey,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`네트워크 응답에 문제가 있습니다. Status: ${response.status}`);
  }

  return await response.json();
};


// import { fetchSupabaseData } from '@/lib/supabase/api';

// async function UserList() {
//   try {
//     const users = await fetchDataFromSupabase('users');

//     return (
//       <div>
//         <h1>사용자 목록</h1>
//         <ul>
//           {users.map((user: { id: string; email: string; username: string }) => (
//             <li key={user.id}>
//               {user.username} ({user.email})
//             </li>
//           ))}
//         </ul>
//       </div>
//     );
//   } catch (error) {
//     console.error('데이터를 가져오는 중 오류 발생:', error);
//     return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
//   }
// }

// export default UserList;


// import { GetServerSideProps } from 'next';
// import { fetchDataFromSupabase } from '@/lib/supabase/api';

// interface User {
//   id: string;
//   email: string;
//   username: string;
// }

// interface UserListProps {
//   users: User[];
// }

// export const getServerSideProps: GetServerSideProps<UserListProps> = async () => {
//   try {
//     const users = await fetchDataFromSupabase('users');
//     return { props: { users } };
//   } catch (error) {
//     console.error('데이터를 가져오는 중 오류 발생:', error);
//     return { props: { users: [] } };
//   }
// };

// function UserList({ users }: UserListProps) {
//   return (
//     <div>
//       <h1>사용자 목록</h1>
//       <ul>
//         {users.map((user) => (
//           <li key={user.id}>
//             {user.username} ({user.email})
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default UserList;