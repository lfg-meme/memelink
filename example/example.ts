import { getMetadata, getTransactionSignature } from './api';

// Example usage
(async () => {
  const metadataUrl = 'https://userplatform.com/trade/aa?acc=2';
  const metadata = await getMetadata(metadataUrl);
  if (metadata) {
    console.log('Metadata:', metadata);

    // Assuming there's an impulse with the href for the transaction
    const impulse = metadata.neuron.impulses.find(i => i.label === 'Buy hhhh');
    if (impulse) {
      const transaction = await getTransactionSignature(`https://userplatform.com${impulse.href}`, '0x1234567890abcdef');
      if (transaction) {
        console.log('Transaction Signature:', transaction);
      }
    }
  }
})();
