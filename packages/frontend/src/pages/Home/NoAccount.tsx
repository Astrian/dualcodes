import Icon from '@mdi/react'
import { mdiQrcodeScan, mdiAccountPlus } from '@mdi/js'
import RecoverSyncingDialog from './RecoverSyncingDialog'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

function NoAccount(props: { addAccount: () => void, refreshList: () => void }) {
	const { t } = useTranslation()

	const [presentRecoverSyncingDialog, setPresentRecoverSyncingDialog] = useState(true)
	return (<>
		<div className='flex flex-col gap-4'>
			<div className="text-2xl font-bold">{t('HOME_EMPTYSCREEN_TITLE')}</div>

			<div className='flex bg-white dark:bg-slate-800 p-2 gap-4 rounded-md shadow-sm items-center' onClick={() => setPresentRecoverSyncingDialog(true)}>
				<div>
					<Icon path={mdiQrcodeScan} size={1.5} />
				</div>
				<div>
					<div className='text-xl'>{t('HOME_EMPTYSCREEN_SYNC_TITLE')}</div>
					<div className='text-slate-500'>{t('HOME_EMPTYSCREEN_SYNC_DESC')}</div>
				</div>
			</div>

			<div className='flex bg-white dark:bg-slate-800 p-2 gap-4 rounded-md shadow-sm items-center' onClick={props.addAccount}>
				<div>
				<Icon path={mdiAccountPlus} size={1.5} />
				</div>
				<div>
					<div className='text-xl'>{t('HOME_EMPTYSCREEN_ADDACCOUNT_TITLE')}</div>
					<div className='text-slate-500'>{t('HOME_EMPTYSCREEN_ADDACCOUNT_DESC')}</div>
				</div>
			</div>
		</div>

		{ presentRecoverSyncingDialog && <RecoverSyncingDialog dismiss={() => setPresentRecoverSyncingDialog(false)} refreshList={props.refreshList} /> }
	</>)
}

export default NoAccount