import { equipSelect, getEquip } from '@/redux/slice/equipSlice'
import React from 'react'
import { useDispatch } from 'react-redux'
// import {useSelector} from 'redux'
import { useSelector } from 'react-redux'

export default function Index() {
  const phone = '185'
  const equip = useSelector(equipSelect)
  const dispatch = useDispatch()
  return (
    <>
      <div>{equip}</div>
      <button onClick={() => {
        dispatch(getEquip(phone))
      }}>I</button></>
  )
}
