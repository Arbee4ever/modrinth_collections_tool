<script lang="ts">
	import PlaceholderImg from '$lib/img/modrinthLogo.svg';
	import DetailsDropdown from '$lib/components/DetailsDropdown.svelte';

	export let user: any;

	let pfp: any;

	if (user != null) {
		pfp = user.avatar_url;
	} else {
		pfp = PlaceholderImg;
	}
</script>

<div id="user">
	{#if user}
		<DetailsDropdown icon={pfp} height="4vh" border_radius="100%">
			<span class="wrapper">
				<h1>{user.username}</h1>
				<a href="/api/signout" data-sveltekit-preload-data="off" class="signout">Sign out </a>
			</span>
		</DetailsDropdown>
	{:else}
		<DetailsDropdown icon={pfp} height="5vh" border_radius="100%">
			<a href="/api/auth" data-sveltekit-preload-data="off" class="signout">Log in </a>
		</DetailsDropdown>
	{/if}
</div>

<style>
	#user {
		position: fixed;
		z-index: 2;
		left: 3vh;
		top: 3vh;
		color: rgba(0, 0, 0, 0.25);
	}

	#user h1 {
		font-size: 2vh;
		white-space: nowrap;
	}

	#user a {
		white-space: nowrap;
	}
</style>