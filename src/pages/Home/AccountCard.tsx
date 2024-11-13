import * as OTPAuth from 'otpauth'
import { useState, useEffect } from 'react'
import { CronJob } from 'cron'
import Icon from '@mdi/react'
import { mdiDotsVertical } from '@mdi/js'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'

function AccountCard(props: { account: Account }) {
	const { t } = useTranslation()
	const [otp, setOtp] = useState('******')
	useEffect(() => {
		refreshOTP()
	}, [])

	const { contextSafe } = useGSAP()

	const otpDigi1Ref = useRef(null)
	const otpDigi2Ref = useRef(null)
	const otpDigi3Ref = useRef(null)
	const otpDigi4Ref = useRef(null)
	const otpDigi5Ref = useRef(null)
	const otpDigi6Ref = useRef(null)

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
			if (seconds % 30 === 0) {
				setOtp(totp.generate())
				fadingIn()
			}
			if ((seconds + 1) % 30 === 0) fadingOut()
		})
		job.start()
	}

	const fadingOut = contextSafe(() => {
		const tl = gsap.timeline()
		tl.to(otpDigi1Ref.current, {
			opacity: 0,
			filter: "blur(8px)",
			top: "10px",
			duration: 0.4,
			ease: "expo.in"
		}).to(otpDigi2Ref.current, {
			opacity: 0,
			filter: "blur(8px)",
			top: "10px",
			duration: 0.4,
			ease: "expo.in"
		}, "-=0.35").to(otpDigi3Ref.current, {
			opacity: 0,
			filter: "blur(8px)",
			top: "10px",
			duration: 0.4,
			ease: "expo.in"
		}, "-=0.35").to(otpDigi4Ref.current, {
			opacity: 0,
			filter: "blur(8px)",
			top: "10px",
			duration: 0.4,
			ease: "expo.in"
		}, "-=0.35").to(otpDigi5Ref.current, {
			opacity: 0,
			filter: "blur(8px)",
			top: "10px",
			duration: 0.4,
			ease: "expo.in"
		}, "-=0.35").to(otpDigi6Ref.current, {
			opacity: 0,
			filter: "blur(8px)",
			top: "10px",
			duration: 0.4,
			ease: "expo.in"
		}, "-=0.35").set(otpDigi1Ref.current, {
			top: "-10px"
		}).set(otpDigi2Ref.current, {
			top: "-10px"
		}).set(otpDigi3Ref.current, {
			top: "-10px"
		}).set(otpDigi4Ref.current, {
			top: "-10px"
		}).set(otpDigi5Ref.current, {
			top: "-10px"
		}).set(otpDigi6Ref.current, {
			top: "-10px"
		})
	})

	const fadingIn = contextSafe(() => {
		const tl = gsap.timeline()
		tl.to(otpDigi1Ref.current, {
			opacity: 1,
			filter: "blur(0px)",
			top: "0px",
			duration: 0.4,
			ease: "expo.out"
		}).to(otpDigi2Ref.current, {
			opacity: 1,
			filter: "blur(0px)",
			top: "0px",
			duration: 0.4,
			ease: "expo.out"
		}, "-=0.35").to(otpDigi3Ref.current, {
			opacity: 1,
			filter: "blur(0px)",
			top: "0px",
			duration: 0.4,
			ease: "expo.out"
		}, "-=0.35").to(otpDigi4Ref.current, {
			opacity: 1,
			filter: "blur(0px)",
			top: "0px",
			duration: 0.4,
			ease: "expo.out"
		}, "-=0.35").to(otpDigi5Ref.current, {
			opacity: 1,
			filter: "blur(0px)",
			top: "0px",
			duration: 0.4,
			ease: "expo.out"
		}, "-=0.35").to(otpDigi6Ref.current, {
			opacity: 1,
			filter: "blur(0px)",
			top: "0px",
			duration: 0.4,
			ease: "expo.out"
		}, "-=0.35")
	})

	function copyOTP() {
		navigator.clipboard.writeText(otp)
		toast(t('HOME_ACCOCARD_COPIED', {
			account: props.account.name
		}), {type: 'info'})
	}

	return (<>
		<div className='border-[1px] border-gray-200 dark:border-slate-600 shadow-md rounded-md p-2 select-none bg-white dark:bg-slate-600 flex items-center lg:items-start'>
			<div className='flex flex-row-reverse justify-between items-center lg:flex-col lg:items-start flex-1'>
				<div className='text-4xl cursor-pointer ' onClick={copyOTP}>
					<span className='relative' ref={otpDigi1Ref}>{otp.split('')[0]}</span>
					<span className='relative' ref={otpDigi2Ref}>{otp.split('')[1]}</span>
					<span className='relative' ref={otpDigi3Ref}>{otp.split('')[2]}</span>
					<span className='relative' ref={otpDigi4Ref}>{otp.split('')[3]}</span>
					<span className='relative' ref={otpDigi5Ref}>{otp.split('')[4]}</span>
					<span className='relative' ref={otpDigi6Ref}>{otp.split('')[5]}</span>
				</div>
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