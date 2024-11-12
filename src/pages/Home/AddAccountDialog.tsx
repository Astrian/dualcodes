import { v4 as uuidv4 } from 'uuid'
import Icon from '@mdi/react'
import { mdiClose } from '@mdi/js'

function AddAccountDialog(props: {
	dismiss: () => void,
	refreshList: () => void
}) {
	async function addAccount(event: React.FormEvent) {
		event.preventDefault()
		const target = event.currentTarget as HTMLFormElement
		const websiteName = (target.elements[0] as HTMLInputElement).value
		const accountName = (target.elements[1] as HTMLInputElement).value
		const account2FASecret = (target.elements[2] as HTMLInputElement).value.replace(/\s/g,'')
		
		let tfaAccountsLS = localStorage.getItem('tfa_accounts')
		let tfaAccounts = [] as Account[]
		if (tfaAccountsLS) tfaAccounts = JSON.parse(tfaAccountsLS)
		
		tfaAccounts.push({
			id: uuidv4(),
			website: websiteName,
			name: accountName,
			secret: account2FASecret
		})

		localStorage.setItem('tfa_accounts', JSON.stringify(tfaAccounts))

		props.refreshList()
		props.dismiss()
	}

	return (<>
		<div className='z-20 fixed top-0 left-0 w-full h-full bg-black/40'>
			<div className='mx-3 lg:w-2/4 lg:mx-auto h-full flex justify-center items-center'>
				<div className='w-full border-[1px] border-gray-300 rounded-md'>
					<div className='bg-slate-300 rounded-t-md p-2 flex justify-between'>
						<div className='font-bold text-xl'>Add new 2FA account</div>
						<button onClick={props.dismiss}><Icon path={mdiClose} size={1} /></button>
					</div>
					<div className='bg-white p-2 rounded-b-md'>
						<form className='flex flex-col' onSubmit={addAccount}>
							<div className='flex border-b-[1px] border-gray-200 py-2'>
								<div className='font-bold'>Website name</div>
								<input placeholder="Awsome website" className='outline-none text-right flex-1' required />
							</div>
							<div className='flex border-b-[1px] border-gray-200 py-2'>
								<div className='font-bold'>Account name</div>
								<input placeholder="John Appleseed" className='outline-none text-right flex-1' required />
							</div>
							<div className='flex border-b-[1px] border-gray-200 py-2'>
								<div className='font-bold'>2FA secret</div>
								<input placeholder="ABCD 1234 ..." className='outline-none text-right flex-1' required />
							</div>
							<div className='flex py-2'>
								<div className='flex-1' />
								<button type="submit" className='bg-sky-500 text-white px-4 py-2 rounded-md border-[1px] border-sky-600 active:shadow-inner active:bg-sky-600'>Add account</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	</>)
}

export default AddAccountDialog