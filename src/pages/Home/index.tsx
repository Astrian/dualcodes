import { useEffect, useState } from 'react'
import AccountCard from './AccountCard'
import AddAccountDialog from './AddAccountDialog'
import Icon from '@mdi/react'
import { mdiDotsVertical } from '@mdi/js'
import { Link } from 'react-router-dom'
import NoAccount from './NoAccount'
import loadFromServer from '../../utils/loadFromServer'

function App() {
	const [accounts, setAccounts] = useState([] as Account[])
	const [presentAddAccountDialog, setPresentAddAccountDialog] = useState(false)
	const [presentMenu, setPresentMenu] = useState(false)

	async function reloadData() {
		loadFromLocalStorage()
		try {
			await loadFromServer()
			loadFromLocalStorage()
		} catch (e) {
			console.error(e)
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
	}

	useEffect(() => {
		reloadData()
	}, [])
	return (<>
		<section className='mx-3 lg:w-2/3 lg:mx-auto'>
			<div className='flex gap-2'>
				<div className='w-full my-4 shadow-md bg-white border-[1px] rounded-full px-4 py-2'>
					<input placeholder='Search my account...' className='outline-none w-full' />
				</div>
				<div className='flex items-center justify-end'>
					<button onClick={() => setPresentMenu(!presentMenu)}><Icon path={mdiDotsVertical} size={1} /></button>
					{ presentMenu && <div className='absolute top-16 z-10 bg-white shadow-lg rounded-md border-[1px] border-gray-200 min-w-40 py-2'>
						<ul>
							<li className='px-4 py-2 hover:bg-slate-100 cursor-pointer' onClick={() => {setPresentMenu(false); setPresentAddAccountDialog(true)}}>Add an account</li>
							<Link to="/preferences"><li className='px-4 py-2 hover:bg-slate-100 cursor-pointer'>Preferences</li></Link>
						</ul>
					</div> }
				</div>
			</div>
			{ accounts.length > 0 ?<>
				<div className='lg:columns-4 lg:gap-2 columns-1'>
					{accounts.map((account) => (
						<div key={account.id} className='break-inside-avoid mb-2'>
							<AccountCard account={account} />
						</div>
					))}
					
				</div> 
				<div className='mt-4 text-center text-xl text-gray-500'>{accounts.length} accounts</div>
			</>: <NoAccount addAccount={() => setPresentAddAccountDialog(true)} refreshList={reloadData} /> }
			
		</section>

		{presentAddAccountDialog && <AddAccountDialog dismiss={() => {setPresentAddAccountDialog(false)}} refreshList={loadFromLocalStorage} />}
	</>)
}

export default App
