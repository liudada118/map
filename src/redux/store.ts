import { configureStore } from '@reduxjs/toolkit'
import equipSlice from './slice/equipSlice'

const store = configureStore(
    {
        reducer: {
            equip: equipSlice
        }
    }
)

export default store