import { supabaseAdmin } from '@/lib/supabase/supabaseAdmin';
import { MenuItem } from '@/types/menu';


async function addMenuItems(menuItems: MenuItem[]) {
  try {
    const { data } = await supabaseAdmin
      .from('menus')
      .upsert(menuItems, { onConflict: 'id' })

    console.log("메뉴 추가 성공 : ", data)
  } catch (e) {
    console.error("메뉴 추가 실패 : ", e)
  }
}

// 메뉴 항목 데이터
const menuItemsToAdd: MenuItem[] = [
  { id: 1, title: "공지사항", link: "/notices", order: 1 },
  { id: 2, title: "인기글", link: "/popularPosts", order: 2 },
  { id: 3, title: "자유게시판", link: "/forum", order: 3 },
  { id: 4, title: "문의하기", link: "/contact", order: 4 },
];

// 스크립트 실행
addMenuItems(menuItemsToAdd);