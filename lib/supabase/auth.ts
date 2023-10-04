import { type } from 'os'
import supabase from './supabase'
import { useState } from 'react'
import { AuthApiError } from '@supabase/supabase-js'
import { UUID } from 'crypto'
export const signIn = async () => {
  const { data: signInData, error: signInError } = await supabase.auth.signInWithOAuth({
    provider: 'discord',
  })
  if (signInError) {
    return null
  }
}

export const createUser = async (id: UUID) => {
  //check if user exists
  const { data, error } = await supabase.from('users').select().eq('id', id)
  if (error) {
    return null
  }
  if (data.length > 0) {
    return data
  }
  //create user
  const { data: userData, error: userError } = await supabase
    .from('users')
    .insert({ id: id, role: {} })
  if (userError) {
    return null
  }
  return userData
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
}

export const getProfile = async () => {
  const { data, error } = await supabase.auth.getUser()
  if (error) {
    return null
  }

  const userdata = data.user
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select()
    .eq('id', userdata?.id)
  return {
    id: userdata?.id,
    username: userdata?.user_metadata.full_name,
    globalname: userdata?.user_metadata.custom_claims.global_name,
    avatar: userdata?.user_metadata.avatar_url,
    email: userdata?.email,
    role: (userData?.length || 0) > 0 ? (userData ? userData[0].role : {}) : {},
  } as Profile
}

export type Profile = {
  id: string
  username: string
  globalname: string
  avatar: string
  email: string
}

export const updateRole = async (id: UUID, roles: Role[]) => {
  // create object
  const { data, error } = await supabase
    .from('users')
    .update({
      role: { roles: roles },
    })
    .eq('id', id)
  if (error) {
    return null
  }
  return data
}

export const deleteRole = async (id: UUID, roleName: string) => {
  const { data, error } = await supabase.from('users').select('role').eq('id', id)
  if (data === null || error) {
    return null
  }
  const roles = data[0].role.roles
  const index = roles.findIndex((role: Role) => role.name === roleName)
  roles.splice(index, 1)
  const { data: updateData, error: updateError } = await supabase
    .from('users')
    .update({
      role: { roles: roles },
    })
    .eq('id', id)
  if (updateError) {
    return null
  }
}

type Role = {
  name: string
  color: string
  granted_at: Date
  permissions: string[]
}
