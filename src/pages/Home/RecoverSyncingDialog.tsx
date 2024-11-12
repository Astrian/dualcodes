import Icon from '@mdi/react'
import { mdiClose } from '@mdi/js'
import axios from 'axios'
import { Scanner } from '@yudiel/react-qr-scanner'

function RecoverSyncingDialog(props: {
	dismiss: () => void,
	refreshList: () => void
}) {

	async function qrCodeEvent(result: {rawValue: string}[]) {
		const syncConfig = JSON.parse(result[0].rawValue) as { password: string, id: string, key: {
			alg: string,
			ext: boolean,
			k: string,
			key_ops: string[],
			kty: string
		} }
		console.log(syncConfig)
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
						<div className='font-bold text-xl'>Connect this device</div>
						<button onClick={props.dismiss}><Icon path={mdiClose} size={1} /></button>
					</div>
					<div className='bg-white p-2 rounded-b-md'>
						<Scanner onScan={result => qrCodeEvent(result)} />
					</div>
				</div>
			</div>
		</div>
	</>)
}

export default RecoverSyncingDialog