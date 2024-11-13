import { useEffect, useState } from 'react'
import AccountCard from './AccountCard'
import AddAccountDialog from './AddAccountDialog'
import Icon from '@mdi/react'
import { mdiDotsVertical } from '@mdi/js'
import { Link } from 'react-router-dom'
import NoAccount from './NoAccount'
import loadFromServer from '../../utils/loadFromServer'
import { useTranslation } from 'react-i18next'

function App() {
	const [accounts, setAccounts] = useState([] as Account[])
	const [presentAddAccountDialog, setPresentAddAccountDialog] = useState(false)
	const [presentMenu, setPresentMenu] = useState(false)
	const [accountsNotExists, setAccountsNotExists] = useState(false)
	const [loading, setLoading] = useState(true)

	const { t } = useTranslation()

	async function reloadData() {
		try {
			await loadFromServer()
		} catch (e) {
			console.error(e)
		} finally {
			loadFromLocalStorage()
			setLoading(false)
		}
	}

	async function loadFromLocalStorage() {
		let tfaAccountsLS = localStorage.getItem('tfa_accounts')
		let tfaAccounts = [] as Account[]
		
		if (tfaAccountsLS) tfaAccounts = JSON.parse(tfaAccountsLS)
		else localStorage.setItem('tfa_accounts', JSON.stringify(tfaAccounts))

		let tagsLS = localStorage.getItem('tfa_tags')
		let tags = [] as Tag[]
		if (tagsLS) tags = JSON.parse(tagsLS)
		else localStorage.setItem('tfa_tags', JSON.stringify(tags))

		setAccounts(tfaAccounts)
		if (tfaAccounts.length === 0) setAccountsNotExists(true)
	}

	async function keywordFind(e: React.ChangeEvent<HTMLInputElement>) {
		const keyword = e.target.value
		if (keyword === '') {
			loadFromLocalStorage()
			return
		}
		const tfaAccountsLS = localStorage.getItem('tfa_accounts')
		if (!tfaAccountsLS) return
		const tfaAccounts = JSON.parse(tfaAccountsLS) as Account[]
		const filteredAccounts = tfaAccounts.filter(account => account.name.includes(keyword) || account.website.includes(keyword))
		setAccounts(filteredAccounts)
	}

	useEffect(() => {
		reloadData()
	}, [])
	return (<>
		{ loading && <>
			<div className='fixed top-0 left-0 w-full h-full bg-black/40 flex justify-center items-center'>
				<div className='bg-white dark:bg-slate-600 p-4 rounded-md shadow-lg'>
					<div className='text-xl font-bold'>{t('HOME_LOADING')}</div>
				</div>
			</div>
		</>}<section className='mx-3 lg:w-2/3 lg:mx-auto'>
			<div className='flex gap-2'>
				<div className='w-full my-4 shadow-md bg-white dark:bg-slate-600 border-[1px] dark:border-slate-500 rounded-full px-4 py-2'>
					<input placeholder={t('HOME_SEARCHBAR_PLACEHOLDER')} className='outline-none w-full dark:bg-slate-600' onChange={keywordFind} />
				</div>
				<div className='flex items-center justify-end'>
					<button onClick={() => setPresentMenu(!presentMenu)}><Icon path={mdiDotsVertical} size={1} /></button>
					{ presentMenu && <div className='absolute top-16 z-10 bg-white dark:bg-slate-600 shadow-lg rounded-md border-[1px] border-gray-200 dark:border-slate-500 min-w-40 py-2'>
						<ul>
							<li className='px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-500 cursor-pointer' onClick={() => {setPresentMenu(false); setPresentAddAccountDialog(true)}}>{t('HOME_MENU_ADDACCOUNT')}</li>
							<Link to="/preferences"><li className='px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-500 cursor-pointer'>{t('HOME_MENU_PREFERENCES')}</li></Link>
						</ul>
					</div> }
				</div>
			</div>
			{ accountsNotExists ? <NoAccount addAccount={() => setPresentAddAccountDialog(true)} refreshList={reloadData} />: <>
				<div className='lg:columns-4 lg:gap-2 columns-1'>
					{accounts.map((account) => (
						<div key={account.id} className='break-inside-avoid mb-2'>
							<AccountCard account={account} />
						</div>
					))}
					
				</div> 
				<div className='mt-4 text-center text-xl text-gray-500'>{t('HOME_ACCOUNTCOUNT', {count: accounts.length})}</div>
			</> }
			
		</section>

		{presentAddAccountDialog && <AddAccountDialog dismiss={() => {setPresentAddAccountDialog(false)}} refreshList={loadFromLocalStorage} />}
	</>)
}

export default App
