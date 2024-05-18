import { sveltekit } from '@sveltejs/kit/vite';
import { vite as vidstack } from 'vidstack/plugins';
import { defineConfig } from 'vite';

//vidstack({ include: /player\// });
export default defineConfig({
	plugins: [vidstack(),sveltekit()]
});
