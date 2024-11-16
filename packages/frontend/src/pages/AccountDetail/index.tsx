import PilledTable from '../../components/PilledTable'
import PilledTableCell from '../../components/PilledTableCell'
import { useEffect, useState } from 'react'
import Topbar from '../../components/Topbar'
import Icon from '@mdi/react'
import { mdiEye, mdiEyeOff } from '@mdi/js'
import syncToServer from '../../utils/syncToServer'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

function AccountDetail() {
	const {t} = useTranslation()

	const [websiteField, setWebsiteField] = useState('')
	const [nameField, setNameField] = useState('')
	const [secretField, setSecretField] = useState('')
	const [displaySecret, setDisplaySecret] = useState(false)
	const [accountId, setAccountId] = useState('')

	useEffect(() => {
		const id = window.location.pathname.split('/')[2]
		const accountsLS = localStorage.getItem('tfa_accounts')
		if (!accountsLS) return
		const accounts = JSON.parse(accountsLS) as Account[]
		const account = accounts.find(a => a.id === id)
		if (!account) return
		setWebsiteField(account.website)
		setNameField(account.name)
		setSecretField(account.secret)
		setAccountId(id)
	}, [])

	async function savechanges() {
		const accountsLS = localStorage.getItem('tfa_accounts')
		if (!accountsLS) return
		let accounts = JSON.parse(accountsLS) as Account[]
		console.log(accounts)
		for (let i in accounts) {
			console.log(accounts[i].id, accountId)
			if (accounts[i].id !== accountId) continue
			console.log('hit')
			const newAccountInfo = {
				id: accountId,
				website: websiteField,
				name: nameField,
				secret: secretField
			}
			accounts[i] = newAccountInfo
			localStorage.setItem('tfa_accounts', JSON.stringify(accounts))
			syncToServer()
			toast(t('ACCOUNTDETAIL_SAVEOPS_SUCCESS'), {type: 'success'})
			window.history.back()
			break
		}
	}

	async function deleteAccount() {
		if (!confirm(t('ACCOUNTDETAIL_DELOPS_CONFIRM'))) return
		const accountsLS = localStorage.getItem('tfa_accounts')
		if (!accountsLS) return
		const accounts = JSON.parse(accountsLS) as Account[]
		const newAccounts = accounts.filter(a => a.id !== accountId)
		localStorage.setItem('tfa_accounts', JSON.stringify(newAccounts))
		syncToServer()
		toast(t('ACCOUNTDETAIL_DELOPS_SUCCESS'), {type: 'success'})
		window.history.back()
	}

	return (<>
		<section className='mx-3 lg:w-2/3 lg:mx-auto'>
			<Topbar title={t('ACCOUNTDETAIL_TITLE')} />

			<PilledTable>
				<PilledTableCell>
					<div className="font-semibold">{t('ACCOUNTDETAIL_FIELDS_WEBSITE_TITLE')}</div>
					<div>
						<input type='text' className='w-full outline-none bg-transparent' placeholder='Awesome website' defaultValue={websiteField} onChange={e => setWebsiteField(e.target.value)} />
					</div>
				</PilledTableCell>

				<PilledTableCell>
					<div className="font-semibold">{t('ACCOUNTDETAIL_FIELDS_NAME_TITLE')}</div>
					<div>
						<input type='text' className='w-full outline-none bg-transparent' placeholder='John Appleseed' defaultValue={nameField} onChange={e => setNameField(e.target.value)} />
					</div>
				</PilledTableCell>

				<PilledTableCell>
					<div className="font-semibold">{t('ACCOUNTDETAIL_FIELDS_2FASECRECT_TITLE')}</div>
					<div className='flex'>
						<input type={displaySecret ? 'text' : 'password'} className='w-full outline-none bg-transparent' placeholder='ABCD 1234 ...' defaultValue={secretField} onChange={e => setSecretField(e.target.value)} />
						<button onClick={() => setDisplaySecret(!displaySecret)}>
							{displaySecret ? <Icon path={mdiEyeOff} size={1} /> : <Icon path={mdiEye} size={1} />}
						</button>
					</div>
				</PilledTableCell>
			</PilledTable>

			<PilledTable>
				<PilledTableCell>
					<button className='text-sky-500 w-full text-left dark:text-sky-300' onClick={savechanges}>{t('ACCOUNTDETAIL_OPSBTN_SAVE')}</button>
				</PilledTableCell>
				<PilledTableCell>
					<button className='text-red-500 w-full text-left dark:text-red-400' onClick={deleteAccount}>{t('ACCOUNTDETAIL_OPSBTN_DEL')}</button>
				</PilledTableCell>
			</PilledTable>
		</section>
	</>)
}

export default AccountDetail