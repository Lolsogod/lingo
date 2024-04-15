<script lang="ts">
    import type { PageData } from "./$types";
    import { Button } from "$lib/components/ui/button";
    import { Card, CardContent } from "$lib/components/ui/card";
    import * as Dialog from "$lib/components/ui/dialog";
    import CreateCardForm from "../../cards/create/CreateCardForm.svelte";
    export let data: PageData;
</script>

<section class="container grid items-center gap-6">
    <div class="flex">
        <h1
            class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl flex-1"
        >
            Колода {data.deck.name}
        </h1>
        <a href="/decks/{data.deck.id}/edit"><Button>Редактировать?</Button></a>
    </div>
    <h2
        class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
    >
        Список карт <!---доделать-->
    </h2>
    {#each data.cards as card}
        {card.topic.content}
        <br/>
    {/each}
    <!--кнопка багано появляется-->
    <Dialog.Root>
        <Dialog.Trigger>
            <Button>Добавить карту</Button>
        </Dialog.Trigger>
        <Dialog.Content>
            <CreateCardForm {data} />
        </Dialog.Content>
    </Dialog.Root>
</section>
