// Google Ads & Analytics (gtag.js)
// Substitua 'AW-SEU_ID_GOOGLE_ADS' pelo seu ID de conversão real (ex.: AW-1234567890),
// obtido no painel do Google Ads, aqui e na tag <script src=".../gtag/js?id=..."> do index.html.
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());

var GOOGLE_ADS_ID = 'AW-SEU_ID_GOOGLE_ADS';

if (GOOGLE_ADS_ID && GOOGLE_ADS_ID !== 'AW-SEU_ID_GOOGLE_ADS') {
  gtag('config', GOOGLE_ADS_ID);
}

window.gtag_report_conversion = function (actionType) {
  if (typeof gtag === 'function' && GOOGLE_ADS_ID !== 'AW-SEU_ID_GOOGLE_ADS') {
    gtag('event', 'conversion', {
      'send_to': GOOGLE_ADS_ID,
      'event_category': 'Contato Google Ads',
      'event_label': actionType
    });
  }
};

// Rastreamento automático de cliques em links de WhatsApp e telefone
document.addEventListener('click', function (e) {
  var link = e.target && e.target.closest ? e.target.closest('a') : null;
  if (!link) return;
  var href = link.getAttribute('href') || '';
  if (href.indexOf('wa.me') !== -1) {
    window.gtag_report_conversion('whatsapp_click');
  } else if (href.indexOf('tel:') !== -1) {
    window.gtag_report_conversion('phone_call_click');
  }
});
