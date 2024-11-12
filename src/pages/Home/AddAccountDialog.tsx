import { v4 as uuidv4 } from 'uuid'
import Icon from '@mdi/react'
import { mdiClose } from '@mdi/js'
import axios from 'axios'
import { useState } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'

function AddAccountDialog(props: {
	dismiss: () => void,
	refreshList: () => void
}) {
	const [mode, setMode] = useState(0)

	async function qrCodeEvent(result: {rawValue: string}[]) {
		// parse the QR code result
		console.log(result[0].rawValue)

		// beginning with otpauth://totp/
		if (!result[0].rawValue.startsWith('otpauth://totp/')) return

		// extract the parameters
		const paramsArray = result[0].rawValue.split('?')[1].split('&')
		const params: { secret: string, issuer?: string, account?: string } = {secret: ''}
		paramsArray.forEach(p => {
			const [key, value] = p.split('=')
			if (key === 'secret') params.secret = value
			if (key === 'issuer') params.issuer = decodeURIComponent(value)
			if (key === 'account') params.account = decodeURIComponent(value)
		})
		if (!params.issuer) {
			const issuer = result[0].rawValue.split('?')[0].split('otpauth://totp/')[1].split(':')[0]
			params.issuer = decodeURIComponent(issuer)
		}
		if (!params.account) {
			const account = result[0].rawValue.split('?')[0].split('otpauth://totp/')[1].split(':')[1]
			params.account = decodeURIComponent(account)
		}
		
		addAccount({
			id: uuidv4(),
			website: params.issuer,
			name: params.account,
			secret: params.secret
		})
	}

	async function addAccountMannual(event: React.FormEvent) {
		event.preventDefault()
		const target = event.currentTarget as HTMLFormElement
		const websiteName = (target.elements[0] as HTMLInputElement).value
		const accountName = (target.elements[1] as HTMLInputElement).value
		const account2FASecret = (target.elements[2] as HTMLInputElement).value.replace(/\s/g,'')
		
		addAccount({
			id: uuidv4(),
			website: websiteName,
			name: accountName,
			secret: account2FASecret
		})
	}

	async function addAccount(account: Account) {
		let tfaAccountsLS = localStorage.getItem('tfa_accounts')
		let tfaAccounts = [] as Account[]
		if (tfaAccountsLS) tfaAccounts = JSON.parse(tfaAccountsLS)
		
		tfaAccounts.push(account)

		localStorage.setItem('tfa_accounts', JSON.stringify(tfaAccounts))

		const syncConfigLS = localStorage.getItem('tfa_sync')
		if (syncConfigLS) {
			const syncConfig = JSON.parse(syncConfigLS) as { password: string, id: string, key: {
				alg: string,
				ext: boolean,
				k: string,
				key_ops: string[],
				kty: string
			} }

			const iv = crypto.getRandomValues(new Uint8Array(12))
			const key = await crypto.subtle.importKey(
				"jwk",
				syncConfig.key,
				{
					name: "AES-GCM"
				},
				false,
				["encrypt", "decrypt"]
			)
			const encrypted = await crypto.subtle.encrypt(
				{
					name: "AES-GCM",
					iv: iv
				},
				key,
				new TextEncoder().encode(JSON.stringify({ accounts: tfaAccounts, tags: [] }))
			)
			const ivBase64 = btoa(String.fromCharCode(...iv))
			const encryptedBase64 = btoa(String.fromCharCode(...new Uint8Array(encrypted)))

			try {
				let response = await axios.post('/api/dualcodes/save', {
					callPwd: syncConfig.password,
					id: syncConfig.id,
					data: JSON.stringify({
						iv: ivBase64,
						data: encryptedBase64
					})
				})
				console.log(response.data)
			} catch (e) {
				console.error(e)
			}
		}

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
						{ mode === 0 && <div className='flex flex-col gap-4 items-center'>
							<Scanner onScan={result => qrCodeEvent(result)} />
							<div>
								<button onClick={() => setMode(1)} className='bg-sky-500 text-white px-4 py-2 rounded-md border-[1px] border-sky-600 active:shadow-inner active:bg-sky-600'>Enter manually</button>
							</div>
						</div>}

						{ mode === 1 && <form className='flex flex-col' onSubmit={addAccountMannual}>
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
						</form> }
					</div>
				</div>
			</div>
		</div>
	</>)
}

export default AddAccountDialog