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
  const user = userData || []
  const role = user[0].role
  return {
    id: userdata?.id,
    username: userdata?.user_metadata.full_name,
    globalname: userdata?.user_metadata.custom_claims.global_name,
    avatar: userdata?.user_metadata.avatar_url,
    email: userdata?.email,
    role: role,
  } as Profile
}

export type Profile = {
  id: string
  username: string
  globalname: string
  avatar: string
  email: string
  role: Array<any>
}

export const getUserList = async () => {
  const { data, error } = await supabase.from('users').select()
  if (error) {
    return null
  }
  return data
}
