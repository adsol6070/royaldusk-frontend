import Banner from "@/components/Banner";
import ReveloLayout from "@/layout/ReveloLayout";

const Page = () => {
  return (
    <ReveloLayout>
      <Banner pageTitle={"Privacy Policy"} />

      <section className="py-100 rel z-1">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="policy-content text-light" style={{fontSize: "16px", lineHeight: "1.8" }}>
                
                <h4>1. Information We Collect</h4>
                <p style={{ color: "black"}}><strong>a. Personal Information:</strong> When you create an account or book a package, we may collect your full name, email, phone number, payment details, travel preferences, and login credentials.</p>
                <p style={{ color: "black"}}><strong>b. Non-Personal Information:</strong> This includes IP address, browser type, device info, and site usage data.</p>

                <h4>2. How We Use Your Information</h4>
                <p style={{ color: "black"}}>We use your data to manage accounts, confirm bookings, send updates or promotions, improve our services, and comply with legal obligations.</p>

                <h4>3. Sharing of Information</h4>
                <p style={{ color: "black"}}>We don’t sell your data. We may share it with trusted partners (like hotels or tour providers), payment processors, and legal authorities if required.</p>

                <h4>4. Cookies and Tracking Technologies</h4>
                <p style={{ color: "black"}}>Cookies help us remember your preferences and improve your experience. You can modify cookie settings in your browser.</p>

                <h4>5. Use of Camera and Photo Access</h4>
                <p style={{ color: "black"}}>Our mobile app may request access to your device’s camera or photo gallery for specific features such as uploading travel documents or profile pictures. This data is used only for its intended purpose and is not shared or stored without your explicit consent.</p>

                <h4>6. Use of Location Data</h4>
                <p style={{ color: "black"}}>Our mobile app may collect location data (GPS or network-based) to provide location-based travel recommendations, nearby tours, or region-specific content. Location access is optional and can be controlled through your device settings.</p>

                <h4>7. Account Management</h4>
                <p style={{ color: "black"}}>You can log in to view or update your account, log out anytime, or contact us at <a href="mailto:go@royaldusk.com">go@royaldusk.com</a> to request deletion.</p>

                <h4>8. Data Security</h4>
                <p style={{ color: "black"}}>We use SSL encryption, secure servers, and regular audits to keep your data safe.</p>

                <h4>9. Your Rights</h4>
                <p style={{ color: "black"}}>You may request access, correction, or deletion of your personal data. Contact us at <a href="mailto:go@royaldusk.com">go@royaldusk.com</a>.</p>

                <h4>10. Third-Party Links</h4>
                <p style={{ color: "black"}}>Our website or app may contain links to third-party websites. We are not responsible for their content or privacy practices.</p>

                <h4>11. Updates to This Policy</h4>
                <p style={{ color: "black"}}>This Privacy Policy may be updated. Check this page regularly for changes. Continued use implies agreement to the latest version.</p>

                <h4>12. Contact Us</h4>
                <p style={{ color: "black"}}>
                  <strong>Royal Dusk Tours FZCO</strong><br />
                  IFZA Business Park, Dubai<br />
                  Email: <a href="mailto:go@royaldusk.com">go@royaldusk.com</a><br />
                  Phone: +91 98763-49140
                </p>

              </div>
            </div>
          </div>
        </div>
      </section>
    </ReveloLayout>
  );
};

export default Page;
