<script lang="ts">
	let accessToken = '[REDACTED]';
	let id = 'vy2qGPHL';
	let collections: any[];
	let selectedCollection: string;
	let projects: any[];
	let sortedData: any[] = [];
	let selectedVersion: string;
	let modal: HTMLDialogElement;

	async function getCollections() {
		collections = [];
		console.log('Loading Collections...');
		let req = await fetch(`https://api.modrinth.com/v3/user/${id}/collections`, {
			headers: {
				'Content-Type': 'application/json',
				'User-Agent': 'https://github.com/Arbee4ever/arbeeco.de (arbeeco.de)',
				Authorization: accessToken
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
			let projectReq = await fetch(`https://api.modrinth.com/v2/project/${projects[i]}`, {
				headers: {
					'Content-Type': 'application/json',
					'User-Agent': 'https://github.com/Arbee4ever/arbeeco.de (arbeeco.de)'
				}
			});
			if (projectReq.status == 200) {
				let proj = await projectReq.json();
				for (const version of proj.game_versions) {
					if (sortedData[version] != undefined) {
						if (sortedData[version].indexOf(proj) == -1) {
							sortedData[version].push(proj);
						}
					} else {
						sortedData[version] = [proj];
					}
				}
			}
		}
		sortedData = Object.entries(sortedData).sort((a, b) => a[1].length - b[1].length);
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
		<p on:click={getCollections} class="button card">Get Collections</p>
		{#if collections}
			<select class="select" bind:value={selectedCollection} on:change={getProjects}>
				{#each collections as coll}
					<option value="{coll.id}">{coll.name}</option>
				{/each}
			</select>
		{/if}
	</div>
	<div class="list card">
		{#if sortedData.length !== 0}
			{#each sortedData as [version, mods] (version)}
				<div class="item" on:click={() => selectVersion({version})} on:keyup={() => selectVersion({version})}
						 role="listitem">
					<p>{version}</p>
					<div class="bar" style="--percent: {(mods.length/projects.length)*100}%">
						<p>
							{mods.length}/{projects.length}
						</p>
					</div>
					<div class="logos">
					{#each mods as mod}
						<img title="{mod.title}" alt="Logo of {mod.title}" src={mod.icon_url} class="modIcon">
					{/each}
					</div>
				</div>
			{/each}
		{:else}
			<div class="item">
				<p>Loading...</p>
			</div>
		{/if}
	</div>
</div>

<dialog class="card" bind:this={modal}>
	{selectedVersion}
	{#if selectedVersion !== undefined}
		{#each Object.values(Object.fromEntries(sortedData)[selectedVersion]) as mod, id}
			<div class="listItem">
				<img alt="Logo of {mod.title}" src={mod.icon_url} class="modIcon">
				<p>{id + 1}: {mod.title}</p>
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

		.list {
			width: 100%;
			height: fit-content;

			.item {
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
					overflow: scroll;
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

		.button {
			cursor: pointer;
			white-space: nowrap;
			background-color: #00000040;
			box-shadow: 0 0 32px 0, #0000005E;
			border-radius: 5px;
			padding: 5px;
			width: var(--width, fit-content);
			text-align: center;
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