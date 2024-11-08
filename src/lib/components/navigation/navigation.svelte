<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import convertNameToInitials from '$lib/_helpers/convertNameToInitials';
	import Logo from '$lib/components/logo/logo.svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { APP_NAME } from '$lib/config/constants';
	import type { User } from 'lucia';
	import { LogOut, Moon, Sun, SunMoon, UserRound } from 'lucide-svelte';
	import { resetMode, setMode } from 'mode-watcher';
	import { Menu } from 'lucide-svelte';
	export let user: User | null;
	$: currentPage = $page.url.pathname;

	const signOut = () => {
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = '/auth/sign-out';
		document.body.appendChild(form);
		form.submit();
	};
	const main_url = user ? '/dashboard' : '/';
	let initials = '';
	$: {
		if (user) {
			initials = convertNameToInitials(user.firstName, user.lastName);
		}
	}
</script>

<header class="sticky top-0 z-40 w-full border-b bg-background">
	<div class="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
		<div class="flex gap-6 md:gap-10">
			<a class="flex items-center space-x-2" href="/"
				><Logo size="24"></Logo><span class="inline-block font-bold">{APP_NAME}</span></a>
			<nav class="hidden gap-6 sm:flex">
				<a
					class="flex items-center text-sm font-medium text-muted-foreground"
					href={main_url}
					class:active={main_url === currentPage}>Главная</a>
				<a
					class="flex items-center text-sm font-medium text-muted-foreground"
					href="/decks/browse"
					class:active={'/decks/browse' === currentPage}>Колоды</a>
				<a
					class="flex items-center text-sm font-medium text-muted-foreground"
					href="/cards/browse"
					class:active={'/cards/browse' === currentPage}>Карты</a>
				<a
					class="flex items-center text-sm font-medium text-muted-foreground"
					href="/dictionary"
					class:active={'/dictionary' === currentPage}>Словарь</a>
				<a
					class="flex items-center text-sm font-medium text-muted-foreground"
					href="/books"
					class:active={'/books' === currentPage}>Книги</a>
				<a
					class="flex items-center text-sm font-medium text-muted-foreground"
					href="/video"
					class:active={'/video' === currentPage}>Видео</a>
			</nav>
		</div>
		<div class="flex flex-1 items-center justify-end space-x-4">
			<nav class="flex items-center space-x-1">
				{#if !user}
					<Button on:click={() => goto('/auth/sign-in')}>Войти</Button>
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild let:builder>
							<Button builders={[builder]} variant="ghost" size="icon">
								<Sun
									class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
								<Moon
									class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
								<span class="sr-only">Тема</span>
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end">
							<DropdownMenu.Item on:click={() => setMode('light')}>Светлая</DropdownMenu.Item>
							<DropdownMenu.Item on:click={() => setMode('dark')}>Тёмная</DropdownMenu.Item>
							<DropdownMenu.Item on:click={() => resetMode()}>Системная</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				{:else}
					<DropdownMenu.Root>
						<DropdownMenu.Trigger asChild let:builder>
							<Button variant="ghost" builders={[builder]} class="relative h-8 w-8 rounded-full">
								<Avatar.Root class="h-8 w-8">
									<Avatar.Fallback>{initials}</Avatar.Fallback>
								</Avatar.Root>
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content class="w-56" align="end">
							<DropdownMenu.Label class="font-normal">
								<div class="flex flex-col space-y-1">
									<p class="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
									<p class="text-xs leading-none text-muted-foreground">{user?.email}</p>
								</div>
							</DropdownMenu.Label>
							<DropdownMenu.Separator />
							<DropdownMenu.Group>
								<DropdownMenu.Item on:click={() => goto('/profile')}>
									<UserRound class="mr-2 h-4 w-4" />
									Профиль
									<DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
								</DropdownMenu.Item>
							</DropdownMenu.Group>

							<DropdownMenu.Sub>
								<DropdownMenu.SubTrigger>
									<Sun
										class="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
									<Moon
										class="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
									Тема
								</DropdownMenu.SubTrigger>
								<DropdownMenu.SubContent>
									<DropdownMenu.Item on:click={() => setMode('light')}
										><Sun class="mr-2 h-4 w-4" />Светлая
									</DropdownMenu.Item>
									<DropdownMenu.Item on:click={() => setMode('dark')}
										><Moon class="mr-2 h-4 w-4" />Тёмная
									</DropdownMenu.Item>
									<DropdownMenu.Item on:click={() => setMode('system')}
										><SunMoon class="mr-2 h-4 w-4" />Системная
									</DropdownMenu.Item>
								</DropdownMenu.SubContent>
							</DropdownMenu.Sub>
							<DropdownMenu.Separator />
							<DropdownMenu.Item on:click={signOut}>
								<LogOut class="mr-2 h-4 w-4" />
								Выйти
								<DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
							</DropdownMenu.Item>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				{/if}
				<div class="block w-4 sm:hidden"></div>
				<Menu class="block sm:hidden" />
			</nav>
		</div>
	</div>
</header>

<style lang="postcss">
	.active {
		@apply text-primary;
	}
</style>
