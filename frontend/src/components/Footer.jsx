import React from 'react'

function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-column">
                    <h3 className="footer-title">Bronline Hall</h3>
                    <p>To'y marosimlaringiz uchun eng yaxshi saroylarni online bron qilish xizmati. Biz bilan hayotingizdagi eng muhim kunni unutilmas qiling!</p>
                    <div className="footer-social">
                        <a href="#" className="social-link"><i className="fab fa-facebook-f"></i></a>
                        <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
                        <a href="#" className="social-link"><i className="fab fa-telegram"></i></a>
                        <a href="#" className="social-link"><i className="fab fa-youtube"></i></a>
                    </div>
                </div>
                <div className="footer-column">
                    <h3 className="footer-title">Foydali havolalar</h3>
                    <ul className="footer-links">
                        <li><a href="saroylar.html" className="footer-link">Barcha saroylar</a></li>
                        <li><a href="xizmatlar.html" className="footer-link">Xizmatlar</a></li>
                        <li><a href="galereya.html" className="footer-link">Galereya</a></li>
                        <li><a href="biz-haqimizda.html" className="footer-link">Biz haqimizda</a></li>
                        <li><a href="faq.html" className="footer-link">Ko'p so'raladigan savollar</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3 className="footer-title">Aloqa</h3>
                    <div className="footer-contact">
                        <div className="contact-item">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>Toshkent sh., Amir Temur ko'chasi, 108-uy</span>
                        </div>
                        <div className="contact-item">
                            <i className="fas fa-phone"></i>
                            <span>+998 90 123 45 67</span>
                        </div>
                        <div className="contact-item">
                            <i className="fas fa-envelope"></i>
                            <span>info@bronline_hall.uz</span>
                        </div>
                        <div className="contact-item">
                            <i className="fas fa-clock"></i>
                            <span>Dushanba - Shanba: 9:00 - 18:00</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2025 Bronline Hall. Barcha huquqlar himoyalangan.</p>
            </div>
        </footer>
    )
}

export default Footer