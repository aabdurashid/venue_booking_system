import axios from "axios";
import { create } from "zustand";

export const useAdminStore = create((set) => ({
    venues: [],
    loading: false,
    error: '',

    fetchVenues: async () => {
        set({ loading: true, error: '' })
        try {
            const token = localStorage.getItem('token')
            const role = localStorage.getItem('role')
            const url = role === 'admin' ? 'http://localhost:3105/admin/venues' : 'http://localhost:3105/owner/venues'

            const res = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            set({ venues: res.data, loading: false })
        } catch (error) {
            set({ error: "To'yxonalarni olishda xatolik", loading: false })
        }
    },
    owners: [],
    fetchOwners: async () => {
        set({ loading: true, error: '' })
        try {
            const token = localStorage.getItem('token')
            const res = await axios.get('http://localhost:3105/admin/allOwners', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            set({ owners: res.data, loading: false })
        } catch (error) {
            set({ error: error.message || "Ownerlarni olishda xatolik yuz berdi", loading: false })

        }
    }
}))

export default useAdminStore