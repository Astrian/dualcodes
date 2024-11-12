import * as OTPAuth from 'otpauth'
import { useState, useEffect } from 'react'
import { CronJob } from 'cron'

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
		<div className='border-[1px] border-gray-100 shadow-md rounded-md p-2 cursor-pointer select-none bg-white flex flex-row-reverse justify-between items-center lg:flex-col lg:items-start' onClick={copyOTP}>
		<div className='text-4xl'>{otp}</div>
			<div className='flex flex-col'>
				<div className='text-xl text-ellipsis'>{props.account.website}</div>
				<div className='text-gray-400 text-sm text-ellipsis'>{props.account.name}</div>
			</div>
			
		</div>
	</>)
}

export default AccountCard