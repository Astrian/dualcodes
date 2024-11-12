import Icon from '@mdi/react'
import { mdiQrcodeScan, mdiAccountPlus } from '@mdi/js'
import RecoverSyncingDialog from './RecoverSyncingDialog'
import { useState } from 'react'

function NoAccount(props: { addAccount: () => void, refreshList: () => void }) {
	const [presentRecoverSyncingDialog, setPresentRecoverSyncingDialog] = useState(false)
	return (<>
		<div className='flex flex-col gap-4'>
			<div className="text-2xl font-bold">Getting start</div>

			<div className='flex bg-white p-2 gap-4 rounded-md shadow-sm items-center' onClick={() => setPresentRecoverSyncingDialog(true)}>
				<div>
					<Icon path={mdiQrcodeScan} size={1.5} />
				</div>
				<div>
					<div className='text-xl'>Sync my data from server</div>
					<div className='text-slate-500'>I already using DualCodes and have syncing data on the server</div>
				</div>
			</div>

			<div className='flex bg-white p-2 gap-4 rounded-md shadow-sm items-center' onClick={props.addAccount}>
				<div>
				<Icon path={mdiAccountPlus} size={1.5} />
				</div>
				<div>
					<div className='text-xl'>Add my first account</div>
					<div className='text-slate-500'>This is my first time to use DualCodes</div>
				</div>
			</div>
		</div>

		{ presentRecoverSyncingDialog && <RecoverSyncingDialog dismiss={() => setPresentRecoverSyncingDialog(false)} refreshList={props.refreshList} /> }
	</>)
}

export default NoAccount