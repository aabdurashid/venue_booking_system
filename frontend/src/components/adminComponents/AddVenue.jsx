import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import useAdminStore from '../../zustand/adminStore';
import axios from 'axios';

function AddVenue() {
    const navigate = useNavigate()
    const { loading, owners, error, fetchOwners } = useAdminStore()
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        district: '',
        capacity: '',
        price_per_seat: '',
        phone_number: '',
        images: [],
        owner_id: ''
    })

    const [previewImages, setPreviewImages] = useState([]);
    const token = localStorage.getItem('token')

    useEffect(() => {
        fetchOwners()
    }, [fetchOwners])

    const handleChange = (e) => {
        const { name, value, files } = e.target
        if (name === 'images') {
            const newFiles = Array.from(files)
            setFormData(prev => ({ ...prev, images: [...prev.images, ...newFiles] }))
            const newPreviews = newFiles.map(file => URL.createObjectURL(file))
            setPreviewImages(prev => [...prev, ...newPreviews])
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    useEffect(() => {
        return () => {
            previewImages.forEach(url => URL.revokeObjectURL(url))
        }
    }, [previewImages])


    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const data = new FormData()
            data.append('name', formData.name)
            data.append('address', formData.address)
            data.append('district', formData.district)
            data.append('capacity', formData.capacity)
            data.append('price_per_seat', formData.price_per_seat)
            data.append('phone_number', formData.phone_number)
            data.append('owner_id', formData.owner_id)

            for (let i = 0; i < formData.images.length; i++) {
                data.append('images', formData.images[i])
            }

            const res = await axios.post('http://localhost:3105/admin/addVenue', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            })
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <section className="add-venue-section">
            <div className="container form-container">
                <div className="page-header">
                    <h1 className="page-title">Yangi to'yxona qo'shish</h1>
                    <p className="page-subtitle">Tizimga yangi to'yxona ma'lumotlarini kiriting</p>
                    <div className="breadcrumb">
                        <Link to='/admin-dashboard'>Admin Panel</Link>
                        <i className="fas fa-chevron-right"></i>
                        <span>Yangi to'yxona qo'shish</span>
                    </div>
                </div>

                <div className="form-card">
                    <h2 className="form-title">
                        <i className="fas fa-building"></i>
                        To'yxona ma'lumotlari
                    </h2>

                    {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

                    <form id="add-venue-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="venue-name" className="form-label required">To'yxona nomi</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="venue-name"
                                    name="name"
                                    placeholder="Masalan: Saroy Nur"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required />
                                <div className="form-text">To'yxonaning to'liq nomini kiriting</div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="owner-name" className="form-label required">Egasi ismi</label>
                                <select
                                    className="form-select"
                                    id="owner-id"
                                    name="owner_id"
                                    value={formData.owner_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">To'yxona egasini tanlang</option>
                                    {owners.map((owner) => {
                                        return (
                                            <option key={owner.id} value={owner.id}>
                                                {owner.firstname} {owner.lastname}
                                            </option>
                                        )
                                    })}
                                </select>
                                <div className="form-text">To'yxona egasining to'liq ismi</div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="address" className="form-label required">Manzil</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="address"
                                    name="address"
                                    placeholder="Masalan: Amir Temur ko'chasi, 108-uy"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required />
                                <div className="form-text">To'liq manzilni kiriting</div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="district" className="form-label required">Tuman</label>
                                <select
                                    className="form-select"
                                    id="district"
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Tumanni tanlang</option>
                                    <option value="Yunusobod tumani">Yunusobod tumani</option>
                                    <option value="Chilonzor tumani">Chilonzor tumani</option>
                                    <option value="Mirzo-Ulug'bek tumani">Mirzo Ulug'bek tumani</option>
                                    <option value="Olmazor tumani">Olmazor tumani</option>
                                    <option value="Sergeli tumani">Sergeli tumani</option>
                                    <option value="Bektemir tumani">Bektemir tumani</option>
                                    <option value="Yakkasaroy tumani">Yakkasaroy tumani</option>
                                    <option value="Mirobod tumani">Mirobod tumani</option>
                                    <option value="Shayxontohur tumani">Shayxontohur tumani</option>
                                    <option value="Uchtepa tumani">Uchtepa tumani</option>
                                    <option value="Yashnobod tumani">Yashnobod tumani</option>
                                </select>
                                <div className="form-text">To'yxona joylashgan tumanni tanlang</div>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="capacity" className="form-label required">Sig'imi (mehmon soni)</label>
                                <div className="input-group">
                                    <span className="input-group-text"><i className="fas fa-users"></i></span>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="capacity"
                                        name="capacity"
                                        placeholder="500"
                                        min="50" max="2000"
                                        value={formData.capacity}
                                        onChange={handleChange}
                                        required />
                                </div>
                                <div className="form-text">Maksimal mehmon sonini kiriting</div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="price-per-seat" className="form-label required">Bir o'rindiq narxi</label>
                                <div className="input-group">
                                    <span className="input-group-text">so'm</span>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="price-per-seat"
                                        name="price_per_seat"
                                        placeholder="30000"
                                        value={formData.price_per_seat}
                                        onChange={handleChange}
                                        required />
                                </div>
                                <div className="form-text">Bir o'rindiq uchun narxni kiriting</div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone-number" className="form-label required">Telefon raqami</label>
                            <div className="input-group">
                                <span className="input-group-text"><i className="fas fa-phone"></i></span>
                                <input
                                    type="tel"
                                    className="form-control"
                                    id="phone-number"
                                    name="phone_number"
                                    placeholder="+998901234567"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    required />
                            </div>
                            <div className="form-text">Telefon raqamini to'liq formatda kiriting</div>
                        </div>

                        <div className="form-group">
                            <label className="form-label required">To'yxona rasmlari</label>
                            <div className="file-upload-area" id="file-upload-area">
                                <div className="file-upload-icon">
                                    <i className="fas fa-cloud-upload-alt"></i>
                                </div>
                                <div className="file-upload-text">Rasmlarni bu yerga sudrab olib keling</div>
                                <div className="file-upload-hint">yoki bosing va fayllarni tanlang</div>
                                <input
                                    type="file"
                                    className="file-input"
                                    id="venue-images"
                                    name="images"
                                    multiple accept="image/*"
                                    onChange={handleChange}
                                    required />
                            </div>
                            <div className="form-text">
                                <i className="fas fa-info-circle"></i> Bir nechta rasm tanlashingiz mumkin. Faqat JPG, PNG, WEBP formatidagi rasmlar qabul qilinadi. Maksimal hajm: 5MB har bir rasm uchun.
                            </div>

                            <div className="upload-progress" id="upload-progress">
                                <div className="progress-bar">
                                    <div className="progress-fill" id="progress-fill"></div>
                                </div>
                                <div className="form-text" id="progress-text">Rasmlar yuklanmoqda...</div>
                            </div>

                            <div className="image-preview-container" id="image-preview-container" style={{ display: previewImages.length > 0 ? 'block' : 'none' }}>
                                <h4>Tanlangan rasmlar:</h4>
                                <div className="image-preview-grid" id="image-preview-grid">
                                    {previewImages.map((prev, index) => {
                                        return (
                                            <div className="image-preview-item" key={index + 1}>
                                                <img src={prev} alt="Preview" className="image-preview" />
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="form-actions">
                            <Link to='/admin-dashboard' className="btn btn-danger btn-lg">
                                <i className="fas fa-times"></i> Bekor qilish
                            </Link>
                            <button type="submit" className="btn btn-success btn-lg" disabled={loading} onClick={() => navigate('/admin-dashboard')}>
                                {loading ? 'Yuklanmoqda...' : (<><i className="fas fa-plus-circle"></i> To'yxona qo'shish</>)}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="alert alert-info">
                    <i className="fas fa-info-circle"></i>
                    <strong>Eslatma:</strong> Barcha maydonlar to'ldirilishi shart. To'yxona qo'shilgandan so'ng, u admin tomonidan tasdiqlanishi kerak bo'ladi.
                </div>
            </div>
        </section>
    )
}

export default AddVenue