<script lang="ts">
import { goto } from '$app/navigation';
import { Button } from '$lib/components/ui/button';
import { APP_NAME } from '$lib/config/constants';

export let data;
</script>

<div class="flex-1">
	<section class="container grid items-center gap-6">
		<div class="flex max-w-[980px] flex-col items-start gap-2">
			<h1 class="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
				{APP_NAME}
			</h1>
			<p class="max-w-[700px] text-lg text-muted-foreground">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tincidunt dui sit amet libero
				commodo elementum. Aliquam elementum vehicula libero in aliquam. Sed laoreet nulla sit amet
				tortor tincidunt, quis viverra augue aliquet. Mauris laoreet nisl in ornare lobortis.
				Maecenas at ex in sapien luctus accumsan nec eget sem. Donec tempor non turpis non rhoncus.
				Vestibulum id dignissim enim. Pellentesque in porta leo, sit amet tincidunt tellus. Sed
				dapibus dignissim sapien sed sollicitudin. Quisque volutpat velit nec semper faucibus.
				Aliquam nibh turpis, condimentum id est et, posuere pellentesque lorem. Proin orci est,
				faucibus eget ligula in, congue bibendum nisl. Phasellus purus neque, pharetra pretium
				euismod ac, ullamcorper nec justo. Fusce eget ante at libero auctor egestas eget nec mi.
			</p>
		</div>
		<div class="flex gap-4">
			{#if !data.user}
				<Button on:click={() => goto('/auth/sign-in')}>Войти</Button>
				<Button on:click={() => goto('/auth/sign-up')} variant="outline">Создать аккаунт</Button>
			{/if}
		</div>
	</section>
</div>
