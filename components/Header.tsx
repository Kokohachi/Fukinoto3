import { Card, Avatar, Text, Badge, Button, Group, Stack, HoverCard, Menu } from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import { signIn, getProfile, Profile, signOut, createUser, updateRole } from '@/lib/supabase/auth'
import { use, useEffect, useState } from 'react'
import Head from 'next/head'
import { Router, useRouter } from 'next/router'
import { HiBadgeCheck, HiOutlineBell } from 'react-icons/hi'
import css from 'styled-jsx/css'
import { UUID } from 'crypto'

export default function Header(props: { title: string }) {
  const { t, lang } = useTranslation('common')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const router = useRouter()
  useEffect(() => {
    getProfile().then((profile) => {
      if (profile != null) {
        setProfile(profile)
        createUser(profile.id as UUID)
        console.log(profile)
        setLoggedIn(true)
        updateRole(profile.id as UUID, [
          { name: 'user', color: 'gray', permissions: ['member'], granted_at: new Date() },
        ])
      } else {
        setLoggedIn(false)
      }
    })
  }, [])
  return (
    <div>
      <Head>
        <title>{props.title}</title>
      </Head>
      <Card
        shadow='lg'
        padding='lg'
        radius='md'
        style={{ width: '80%', margin: '0 auto', marginTop: '20px' }}
      >
        <Group justify='space-between'>
          <Text fw={500}>🝲 Fukinoto</Text>
          {loggedIn ? (
            <Group>
              <HiOutlineBell size={20} />
              <Menu shadow='md' width={200} trigger='hover' offset={25}>
                <Menu.Target>
                  <Group>
                    <Avatar src={profile?.avatar} alt={profile?.username} radius='xl' size={50} />
                    <Stack gap={0}>
                      <Text fw={'bolder'} display={'inline-flex'} style={{ alignItems: 'center' }}>
                        {profile?.globalname}
                        <HiBadgeCheck style={{ color: '#3ec0ff' }} />
                      </Text>
                      <Text size='sm' c={'gray'}>
                        @{profile?.username}
                      </Text>
                    </Stack>
                  </Group>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>ユーザー</Menu.Label>
                  <Menu.Item>ダッシュボード</Menu.Item>
                  <Menu.Item>設定</Menu.Item>
                  <Menu.Item>通知</Menu.Item>

                  <Menu.Divider />
                  <Menu.Item
                    color='red'
                    onClick={() => {
                      signOut().then(() => {
                        setLoggedIn(false)
                      })
                    }}
                  >
                    ログアウト
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          ) : (
            <Button variant='light' color='pink' onClick={() => signIn()}>
              {t`Login`}
            </Button>
          )}
        </Group>
      </Card>
    </div>
  )
}
