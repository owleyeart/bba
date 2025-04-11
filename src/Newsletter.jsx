import React, { useEffect } from 'react';
import './Newsletter.css'; 
import Header from './Header';

function Newsletter() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://groot.mailerlite.com/js/w/webforms.min.js?v176e10baa5e7ed80d35ae235be3d5024';
    script.type = 'text/javascript';
    script.defer = true;
    document.body.appendChild(script);

    const recaptchaScript = document.createElement('script');
    recaptchaScript.src = 'https://www.google.com/recaptcha/api.js';
    recaptchaScript.async = true;
    recaptchaScript.defer = true;
    document.body.appendChild(recaptchaScript);
  }, []);

  return (
    <>
    <Header />
    <div className="newsletter-page">
    <div className="newsletter-overlay">
    <div className="newsletter-container">
    <div className="ml-embedded" data-form="wpne7G"></div>
    <div id="mlb2-24393855" className="ml-form-embedContainer ml-subscribe-form ml-subscribe-form-24393855">
      <div className="ml-form-align-center">
        <div className="ml-form-embedWrapper embedForm">
          <div className="ml-form-embedBody ml-form-embedBodyDefault row-form">
            <div className="ml-form-embedContent">
              <h4>Newsletter</h4>
              <p>Signup for news and special offers!</p>
            </div>
            <form className="ml-block-form" action="https://assets.mailerlite.com/jsonp/1410242/forms/150588775109494323/subscribe" method="post" target="_blank">
              <div className="ml-form-formContent">
                <div className="ml-form-fieldRow ml-last-item">
                  <div className="ml-field-group ml-field-email ml-validate-email ml-validate-required">
                    <input
                      aria-label="email"
                      aria-required="true"
                      type="email"
                      className="form-control"
                      name="fields[email]"
                      placeholder="Email"
                      autoComplete="email"
                    />
                  </div>
                </div>
              </div>
              <div className="ml-form-checkboxRow ml-validate-required">
                <label className="checkbox">
                  <input type="checkbox" />
                  <div className="label-description">
                    <p>Opt in to receive news and updates.</p>
                  </div>
                </label>
              </div>
              <div className="ml-form-recaptcha ml-validate-required" style={{ float: 'left', marginBottom: '20px' }}>
                <div className="g-recaptcha" data-sitekey="6Lf1KHQUAAAAAFNKEX1hdSWCS3mRMv4FlFaNslaD"></div>
              </div>
              <input type="hidden" name="ml-submit" value="1" />
              <div className="ml-form-embedSubmit">
                <button type="submit" className="primary">Subscribe</button>
                <button disabled style={{ display: 'none' }} type="button" className="loading">
                  <div className="ml-form-embedSubmitLoad"></div>
                  <span className="sr-only">Loading...</span>
                </button>
              </div>
              <input type="hidden" name="anticsrf" value="true" />
            </form>
          </div>
          <div className="ml-form-successBody row-success" style={{ display: 'none' }}>
            <div className="ml-form-successContent">
              <h4>Thank you!</h4>
              <p>You have successfully joined our subscriber list.</p>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
      </div>
      </div>
</>
  );
}

export default Newsletter;
