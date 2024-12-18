import Icon from '@mdi/react'
import { mdiClose } from '@mdi/js'
import { useState } from 'react'
import axios from 'axios'
import {v4 as uuidv4} from 'uuid'
import { useTranslation } from 'react-i18next'

function InitialSyncingDialog(props: { dismiss: () => void, launchSyncing: () => void }) {
	const { t } = useTranslation()
	const [password, setPassword] = useState('')

	async function exec() {
		const key = await generateKey()
		const exportedKey = await crypto.subtle.exportKey("jwk", key)
		
		const iv = crypto.getRandomValues(new Uint8Array(12))

		let accountsLS = localStorage.getItem('tfa_accounts')
		if (!accountsLS) {
			localStorage.setItem('tfa_accounts', JSON.stringify([]))
			accountsLS = '[]'
		}
		const accounts = JSON.parse(accountsLS)

		let tagsLS = localStorage.getItem('tfa_tags')
		if (!tagsLS) {
			localStorage.setItem('tfa_tags', JSON.stringify([]))
			tagsLS = '[]'
		}
		const tags = JSON.parse(tagsLS)

		const data = {
			accounts: accounts,
			tags: tags
		}
		const dataString = JSON.stringify(data)

		const encrypted = await crypto.subtle.encrypt(
			{
				name: "AES-GCM",
				iv: iv
			},
			key,
			new TextEncoder().encode(dataString)
		)
		
		// transfer iv and encrypted data to base64
		const ivBase64 = btoa(String.fromCharCode(...iv))
		const encryptedBase64 = btoa(String.fromCharCode(...new Uint8Array(encrypted)))
		console.log(ivBase64)
		console.log(encryptedBase64)

		// generate server userid
		const id = uuidv4()

		// send to server
		try {
			await axios.post('/api/dualcodes/save', {
				callPwd: password,
				id,
				data: JSON.stringify({
					iv: ivBase64,
					data: encryptedBase64
				})
			})

			// storage key into local storage
			const syncConfig = {
				key: exportedKey,
				id,
				password
			}
			localStorage.setItem('tfa_sync', JSON.stringify(syncConfig))

			// update syncing time
			localStorage.setItem('tfa_synctime', JSON.stringify({
				toServer: Date.now(),
				fromServer: 0
			}))

			// update sync time
			const lastSyncTimeLS = localStorage.getItem('tfa_synctime')
			const lastSyncTime = JSON.parse(lastSyncTimeLS ?? `{"toServer":0,"fromServer":0}`) as { toServer: number, fromServer: number }
			lastSyncTime.toServer = Date.now()
			localStorage.setItem('tfa_synctime', JSON.stringify(lastSyncTime))

			// dismiss dialog
			props.dismiss()
			props.launchSyncing()
		} catch (e) {
			console.error(e)
			alert('Failed to enable syncing feature')
		}
	}

	return (<>
		<div className='z-20 fixed top-0 left-0 w-full h-full bg-black/40'>
			<div className='mx-3 lg:w-2/4 lg:mx-auto h-full flex justify-center items-center'>
				<div className='w-full border-[1px] border-gray-300 dark:border-gray-600 rounded-md'>
					<div className='bg-slate-300 dark:bg-slate-700 rounded-t-md p-2 flex justify-between'>
						<div className='font-bold text-xl'>{t('PREFERENCE_INITIALSYNCDIALOG_TITLE')}</div>
					<button onClick={props.dismiss}><Icon path={mdiClose} size={1} /></button>
					</div>
					<div className='bg-white dark:bg-slate-800 p-2 rounded-b-md flex flex-col gap-2'>
						<div className='flex flex-col gap-2'>
							<p>{t('PREFERENCE_INITIALSYNCDIALOG_P1')}</p>
							<p>{t('PREFERENCE_INITIALSYNCDIALOG_P2')}</p>
						</div>
						<input placeholder={t('PREFERENCE_INITIALSYNCDIALOG_PASSWORDPLACEHOLDER')} className='outline-none flex-1 shadow-inner border-[1px] border-slate-200 dark:border-slate-700 dark:bg-slate-800 px-2 py-1 rounded-md' required type="password" onChange={e => setPassword(e.target.value)} />
						<div className='flex flex-row-reverse'>
							<button className='bg-sky-500 dark:bg-sky-800 border-[1px] border-sky-600 dark:border-sky-700 text-white px-2 py-1 rounded-md active:shadow-inner active:bg-sky-600 dark:active:bg-sky-900 disabled:opacity-50 disabled:cursor-not-allowed' disabled={password === ""} onClick={exec}>{t('PREFERENCE_INITIALSYNCDIALOG_ENABLEBTN')}</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</>)
}
export default InitialSyncingDialog

async function generateKey() {
	return await crypto.subtle.generateKey(
		{
			name: "AES-GCM",
			length: 256,
		},
		true,
		["encrypt", "decrypt"]
	);
}