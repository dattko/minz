import Link from 'next/link'
import styles from './NotFound.module.scss'
import Text from '@/components/text/Text'
import Btn from '@/components/common/button/Btn'
export default function NotFound() {
  return (
    <div className={styles.container}>
      <Text className={styles.heading} variant='h3'>준비중입니다</Text>
      <Text className={styles.text} variant='p' fontSize='xl'>요청하신 페이지는 현재 준비 중입니다.</Text>
      <Link href="/">
        <Btn variant='primary' size='large'>
          홈으로 돌아가기
        </Btn>
      </Link>
    </div>
  )
}