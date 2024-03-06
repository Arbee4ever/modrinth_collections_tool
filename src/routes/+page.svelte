<script lang="ts">
	import ModrinthLogo from '$lib/img/modrinthLogo.svg?raw';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let user: any = $page.data.user;
	let token: any = $page.data.token;
	let collections: any[];
	let selectedCollection: string;
	let projects: any[];
	let sortedData: any[] = [];
	let selectedVersion: string;
	let modal: HTMLDialogElement;
	let progressCounter = 0;


	onMount(() => {
		getCollections();
	});

	async function getCollections() {
		if (user == null) return;
		collections = [];
		console.log('Loading Collections...');
		let req = await fetch(`https://api.modrinth.com/v3/user/${user.id}/collections`, {
			headers: {
				'Content-Type': 'application/json',
				'User-Agent': 'https://github.com/Arbee4ever/arbeeco.de (arbeeco.de)',
				'Authorization': token
			}
		});
		if (req.status == 200) {
			collections = await req.json();
		}
	}

	async function getProjects() {
		sortedData = [];
		console.log('Loading Projects...');
		projects = collections.filter((el) => {
			return el.id === selectedCollection;
		})[0].projects;
		for (let i = 0; i < projects.length; i++) {
			console.log('Processing Project ' + (i + 1));
			let projectReq = await fetch(`https://api.modrinth.com/v3/project/${projects[i]}`, {
				headers: {
					'Content-Type': 'application/json',
					'User-Agent': 'https://github.com/Arbee4ever/arbeeco.de (arbeeco.de)',
					'Authorization': token
				}
			});

			if (projectReq.status == 200) {
				let proj = await projectReq.json();
				for (const projVersion of proj.game_versions) {
					let versionEl = sortedData.find(({version}) => version === projVersion);
					if (versionEl !== undefined) {
						if (versionEl.mods.indexOf(proj) == -1) {
							versionEl.mods.push(proj);
						}
						sortedData = sortedData;
					} else {
						sortedData.push({"version": projVersion, "mods": [proj]});
						sortedData = sortedData.sort((a, b) => {
							return a.version.localeCompare(b.version, undefined, { numeric: true, sensitivity: 'base' });
						});
					}
				}
			}
			progressCounter = i + 1;
		}
	}

	function selectVersion(version) {
		selectedVersion = version.version;
		modal.showModal();
		modal.addEventListener('click', function(event) {
			var rect = modal.getBoundingClientRect();
			var isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
				rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
			if (!isInDialog) {
				modal.close();
			}
		});
	}
</script>

<div class="holder">
	<div class="collectionsSelector">
		<p on:click={getCollections} on:keypress={getCollections} class="button card">Get Collections</p>
		{#if collections}
			<select class="select" bind:value={selectedCollection} on:change={getProjects}>
				{#each collections as coll}
					<option value="{coll.id}">{coll.name}</option>
				{/each}
			</select>
		{/if}
	</div>
	{#if projects}
		<progress max={projects.length} value={progressCounter}></progress>
	{/if}
	{#if sortedData.length !== 0}
		<div class="list card">
			{#each sortedData as {version, mods} (version)}
				<button class="item" on:click={() => selectVersion({version})} on:keyup={() => selectVersion({version})}>
					<p>{version}</p>
					<span class="bar" style="--percent: {(mods.length/projects.length)*100}%">
						<p>
							{mods.length}/{projects.length}
						</p>
					</span>
					<span class="logos">
						{#each mods as mod}
							{#if mod.icon_url !== null}
								<img title="{mod.name}" alt="Logo of {mod.name}" src={mod.icon_url} class="modIcon">
							{/if}
						{/each}
					</span>
				</button>
			{/each}
		</div>
	{:else}
		<div class="list card">
			{#if !user}
				<a class="button card modrinthLogin" data-sveltekit-preload-data="off" href="/api/auth">
					{@html ModrinthLogo}
					<p>Login with modrinth</p>
				</a>
			{:else}
				<p>Select a Collection in the Dropdown above!</p>
			{/if}
		</div>
	{/if}
</div>

<dialog class="card" bind:this={modal}>
	{selectedVersion}
	{#if selectedVersion !== undefined && sortedData.length !== 0}
		{#each sortedData.find(({version}) => version === selectedVersion).mods as mod, i}
			<div class="listItem">
				{#if mod.icon_url !== null}
					<img alt="Logo of {mod.name}" src={mod.icon_url} class="modIcon">
				{/if}
				<p>{i + 1}: {mod.name}</p>
			</div>
		{/each}
	{/if}
</dialog>

<style lang="scss">
	.holder {
		gap: 2vw;
		margin: 10vh 2vw 2vw;
		min-height: 90vh;

		.collectionsSelector {
			display: flex;
			gap: 1vw;
			margin-bottom: 1vh;

			.select {
				width: 100%;
			}
		}

		progress {
			all: unset;
			width: 100%;
		}

		.list {
			width: 100%;
			height: fit-content;

			.item {
				all: unset;
				position: relative;
				width: 100%;
				cursor: pointer;
				display: grid;
				grid-template-columns: 1fr 4fr 2fr;
				align-items: center;
				gap: 1vw;

				.bar {
					height: 1em;
					width: 100%;
					align-self: center;
					background: linear-gradient(90deg, rgba(0, 0, 0, 0.6) var(--percent), rgba(0, 0, 0, 0.2) var(--percent));
					border-radius: 5px;

					p {
						margin: 0 0.2vw 0 0;
						opacity: 0.2;
						font-size: 0.75em;
						color: white
					}
				}

				.logos {
					width: 100%;
					overflow-x: auto;
					height: 1em;
					display: flex;
					gap: 0.5em;

					img {
						border-radius: 5px;
						height: 100%;
					}
				}

				p {
					text-align: right;
					white-space: nowrap;
					margin: 0.5em 0;
				}
			}
		}
	}

	.button {
		cursor: pointer;
		white-space: nowrap;
		background-color: #00000040;
		box-shadow: 0 0 32px 0, #0000005E;
		border-radius: 5px;
		padding: 5px;
		width: var(--width, fit-content);

		&.modrinthLogin {
			--color: black;
			display: flex;
			gap: 1vw;
			align-items: center;
			background-color: #1bd96a;
			height: 4vh;
			padding: 0.5vw;

			p {
				color: black;
			}
		}
	}

	dialog {
		border: none;
		margin: auto;
		color: white;
		position: fixed;

		.listItem {
			display: flex;
			text-align: center;

			.modIcon {
				height: 3vh;
			}

			p {
				text-align: center;
				margin: 0;
			}
		}

		&::backdrop {
			backdrop-filter: blur(2px);
		}
	}
</style>