<script lang="ts">
    import { zodClient } from "sveltekit-superforms/adapters";
    import type { PageData } from "./$types";
    import { superForm, type SuperForm, type SuperValidated } from "sveltekit-superforms";
    import {
        createCardSchema,
        type CreateCardSchema,
    } from "$lib/config/zod-schemas";
    import * as Alert from "$lib/components/ui/alert";
    import * as Card from "$lib/components/ui/card";
    import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { AlertCircle } from "lucide-svelte";
    import { Loader2 } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";
    //TODO: вынести компонент в lib
    export let data: {form : SuperValidated<CreateCardSchema>};

    const form = superForm(data.form, {
        validators: zodClient(createCardSchema),
        dataType: "json"
    });

    const { form: formData, enhance, submitting, errors } = form;

    const addBlock = () => {
        $formData.blocks = [...$formData.blocks, { content: "" }];
    };
</script>

<form method="POST" use:enhance>
    <Card.Root>
        <Card.Header class="space-y-1">
            <Card.Title class="text-2xl">Create card</Card.Title>
        </Card.Header>
        <Card.Content class="grid gap-4">
            {#if $errors._errors?.length}
                <Alert.Root variant="destructive">
                    <AlertCircle class="h-4 w-4" />
                    <Alert.Title>Error</Alert.Title>
                    <Alert.Description>
                        {#each $errors._errors as error}
                            {error}
                        {/each}
                    </Alert.Description>
                </Alert.Root>
            {/if}
            <Form.Field {form} name="topicName">
                <Form.Control let:attrs>
                    <Form.Label>Топик</Form.Label>
                    <Input {...attrs} bind:value={$formData.topicName} />
                </Form.Control>
                <Form.FieldErrors />
            </Form.Field>
            {#each $formData.blocks as _, i}
                <Form.Field {form} name="blocks">
                    <Form.Control let:attrs>
                        <Form.Label>Блок {i + 1}</Form.Label>
                        <Input
                            {...attrs}
                            bind:value={$formData.blocks[i].content}
                        />
                    </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>
            {/each}
            <Button variant="secondary" on:click={addBlock}>Добавить блок</Button>
        </Card.Content>
        <Card.Footer>
            <div class="block w-full">
                <Form.Button class="w-full" disabled={$submitting}>
                    {#if $submitting}
                        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                        Please wait
                    {:else}
                        Submit
                    {/if}
                </Form.Button>
            </div>
        </Card.Footer>
    </Card.Root>
</form>
