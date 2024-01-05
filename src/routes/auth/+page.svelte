<script>
	import { authHandlers, authStore } from '$lib/stores/userauth/authStore';
	import { clsx } from 'clsx';
	import ExternalLoginButton from './components/ExternalLoginButton.svelte';
	import Button from './../../lib/components/ui/button/button.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { goto } from '$app/navigation';
	import GoogleIcon from '$lib/components/svg/GoogleIcon.svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { Eye, EyeOff, Mail, User } from 'lucide-svelte';
	import ComingSoonStore from './components/ComingSoonStore.svelte';
	import Terms from './components/Terms.svelte';
	import PrimaryButton from '$lib/components/primaryButton.svelte';
	import ChatbotWidget from './components/ChatbotWidget.svelte';

	let fullName = '';
	let email = '';
	let password = '';
	let confirmPassword = '';
	let isChecked = false;
	let register = true;
	let reset = false;
	let emailForPasswordReset = '';

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

	let eyeClose = false;
</script>

<section class="bg-white dark:bg-black">
	<div class="sm:hidden p-4">
		<img class="w-24" src="/images/logo.png" alt="" />
	</div>
	<div class="w-full h-full flex">
		<div class="hidden lg:flex w-[60%] xl:w-[70%] h-screen">
			<div class="w-[100vw] relative overflow-y-hidden">
				<img
					src="https://images.pexels.com/photos/8100784/pexels-photo-8100784.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
					class="w-full min-h-screen object-cover"
					alt=""
				/>
				<ChatbotWidget />
				<Terms />
			</div>
		</div>

		<div
			class=" bg-card w-full rounded-t-[45px] sm:rounded-none md:mx-auto lg:w-[40%] xl:w-[30%] sm:mt-0 mt-24 h-full sm:h-[100vh] overflow-y-auto"
		>
			<div
				class="w-full h-full rounded-none border-0 flex flex-col sm:justify-between justify-center py-6 sm:p-10"
			>
				<div class="sm:flex flex-col space-x-4 px-5 sm:pl-16 lg:pl-5 items-center hidden">
					<img class="w-24 block dark:hidden" src="/images/logo.png" alt="" />
					<img class="w-24 hidden dark:block " src="/images/logo-dark.png" alt="" />
					<p class="text-[12px] text-primaryText/80 w-3/6 text-center italic dark:text-white/80">
						Chat with any image and create stunning images from text.
					</p>
				</div>
				<div>
					<div class="space-y-6 mt-10 px-5 sm:px-16 lg:px-5">
						<div class="sm:mt-24 mt-12 text-[#4d4d4d] dark:text-white">
							{#if register}
								<h1 class=" text-center text-primaryText text-xl">Create Account</h1>
							{:else}
								<h1 class=" text-center text-primaryText text-xl">SIGN IN</h1>
							{/if}

							<p class="text-center text-xs font-semibold text-black/50 dark:text-white/80">
								Signin to start finding meanings
							</p>
						</div>
						<div class="overflow-y-auto">
							<div class="py-4 space-y-2">
								{#if register}
									<div class="flex justify-center space-x-4">
										<div class="w-full relative">
											<Input
												type="text"
												bind:value={fullName}
												placeholder="First name"
												class=" text-[#607D8B] focus-visible:ring-none border-none w-full text-[16px] bg-white
												placeholder:text-[#607D8B]/65 h-[35px]"
												autocomplete="name"
											/>
											<i class=" absolute right-3 top-1 opacity-[65%]">
												<User class="w-5" color="#607D8B" />
											</i>
										</div>
									</div>
								{/if}
								<div class="relative">
									<Input
										type="email"
										bind:value={email}
										placeholder="Enter email"
										class=" text-[#607D8B] border-none w-full text-[16px] bg-white
										placeholder:text-[#607D8B]/65 h-[35px]"
										autocomplete="email"
									/>
									<i class="absolute right-3 top-1 opacity-[65%]">
										<Mail class="w-5" color="#607D8B" />
									</i>
								</div>
								<div class="relative">
									<Input
										bind:value={password}
										type={eyeClose ? 'text' : 'password'}
										placeholder="Password"
										class=" text-[#607D8B] border-none w-full text-[16px] dark:bg-white bg-white
										placeholder:text-[#607D8B]/65 h-[35px]"
									/>
									{#if eyeClose}
										<button
											on:click={() => (eyeClose = false)}
											class="absolute right-3 top-1 opacity-[65%]"
										>
											<Eye class="w-5" color="#607D8B" />
										</button>
									{:else}
										<button
											on:click={() => (eyeClose = true)}
											class="absolute right-3 top-1 opacity-[65%]"
										>
											<EyeOff class="w-5" color="#607D8B" />
										</button>
									{/if}
								</div>
								{#if register}
									<div class="relative">
										<Input
											bind:value={confirmPassword}
											type={eyeClose ? 'text' : 'password'}
											placeholder="Confirm password"
											class=" text-[#607D8B] border-none w-full text-[16px] bg-white
									placeholder:text-[#607D8B]/65 h-[35px]"
										/>
										{#if eyeClose}
											<button
												on:click={() => (eyeClose = false)}
												class="absolute right-3 top-1 opacity-[65%]"
											>
												<Eye class="w-5" color="#607D8B" />
											</button>
										{:else}
											<button
												on:click={() => (eyeClose = true)}
												class="absolute right-3 top-1 opacity-[65%]"
											>
												<EyeOff class="w-5" color="#607D8B" />
											</button>
										{/if}
									</div>
								{/if}
								{#if !register}
									<div class="flex justify-end text-sm">
										<button
											on:click={resetPasswordHandler}
											class="font-medium text-[#607D8B]/65 dark:text-gray-400 leading-[14.39px] py-2"
											>Forgot Password ?</button
										>
									</div>
								{/if}
							</div>

							<div class="flex items-center justify-center space-x-2 sm:py-16 py-9">
								<Checkbox
									on:click={() => (isChecked = !isChecked)}
									class="w-3 h-3 flex items-center justify-center"
									id="terms"
								/>
								<Label
									for="remember"
									class="text-sm text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 opacity-65"
									>Remember me
								</Label>
							</div>

							<!-- <Button
								type="submit"
								on:click={handleSubmit}
								class="h-[36px] bg-gradient-to-b from-accent to-[#3F9A43] rounded-[6px] border font-medium w-full text-[12px]  text-[#ffffff]"
							>
								Create Account >
							</Button> -->
							{#if register}
								<PrimaryButton class="w-full" onClick={handleSubmit} text={'Register'} />
							{:else}
								<PrimaryButton class="w-full" onClick={handleSubmit} text={'Login'} />
							{/if}

							<div class="flex justify-center sm:mt-24 mt-12">
								<Button
									disabled
									class="h-[22px] font-normal  dark:bg-black dark:text-white  text-[12px]"
									>Use Phone Number</Button
								>
							</div>

							{#if register}
								<div
									class="text-black/50 dark:text-white/50 font-semibold mt-2 text-center text-[14px]"
								>
									<span>Have an account? </span>
									<button
										on:click={() => {
											register = false;
										}}
										class="font-medium text-green-500">Login</button
									>
									<span>to apply</span>
								</div>
							{:else}
								<div
									class="text-black/50 dark:text-white/50 font-semibold mt-2 text-center text-[14px]"
								>
									<span>Don't have an account? </span>
									<button
										on:click={() => {
											register = true;
										}}
										class="font-medium text-green-500">Register</button
									>
									<span>to apply</span>
								</div>
							{/if}
							<div class="flex items-center justify-center h-full mt-4 gap-2">
								<hr class="bg-black sm:w-[10px] w-[60px]" />
								<div class="text-xs font-semibold text-black text-center dark:text-white/50">
									or Continue with
								</div>
								<hr class="sm:w-[10px] w-[60px]" />
							</div>
							<div class="flex flex-col justify-center gap-4">
								<ExternalLoginButton
									handleAuthClick={async () => {
										await authHandlers.googleLogin();
									}}
									text="Continue with Google"
									icn={GoogleIcon}
									class="mt-5 hover:bg-white "
								/>
							</div>

							<ComingSoonStore />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<Modal bind:showModal={reset}>
		<h1
			slot="header"
			class="text-transparent bg-clip-text bg-gradient-to-t py-2 from-[rgba(0,217,24,1)] to-[rgba(0,169,19,1)]"
		>
			Forgot Password ?
		</h1>
		<div class="m-2">
			<p class="text-sm my-2">Enter your email below and get a link to reset your password.</p>
			<Input bind:value={emailForPasswordReset} />
		</div>
		<Button
			on:click={handleForgotPassword}
			type="submit"
			slot="footer"
			variant="secondary"
			class="mt-2 rounded-2xl border-[1px] border-[#c8c8c8] shadow-[0px_4px_3.7px_0px_rgba(0, 0, 0, 0.22)]"
			>Send Link</Button
		>
	</Modal>
</section>
