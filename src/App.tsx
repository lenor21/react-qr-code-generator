import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import QRCode from 'qrcode';
import defaultQRCode from './assets/img/qr.png';

const App = () => {
  const [qrCode, setQrCode] = useState('');
  const [input, setInput] = useState('');

  const handleGenerateQrCode = () => {
    let timerInterval: NodeJS.Timeout;
    Swal.fire({
      title: 'Generating QR code!',
      timer: 2000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();

        const popup = Swal.getPopup();

        if (popup) {
          const timer = popup.querySelector('b');

          if (timer) {
            timerInterval = setInterval(() => {
              timer.textContent = `${Swal.getTimerLeft()}`;
            }, 100);
          }
        }
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      /* Read more about handling dismissals below */
      if (result.dismiss === Swal.DismissReason.timer) {
        QRCode.toDataURL(input, {
          errorCorrectionLevel: 'H',
          margin: 1,
          scale: 10,
        })
          .then(setQrCode)
          .catch((err) => {
            console.error('Error generating QR code:', err);
          });
      }
    });
  };

  const inputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    console.log(input);
  }, [input]);

  return (
    <div className='grid place-items-center min-h-screen p-4'>
      <div className='card lg:card-side bg-base-100 shadow-lg overflow-hidden'>
        <div className='w-full md:w-[24rem] p-5 lg:p-0 bg-slate-100 grid place-items-center'>
          <img
            className={`w-[85%] ${qrCode ? qrCode : 'opacity-20'}`}
            id='image'
            src={`${qrCode ? qrCode : defaultQRCode}`}
            alt='Generated QR Code'
          />
        </div>

        <div className='flex flex-col p-6 gap-y-3 md:gap-y-4'>
          <h1 className='text-2xl font-semibold my-1 md:my-4'>
            QR Code Generator
          </h1>
          <p>Click the generate button to display your QR code.</p>
          <textarea
            onChange={inputChange}
            className='textarea w-full resize-none h-28'
            placeholder='Enter text here'></textarea>

          <button
            onClick={handleGenerateQrCode}
            className='btn btn-neutral w-full'
            disabled={input && input.trim() !== '' ? false : true}>
            Generate
          </button>

          <a
            href={qrCode}
            download={`${input}.png`}
            className={`btn btn-success w-full ${
              qrCode ? '' : 'pointer-events-none opacity-30'
            }`}>
            Download
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
