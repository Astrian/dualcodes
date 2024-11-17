import Icon from '@mdi/react'
import { mdiClose } from '@mdi/js'
import QRCode from "react-qr-code"
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

function ConnectQRCodeDialog(props: {
	dismiss: () => void,
}) {
	const { t } = useTranslation()

	const [qrCode, setQRCode] = useState('')

	useEffect(() => {
		const qrCode = localStorage.getItem('tfa_sync')
		if (qrCode) setQRCode(qrCode)
	})

	async function copyCode() {
		await navigator.clipboard.writeText(btoa(encodeURIComponent(qrCode)))
	}

	return (<>
		<div className='z-20 fixed top-0 left-0 w-full h-full bg-black/40'>
			<div className='mx-3 lg:w-2/4 lg:mx-auto h-full flex justify-center items-center'>
				<div className='w-full border-[1px] border-gray-300 dark:border-gray-600 rounded-md'>
					<div className='bg-slate-300 dark:bg-slate-700 rounded-t-md p-2 flex justify-between'>
						<div className='font-bold text-xl'>{t('PREFERENCE_CONNECTDIALOG_TITLE')}</div>
						<button onClick={props.dismiss}><Icon path={mdiClose} size={1} /></button>
					</div>
					<div className='bg-white dark:bg-slate-800 p-2 rounded-b-md flex flex-col lg:flex-row items-center gap-4'>
						<div className='p-2 bg-white'>
							<QRCode value={qrCode} />
						</div>
						<div className='flex items-center justify-center text-center flex-col gap-2'>
							<div>{t('PREFERENCE_CONNECTDIALOG_GUIDE')}</div>
							<textarea className='w-full h-24 p-2 bg-yellow-100 font-mono border-[1px] border-yellow-400 rounded-md resize-none outline-none text-black' value={btoa(encodeURIComponent(qrCode))} readOnly onClick={() => {
								toast(t('PREFERENCE_CONNECTDIALOG_TEXTAREA_COPIED'), {type: 'info'})
								copyCode()
							}} />
							<div className='text-gray-500 text-sm'>{t('PREFERENCE_CONNECTDIALOG_CLICKTOCOPY')}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</>)
}

export default ConnectQRCodeDialog