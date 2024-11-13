import * as OTPAuth from 'otpauth'
import { useState, useEffect } from 'react'
import { CronJob } from 'cron'
import Icon from '@mdi/react'
import { mdiDotsVertical } from '@mdi/js'
import { Link } from 'react-router-dom'

function AccountCard(props: { account: Account }) {
	const [otp, setOtp] = useState('******')
	useEffect(() => {
		refreshOTP()
	}, [])

	async function refreshOTP() {
		const totp = new OTPAuth.TOTP({
			algorithm: 'SHA1',
			digits: 6,
			period: 30,
			secret: props.account.secret
		})
		setOtp(totp.generate())
		const job = new CronJob('* * * * * *', function() {
			const seconds = new Date().getSeconds()
			if (seconds % 30 === 0) setOtp(totp.generate())
		})
		job.start()
	}

	function copyOTP() {
		navigator.clipboard.writeText(otp)
	}

	return (<>
		<div className='border-[1px] border-gray-200 dark:border-slate-600 shadow-md rounded-md p-2 select-none bg-white dark:bg-slate-600 flex items-center lg:items-start'>
			<div className='flex flex-row-reverse justify-between items-center lg:flex-col lg:items-start flex-1'>
				<div className='text-4xl cursor-pointer' onClick={copyOTP}>{otp}</div>
				<div className='flex flex-col w-36 lg:w-full'>
					<div className='text-xl text-ellipsis truncate'>{props.account.website}</div>
					<div className='text-gray-400 text-sm text-ellipsis w-full truncate'>{props.account.name}</div>
				</div>
				
			</div>
			<div>
				<Link to={`/accounts/${props.account.id}`} className='min-w-6'>
					<button className='min-w-6'>
						<Icon path={mdiDotsVertical} size={1} />
					</button>
				</Link>
			</div>
		</div>
	</>)
}

export default AccountCard