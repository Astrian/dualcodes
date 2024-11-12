import Switch from "react-switch"
import { useState, useEffect } from "react"
import InitialSyncingDialog from "./InitialSyncingDialog"
import ConnectQRCodeDialog from "./ConnectQRCodeDialog"

function Preferences() {
	const [syncing, setSyncing] = useState(false)
	const [presentInitialSyncingDialog, setPresentInitialSyncingDialog] = useState(false)
	const [presentQRCodeDialog, setPresentQRCodeDialog] = useState(false)

	function toggleSyncing() {
		if (syncing) {
			// show dialog warn user that need to reset the local data to re-enable syncing
		} else {
			setPresentInitialSyncingDialog(true)
		}
	}

	async function launchSyncing() {
		setSyncing(true)
	}

	useEffect(() => {
		let secret = localStorage.getItem('tfa_sync')
		if (secret) setSyncing(true)
	}, [])

	return(<>
		<section className='mx-3 lg:w-2/3 lg:mx-auto mt-4'>
			<div className="text-4xl font-bold">Preferences</div>
			<div className="rounded-md border-[1px] border-slate-300 mt-4">
				<div className="p-4 bg-slate-300 font-bold rounded-t-md">Syncing</div>
				<div className="bg-white rounded-b-md">
					<div className="flex justify-between p-4">
						<div>Enable</div>
						<Switch onChange={toggleSyncing} checked={syncing} />
					</div>

					{syncing && <>
						<div className="flex justify-between p-4">
							<div>Connect a new device</div>
							<div className="flex gap-2">
								<button className="bg-sky-500 px-2 py-1 rounded-md border-[1px] border-sky-600 text-white" onClick={() => setPresentQRCodeDialog(true)}>Present connect QR code</button>
								<button className="bg-slate-100 px-2 py-1 rounded-md border-[1px] border-slate-200">Mannually set</button>
							</div>
						</div>
						<div className="flex justify-between p-4">
							<div>Secure area</div>
							<div className="flex gap-2">
								<button className="bg-red-500 px-2 py-1 rounded-md border-[1px] border-red-600 text-white">Reset syncing secret</button>
								<button className="bg-slate-100 px-2 py-1 rounded-md border-[1px] border-slate-200">Change syncing password</button>
							</div>
						</div>
					</>}
				</div>
			</div>
		</section>

		{presentInitialSyncingDialog && <InitialSyncingDialog dismiss={() => {setPresentInitialSyncingDialog(false)}} launchSyncing={launchSyncing} />}

		{presentQRCodeDialog && <ConnectQRCodeDialog dismiss={() => {setPresentQRCodeDialog(false)}} />}
	</>)
}
export default Preferences