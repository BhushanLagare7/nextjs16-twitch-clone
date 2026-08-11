"use server";

import { revalidatePath } from "next/cache";

import { blockUser, unblockUser } from "@/lib/block-service";

export async function onBlock(id: string): Promise<typeof blockedUser> {
  // TODO: Adapt to disconnect from livestream
  // TODO: Allow ability to kick the guest
  const blockedUser = await blockUser(id);

  revalidatePath("/");

  if (blockedUser) {
    revalidatePath(`/${blockedUser.blocked.username}`);
  }

  return blockedUser;
}

export async function onUnblock(id: string): Promise<typeof unblockedUser> {
  const unblockedUser = await unblockUser(id);

  revalidatePath("/");

  if (unblockedUser) {
    revalidatePath(`/${unblockedUser.blocked.username}`);
  }

  return unblockedUser;
}
