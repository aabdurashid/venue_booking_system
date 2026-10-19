import React from 'react'
import Search from '../components/Search'
import Venues from '../components/userComponents/Venues'

function Home() {
    return (
        <>
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">Hayotingizdagi eng muhim kunni biz bilan nishonlang</h1>
                    <p className="hero-subtitle">To'y marosimingiz uchun eng go'zal to'yxonalarni online bron qiling va unutilmas lahzalarga ega bo'ling.</p>
                    <div className="hero-buttons">
                        <a href="#search" className="btn btn-primary">To'y saroyini toping</a>
                        <a href="/xizmatlar" className="btn btn-outline">Xizmatlarimiz</a>
                    </div>
                </div>
            </section>
            <div className='dashboard-section'>
                <div className='container'>
                    <Venues />
                </div>
            </div>
        </>
    )
}

export default Home