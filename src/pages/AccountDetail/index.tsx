import Icon from '@mdi/react'
import { mdiArrowLeft } from '@mdi/js'
import PilledTable from '../../components/PilledTable'
import PilledTableCell from '../../components/PilledTableCell'
import { useEffect, useState } from 'react'

function AccountDetail() {
	const [account, setAccount] = useState({} as Account)
	const [websiteField, setWebsiteField] = useState('')
	const [nameField, setNameField] = useState('')
	const [secretField, setSecretField] = useState('')
	const [displaySecret, setDisplaySecret] = useState('')

	useEffect(() => {
		const id = window.location.pathname.split('/')[2]
		const accountsLS = localStorage.getItem('tfa_accounts')
		if (!accountsLS) return
		const accounts = JSON.parse(accountsLS) as Account[]
		const account = accounts.find(a => a.id === id)
		if (!account) return
		setAccount(account)
		setWebsiteField(account.website)
		setNameField(account.name)
		setSecretField(account.secret)
	}, [])

	async function returnToLastPage() {
		window.history.back()
	}
	return (<>
		<section className='mx-3 lg:w-2/3 lg:mx-auto'>
			<div>
				<div className='flex items-center my-4 gap-2'>
					<button onClick={returnToLastPage}>
						<Icon path={mdiArrowLeft} size={1} />
					</button>
					<div className='text-xl font-bold'>Account detail</div>
				</div>
			</div>

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
					<div>
						<input type='text' className='w-full outline-none' placeholder='Awesome website' defaultValue={secretField} />
						<button></button>
					</div>
				</PilledTableCell>
			</PilledTable>
		</section>
	</>)
}

export default AccountDetail