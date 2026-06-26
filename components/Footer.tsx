export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-red-line" />

      <div className="footer-top" style={{ paddingTop: '80px' }}>
        {/* Brand */}
        <div>
          <div className="footer-brand">YOG<span>NA</span></div>
          <p style={{
            marginTop: '24px',
            fontSize: '13px',
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.5)',
            maxWidth: '280px'
          }}>
            India&apos;s premier corporate hygiene services provider. Automated, eco-friendly washroom systems for commercial establishments.
          </p>
        </div>

        {/* Products */}
        <div className="footer-col">
          <p className="footer-col-title">Products</p>
          <ul>
            <li><a href="#products">Touchless Dispensers</a></li>
            <li><a href="#products">Bio-Sanitizers</a></li>
            <li><a href="#products">Feminine Hygiene</a></li>
            <li><a href="#products">Air Care Systems</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <p className="footer-col-title">Contact</p>
          <ul>
            <li><a href="mailto:yogna09@gmail.com">yogna09@gmail.com</a></li>
            <li><a href="tel:+919176088989">+91 91760 88989</a></li>
            <li><a href="https://wa.me/919176088989" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div className="footer-col">
          <p className="footer-col-title">Info</p>
          <ul>
            <li><a href="#">About YOGNA</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms</a></li>
            <li><a href="#">Sustainability</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copy">© 2025 YOGNA Corporate Hygiene Solutions. All rights reserved.</p>
        <p className="footer-copy" style={{ opacity: 0.2 }}>Designed by TRIYO</p>
      </div>
    </footer>
  );
}
