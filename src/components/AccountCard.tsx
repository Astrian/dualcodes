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

	return (<>
		<div>{props.account.name}</div>
		<div>{props.account.website}</div>
		<div>{otp}</div>
	</>)
}

export default AccountCard