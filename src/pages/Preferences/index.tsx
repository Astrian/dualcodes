import Switch from "react-switch"
import { useState } from "react"
import InitialSyncingDialog from "./InitialSyncingDialog"

function Preferences() {
	const [syncing, setSyncing] = useState(false)
	const [presentInitialSyncingDialog, setPresentInitialSyncingDialog] = useState(true)

	function toggleSyncing() {
		if (syncing) {

		} else {
			setPresentInitialSyncingDialog(true)
		}
	}
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
							<div>Sync with another device</div>
							<div className="flex gap-2">
								<button className="bg-sky-500 px-2 py-1 rounded-md border-[1px] border-sky-600 text-white">Present syncing QR code</button>
								<button className="bg-slate-100 px-2 py-1 rounded-md border-[1px] border-slate-200">Mannually set</button>
							</div>
						</div>
						<div className="flex justify-between p-4">
							<div>Secure area</div>
							<div className="flex gap-2">
								<button className="bg-red-500 px-2 py-1 rounded-md border-[1px] border-red-600 text-white">Reset syncing secret</button>
								<button className="bg-slate-100 px-2 py-1 rounded-md border-[1px] border-slate-200">Change syncing passphrase</button>
							</div>
						</div>
					</>}
				</div>
			</div>
		</section>

		{presentInitialSyncingDialog && <InitialSyncingDialog dismiss={() => {setPresentInitialSyncingDialog(false)}} />}
	</>)
}
export default Preferences