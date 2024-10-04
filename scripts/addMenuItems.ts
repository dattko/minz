import { db } from '@/lib/firebaseAdmin';
import { MenuItem } from '@/types/menu';

async function addMenuItems(menuItems: MenuItem[]) {
  const batch = db.batch();
  const menuCollection = db.collection('menus');

  menuItems.forEach((item) => {
    const newDocRef = menuCollection.doc(item.id);
    batch.set(newDocRef, item);
  });

  try {
    await batch.commit();
    console.log("All menu items added successfully");
  } catch (e) {
    console.error("Error adding menu items: ", e);
  }
}

// 메뉴 항목 데이터
const menuItemsToAdd: MenuItem[] = [
  { id: 'menu-1', title: "공지사항", link: "/notices", order: 1 },
  { id: 'menu-2', title: "인기글", link: "/popularPosts", order: 2 },
  { id: 'menu-3', title: "자유게시판", link: "/forum", order: 3 },
  { id: 'menu-4', title: "문의하기", link: "/contact", order: 4 },
];

// 스크립트 실행
addMenuItems(menuItemsToAdd);