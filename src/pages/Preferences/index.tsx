import Switch from "react-switch"
import { useState, useEffect } from "react"
import InitialSyncingDialog from "./InitialSyncingDialog"
import ConnectQRCodeDialog from "./ConnectQRCodeDialog"
import Topbar from "../../components/Topbar"
import PilledTable from "../../components/PilledTable"
import PilledTableCell from "../../components/PilledTableCell"
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

function Preferences() {
	const [syncing, setSyncing] = useState(false)
	const [presentInitialSyncingDialog, setPresentInitialSyncingDialog] = useState(false)
	const [presentQRCodeDialog, setPresentQRCodeDialog] = useState(false)
	const [fetchFromServerTimeStamp, setFetchFromServerTimeStamp] = useState(0)
	const [updateToServerTimeStamp, setUpdateToServerTimeStamp] = useState(0)
	const [syncId, setSyncId] = useState('')

	function toggleSyncing() {
		if (syncing) {
			if (!confirm('The data in this browser will remain, but will not be sync with the data on server.')) return

			// remove sync config
			localStorage.removeItem('tfa_sync')
			localStorage.removeItem('tfa_synctime')

			// turn off syncing
			setSyncing(false)
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
		setFetchFromServerTimeStamp(JSON.parse(localStorage.getItem('tfa_synctime') || `{ "fromServer": 0, "toServer": 0 }`).fromServer)
		setUpdateToServerTimeStamp(JSON.parse(localStorage.getItem('tfa_synctime') || `{ "fromServer": 0, "toServer": 0 }`).toServer)
		setSyncId(JSON.parse(localStorage.getItem('tfa_sync') || `{ "id": "" }`).id)
	}, [])

	return(<>
		<section className='mx-3 lg:w-2/3 lg:mx-auto mt-4'>
			<Topbar title='Preferences' />

			<PilledTable header='Syncing'>
			<PilledTableCell>
					<div className="font-semibold">Syncing feature</div>
					<div className="flex items-center gap-3">
						<Switch checked={syncing} onChange={toggleSyncing} />
						<span>{ syncing ? "On" : "Off" }</span>
					</div>
				</PilledTableCell>

				{syncing && <>
					<PilledTableCell>
						<div className="font-semibold">Sync ID</div>
						<div className="flex flex-col">
							<div>{syncId}</div>
						</div>
					</PilledTableCell>

					<PilledTableCell>
						<div className="font-semibold">Sync status</div>
						<div className="flex flex-col">
							<div>Last fetch from server operation: {fetchFromServerTimeStamp === 0 ? 'Never' : dayjs(fetchFromServerTimeStamp).fromNow()}</div>
							<div>Last server overwriting in current browser: {updateToServerTimeStamp === 0 ? 'Never' : dayjs(updateToServerTimeStamp).fromNow()}</div>
						</div>
					</PilledTableCell>

					<PilledTableCell>
						<button className="w-full text-left">
							<div className="text-sky-500">Connect a new device</div>
						</button>
					</PilledTableCell>

					<PilledTableCell>
						<button className="w-full text-left">
							<div className="text-sky-500">Force fetch from server</div>
							<div className="text-sm text-sky-500/80">Will overwrite data on your current browser.</div>
						</button>
					</PilledTableCell>

					<PilledTableCell>
						<button className="w-full text-left">
							<div className="text-sky-500">Force overwrite server data</div>
							<div className="text-sm text-sky-500/80">Replace server data with the data in current browser.</div>
						</button>
					</PilledTableCell>
				</>}
			</PilledTable>
		</section>

		{presentInitialSyncingDialog && <InitialSyncingDialog dismiss={() => {setPresentInitialSyncingDialog(false)}} launchSyncing={launchSyncing} />}

		{presentQRCodeDialog && <ConnectQRCodeDialog dismiss={() => {setPresentQRCodeDialog(false)}} />}
	</>)
}
export default Preferences