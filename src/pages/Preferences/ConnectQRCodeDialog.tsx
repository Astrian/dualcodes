import Icon from '@mdi/react'
import { mdiClose } from '@mdi/js'
import QRCode from "react-qr-code"
import { useState, useEffect } from 'react'

function ConnectQRCodeDialog(props: {
	dismiss: () => void,
}) {
	const [qrCode, setQRCode] = useState('')

	useEffect(() => {
		const qrCode = localStorage.getItem('tfa_sync')
		if (qrCode) setQRCode(qrCode)
	})
	return (<>
		<div className='z-20 fixed top-0 left-0 w-full h-full bg-black/40'>
			<div className='mx-3 lg:w-2/4 lg:mx-auto h-full flex justify-center items-center'>
				<div className='w-full border-[1px] border-gray-300 rounded-md'>
					<div className='bg-slate-300 rounded-t-md p-2 flex justify-between'>
						<div className='font-bold text-xl'>Connect another device</div>
						<button onClick={props.dismiss}><Icon path={mdiClose} size={1} /></button>
					</div>
					<div className='bg-white p-2 rounded-b-md'>
						<QRCode value={qrCode} />
					</div>
				</div>
			</div>
		</div>
	</>)
}

export default ConnectQRCodeDialog