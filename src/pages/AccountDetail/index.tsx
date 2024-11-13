import PilledTable from '../../components/PilledTable'
import PilledTableCell from '../../components/PilledTableCell'
import { useEffect, useState } from 'react'
import Topbar from '../../components/Topbar'
import Icon from '@mdi/react'
import { mdiEye, mdiEyeOff } from '@mdi/js'
import syncToServer from '../../utils/syncToServer'

function AccountDetail() {
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
		const accounts = JSON.parse(accountsLS) as Account[]
		console.log(accounts)
		for (let i in accounts) {
			if (accounts[i].id !== accountId) continue
			accounts[i].website = websiteField
			accounts[i].name = nameField
			accounts[i].secret = secretField
			break
		}
		localStorage.setItem('tfa_accounts', JSON.stringify(accounts))
		syncToServer()
		window.history.back()
	}

	return (<>
		<section className='mx-3 lg:w-2/3 lg:mx-auto'>
			<Topbar title='Account Detail' />

			<PilledTable header='Account information'>
				<PilledTableCell>
					<div className="font-semibold">Website</div>
					<div>
						<input type='text' className='w-full outline-none' placeholder='Awesome website' defaultValue={websiteField} />
					</div>
				</PilledTableCell>

				<PilledTableCell>
					<div className="font-semibold">Account Name</div>
					<div>
						<input type='text' className='w-full outline-none' placeholder='John Appleseed' defaultValue={nameField} />
					</div>
				</PilledTableCell>

				<PilledTableCell>
					<div className="font-semibold">2FA Secret</div>
					<div className='flex'>
						<input type={displaySecret ? 'text' : 'password'} className='w-full outline-none' placeholder='Awesome website' defaultValue={secretField} />
						<button onClick={() => setDisplaySecret(!displaySecret)}>
							{displaySecret ? <Icon path={mdiEyeOff} size={1} /> : <Icon path={mdiEye} size={1} />}
						</button>
					</div>
				</PilledTableCell>
			</PilledTable>

			<PilledTable>
				<PilledTableCell>
					<button className='text-sky-500 w-full text-left' onClick={savechanges}>Save changes</button>
				</PilledTableCell>
				<PilledTableCell>
					<button className='text-red-500 w-full text-left'>Delete account</button>
				</PilledTableCell>
			</PilledTable>
		</section>
	</>)
}

export default AccountDetail