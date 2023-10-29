import Header from '@/components/Header'
import { Container, Table, Tabs } from '@mantine/core'
import { LuUser } from 'react-icons/lu'
import { IoMusicalNoteOutline } from 'react-icons/io5'
import { PiExamLight } from 'react-icons/pi'
import { useEffect, useState } from 'react'
import { Profile, getProfile, getUserList } from '@/lib/supabase/auth'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'

export default function List() {
  const { t, lang } = useTranslation('common')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [userList, setUserList] = useState<any[]>([])
  const [userRows, setUserRows] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    getProfile().then((profile) => {
      if (profile != null) {
        setProfile(profile)
        if (!profile.role.includes('admin')) {
          router.push('/')
        }
      } else {
        router.push('/')
      }
    })
    getUserList().then((userList) => {
      setUserList(userList || [])
    })
    console.log(userList)
    const changeDateToString = (date: string) => {
      const dateObj = new Date(date)
      return `${dateObj.getFullYear()}/${dateObj.getMonth()}/${dateObj.getDay()}`
    }
    const rows = userList.map((user) => (
      <Table.Tr key={user.user_id}>
        <Table.Td>{user.user_id}</Table.Td>
        <Table.Td>{changeDateToString(user.created_at)}</Table.Td>
        <Table.Td>{user.role.toString()}</Table.Td>
        <Table.Td>{user.ViolationPoint.toString()}</Table.Td>
        <Table.Td>{user.TOUntil}</Table.Td>
        <Table.Td>{user.isBanned.toString()}</Table.Td>
      </Table.Tr>
    ))
    setUserRows(rows)
    console.log(userRows)
  }, [])
  return (
    <>
      <Header title='Fukinoto | Admin' />
      <div>
        <Tabs defaultValue='user' style={{ marginTop: '6.5vh', marginLeft: '21vh' }} w='70%'>
          <Tabs.List>
            <Tabs.Tab value='user' leftSection={<LuUser />}>
              Users
            </Tabs.Tab>
            <Tabs.Tab value='charts' leftSection={<IoMusicalNoteOutline />}>
              Charts
            </Tabs.Tab>
            <Tabs.Tab value='settings' leftSection={<PiExamLight />}>
              Exam
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value='user'>
            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>{t`Username`}</Table.Th>
                  <Table.Th>{t`CreatedAt`}</Table.Th>
                  <Table.Th>{t`Role`}</Table.Th>
                  <Table.Th>{t`ViolationPoints`}</Table.Th>
                  <Table.Th>{t`TOUntil`}</Table.Th>
                  <Table.Th>{t`Banned`}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{userRows}</Table.Tbody>
            </Table>
          </Tabs.Panel>

          <Tabs.Panel value='charts'>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Username</Table.Th>
                  <Table.Th>CreatedAt</Table.Th>
                  <Table.Th>Role</Table.Th>
                  <Table.Th>ViolationPoints</Table.Th>
                  <Table.Th>TOTill</Table.Th>
                  <Table.Th>Banned</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{userRows}</Table.Tbody>
            </Table>
          </Tabs.Panel>

          <Tabs.Panel value='exam'>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Username</Table.Th>
                  <Table.Th>CreatedAt</Table.Th>
                  <Table.Th>Role</Table.Th>
                  <Table.Th>ViolationPoints</Table.Th>
                  <Table.Th>TOTill</Table.Th>
                  <Table.Th>Banned</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{userRows}</Table.Tbody>
            </Table>
          </Tabs.Panel>
        </Tabs>
      </div>
    </>
  )
}
