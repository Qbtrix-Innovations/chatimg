<script>
	import { authHandlers, authStore } from '$lib/stores/userauth/authStore';
	import { clsx } from 'clsx';
	import TextInput from './components/TextInput.svelte';
	import ExternalLoginButton from './components/ExternalLoginButton.svelte';
	import Button from './../../lib/components/ui/button/button.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { goto } from '$app/navigation';
	let fullName = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let isChecked = false;
	let register = true;
	let reset = false;
	let emailForPasswordReset = '';
	let google_icon = `<svg width="21" height="19" viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M18.4921 7.71721H17.8162V7.68532H10.264V10.7594H15.0064C14.3145 12.549 12.4554 13.8336 10.264 13.8336C7.4835 13.8336 5.22915 11.7689 5.22915 9.22238C5.22915 6.67585 7.4835 4.61119 10.264 4.61119C11.5474 4.61119 12.7151 5.05464 13.6042 5.77898L15.9777 3.60519C14.479 2.32597 12.4743 1.53707 10.264 1.53707C5.62984 1.53707 1.8726 4.97817 1.8726 9.22238C1.8726 13.4666 5.62984 16.9077 10.264 16.9077C14.8981 16.9077 18.6554 13.4666 18.6554 9.22238C18.6554 8.70708 18.5975 8.20407 18.4921 7.71721Z" fill="#FFC107"/>
							<path d="M2.84013 5.64525L5.59712 7.49702C6.34311 5.80549 8.14978 4.61119 10.264 4.61119C11.5474 4.61119 12.7151 5.05463 13.6042 5.77897L15.9777 3.60519C14.479 2.32597 12.4743 1.53707 10.264 1.53707C7.04086 1.53707 4.24569 3.20363 2.84013 5.64525Z" fill="#FF3D00"/>
							<path d="M10.264 16.9077C12.4315 16.9077 14.4009 16.148 15.89 14.9126L13.2929 12.8998C12.4221 13.5063 11.358 13.8343 10.264 13.8335C8.08139 13.8335 6.22815 12.5589 5.52999 10.7802L2.79356 12.7111C4.18234 15.2 7.00268 16.9077 10.264 16.9077Z" fill="#4CAF50"/>
							<path d="M18.4921 7.7172H17.8162V7.6853H10.264V10.7594H15.0064C14.6754 11.6111 14.0793 12.3553 13.2916 12.9002L13.2928 12.8994L15.89 14.9122C15.7062 15.0651 18.6554 13.065 18.6554 9.22236C18.6554 8.70706 18.5975 8.20406 18.4921 7.7172Z" fill="#1976D2"/>
						</svg>`;
	const resetPasswordHandler = async () => {
		reset = true;
	};
	const handleSubmit = (/** @type {any} */ e) => {
		e.preventDefault();
		// checking that all fields are filled
		if (!email || !password || (register && !confirmPassword) || (register && !fullName)) {
			alert('Please enter all the required fields.');
			return;
		} else {
			// signup
			if (register && password === confirmPassword) {
				// checking for terms and conditions
				if (isChecked) {
					const userData = {
						username: fullName,
						email: email,
						phoneNumber: null,
						dateOfBirth: null,
						profilePictureUrl: null
					};
					authHandlers.signup(email, password, fullName, userData);
				} else {
					alert('Please accept the terms and conditions');
					return;
				}
			}
			// login
			else {
				try {
					const userData = {
						username: fullName,
						email: email,
						phoneNumber: null,
						dateOfBirth: null,
						profilePictureUrl: null
					};
					authHandlers.login(email, password, fullName, userData);
				} catch (error) {
					console.log(error);
				}
			}
		}
	};
	const handleForgotPassword = async () => {
		const res = await authHandlers.resetPassword(emailForPasswordReset);
		alert('email sent successfully.');
		reset = false;
		emailForPasswordReset = '';
		goto('/auth');
	};
	let p1="password";
	let p2="password";
	let p3="password";
	let p4="password";
</script>

