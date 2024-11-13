import Switch from "react-switch"
import { useState, useEffect } from "react"
import InitialSyncingDialog from "./InitialSyncingDialog"
import ConnectQRCodeDialog from "./ConnectQRCodeDialog"
import Topbar from "../../components/Topbar"
import PilledTable from "../../components/PilledTable"
import PilledTableCell from "../../components/PilledTableCell"
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import loadFromServer from "../../utils/loadFromServer"
import syncToServer from "../../utils/syncToServer"
import { useTranslation } from "react-i18next"

dayjs.extend(relativeTime)

function Preferences() {
	const { t } = useTranslation()

	const [syncing, setSyncing] = useState(false)
	const [presentInitialSyncingDialog, setPresentInitialSyncingDialog] = useState(false)
	const [presentQRCodeDialog, setPresentQRCodeDialog] = useState(false)
	const [fetchFromServerTimeStamp, setFetchFromServerTimeStamp] = useState(0)
	const [updateToServerTimeStamp, setUpdateToServerTimeStamp] = useState(0)
	const [syncId, setSyncId] = useState('')

	function toggleSyncing() {
		if (syncing) {
			if (!confirm(t("PREFERENCE_TURNOFFSYNCINGWARN"))) return

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
			<Topbar title={t('PREFERENCE_TITLE')} />

			<PilledTable header={t('PREFERENCE_SYNCING_TITLE')}>
			<PilledTableCell>
					<div className="font-semibold">{t('PREFERENCE_SYNCING_FEATURESWITCH_TITLE')}</div>
					<div className="flex items-center gap-3">
						<Switch checked={syncing} onChange={toggleSyncing} />
						<span>{ syncing ? t('PREFERENCE_SYNCING_FEATURESWITCH_ON') : t('PREFERENCE_SYNCING_FEATURESWITCH_OFF') }</span>
					</div>
				</PilledTableCell>

				{syncing && <>
					<PilledTableCell>
						<div className="font-semibold">{t('PREFERENCE_SYNCING_ID_TITLE')}</div>
						<div className="flex flex-col">
							<div>{syncId}</div>
						</div>
					</PilledTableCell>

					<PilledTableCell>
						<div className="font-semibold">{t('PREFERENCE_SYNCING_TIME_TITLE')}</div>
						<div className="flex flex-col">
							<div>{fetchFromServerTimeStamp === 0 ? t('PREFERENCE_SYNCING_TIME_FETCH_NEVER') : t('PREFERENCE_SYNCING_TIME_FETCH', { text: dayjs(fetchFromServerTimeStamp).fromNow() })}</div>
							<div>{updateToServerTimeStamp === 0 ? t('PREFERENCE_SYNCING_TIME_PUSH_NEVER') : t('PREFERENCE_SYNCING_TIME_PUSH', { text: dayjs(updateToServerTimeStamp).fromNow() })}</div>
						</div>
					</PilledTableCell>

					<PilledTableCell>
						<button className="w-full text-left" onClick={() => setPresentQRCodeDialog(true)}>
							<div className="text-sky-500">{t('PREFERENCE_CONNECTNEWDEVICE')}</div>
						</button>
					</PilledTableCell>

					<PilledTableCell>
						<button className="w-full text-left" onClick={async () => {
							try {
								await loadFromServer()
								setFetchFromServerTimeStamp(Date.now())
							} catch (e) {}
						}}>
							<div className="text-sky-500">{t('PREFERENCE_FORCEFETCH')}</div>
							<div className="text-sm text-sky-500/80">{t('PREFERENCE_FORCEFETCH_DESC')}</div>
						</button>
					</PilledTableCell>

					<PilledTableCell>
						<button className="w-full text-left" onClick={async () => {
							try {
								await syncToServer()
								setUpdateToServerTimeStamp(Date.now())
							} catch (e) {}
						}}>
							<div className="text-sky-500">{t('PREFERENCE_FORCEPUSH')}</div>
							<div className="text-sm text-sky-500/80">{t('PREFERENCE_FORCEPUSH_DESC')}</div>
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