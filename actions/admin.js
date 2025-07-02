"use server";

import { db } from "@/lib/prisma";
import {auth} from "@clerk/nextjs/server";

export async function getAdmin() {
    const {userId} = await auth ();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: {clerkUserId: userId},
    });

    if(!user || user.role !== "ADMIN") {
        return { authorized: false, reason: "not-admin"};
    }

    return { authorized: true, user };
}