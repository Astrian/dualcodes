import Icon from '@mdi/react'
import { mdiClose } from '@mdi/js'
import axios from 'axios'
import { Scanner } from '@yudiel/react-qr-scanner'
import { useTranslation } from 'react-i18next'

function RecoverSyncingDialog(props: {
	dismiss: () => void,
	refreshList: () => void
}) {
	const { t } = useTranslation()
	async function qrCodeEvent(result: {rawValue: string}[]) {
		try {
			const syncConfig = await JSON.parse(result[0].rawValue) as { password: string, id: string, key: {
				alg: string,
				ext: boolean,
				k: string,
				key_ops: string[],
				kty: string
			} }
			console.log(syncConfig)
			await connect(syncConfig)
		} catch (e) {
			console.error(e)
		}
	}

	async function paste(e: React.ChangeEvent<HTMLTextAreaElement>) {
		console.log(e.target.value)
		// decode the base64 string
		try {
			const syncConfig = await JSON.parse(decodeURIComponent(atob(e.target.value))) as { password: string, id: string, key: {
				alg: string,
				ext: boolean,
				k: string,
				key_ops: string[],
				kty: string
			} }
			console.log(syncConfig)
			await connect(syncConfig)
		} catch (e) {
			console.error(e)
		}
	}

	async function connect(syncConfig: { password: string, id: string, key: {
		alg: string,
		ext: boolean,
		k: string,
		key_ops: string[],
		kty: string
	} }) {
		try {
			let response = await axios.post('/api/dualcodes/load', {
				callPwd: syncConfig.password,
				id: syncConfig.id
			})
			console.log(response.data)
			if (response.data.status !== "success") return
			localStorage.setItem('tfa_sync', JSON.stringify(syncConfig))
			props.refreshList()
			props.dismiss()
		} catch (e) {
			console.error(e)
		}
	}

	return (<>
		<div className='z-20 fixed top-0 left-0 w-full h-full bg-black/40'>
			<div className='mx-3 lg:w-2/4 lg:mx-auto h-full flex justify-center items-center'>
				<div className='w-full border-[1px] border-gray-300 rounded-md'>
					<div className='bg-slate-300 rounded-t-md p-2 flex justify-between'>
						<div className='font-bold text-xl'>{t('HOME_RECOVERDIALOG_TITLE')}</div>
						<button onClick={props.dismiss}><Icon path={mdiClose} size={1} /></button>
					</div>
					<div className='bg-white p-2 rounded-b-md flex lg:flex-row flex-col gap-4 items-center justify-center text-center'>
						<div className='max-w-60'>
							<Scanner onScan={result => qrCodeEvent(result)} />
						</div>
						<div className='flex-1 flex flex-col gap-2'>
							<div>{t('HOME_RECOVERDIALOG_GUIDE')}</div>
							<textarea className='w-full h-24 p-2 bg-yellow-100 font-mono border-[1px] border-yellow-400 rounded-md resize-none outline-none' placeholder={t('HOME_RECOVERDIALOG_CODEPLACEHOLDER')} onChange={paste} />
						</div>
					</div>
				</div>
			</div>
		</div>
	</>)
}

export default RecoverSyncingDialog