fetch('http://localhost:5173/solicita-oferta')
  .then(r => r.text())
  .then(t => {
    const title = t.match(/<title>(.*?)<\/title>/);
    console.log('Page title:', title ? title[1] : 'Not found');
    console.log('Contains Solicită:', t.includes('Solicită'));
    console.log('Page loads:', t.includes('<!DOCTYPE html'));
  })
  .catch(err => console.error('Error:', err));
