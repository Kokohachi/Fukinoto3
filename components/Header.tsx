import {
  Card,
  Avatar,
  Text,
  Badge,
  Button,
  Group,
  Stack,
  HoverCard,
  Menu,
  ActionIcon,
  Space,
} from '@mantine/core'
import useTranslation from 'next-translate/useTranslation'
import { signIn, getProfile, Profile, signOut, createUser } from '@/lib/supabase/auth'
import { use, useEffect, useState } from 'react'
import Head from 'next/head'
import { Router, useRouter } from 'next/router'
import { HiBadgeCheck, HiOutlineBell } from 'react-icons/hi'
import { TbAlpha, TbBeta } from 'react-icons/tb'
import {
  LuPencil,
  LuPencilLine,
  LuLayoutDashboard,
  LuSettings,
  LuLogOut,
  LuPencilRuler,
  LuUser,
  LuBell,
} from 'react-icons/lu'
import css from 'styled-jsx/css'
import { GrUserAdmin } from 'react-icons/gr'
import { UUID } from 'crypto'

export default function Header(props: { title: string }) {
  const { t, lang } = useTranslation('common')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  useEffect(() => {
    getProfile().then((profile) => {
      if (profile != null) {
        setProfile(profile)
        createUser(profile.id as UUID)
        console.log(profile)
        setLoggedIn(true)
        if (profile.role.includes('admin')) {
          setIsAdmin(true)
        }
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
              <ActionIcon variant='transparent' color='black' radius='xl' aria-label='Settings'>
                <LuBell size={20} />
              </ActionIcon>
              <Menu
                shadow='md'
                width={200}
                trigger='hover'
                offset={25}
                transitionProps={{ transition: 'pop', duration: 300 }}
              >
                <Menu.Target>
                  <Group>
                    <Avatar src={profile?.avatar} alt={profile?.username} radius='xl' size={50} />
                    <Stack gap={0}>
                      <Group>
                        <Text
                          fw={'bolder'}
                          display={'inline-flex'}
                          style={{ alignItems: 'center' }}
                        >
                          {profile?.globalname}
                        </Text>
                        <Space w={5} />
                        <Badge color='red' h={15}>
                          α
                        </Badge>
                      </Group>
                      <Text size='sm' c={'gray'}>
                        @{profile?.username}
                      </Text>
                    </Stack>
                  </Group>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>
                    <LuPencilRuler />
                    {t`Post`}
                  </Menu.Label>
                  <Menu.Item
                    leftSection={<LuPencil />}
                    onClick={() => {
                      router.push('/charts/post')
                    }}
                  >{t`PostChart`}</Menu.Item>
                  <Menu.Item leftSection={<LuPencilLine />}>{t`PostNote`}</Menu.Item>
                  <Menu.Label>
                    <LuUser /> {t`User`}
                  </Menu.Label>
                  <Menu.Item
                    onClick={() => {
                      router.push('/dashboard')
                    }}
                    leftSection={<LuLayoutDashboard />}
                  >
                    {t`Dashboard`}
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      router.push('/settings')
                    }}
                    leftSection={<LuSettings />}
                  >
                    {t`Settings`}
                  </Menu.Item>

                  {isAdmin && (
                    <>
                      <Menu.Divider />
                      <Menu.Label>
                        <TbAlpha /> {t`Admin`}
                      </Menu.Label>
                      <Menu.Item
                        onClick={() => {
                          router.push('/admin/list')
                        }}
                        leftSection={<GrUserAdmin />}
                      >
                        {t`UserList`}
                      </Menu.Item>
                    </>
                  )}

                  <Menu.Divider />
                  <Menu.Item
                    color='red'
                    onClick={() => {
                      signOut().then(() => {
                        setLoggedIn(false)
                      })
                    }}
                    leftSection={<LuLogOut />}
                  >
                    {t`Logout`}
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
