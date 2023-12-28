import type { Chat } from "$lib/core/entities/Chat";
import type { Image } from "$lib/core/entities/Image";
import { writable } from "svelte/store";

const initialData: { id: string; data:Chat; images: Image[] }[] | undefined = [];

const chatsData = writable(initialData);

export default chatsData;