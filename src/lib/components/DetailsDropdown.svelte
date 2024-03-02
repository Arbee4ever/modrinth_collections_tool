<script lang="ts">
	import { slide } from 'svelte/transition';
	import { clickOutside } from '$lib/script/clickOutside.js';

	export let placeholderIcon = '';
	export let icon: any;
	export let height = '15px';
	export let border_radius = '4px';
	let expanded = false;
	let details: HTMLDivElement;
	let overflow = '0px';

	function toggleExpand() {
		expanded = !expanded;
		setTimeout(function () {
			if (expanded) {
				if (details.firstChild) {
					if (details.firstChild.getBoundingClientRect().right >= window.innerWidth) {
						overflow =
							window.innerWidth - details.firstChild.getBoundingClientRect().right - 20 + 'px';
					}
				}
			}
		}, 1);
	}

	function handleClickOutside() {
		if (expanded) {
			toggleExpand();
		}
	}
</script>

<div
	class="dropdown"
	style="--height:{height}; --overflow: {overflow}; --border-radius: {border_radius}"
	use:clickOutside={handleClickOutside}
>
	{#if icon}
		<img src={icon} class="icon" alt="Dropdown Icon" on:mousedown={toggleExpand} />
	{:else}
		<img src={placeholderIcon} class="icon" alt="Dropdown Icon" on:mousedown={toggleExpand} />
	{/if}
	<div bind:this={details}>
		{#if expanded}
			<div class="details card" in:slide>
				<slot name="filter" />
				<div class="content">
					<slot />
				</div>
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.dropdown {
		width: min-content;
		align-items: center;

		.icon {
			cursor: pointer;
			height: var(--height);
			border-radius: var(--border-radius);
			max-width: 400px;
			vertical-align: middle;
		}

		.details {
			z-index: 1;
			background-color: currentColor;
			position: absolute;
			transform: translateX(var(--overflow));
			max-width: 30vw;
			width: max-content;
			display: grid;
			gap: 1vh;
		}

		.content {
			z-index: 1;
			display: flex;
			max-width: 15vw;
			max-height: 10vh;
			flex-wrap: wrap;
			gap: 1vh;
			overflow: scroll;
		}
	}
</style>