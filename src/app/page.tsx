import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const userId = await getCurrentUserId();
  if (!userId) {
    redirect("/login");
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { onboarded: true },
  });
  if (user && !user.onboarded) {
    redirect("/onboarding");
  }
  redirect("/dashboard");
}