<div class="bg-[#f5f5f5] h-screen">
	<div class="font-semibold text-[14px] text-[#263238] mt-2 ml-4 fixed w-full z-20">Chat Img</div>
	<div class="h-screen flex flex-col justify-end">
		<div
			class="w-full flex flex-col items-center bg-white h-[75%] rounded-tl-[38px] rounded-tr-[38px] shadow-[0px_4px_4px_0px_rgba(0, 0, 0, 0.07)]"
		>
			<div class="w-fit leading-4 text-[14px] font-semibold text-[rgba(38,50,56,1)] h-4 mt-[10%]">
				{#if register}
					{`Signup to Chat`}
				{:else}
					{`Login to Chat`}
				{/if}
			</div>
			<div
				class="w-fit text-[10px] leading-3 font-normal text-[rgba(96,125,139,1)] opacity-50 h-3 mt-2"
			>
				An account is required to chat
			</div>
			<form method="POST" class="w-full flex flex-col items-center mt-10">
				{#if register}
					<TextInput
						type="text"
						classSVG="ml-[70%]"
						placeholder="Full Name"
						bind:val={fullName}
						SvgInput={'name'}
						onClickSVG={() => {}}
					/>
				{/if}

				<TextInput
					bind:val={email}
					classSVG="ml-[70%]"
					type="email"
					placeholder="Email"
					SvgInput={'email'}
					onClickSVG={() => {}}
				/>

				{#if !register}
					<TextInput
						bind:val={password}
						classSVG="ml-[70%]"
						type="password"
						placeholder="Password"
						SvgInput={p1}
						onClickSVG={() => {
							if (p1==='password') {
								p1='passwordVisible'		
							} else {
								p1='password';
							}
						}}
					/>
				{/if}
				{#if register}
					<div class="flex flex-row self-center justify-center">
						<TextInput
							class="w-[39%] mx-1"
							classSVG="ml-[32%]"
							bind:val={password}
							type="password"
							placeholder="Password"
							SvgInput={p2}
							onClickSVG={() => {
								if (p2==='password') {
									p2='passwordVisible'		
								} else {
									p2='password';
								}
							}}
						/>
						<TextInput
							class="w-[39%] mx-1"
							classSVG="ml-[32%]"
							type="password"
							placeholder="Check Password"
							bind:val={confirmPassword}
							SvgInput={p3}
							onClickSVG={() => {
								if (p3==='password') {
									p3='passwordVisible'		
								} else {
									p3='password';
								}
							}}
						/>
					</div>
				{/if}
				{#if register}
					<div class="flex flex-row justify-center align-middle items-center">
						<input
							type="checkbox"
							bind:checked={isChecked}
							class={clsx` w-2 h-2 data-[state=checked]:bg-white data-[state=checked]:text-[rgba(0,217,24,1)] mr-2 border-[1px] rounded-[2px] border-solid border-[rgba(203,203,203,1)]`}
						/>
						<div class="text-[7.5px] text-[rgba(37,37,37,1)] leading-[8.5px] font-normal">
							<span>By checking the box you agree to our </span>
							<span
								class="text-transparent bg-clip-text bg-gradient-to-t from-[rgba(0,217,24,1)] to-[rgba(0,169,19,1)]"
								>Terms</span
							>
							and
							<span
								class="text-transparent bg-clip-text bg-gradient-to-t from-[rgba(0,217,24,1)] to-[rgba(0,169,19,1)]"
								>Conditions</span
							>.
						</div>
					</div>
				{/if}
				<Button
					on:click={handleSubmit}
					class="h-[30px] w-[300px] mt-4 bg-transparent rounded-2xl border-[1px] border-[#c8c8c8] bg-gradient-to-t from-[rgba(76,175,80,1)] to-[rgba(100,197,104,0.43)] shadow-[0px_4px_3.7px_0px_rgba(0, 0, 0, 0.22)]"
					type="submit"
				>
					{#if register}
						{`Signup >`}
					{:else}
						{`Login >`}
					{/if}
				</Button>

				{#if register}
					<div>
						Already have an account ?
						<Button
							on:click={() => {
								register = false;
							}}
							class="bg-transparent text-transparent bg-clip-text bg-gradient-to-t from-[rgba(0,217,24,1)] to-[rgba(0,169,19,1)] ml-0 pl-0"
							>Login here</Button
						>
					</div>
				{:else}
					<div>
						New to ChatImg ?
						<Button
							on:click={() => {
								register = true;
							}}
							class="bg-transparent text-transparent bg-clip-text bg-gradient-to-t from-[rgba(0,217,24,1)] to-[rgba(0,169,19,1)] ml-0 pl-0"
							>Register here</Button
						>
					</div>
				{/if}
			</form>
			<div class="flex flex-row mt-4">
				<div class="mt-[14px] px-2">
					<hr class="text-[rgba(0,0,0,0.4)] h-[0.37px] bg-[rgba(0,0,0,0.4)] sm:w-[10px] w-[60px]" />
				</div>
				<div>or Continue with</div>
				<div class="mt-[14px] px-2">
					<hr class="text-[rgba(0,0,0,0.4)] h-[0.37px] bg-[rgba(0,0,0,0.4)] sm:w-[10px] w-[60px]" />
				</div>
			</div>
			<div class="flex flex-col h-7 w-[80%] bg-transparent">
				<ExternalLoginButton handleAuthClick={async ()=>{await authHandlers.googleLogin()}} text="Google" icn={google_icon} class="mt-5"  />
			</div>
			<div class="mt-8 flex flex-row">
				<div class="font-medium text-[9.59px] leading-[14.39px]">Forgot Password ?</div>
				<button
					on:click={resetPasswordHandler}
					class="font-bold ml-1 text-[9.59px] w-fit leading-[14.39px] text-transparent bg-clip-text bg-gradient-to-t from-[rgba(0,217,24,1)] to-[rgba(0,169,19,1)]"
					>Reset Password</button
				>
			</div>
			<Modal bind:showModal={reset}>
				<h1
					slot="header"
					class="text-transparent bg-clip-text bg-gradient-to-t from-[rgba(0,217,24,1)] to-[rgba(0,169,19,1)]"
				>
					Forgot Password ?
				</h1>
				<div class="m-2">
					<p class="text-sm p-2 m-2">
						Enter your email below and get a link to reset your password.
					</p>
					<Input bind:value={emailForPasswordReset} />
				</div>
				<Button
					on:click={handleForgotPassword}
					type="submit"
					slot="footer"
					class="mt-2 rounded-2xl border-[1px] border-[#c8c8c8] bg-gradient-to-t from-[rgba(76,175,80,1)] to-[rgba(100,197,104,0.43)] shadow-[0px_4px_3.7px_0px_rgba(0, 0, 0, 0.22)]"
					>Send Link</Button
				>
			</Modal>
		</div>
	</div>
</div>
