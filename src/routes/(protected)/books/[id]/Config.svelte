<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Slider } from '$lib/components/ui/slider';
	import * as Select from '$lib/components/ui/select';
	import { StickyNote, Book, Settings } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';

	interface settingsInterface {
		scale: number;
		fontFamily: string;
		paginated: boolean;
		animations: boolean;
	}

	export let settings: settingsInterface;
	export let onScaleChange: () => void;

	let sliderVal = [settings.scale];
	$: settings.scale = sliderVal[0];

	onDestroy(() => {
		localStorage.setItem('settings', JSON.stringify(settings));
	});
</script>

<Popover.Root>
	<Popover.Trigger><Settings /></Popover.Trigger>
	<Popover.Content class="flex flex-col gap-2">
		<div class="flex">
			<Select.Root
				selected={{ value: settings.fontFamily, label: settings.fontFamily }}
				onSelectedChange={(v) => {
					v && (settings.fontFamily = v.value);
				}}>
				<Select.Trigger>
					<Select.Value placeholder="Font" />
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="Default">Default</Select.Item>
					<Select.Item value="Verdana">Verdana</Select.Item>
					<Select.Item value="Arial">Arial</Select.Item>
					<Select.Item value="Courier New">Courier New</Select.Item>
					<Select.Item value="Helvetica">Helvetica</Select.Item>
					<Select.Item value="Times New Roman">Times New Roman</Select.Item>
				</Select.Content>
			</Select.Root>
			<Button
				on:click={() => (settings.paginated = true)}
				variant={settings.paginated ? 'secondary' : 'outline'}
				class="rounded-r-none border ml-2"><Book /></Button>
			<Button
				on:click={() => (settings.paginated = false)}
				variant={!settings.paginated ? 'secondary' : 'outline'}
				class="rounded-l-none border "><StickyNote /></Button>
		</div>

		<Slider bind:value={sliderVal} max={30} min={5} step={1} on:change={onScaleChange} />
	</Popover.Content>
</Popover.Root>
